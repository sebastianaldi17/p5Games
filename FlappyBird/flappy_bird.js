let die_sound
let hit_sound
let point_sound
let wing_sound
let font

let dead = false
let hover = false
let score = 0
let SCROLL_SPEED = 2
let title = true

let pipe1
let pipe2
let bird

const BIRD_RADIUS = 75
const PIPE_WIDTH = 75
const PIPE_GAP = 200
const PIPE_DISTANCE = 300


function intersect(bird, pipe) {
  if (bird.x + bird.r / 2 < pipe.x || bird.x - bird.r / 2 > pipe.x + pipe.w) return false
  if (bird.y - bird.r / 2 < pipe.y || bird.y + bird.r / 2 > pipe.y + pipe.h) return true
}

class Pipe {
  constructor(x, y, w, h) {
    // y represents the top gap location
    // y + h is the bottom gap
    this.x = x
    this.y = y
    this.w = w
    this.h = h
    this.count = true
  }

  draw = function () {
    rect(this.x, 0, this.w, this.y)
    rect(this.x, this.y + this.h, this.w, height - this.y - this.h)

    // Scrolling and resetting
    this.x -= SCROLL_SPEED
    if (this.x + PIPE_WIDTH < 0) {
      this.x = width
      this.y = random(100, height - 2 * this.h)
      this.count = true
    }

    if (bird.x + BIRD_RADIUS / 2 > this.x + this.w && this.count) {
      point_sound.play()
      score += 1
      this.count = false
    }
  }
}

class Bird {
  constructor(x, y, r) {
    this.x = x
    this.y = y
    this.r = r
    this.vx = 0
    this.vy = 0
  }

  draw = function () {
    ellipse(this.x, this.y, this.r)
    bird.vy += 0.6
  }
}

function setup() {
  // Load resources
  die_sound = loadSound("assets/sfx_die.wav")
  hit_sound = loadSound("assets/sfx_hit.wav")
  point_sound = loadSound("assets/sfx_point.wav")
  wing_sound = loadSound("assets/sfx_wing.wav")
  font = loadFont("assets/Pixeled.ttf")

  // Canvas settings
  createCanvas(480, 854)
  noSmooth()

  // Initialize objects
  setEntities()
}

function draw() {
  background("#73f6ff")
  textFont(font)
  fill(255)

  if (mouseX >= width / 2 - 75 && mouseX <= width / 2 + 75 && mouseY >= height / 2 && mouseY <= height / 2 + 75) {
    hover = true
  } else {
    hover = false
  }

  if (!title) {
    pipe1.draw()
    pipe2.draw()
    if (dead) fill(100)
    bird.draw()

    // update variables
    bird.x += bird.vx
    bird.y = min(bird.y + bird.vy, height - BIRD_RADIUS / 2)
    SCROLL_SPEED = dead ? 0 : 2

    if (intersect(bird, pipe1) || intersect(bird, pipe2) || bird.y >= height - BIRD_RADIUS / 2) {
      if (!dead) {
        hit_sound.play()
        setTimeout(function () { die_sound.play() }, 300)
      }
      dead = true
    }

    // Text drawing
    fill(0)
    textAlign(CENTER)
    textSize(36)
    text("SCORE: " + score.toString(), width / 2, height / 8)

    if (dead) {
      text("GAME OVER", width / 2, height / 2 - 75)
      let fillC = 100
      if (hover) fillC = 50
      fill(fillC)
      rect(width / 2 - 75, height / 2, 150, 50)
      fill(255)
      textSize(18)
      text("RETRY?", width / 2, height / 2 + 75 / 2)
    }
  } else {
    noStroke()
    fill(0)
    textAlign(CENTER)
    textSize(36)
    text("FLAP5.JS", width / 2, height / 2 - 75)
    let fillC = 100
    if (hover) fillC = 50
    fill(fillC)
    rect(width / 2 - 75, height / 2, 150, 50)
    fill(255)
    textSize(18)
    text("START!", width / 2, height / 2 + 75 / 2)
  }
}

function keyPressed() {
  if (dead || title) return
  if (key === ' ') {
    wing_sound.play()
    bird.vy = -10
  }
}

function mousePressed() {
  if (hover) {
    if (title) title = false
    if (dead) {
      dead = false
      setEntities()
      score = 0
    }
  }
}

function setEntities() {
  pipe1 = new Pipe(400, random(100, height - 2 * PIPE_GAP), PIPE_WIDTH, PIPE_GAP)
  pipe2 = new Pipe(400 + PIPE_DISTANCE, random(100, height - 2 * PIPE_GAP), PIPE_WIDTH, PIPE_GAP)
  bird = new Bird(50, height / 2, BIRD_RADIUS)
}