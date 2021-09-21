import data from './data'

export default async function handler (req, res) {
  if (req.method === 'GET') {
    const { id } = req.query
    if (data[id]) {
      res.statusCode = 200
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify(data[id]))
    } else {
      res.statusCode = 404
      res.end()
    }
  } else {
    res.statusCode(405)
    res.end()
  }
}
