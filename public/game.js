const world = new World()
let hero
const CANVAS = {element: null, width: 1000, height: 800}
const GRAVITY = 14
const FRICTION = .4
let context = null

$(ready)

function ready () {
  let $main = $('main')
  CANVAS.element = document.createElement('canvas')
  CANVAS.element.className = 'play-field'
  CANVAS.element.width  = CANVAS.width
  CANVAS.element.height = CANVAS.height
  context = CANVAS.element.getContext('2d')

  $main.append(CANVAS.element)

  hero = new Hero(10, 10)
  world.addElement(new Feather())
  world.addElement(new Floor())
  world.addElement(new Box())

  hero.velocityY = 5

  frame()
}

$(window).on('keydown', function (ev) {
  // if (ev.key == 'ArrowUp') {
  //   setPosition(hero.$el[0], 'top', -CHAR_SPEED)
  // }

  // if (ev.key == 'ArrowDown') {
  //   setPosition(hero.$el[0], 'bottom', CHAR_SPEED)
  // }

  if (ev.keyCode == 32) {
    hero.jump()
  }

  if (ev.key == 'ArrowLeft') {
    hero.run('left')
  }

  if (ev.key == 'ArrowRight') {
    hero.run('right')
  }

})

$(window).on('keyup', function (ev) {
  // if (ev.key == 'ArrowUp') {
  // }

  // if (ev.key == 'ArrowDown') {
  // }

  if (ev.key == 'ArrowLeft') {
    hero.runKeydown = false
    hero.idle()
  }

  if (ev.key == 'ArrowRight') {
    hero.runKeydown = false
    hero.idle()
  }
})

class Hero {
  constructor(x, y) {
    this.state = 'idle'
    this.sprite = new Image()
    this.sprite.src = '/assets/idle.gif'
    this.width = 35
    this.height = 70
    this.x = x
    this.y = y
    this.X = this.x + this.width
    this.Y = this.y + this.height
    this.velocityX = 0
    this.velocityY = 0
    this.weight = .5
    this.isFalling = true
    this.runKeydown = false
    this.MAX_SPEED = 6
    this.direction = 'right'
    this.gifIndex = 0
  }

  setx(x) {
    this.x = x
    this.X = this.x + this.width
  }

  sety(y) {
    this.y = y
    this.Y = this.y + this.height
  }

  setState(state) {
    if (this.state != state) {
      this.state = state
    }
  }

  applySpecial (special, miliseconds) {
    this.special = special
    setTimeout(() => {
      this.special = null
    }, miliseconds)
  }

  cycleGif(state, frames) {
    if (this.gifIndex > frames - 1) this.gifIndex = 0
    this.sprite.src = `/assets/${state}-${this.gifIndex}.gif`
    this.gifTimeout = setTimeout(() => {
      this.cycleGif(state, frames)
      this.gifIndex++
    }, 100)
  }

  clearGif () {
    clearTimeout(this.gifTimeout)
    this.gifTimeout = null
    this.gifIndex = 0
  }

  setPng(state) {
    this.sprite.src = `/assets/${state}.png`
  }

  idle () {
    if (this.state == 'idle') return
    this.clearGif()
    this.state = 'idle'
    this.cycleGif('idle', 11)
  }

  hitGround (elementsY) {
    this.sety(elementsY - this.height)
    this.isFalling = false
    if (this.runKeydown) {
      this.run()
    } else {
      this.idle()
    }
  }

  jump () {
    // if (!this.isFalling) {
      this.velocityY = -11
      this.isFalling = true
    // }
    this.clearGif()
    this.setPng('jump')
    this.state = 'jump'
  }

  falling() {
    if (this.state == 'falling') return
    this.state = 'falling'
    this.clearGif()
    this.cycleGif('falling', 2)
  }

  run (direction) {
    if (this.state == 'run' || this.isFalling) return
    this.velocityX += 5
    if (direction) this.direction = direction
    this.runKeydown = true
    this.state = 'run'
    this.clearGif()
    this.cycleGif('run', 8)
  }

  adjustPosition () {
    let y = this.y + this.velocityY
    let x = this.x + this.velocityX * (this.direction == 'left' ? -1 : 1)
    this.setx(x)
    this.sety(y)
  }

  render (context) {
    let x = this.direction == 'left' ? (this.x * -1) - this.width : this.x
    if (this.direction == 'left') context.scale(-1, 1)

    switch (this.special) {
      case 'feather':
        context.filter = 'saturate(100%)'
        context.shadowColor = 'purple'
        context.shadowBlur = 10
        break
      default:
        break
    }

    context.drawImage(this.sprite, x, this.y, this.width, this.height)
  }

  remove () {

  }
}

class Floor {
  constructor () {
    this.length = CANVAS.width / Tile.getRenderWidth()
    this.tiles = []
    for (let i = 0; i < this.length; i++) {
      this.tiles[i] = new Tile(i)
    }
  }

  collision () {
    this.tiles.forEach((tile) => tile.collision(context))
  }

  render (context) {
    this.tiles.forEach((tile) => tile.render(context))
  }
}

class Tile {
  constructor(index) {
    this.sheetY = 17
    this.sheetX = 31
    this.index = index
    this.sheetWidth = 14
    this.sheetHeight = 46
    this.x = Tile.getRenderWidth() * this.index
    this.y =  CANVAS.height - this.sheetHeight
    this.sprite = new Image()
    this.sprite.src = `assets/jungle-tileset.png`
  }

  static getRenderWidth () {
    return 25
  }

  collision() {
    if (hero.y + hero.height > this.y && hero.y < this.y) {
      hero.hitGround(this.y)
    }
  }

  render (context) {
    context.drawImage(this.sprite, this.sheetX, this.sheetY, this.sheetWidth, this.sheetHeight, this.x, this.y, Tile.getRenderWidth(), this.sheetHeight)
  }
}

function frame () {
  //pre-variable adjustment
  hero.adjustPosition()

  //logic
  update()
  wallCollision()
  world.collisions()

  //post-variable adjustment

  // render
  render(context)
  requestAnimationFrame(frame, CANVAS.element)
}

function update () {
  if (hero.velocityX > hero.MAX_SPEED) hero.velocityX = hero.MAX_SPEED
  if (hero.isFalling) {
    if (hero.velocityY < GRAVITY) hero.velocityY += hero.weight
    if (hero.velocityY > 0 && hero.isFalling) hero.falling()
  } else {
    if (hero.velocityX > 0 && !hero.runKeydown) {
      hero.velocityX -= FRICTION
      if (hero.velocityX < 0) hero.velocityX = 0
    }
  }
}

function wallCollision () {
  if (hero.x < 0) {
    hero.setx(0)
  }

  if (hero.x + hero.width > CANVAS.width) {
    hero.setx(CANVAS.width - hero.width)
  }

  if (hero.y + hero.height > CANVAS.height) {
    hero.hitGround(CANVAS.height)
  }
}

function render (context) {
  context.clearRect(0, 0, CANVAS.width, CANVAS.height)
  context.save()
  hero.render(context)
  context.restore()
  world.render(context)
}