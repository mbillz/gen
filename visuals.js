import _ from 'lodash';

var oldX;
var oldY;

var bezierX;
var bezierY;

const numNoiseUpdatesPerFrame = 7000;

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
  createCanvas(displayWidth, displayHeight);
  smooth();
  background(0);
  colorMode(HSB, 1);

  oldX = displayWidth / 2;
  oldY = displayHeight / 2;

  bezierX = new NoisyBezier(0.01, 10);
  bezierY = new NoisyBezier(0.01, 10);
};

window.draw = () => {
  background(0);

  for (var rep = 0; rep < numNoiseUpdatesPerFrame; rep++) {
    // noise value for the current position
    var n = noise(oldX/50 + bezierX.val, oldY/50 + bezierY.val, offset);

    stroke(mouseX / displayWidth, mouseY / displayHeight, 1, 0.05);
    // angle
    var a = n * TWO_PI + 20 * noise(offset);
    // distance
    var d = random(4, 7);
    // move using distance and angle
    var x = oldX + d * sin(a);
    var y = oldY + d * cos(a);

    // noise based line strokeWeight
    var w = max((40 + 10*sin(offset)) * noise(offset, oldX/50, oldY/50) - 10, 1);
    strokeWeight(w);

    line(oldX, oldY, x, y);

    // if we get out of the screen, jump back in
    if ((x < 0) || (y < 0) || (x > width) || (y > height)) {
      x = random(width);
      y = random(height);
    }  

    oldX = x;
    oldY = y;
  }
  offset += 0.0005;
  
  bezierX.update();
  bezierY.update();
};

export function start() {
  console.log('starting visuals');
}
