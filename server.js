const express = require('express')
const app = express()
const axios = require('axios')
const cheerio = require('cheerio');

const pixabyKey = '8667126-b1d20e9584947535e08d5db4b'
const pixabyURL = 'https://pixabay.com/api/'


app.use(express.static('public'))

app.get('/play', (req, res) => {
  res.sendFile(__dirname + '/public/game.html')
})

app.get('/trump', (req, res) => {
  axios.get('https://api.tronalddump.io/search/quote?query=wall').then(function (result) {
    let quotes = result.data._embedded.quotes.map((q) => {
      return {
        question: q.value,
        context: q.tags
      }
    })
    res.json(quotes)
  }).catch((err) => {
    console.log(err)
  })
})

app.get('/images', (req, res) => {
  axios.get(`${pixabyURL}?key=${pixabyKey}&q=${req.query.name}`).then((result) => {
    res.json(result.data.hits)
  })
})

app.get('/quotes', (req, res) => {
  let name = req.query.name
  axios(`https://www.brainyquote.com/search_results?q=${name}`).then((result) => {
    const $ = cheerio.load(result.data)
    let data = {
      person: null,
      quotes: []
    }

    $('.b-qt').each(function (i, el) {
      data.quotes.push($(el).text())
    })

    for (let i = 0; i < data.quotes.length * 5; i++) {
      let index1 = Math.floor(Math.random() * data.quotes.length)
      let index2 = Math.floor(Math.random() * data.quotes.length)
      let temp = data.quotes[index1]
      data.quotes[index1] = data.quotes[index2]
      data.quotes[index2] = temp
    }

    res.json(data)
  })
})

app.listen('8080', () => {
  console.log('...server running on port 8080....')
})