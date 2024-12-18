var ball;
let balls = [];
let colors = [
  "#db170d",
  "#fa9702",
  "#e5f224",
  "#76f20a",
  "#0af225",
  "#07f2c3",
  "#07a6f0",
  "#0a34f0",
  "#5b0ff5",
  "#c70ce8",
  "#eb13ad",
  "#80724d",
  "#f26f28",
  "#482a6f",
  "#deb440"
];

let holes = [];

function setup() {
  createCanvas(900, 530);
  ball = new WhiteBall(width - 100, height / 2, 30, 45);
  
  balls.push(ball);
  let offset = 0;
  let c = 0;
  let ballR = 30;
  for (var i = 0; i < 5; i++) {
    for (var j = 5 - i; j > 0; j--) {
      let b = new Ball(
        100 + i * ballR + i,
        j * ballR - (ballR * 5) / 2 + offset - ballR / 2 + height / 2 + j,
        ballR,
        colors[c]
      );
      balls.push(b);
      c++;
    }
    offset += ballR / 2 + 1;
  }

  holes.push(new Hole(0, 0));
  holes.push(new Hole(width, 0));
  holes.push(new Hole(width / 2, 0));
  holes.push(new Hole(width / 2, height));
  holes.push(new Hole(0, height));
  holes.push(new Hole(width, height));
}

function draw() {
  background("#006841");
  for (var hole of holes) {
    hole.render();
  }
  rectMode(CENTER, CENTER);

  fill("#2bA557");
  rect(width - 100, height / 2, 28, 20);

  for (var j = 0; j < holes.length; j++) {
    for (var i = 0; i < balls.length; i++) {
      let ball = balls[i];
      if (ball.inHole) continue;
      ball.checkCollisionWithHole(holes[j]);
    }
  }

  for (var ball of balls) {
    if (ball.inHole) continue;
    for (let i = 0; i < balls.length; i++) {
      let test = balls[i];
      if (test.inHole) continue;
      if (ball === test) continue;
      ball.checkCollision(test);
    }
  }
  for (var ball of balls) {
    if (ball.inHole) continue;
    ball.update();
    ball.render();
  }
  stroke(255); 
  strokeWeight(2.4); 
  line(balls[0].position.x, balls[0].position.y, mouseX, mouseY);

}

function mousePressed() {
  if (ball.velocity.mag() > 0.1) return;
  let dx = mouseX - ball.position.x;
  let dy = mouseY - ball.position.y;
  let angle = Math.atan2(dy, dx);
  let distance = Math.sqrt(dx * dx + dy * dy) / 10;
  let force = createVector(distance * cos(angle), distance * sin(angle), 0);
  force.limit(45);
  ball.applyForce(force);
}

class Hole {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  static get radius() {
    return 85;
  }

  render() {
    noStroke();
    fill(0);
    ellipse(this.x, this.y, Hole.radius, Hole.radius);
  }
}

class PhysicsParticle {
  constructor(x, y, r, velocityLimit) {
    this.position = createVector(x, y, 0);
    this.acc = createVector(0, 0, 0);
    this.velocity = createVector(0, 0, 0);
    this.r = r;
    this.velocityLimit = velocityLimit || 30;
    this.friction = 0.975;
  }

  applyForce(f) {
    this.acc.add(f);
  }

  update() {
    this.velocity.add(this.acc);
    this.velocity.limit(this.velocityLimit);
    this.position.add(this.velocity);
    this.acc.mult(0);
    this.velocity.mult(this.friction);
    this.applyBounds();
  }

  checkCollision(b) {
    let dx = b.position.x - this.position.x;
    let dy = b.position.y - this.position.y;
    let d = this.position.dist(b.position);
    if (d <= b.r / 2 + this.r / 2) {
      this.computeCollision(b, dx, dy);
    }
  }

  computeCollision(b, dx, dy) {
    let speed = this.velocity.mag() * 0.8;
    let angle = atan2(dy, dx);
    b.applyForce(createVector(speed * cos(angle), speed * sin(angle)));
    this.velocity.mult(0.65);
  }

  applyBounds() {
    if (this.position.y + this.r / 2 >= height) {
      this.position.y = height - this.r / 2;
      this.applyForce(createVector(0, 2 * this.velocity.y * -1, 0));
    } else if (this.position.y < this.r / 2) {
      this.position.y = this.r / 2;
      this.applyForce(createVector(0, 2 * this.velocity.y * -1, 0));
    }
    if (this.position.x + this.r / 2 >= width) {
      this.position.x = width - this.r / 2;
      this.applyForce(createVector(2 * this.velocity.x * -1, 0, 0));
    } else if (this.position.x < this.r / 2) {
      this.position.x = this.r / 2;
      this.applyForce(createVector(2 * this.velocity.x * -1, 0, 0));
    }
  }
}

class Ball extends PhysicsParticle {
  constructor(x, y, r, _color, limit) {
    super(x, y, r, limit);
    this.color = _color || color(255);
    this.inHole = false;
  }

  checkCollisionWithHole(hole) {
    let dx = hole.x - this.position.x;
    let dy = hole.y - this.position.y;
    let d = Math.sqrt(dx * dx + dy * dy);
    if (d <= Hole.radius / 2 - this.r / 2) {
      this.inHole = true;
    }
  }

  render() {
    stroke(0);
    fill(this.color);
    ellipse(this.position.x, this.position.y, this.r, this.r);
  }
}

class WhiteBall extends Ball {
  constructor(x, y, r, limit) {
    super(x, y, r, limit);
    this.color = color(255);
  }

  checkCollisionWithHole(hole) {
    let dx = hole.x - this.position.x;
    let dy = hole.y - this.position.y;
    let d = Math.sqrt(dx * dx + dy * dy);
    if (d <= Hole.radius / 2 - this.r / 2) {
      this.velocity.mult(0);
      this.position.set(width - 100, height / 2);
      this.acc.mult(0);
    }
  }
}
