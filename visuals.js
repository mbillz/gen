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
  
  directionalLight(250, 250, 250, -dirX, -dirY, -1);
  ambientMaterial(255, 255, 255);
  translate(-100, 270, 0);
  push();
  rotateZ(500);
  rotateX(0.01);
  rotateY(0.01);
  box(200, 200, 70);
  pop();
  
  translate(140, 0, 0);
  push();
  rotateZ(500);
  rotateX(50);
  rotateY(50);
  box(150, 150, 150);
  pop();
  
  translate(100, 0, 0);
  push();
  rotateZ(500);
  rotateX(250);
  rotateY(50);
  box(150, 200, 200);
  pop();
  
  translate(100, 0, 0);
  push();
  rotateZ(500);
  rotateX(350);
  rotateY(50);
  box(100, 250, 250);
  pop();
}

window.draw = () => {
  background(0);
  
  for (var rep = 0; rep < numNoiseUpdatesPerFrame; rep++) {
    // noise value for the current position
    var n = noise(oldX/50 + bezierX.val, oldY/50 + bezierY.val, offset);

    var which = Math.floor(n * hues.length);
    // stroke(hues[which].val, saturations[which].val, 1, 0.05);
    // angle
    var a = n * TWO_PI + 20 * noise(offset);
    // distance
    var d = random(4, 7);
    // move using distance and angle
    var x = oldX + d * sin(a);
    var y = oldY + d * cos(a);

    // noise based line strokeWeight
    var w = max((40 + 10*sin(offset)) * noise(offset, oldX/50, oldY/50) - 10, 1);
    // strokeWeight(w);

    // circle(oldX, oldY, 100, 100);
    // directionalLight(250, 250, 250, -oldX, -oldY, 100);
    // if we get out of the screen, jump back in
    if ((x < 0) || (y < 0) || (x > width) || (y > height)) {
      x = random(width);
      y = random(height);
    }  

    oldX = x;
    oldY = y;
  }
  offset += 0.0005;
  
  for (var i = 0; i<hues.length; i++) {
    hues[i].update();
    saturations[i].update();
  }
  bezierX.update();
  bezierY.update();

drawMountains();
};

export function start() {
  console.log('starting visuals');
}
