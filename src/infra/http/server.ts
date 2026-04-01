import http from 'node:http'

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify({ message: 'API running 🚀' }))
})

server.listen(3333, () => {
  console.log('🚀 HTTP server running on http://localhost:3333')
})
