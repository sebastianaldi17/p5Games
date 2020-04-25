let hit_sound
let font

let paddle_1
let paddle_2
let ball

let boost = 1
let score_1 = 0
let score_2 = 0

let game_start = false
let game_over = false

let hover = false

class Paddle {
  constructor(x, y, h, w) {
    this.x = x
    this.y = y
    this.w = w
    this.h = h
  }

  draw = function () {
    rect(this.x, this.y, this.w, this.h)
  }
}

class Ball {
  // The ball is gonna be a square
  constructor(x, y, side_length) {
    this.x = x
    this.y = y
    this.side_length = side_length
    this.vx = Math.floor(Math.random() * 3) + 3
    this.vy = Math.floor(Math.random() * 3) + 3
    this.dir = 1
  }

  draw = function () {
    rect(this.x, this.y, this.side_length, this.side_length)
  }
}

function setup() {
  // Load resources
  hit_sound = loadSound("assets/hit.wav")
  font = loadFont("assets/Pixeled.ttf")

  // Canvas settings
  createCanvas(854, 480)
  noSmooth()

  // Set objects
  paddle_1 = new Paddle(25, 5, 50, 7)
  paddle_2 = new Paddle(width - 32, 5, 50, 7)
  ball = new Ball(width / 2, height / 2, 10)
}

function mousePressed() {
  if (hover) {
    if (!game_start) game_start = true
    if (game_over) {
      game_over = false
      score_1 = 0
      score_2 = 0
    }
  }
}

function draw() {
  background("#9193A0")
  noStroke()
  textFont(font)
  textSize(36)
  fill(255)

  // Draw score
  textAlign(LEFT)
  text(score_1.toString(), 100, 75)
  textAlign(RIGHT)
  text(score_2.toString(), width - 100, 75)

  // Draw paddles and ball
  paddle_1.draw()
  paddle_2.draw()
  ball.draw()

  // Detect if mouse is over button
  if (mouseX >= width / 2 - 75 && mouseX <= width / 2 + 75 && mouseY >= height / 2 && mouseY <= height / 2 + 75) {
    hover = true
  } else {
    hover = false
  }

  // Draw opening screen
  if (!game_start) {
    textAlign(CENTER)
    text("Pong5.js", width / 2, height / 2 - 50)
    let fillC = 100
    if (hover) fillC = 50
    fill(fillC)
    rect(width / 2 - 75, height / 2, 150, 50)
    fill(255)
    textSize(18)
    text("START", width / 2, height / 2 + 36)
    text("First to 5 wins.".toUpperCase(), width / 2, height / 4 * 3)
    text("Move the left paddle with your mouse.".toUpperCase(), width / 2, height / 4 * 3 + 36)
    text("Right paddle is controlled by computer.".toUpperCase(), width / 2, height / 4 * 3 + 72)
  }
  if (game_over) {
    let t = "P1 Wins!"
    if (score_2 >= 5) t = "P2 Wins!"
    textAlign(CENTER)
    text(t, width / 2, height / 2 - 50)
    let fillC = 100
    if (hover) fillC = 50
    fill(fillC)
    rect(width / 2 - 75, height / 2, 150, 50)
    fill(255)
    textSize(18)
    text("AGAIN?", width / 2 + 3, height / 2 + 36)
  }

  if (game_start == true && game_over == false) {
    // Move Player paddle via mouse (Player 1)
    paddle_1.y = mouseY
    if (paddle_1.y <= 0) {
      paddle_1.y = 0
    }
    if (paddle_1.y >= height - paddle_1.h) {
      paddle_1.y = height - paddle_1.h
    }

    // Move AI Paddle (Player 2)
    paddle_2.y = min(ball.y, height - paddle_2.h)

    // Move ball
    ball.x += ball.vx * ball.dir * boost
    ball.y += ball.vy * boost
    if (ball.y <= 0 || ball.y >= height - ball.side_length) {
      ball.vy *= -1
    }
    if (ball.x <= 0) {
      ball.x = width / 2
      score_2 += 1
      boost = 1
    } else if (ball.x >= width - ball.side_length) {
      ball.x = width / 2
      score_1 += 1
      boost = 1
    }

    // Collision
    if (Math.abs(ball.x - paddle_2.x) <= ball.side_length && ball.y >= (paddle_2.y - ball.side_length) && ball.y <= (paddle_2.y + paddle_2.h + ball.side_length)) {
      ball.dir = -1
      hit_sound.play()
      boost += 0.2
    } else if (Math.abs(ball.x - paddle_1.x) <= ball.side_length && ball.y >= (paddle_1.y - ball.side_length) && ball.y <= (paddle_1.y + paddle_1.h + ball.side_length)) {
      ball.dir = 1
      hit_sound.play()
      boost += 0.2
    }
  }
  if (score_1 >= 5 || score_2 >= 5) {
    game_over = true
  }
}

