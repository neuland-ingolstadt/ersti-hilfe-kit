import fs from 'fs'

function parse (text) {
  const data = {}

  for (const line of text.split('\n')) {
    if (/^#/.test(line)) {
      data.heading = line.replace(/^#+/g, '').trim()
      data.text = ''
      data.properties = {}
    } else if (/.+:.+/.test(line)) {
      const sep = line.indexOf(':')
      data.properties[line.substring(0, sep).trim()] = line.substring(sep + 1).trim()
    } else if (line.trim()) {
      data.text += line.trim() + '\n'
    }
  }

  return [
    data.properties.ID,
    {
      heading: data.heading,
      text: data.text,
      questions: Object.keys(data.properties)
        .filter(key => key.startsWith('Q'))
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
      .map(file => parse(fs.readFileSync('data/scavenger/' + file, 'utf-8')))
  )
  return map
}

export default loadData()
