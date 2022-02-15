require('dotenv').config()
const express = require('express')
const app = express()
const port = 3000 || process.env.PORT
const path = require('path')
const prismicH = require('@prismicio/helpers')
const { client } = require('./config/prismicConfig.js')

app.use((req, res, next) => {
  res.locals.ctx = {
    prismicH
  }
  next()
})

app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'views'))

app.get('/', async (req, res) => {
  const document = await client.getFirst()
  console.log(document)
  res.render('pages/home')
})

app.get('/about', async (req, res) => {
  const about = await client.getByType('about')
  console.log(about)

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