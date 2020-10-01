import _ from 'lodash';

let xoff = 0.0;
  
let purple = '#5402f7';
let green = '#22e633';
let yellow = '#ffff1f';

var originPoint;
let rotationAngle = .001;
let numStars = 10000;
let maxStarAlpha = 250;
let minStarAlpha = 0;

class auroraLine { 
    constructor(points, color, endColor) {
      this.points = points;
      const totalHeight = 400;
      this.layers = 100;
      this.movementWeight = this.layers * (totalHeight / this.layers);
      this.color = color;
      this.endColor = endColor
      this.alpha = 0.5;
    }

    drawEnd(up) {
        xoff = xoff + 0.01;
        let alphaNoise = 255 * noise(xoff);

        let directionMulti = 1
        if (up) {
            directionMulti = -1;
        }
        for (var i=0; i<this.layers; i++) {
            let ratio = i / this.layers
            let ratio_minus = 1 - ratio
            let interpColor = lerpColor(this.color, this.endColor, ratio_minus);
            const alpha = alphaNoise * (1 - Math.abs(-2 * ratio + 1));
            interpColor.setAlpha(alpha)
            stroke(interpColor);
            strokeWeight(20)
            let fillColor = color(0)
            fillColor.setAlpha(0)
            fill(fillColor);
            
            const offsetPoints = _.map(this.points, (point, index) => {
              return this.getPointOffset(point, index);
            });

            bezier(
              offsetPoints[0].x,
              offsetPoints[0].y, 
              offsetPoints[1].x,
              offsetPoints[1].y + (directionMulti * this.movementWeight * ratio),
              offsetPoints[2].x,
              offsetPoints[2].y + (directionMulti * this.movementWeight * ratio),
              offsetPoints[3].x,
              offsetPoints[3].y,
            );
        }
    }

    getPointOffset(originalPoint, pointIndex) {
      // don't have motion on the fixed points, only the control points
      if (pointIndex === 0 || pointIndex === 3) {
        return originalPoint;
      }
      const range = 0.1;
      const sinX = Math.sin(timeElapsed / 3500 * Math.PI * 2)
      const sinY = Math.sin(timeElapsed / 5000 * Math.PI * 2)

      // const speed = 0.0005;
      // let noiseOffset = 1000 * pointIndex;
      // not using these right now, looked jittery
      // const noiseX = noise(noiseOffset + timeElapsed * speed) - 0.5;
      // const noiseY = noise(noiseOffset + timeElapsed * speed) - 0.5;
      const nX = range * sinX;
      const nY = range * sinY;

      return {x: originalPoint.x + width * nX, y: originalPoint.y + height * nY};
    }
};

function gaussian(x, standardDeviation) {
  const factor = 1 / (standardDeviation * Math.sqrt(2 * Math.PI));
  return factor * Math.exp(-0.5 * (x * x) / (standardDeviation * standardDeviation));
}

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

    let p1 = { x: -0.3 * width, y: 0.3 * height };
    let p2 = { x: 0.7 * width, y: 0.1 * height };
    let p3 = { x: 0.35 * width, y: 0.55 * height };
    let p4 = { x: 1.3 * width, y: 0.4 * height };
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
    purpleLine.drawEnd(true);

    // loopCount++;
    // if (loopCount > 50) {
    //   noLoop();
    // }
}

export function start() {
  console.log('starting visuals');
}
