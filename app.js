require('dotenv').config()

const express = require('express')
const errorHandler = require('errorhandler')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const logger = require('morgan')

const prismic = require('@prismicio/client')
const path = require('path')
const prismicH = require('@prismicio/helpers')
const { client } = require('./config/prismicConfig.js')

const app = express()
const port = 3000 || process.env.PORT

const handleRequest = async () => {
  const navigation = await client.getSingle('navigation')
  const meta = await client.getByType('meta')
  const preloader = await client.getSingle('preloader')

  return {
    meta,
    navigation,
    preloader
  }
}
const handleLinkResolver = (doc) => {
  if (doc.type === 'product') {
    return `/detail/${doc.slug}`
  }

  if (doc.type === 'collections') {
    return '/collections'
  }

  if (doc.type === 'about') {
    return '/about'
  }
  return '/'
}

app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(methodOverride('_method'))
app.use(errorHandler())

app.use((req, res, next) => {
  res.locals.ctx = {
    prismicH
  }
  res.locals.Link = handleLinkResolver
  res.locals.Numbers = index => {
    return index === 0 ? 'One' : index === 1 ? 'Two' : index === 2 ? 'Three' : index === 3 ? 'Four' : ''
  }
  next()
})

app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'views'))

app.get('/', async (req, res) => {
  const home = await client.getSingle('home')
  const defaults = await handleRequest()
  const collections = await client.get({
    predicates: prismic.predicate.at('document.type', 'collection'),
    fetchLinks: 'product.image'
  }).then(res => res.results).catch(err => console.log(err))

  res.render('pages/home', {
    ...defaults,
    collections,
    home

  })
})

app.get('/about', async (req, res) => {
  const defaults = await handleRequest()

  const preloader = await client.getSingle('preloader')
  const [about, meta] = await client.get({
    predicates: prismic.predicate.any('document.type', ['about', 'meta'])
  }).then(res => res.results).catch(err => console.log(err))

  res.render('pages/about', {
    ...defaults,
    about,
    meta,
    preloader
  })
})

app.get('/detail/:uid', async (req, res) => {
  const meta = await client.getSingle('meta')
  const preloader = await client.getSingle('preloader')

  const product = await client.getByUID('product', req.params.uid, { fetchLinks: 'collection.title' })
  res.render('pages/detail', {
    meta,
    product,
    preloader
  })
})

app.get('/collections', async (req, res) => {
  const preloader = await client.getSingle('preloader')
  const defaults = await handleRequest()

  const meta = await client.getSingle('meta')
  const home = await client.getSingle('home')
  const collections = await client.get({
    predicates: prismic.predicate.at('document.type', 'collection'),
    fetchLinks: 'product.image'
  }).then(res => res.results).catch(err => console.log(err))
  res.render('pages/collections', {
    ...defaults,
    meta,
    collections,
    home,
    preloader
  })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
