let answers = []
let count = 0
let images

let answerMap = {
  'Absolutely agree': 2,
  'Somewhat agree': 1,
  'Nuetral or hesitant': 1,
  'Rather disagree': 1,
  'Absolutely disagree': 2
}

let totals = {}
let questions = []
let categories = [] 

$.ajax({
  url: '/trump',
  success: function(response) {
    questions = response
    console.log(questions)
    applyQuestion()
    $('.question-total').html(questions.length)
    categories = unique(questions)
    initTotals()
  }
})

$.ajax({
  url: '/images?q=trump',
  success: function(response) {
   images = response
   console.log(images)
  }
})

function unique(arr) {
  let cats = arr.reduce((obj, el) => {
    let context = el.context[0] // Change for multiple values
    obj[context] = true
    return obj
  }, {})

  return Object.keys(cats)
} 

function initTotals() {
  totals = categories.reduce((acc, key) => {
    acc[key] = {
      agree: 0,
      disagree: 0,
      neutral: 0
    }
    return acc
  }, {})
}

let data = {
  'science': {
    rightImage: 'assets/tub.jpeg',
    leftImage:  'assets/bear.jpg',
    leftTitle: 'Bear',
    rightTitle: 'Michelin'
  },
  'vanity': {
    rightImage: 'https://timeincsecure-a.akamaihd.net/rtmp_uds/2111767321001/201710/3972/2111767321001_5625929760001_5625708507001-vs.jpg',
    leftImage: 'http://www.myessentia.com/blog/wp-content/uploads/2008/04/angry-baby-940x480.jpg',
    leftTitle: '\'woke',
    rightTitle: 'Raw'
  },
  'views': {
    rightImage: 'http://www.indofoody.com/wp-content/uploads/2017/03/x21201853-Pieces-of-raw-chicken-meat-Stock-Photo-chicken-1200x680.jpg.pagespeed.ic.v-KmMn-SkC.webp',
    leftImage: 'https://www.bbcgoodfood.com/sites/default/files/styles/push_item/public/chicken-thumb.jpg',
    leftTitle: 'Fat',
    rightTitle: 'Fatter'
  }
}

$('.answers button').click(function (event) {
  let ctx = questions[count - 1].context[0] // Change for multiple values
  let type = $(this).data('side')
  totals[ctx][type] += Number(this.value)

  if (count < questions.length) {
    $('.question-index').html(count + 1)
    applyQuestion()
  } else {
    showResults()
  }
})

function applyQuestion() {
  $('.question').html(questions[count].question)
  count++
}

function showResults() {
  let html = ''

  for (let key in totals) {
    let field = totals[key]
    let total = field['agree'] + field['disagree'] + field['neutral']
    let agreePercent = Math.round((field.agree / total) * 100)
    let disagreePercent = Math.round((field.disagree / total) * 100)
    let neutralPercent = Math.round((field.neutral / total) * 100)
    let totalPercent = agreePercent + disagreePercent + neutralPercent
    if (totalPercent != 100) {
      neutralPercent += 100 - totalPercent
    }

    html += meterTemplate(key, agreePercent, disagreePercent, neutralPercent)    
  }
  
  $('.results').html(html)
  $('.questions-container').css('display', 'none')
  $('.results-container').css('display', 'inline-block')
}


function meterTemplate(context, a, d, n) {
  let paddless = 'padding: 0;'
  let leftImage = `background-image: url('${images[0].largeImageURL}');`
  let rightImage = `background-image: url('${images[1].largeImageURL}');`
  return  `
    <div class='meter-container'> 
      <div class='meter meter-${context}' data-field='${context}'>
        <div class='left-image' style="${leftImage}">
          <span>${data[context].leftTitle}</span>
        </div>
        <div class='agree' style='width: ${a}%; ${a == 0 ? paddless : ''}'>${a}%</div>
        <div class='neutral' style='width: ${n}%; ${n == 0 ? paddless : ''}'>${n}%</div>
        <div class='disagree' style='width: ${d}%; ${d == 0 ? paddless : ''}'>${d}%</div>
        <div class='right-image' style="${rightImage}">
          <span>${data[context].rightTitle}</span>
        </div>
      </div>
    </div>
  `
}