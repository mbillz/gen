let xoff = 0.0;
  
let purple = '#5402f7';
let green = '#22e633';
let yellow = '#ffff1f';

var originPoint;
let rotationAngle = .001;
let numStars = 10000;
let maxStarAlpha = 250;
let minStarAlpha = 0;

let p1 = { x: 20, y: 800 };
let p2 = { x: -100, y: 300 };
let p3 = { x: 900, y: 300 };
let p4 = { x: 250, y: -200 };


class auroraLine { 
    constructor(points, color, endColor) {
      this.points = points;
      this.layers = 100;
      this.movementWeight = this.layers * 2.5
      this.color = color;
      this.endColor = endColor
      this.alpha = alpha;
    }

    drawEnd(up) {
        xoff = xoff + 0.01;
        let n = noise(xoff) * width;
        let directionMulti = 1
        if (up) {
            directionMulti = -1;
        }
        for (var i=0; i<this.layers; i++) {
            let ratio = i / this.layers
            let ratio_minus = 1 - ratio
            this.color
            let interpColor = lerpColor(this.color, this.endColor, ratio_minus);
            interpColor.setAlpha(n * ratio_minus / 3 - 20)
            stroke(interpColor);
            strokeWeight(20)
            let fillColor = color(0)
            fillColor.setAlpha(0)
            fill(fillColor);
            curve(this.points[0].x, this.points[0].y + n, 
                    this.points[1].x,  this.points[1].y + (directionMulti * this.movementWeight * ratio), 
                    this.points[2].x,  this.points[2].y + (directionMulti * this.movementWeight * ratio), 
                    this.points[3].x, this.points[3].y);
        }
    }
};


class Stars { 
    constructor(nStars, minSize, maxSize) {
      this.nStars = nStars;
      this.minSize = minSize;
      this.maxSize = maxSize;
      this.maxAlpha = maxStarAlpha;
      this.minAlpha = minStarAlpha;
      this.starPoints = this.createStars();

      this.twinkleSpeed = 0.001 * Math.random() + 0.0005;
    }

    createStars() {
      const randomMinusOneToOne = () => {
        return 2 * (Math.random() - 0.5);
      };

      let curStarPoints = []
      for (var i=0; i < this.nStars; i++) {
        // multiply by 1.5 so that our star grid is larger than the bounding box
        // this avoids any "holes" as the scene rotates about the origin
        let x = width * 1.5 * randomMinusOneToOne();
        let y = height * 1.5 * randomMinusOneToOne();
        let r = this.minSize + (this.maxSize - this.minSize) * Math.random();
        let starPoint = {x: x, y: y, r: r};
        curStarPoints.push(starPoint);
      }
      return curStarPoints;
    }

    drawStars() {
      for (var i=0; i < this.nStars; i++) {
        let curPoints = this.starPoints[i];
        let c = color(255, 255, 255);

        let noiseOffset = 1000 * i;
        let noiseFactor = noiseOffset + timeElapsed * this.twinkleSpeed;
        let a = this.minAlpha + (this.maxAlpha - this.minAlpha) * noise(noiseFactor);

        c.setAlpha(a);
        fill(c);
        noStroke();
        circle(curPoints.x, curPoints.y, curPoints.r);
      }
    }

    rotatePoint(point, angle, origin) {
      let s = Math.sin(angle);
      let c = Math.cos(angle);

      // translate point back to origin:
      point.x -= origin.x;
      point.y -= origin.y;

      // rotate point
      let xnew = point.x * c - point.y * s;
      let ynew = point.x * s + point.y * c;

      // translate point back:
      point.x = xnew + origin.x;
      point.y = ynew + origin.y;
    }

    // rotate stars around origin
    updateStars() {
      for (var i=0; i < this.nStars; i++) {
        this.rotatePoint(this.starPoints[i], rotationAngle, originPoint)
      }
    }
};

var stars;
var purpleLine;
var startTime;
var timeElapsed;

var loopCount = 0;

window.setup = () => {
    frameRate(10);
    createCanvas(displayWidth, displayHeight);
    purpleLine = new auroraLine([p1, p2, p3, p4], color(purple), color(green));
    stars = new Stars(numStars, 1, 5);
    originPoint = {x: 0.75 * width, y: 0.5 * height};
    console.log(stars.starPoints.slice(0, 50));

    startTime = Date.now();
    timeElapsed = Date.now() - startTime;  
};

window.draw = () => {
    timeElapsed = Date.now() - startTime;

    background(0);
    stars.updateStars();
    stars.drawStars();
    // purpleLine.drawEnd(true);
}

export function start() {
  console.log('starting visuals');
}
