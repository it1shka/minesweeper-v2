const express = require('express')

const app = express()

app.use('/assets', express.static(__dirname + '/assets'))

app.get('/', (_, res) => {
  res.sendFile('html/index.html', { root: __dirname })
})

app.get('/rules', (_, res) => {
  res.sendFile('html/rules.html', { root: __dirname })
})

app.use((_, res) => {
  res.status(404).sendFile('html/404.html', { root: __dirname })
})

const port = process.env.PORT ?? 8080
app.listen(port, () => {
  console.log(`Listening on port: ${port}...`)
})