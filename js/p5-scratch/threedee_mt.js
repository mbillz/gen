import _ from 'lodash';

var oldX;
var oldY;

var bezierX;
var bezierY;

const numColorsPerPath = 4;
var hues = _.range(numColorsPerPath);
var saturations = _.range(numColorsPerPath);

const numNoiseUpdatesPerFrame = 1;

// Offset is going to keep increasing.
// I start with a random offset so the branches 
// do not always point up at the beginning.
var offset = Math.random() * 2 * Math.PI;

// A random value interpolator based on a never ending bezier curve.
// When we reach destination (t == 1) then the end becomes the 
// beginning, the first control point is a mirror of the last 
// control point to make a smooth transition
class NoisyBezier {
  constructor(increment, m) {
    this.max = m;
    this.dt = increment;
    this.bx = [0, 0, 0, 0];
    this.t = 0;
    for (var i = 0; i < 4; i++) {
      this.bx[i] = random(this.max);
    }
    this.update();
  }
  
  update() {
    this.t += this.dt;
    if (this.t > 1) {
      this.t = 0;
      this.reset();
    }
    this.val = bezierPoint(this.bx[0], this.bx[1], this.bx[2], this.bx[3], this.t);
  }

  reset() {
    this.bx[1] = this.bx[3] - (this.bx[2] - this.bx[3]);
    this.bx[0] = this.bx[3];
    this.bx[2] = random(this.max);
    this.bx[3] = random(this.max);
  }
}

window.setup = () => {
  createCanvas(displayWidth, displayHeight, WEBGL);
  smooth();
  background(0);
  colorMode(HSB, 1);

  oldX = displayWidth / 2;
  oldY = displayHeight / 2;

  bezierX = new NoisyBezier(0.01, 10);
  bezierY = new NoisyBezier(0.01, 10);
  for (var i = 0; i < hues.length; i++) {
    hues[i] = new NoisyBezier(random(0.001, 0.009), 1.0);
    saturations[i] = new NoisyBezier(random(0.003, 0.01), 1.0);
  }
};

function drawMountains() {
  let dirX = (mouseX / width - 0.5) * 2;
  let dirY = (mouseY / height - 0.5) * 2;
  let c = color(100, 100, 10);
  directionalLight(c, -dirX, -dirY, -1);
  ambientMaterial(c);
  translate(-100, 425, 0)
  push();
  rotateZ(500);
  rotateX(0.01);
  rotateY(0.01);
  box(200, 200, 70);
  pop();
  
  push();
  translate(100, 0, 0)
  rotateZ(500);
  rotateX(50);
  rotateY(50);
  box(150, 150, 150);
  pop();
  
  push();
  translate(200, 0, 0)
  rotateZ(500);
  rotateX(250);
  rotateY(50);
  box(150, 200, 200);
  pop();
  
  push();
  translate(350, 0, 0)
  rotateZ(500);
  rotateX(350);
  rotateY(50);
  box(200, 250, 250);
  pop();

  push();
  translate(-100, 0, 0)
  rotateZ(500);
  rotateX(350);
  rotateY(50);
  box(200, 250, 250);
  pop();

  push();
  translate(-200, 0, 0)
  rotateZ(500);
  rotateX(350);
  rotateY(50);
  box(200, 200, 200);
  pop();
}

function draw_sun() {
  color(100, 100, 100);
  circle(mouseX, mouseY, 100);

}

window.draw = () => {
  background(0);
  

drawMountains();
draw_sun();
};

export function start() {
  console.log('starting visuals');
}
