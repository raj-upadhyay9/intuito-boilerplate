require('dotenv').config()
const express = require('express')
const prismic = require('@prismicio/client')
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
  const [about, meta] = await client.get({
    predicates: prismic.predicate.any('document.type', ['about', 'meta'])
  }).then(res => res.results).catch(err => console.log(err))

  res.render('pages/about', {
    about,
    meta
  })
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
