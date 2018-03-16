let answers = []
let count = 0

let answerMap = {
  'Absolutely agree': 2,
  'Somewhat agree': 1,
  'Nuetral or hesitant': 1,
  'Rather disagree': 1,
  'Absolutely disagree': 2
}

let questions = [
  {
    question: 'How do you feel about space?',
    context: ['science']
  },
  {
    question: 'The earth is flat.',
    context: ['views']
  },
  {
    question: 'I like looking in the mirror.',
    context: ['vanity']
  }
]

applyQuestion()
$('.question-total').html(questions.length)

$('.answers button').click(function (event) {
  answers.push({
    value: this.value,
    side: $(this).data('side')
  })
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

function showTable() {
  let content = ''

  for(let key in answerMap) {
    let arr = answers.filter(function (val) { 
      return answerMap[key] == val
    })
    
    content += 
    `<tr>
        <td>${key}</td>
        <td>${arr.length}</td>
      </tr>
    `
  }
  $('.content').html(`<table>${content}</table>`)
}

function showResults() {
  let sides = {
    agree: 0,
    disagree: 0,
    neutral: 0
  }
  for(let i = 0; i < answers.length; i++) {
    sides[answers[i].side] += answers[i].value
  }

  $('.questions-container').css('display', 'none')
  $('.results').css('display', 'block')
}