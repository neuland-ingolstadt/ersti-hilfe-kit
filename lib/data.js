import fs from 'fs'

function parse (text) {
  text = text.replace(/\uFEFF/gu, '') // remove weird characters
  const data = {
    heading: '',
    text: '',
    properties: {}
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
      data.text += line.trim() + '\n'
    }
  }

  const propKeys = Object.keys(data.properties)
  return [
    data.properties.uuid,
    {
      heading: data.heading,
      text: data.text,
      points: parseInt(data.properties.points) || 100,
      questions: propKeys
        .filter(key => key.startsWith('q') && propKeys.indexOf('a' + key.substring(1)) !== -1)
        .map(key => ({
          id: key.substring(1),
          points: parseInt(data.properties['pointsq' + key.substr(1)]) || 100,
          question: data.properties['q' + key.substring(1)],
          answer: data.properties['a' + key.substring(1)].split(/,\s*/g)
        }))
    }]
}

function loadData () {
  const map = Object.fromEntries(
    fs.readdirSync('data/scavenger/')
      .filter(file => file.endsWith('.md'))
      .map(file => {
        try {
          return parse(fs.readFileSync('data/scavenger/' + file, 'utf-8'))
        } catch (e) {
          console.error('Failed parsing file', file, e)
          return null
        }
      })
      .filter(x => !!x)
  )
  return map
}

export default loadData()
