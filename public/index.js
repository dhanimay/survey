let quotes , pictures

$(init)

function init() {
  let colors = randomColors(10)
  let buttons = []
  for (let i = 0; i < colors.length; i++) {
    buttons[i] = $(`<button>
      <span><span>${colors[i]}</span></span>
    </button>`)
    buttons[i].css('background-color', colors[i])

    buttons[i].click(function (ev) {
      let color = $(this).find('span span').html()
      $('body').css('background-color', color)
    })
  }

  $('.color-tray').html(buttons)
}

function randomColors (num) {
  let positions = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'a', 'b', 'c', 'd', 'e', 'f']
  let colors = []
  for(let i=0; i<10; i++) {
    let str = ''
    for(let n=0; n<6; n++) {
      let rand = Math.floor(Math.random() * 16)
      str += positions[rand].toString()
    }
    colors.push('#' + str)
  }

  return colors
}

$('button.search-accept').click(search)
$('.keyword-input').keypress((ev)=> {
    if (ev.key == 'Enter') search()
})
  

function search (ev) {
  let name = $('.keyword-input').val()
  if (name == '') return alert('Must enter value.')

  let getQuotes = $.ajax(`/quotes?name=${name}`)
  let getPictures = $.ajax(`/images?name=${name}`)

  Promise.all([
    getQuotes,
    getPictures
  ]).then((result) => {
    appendQuote(result[0])
    appendPictures(result[1])
    // appendDotMap(result[1].length)
  })
    
  function appendQuote (response) {
    quotes = response.quotes
    console.log(quotes)

    let html = '' 
    quotes[0].split('').forEach((char) => {
      html += '<span>' + char + '</span>' 
    })

    $('.quote').html(html)

    $('.quote span').each((i, el) => {
      setTimeout(() => {
        $(el).addClass('active')
      }, 10 * i)
    })
  }

  function appendPictures (pictures) {
    let picItems = ''
    let dotItems = ''

    pictures.forEach((pic, i) => {
      picItems += `
        <li>
          <img src='${pic.largeImageURL}' />
        </li>
      `
      dotItems += `
        <button class='dot'
          data-index=${i}
          style="background-image: url('${pic.largeImageURL}')">
        </button>
      `
    })

    $('.pic ul').html(picItems)
    $('.dot-map').html(dotItems)
    $('.dot-map .dot').click((event) => {
      let index = $(event.target).data('index')
      let $list = $('.pic ul')
      let width = 400
      $list.scrollLeft(width * index)
    })
  }

  function appendDotMap (length) {
    let html = ''
    for (let i = 0; i < length; i++) {
      html += `<button class='dot'></button>`
    }
    $('.dot-map').html(html)
  }
}

