import fs from 'fs'

function parse (text) {
  text = text.replace(/\uFEFF/gu, '') // remove weird characters
  const data = {
    heading: '',
    text: '',
    properties: {}
  }

  for (const line of text.split('\n')) {
    if (/^#/.test(line)) {
      data.heading = line.replace(/^#+/g, '').trim()
    } else if (/^.+:.+$/.test(line)) {
      const sep = line.indexOf(':')
      data.properties[line.substring(0, sep).trim()] = line.substring(sep + 1).trim()
    } else if (line.trim()) {
      data.text += line.trim() + '\n'
    }
  }

  const propKeys = Object.keys(data.properties)
  return [
    data.properties.uuid,
    {
      heading: data.heading,
      text: data.text,
      questions: propKeys
        .filter(key => key.startsWith('Q') && propKeys.indexOf('A' + key.substring(1)) !== -1)
        .map(key => ({
          id: key.substring(1),
          question: data.properties['Q' + key.substring(1)],
          answer: data.properties['A' + key.substring(1)].split(/,\s*/g)
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
