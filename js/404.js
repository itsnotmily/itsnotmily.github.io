var ball = {
  x: 300,
  y: 200,
  xspeed: 4,
  yspeed: 4,
};
let ranWord = "inm";

function setup() {
  createCanvas(windowWidth*0.99, windowHeight*0.98);
}

function draw() {
  background(0);
  move();
  bounce();
  display();
  fill(100)
  text("404 Page not found",windowWidth/2,windowHeight/2)

}

function bounce() {
  if (ball.x > width || ball.x < 0) {
    ball.xspeed = ball.xspeed * -1;
    if (ranWord == "inm") {
      ranWord = "404";
    } else {
      ranWord = "inm";
    }
  }

  if (ball.y > height || ball.y < 0) {
    ball.yspeed = ball.yspeed * -1;
    if (ranWord == "inm") {
      ranWord = "404";
    } else {
      ranWord = "inm";
    }
  }
}

function display() {
  stroke(255);
  strokeWeight(3);
  fill(100, 100, 100);

  ellipse(ball.x, ball.y, 60, 60);
  fill(0, 255, 255);

  textSize(32);
  text(ranWord, ball.x, ball.y);
  textAlign(CENTER, CENTER);
}

function move() {
  ball.x = ball.x + ball.xspeed;
  ball.y = ball.y + ball.yspeed;
}
