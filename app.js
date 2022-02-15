require('dotenv').config()
const express = require('express')
const app = express()
const port = 3000 || process.env.PORT
const path = require('path')

app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'views'))

app.get('/', async (req, res) => {
  console.log(document)
  res.render('pages/home', { document })
})

app.get('/about', (req, res) => {
  res.render('pages/about')
})

app.get('/detail/:uid', (req, res) => {
  res.render('pages/detail')
})

app.get('/collections', (req, res) => {
  res.render('pages/collections')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
