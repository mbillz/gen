import _ from 'lodash';

// stolen from here:
//   https://github.com/hamoid/Fun-Programming/blob/3a91c35d86e2cd340170f8ba2a0cb2a3ffd8a441/processing/ideas/i2012_02_18_fall_into_paths2/i2012_02_18_fall_into_paths2.pde

var i = 0;
var oldx;
var oldy;

var bezx;
var bezy;
var hues = [0,0,0,0];
var sats = [0,0,0,0];

// Offset is going to keep increasing.
// I start with a random offset so the branches 
// do not always point up at the beginning.
var offset = Math.random() * 2 * Math.PI;

// A random value interpolator based on a never ending bezier curve.
// When we reach destination (t == 1) then the end becomes the 
// beginning, the first control point is a mirror of the last 
// control point to make a smooth transition

class Bezerk {
  constructor(inct, m) {
    this.maximo = m;
    this.dt = inct;
    this.bx = [0, 0, 0, 0];
    this.t = 0;
    for (var i = 0; i<4; i++) {
      this.bx[i] = random(this.maximo);
    }
    this.next();
  }
  
  next() {
    this.t += this.dt;
    if (this.t > 1) {
      this.t = 0;
      this.bx[1] = this.bx[3] - (this.bx[2] - this.bx[3]);
      this.bx[0] = this.bx[3];
      this.bx[2] = random(this.maximo);
      this.bx[3] = random(this.maximo);
    }
    this.val = bezierPoint(this.bx[0], this.bx[1], this.bx[2], this.bx[3], this.t);
  }
}

window.setup = () => {
  createCanvas(640, 480);
  smooth();
  background(0);
  colorMode(HSB, 1);

  oldx = width / 2;
  oldy = height / 2;

  bezx = new Bezerk(0.01, 10);
  bezy = new Bezerk(0.01, 10);
  for (var i = 0; i<hues.length; i++) {
    hues[i] = new Bezerk(random(0.001, 0.009), 1);
    sats[i] = new Bezerk(random(0.003, 0.01), 0.7);
  }
};

window.draw = () => {
  background(0);

  // 7000 iterations per frame
  for (var rep = 0; rep < 7000; rep++) {
    // noise value for the current position
    var n = noise(oldx/50 + bezx.val, oldy/50 + bezy.val, offset);

    var which = Math.floor(n*hues.length);
    stroke(hues[which].val, sats[which].val, 1, 0.02);
    // angle
    var a = n * TWO_PI + 20 * noise(offset);
    // distance
    var d = random(4, 7);
    // move using distance and angle
    var x = oldx + d * sin(a);
    var y = oldy + d * cos(a);

    //var at = atan2(x-oldx, y-oldy);

    // noise based line strokeWeight
    var w = max((40 + 10*sin(offset)) * noise(offset, oldx/50, oldy/50) - 10, 1);
    strokeWeight(w);

    line(oldx, oldy, x, y);

    // if we get out of the screen, jump back in
    if ((x < 0) || (y < 0) || (x > width) || (y > height)) {
      x = random(width);
      y = random(height);
    }  

    oldx = x;
    oldy = y;
  }
  offset += 0.005;
  
  for (var i = 0; i<hues.length; i++) {
    hues[i].next();
    sats[i].next();
  }
  bezx.next();
  bezy.next();
};

export function start() {
  console.log('starting visuals');
}
