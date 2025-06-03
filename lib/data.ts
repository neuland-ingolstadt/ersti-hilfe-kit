import { strict as assert } from 'node:assert'
import fs from 'node:fs'

interface Question {
  id: string
  points: number
  question: string
  answer: string[]
}

interface ParsedDataValue {
  heading: string
  text: string
  points: number
  questions: Question[]
}

interface DataProperties {
  uuid?: string
  points?: string
  [key: string]: string | undefined
}

interface ParsedDataObject {
  heading: string
  text: string
  properties: DataProperties
}

type ParsedEntry = [string, ParsedDataValue] | null

type ScavengerDataMap = Record<string, ParsedDataValue>

function parse(input: string): ParsedEntry {
  const text = input.replace(/\uFEFF/g, '')
  const data: ParsedDataObject = {
    heading: '',
    text: '',
    properties: {},
  }

  for (const line of text.split(/\r?\n/)) {
    if (/^#/.test(line)) {
      data.heading = line.replace(/^#+/g, '').trim()
    } else if (/^\w+:.+$/.test(line)) {
      const sep = line.indexOf(':')
      const key = line.substring(0, sep).trim().toLowerCase()
      const val = line.substring(sep + 1).trim()
      data.properties[key] = val
    } else {
      data.text += `${line.trim()}\n`
    }
  }

  assert(data.properties.uuid, 'Missing ID')
  assert(data.properties.points, `${data.properties.uuid} missing points`)
  assert(data.heading, `${data.properties.uuid} missing heading`)
  assert(data.text.trim(), `${data.properties.uuid} missing text`)

  const propKeys = Object.keys(data.properties)

  return [
    data.properties.uuid,
    {
      heading: data.heading,
      text: data.text.trim(),
      points: Number.parseInt(data.properties.points, 10) || 100,
      questions: propKeys
        .filter(
          (key) =>
            key.startsWith('q') &&
            !key.startsWith('pointsq') &&
            propKeys.includes(`a${key.substring(1)}`)
        )
        .map((key) => {
          const questionId = key.substring(1)
          const questionText = data.properties[key]
          const answerText = data.properties[`a${questionId}`]
          const pointsForQuestion = data.properties[`pointsq${questionId}`]

          assert(
            questionText,
            `Missing question text for ${key} in ${data.properties.uuid}`
          )
          assert(
            answerText,
            `Missing answer text for a${questionId} in ${data.properties.uuid}`
          )

          return {
            id: questionId,
            points: Number.parseInt(pointsForQuestion || '', 10) || 100,
            question: questionText,
            answer: answerText.split(/,\s*/g),
          }
        }),
    },
  ]
}

function loadData(): ScavengerDataMap {
  const directoryPath = 'data/scavenger/'
  let files: string[]

  try {
    files = fs.readdirSync(directoryPath)
  } catch (error) {
    console.error(`Error reading directory ${directoryPath}:`, error)
    return {}
  }

  const map = Object.fromEntries(
    files
      .filter((file) => file.endsWith('.md'))
      .map((file) => {
        const filePath = `${directoryPath}${file}`
        try {
          const fileContent = fs.readFileSync(filePath, 'utf-8')
          return parse(fileContent)
        } catch (e) {
          if (!(e instanceof Error)) {
            console.error(`Unexpected error reading file ${file}:`, e)
            return null
          }

          console.error(`Failed parsing file ${file}:`, e.message)
          if (e.stack) {
            console.error(e.stack)
          }
          return null
        }
      })
      .filter((x): x is ParsedEntry & [string, ParsedDataValue] => !!x) // Type guard to filter out nulls
  ) as ScavengerDataMap

  return map
}

const scavengerData: ScavengerDataMap = loadData()
console.log('Loaded scavenger data:', scavengerData) // Optional: log the loaded data

export default scavengerData
