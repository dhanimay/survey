class World {
  constructor () {
    this.elements = []
  }

  addElement (element) {
    this.elements.push(element)
  }

  collisions () {
    this.elements.forEach((el) => el.collision())
  }

  remove (element) {
    this.elements.splice(this.elements.indexOf(element), 1)
  }

  render (context) {
    this.elements.forEach((el) => el.render(context))
  }
}

class Feather {
  constructor () {
    this.width = 50
    this.height = 50
    this.x = CANVAS.width / 2
    this.y =  CANVAS.height / 2
    this.sprite = new Image()
    this.sprite.src = `assets/feather.png`
    this.effectLength = 8000
  }

  remove () {
    world.remove(this)
    hero.applySpecial('feather', this.effectLength)
  }

  collision () {
    if (
      (hero.y >= this.y && hero.y <= this.y + this.height) &&
      (hero.x >= this.x - hero.width && hero.x + hero.width <= this.x + hero.width)
    ) return this.remove()

    if (
      (hero.y + hero.height >= this.y && hero.y + hero.height <= this.y + this.height) &&
      (hero.x >= this.x - hero.width && hero.x + hero.width <= this.x + hero.width)
    ) return this.remove()

    if (
      (hero.x >= this.x && hero.x <= this.x + this.width) &&
      (hero.y >= this.y - hero.height && hero.y + hero.height <= this.y + hero.height)
    ) return this.remove()

    if (
      (hero.x + hero.width >= this.x && hero.x + hero.width <= this.x + this.width) &&
      (hero.y >= this.y - hero.height && hero.y + hero.height <= this.y + hero.height)
    ) return this.remove()
  }

  render (context) {
    context.drawImage(this.sprite, this.x, this.y, this.width, this.height)
  }
}

class Box {
  constructor(index) {
    this.width = 200
    this.height = 200
    this.x = 600
    this.y = 450
    this.X = this.x + this.width
    this.Y = this.y + this.height
    this.sprite = new Image()
    this.sprite.src = `assets/jungle-tileset.png`
  }

  touching () {
    console.log('hitting')
  }

  collision () {
    if (!(hero.X < this.x || this.X < hero.x || hero.Y < this.y || this.Y < hero.y)) {
      if (top) {
        return hero.hitGround(this.y)
      } else if (right) {

      } else if (bottom) {

      } else if (left) {

      }
    }

    // top of box
    // if (
    //   (hero.y + hero.height >= this.y && hero.y < this.y + this.height) &&
    //   (hero.x + hero.width > this.x && hero.x < this.x + this.width)
    // ) {
    //   return hero.hitGround(this.y)
    // }

    // bottom of box
    // if (
    //   (hero.y + hero.height >= this.y && hero.y + hero.height <= this.y + this.height) &&
    //   (hero.x >= this.x - hero.width && hero.x + hero.width <= this.x + hero.width)
    // ) {
    //   console.log(this.y)
    //   return hero.hitGround(this.y)
    // }

    // left of box

    // if (
    //   (hero.x + hero.width >= this.x && hero.x < this.x + this.width) &&
    //   (hero.y + hero.height > this.y && hero.y < this.y + this.height)
    // ) {
    //   return hero.x = this.x - hero.width
    // }

    // if (
    //   (hero.x + hero.width >= this.x && hero.x + hero.width <= this.x + this.width) &&
    //   (hero.y >= this.y - hero.height && hero.y + hero.height <= this.y + hero.height)
    // ) return this.touching()
  }

  render (context) {
    context.rect(this.x, this.y, this.width, this.height)
    context.strokeStyle = 'orange'
    context.stroke()
    // context.drawImage(this.sprite, this.sheetX, this.sheetY, this.sheetWidth, this.sheetHeight, this.x, this.y, Tile.getRenderWidth(), this.sheetHeight)
  }
}