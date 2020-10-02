import _ from 'lodash';

var startTime;
var timeElapsed;

// PARAMETERS
const numMountains = 1;
var nPoints = 2000;  // from left to right
var mountainStart = 0.5;  // fraction of height
var mountainEnd = 0.2;  // fraction of height
var amplitudeStart = 0.2;
var amplitudeEnd = 0.4;
var stepStart = 0.05;
var stepEnd = 0.01;
var backColor = "#bd73c9";
var lastColor = "#5b2f91";
var backColors;
var frontColors;

var mountains;

class Mountain {
  constructor(color, velocity) {
    this.color = color;
    this.velocity = velocity; // in width ratio per millisecond
    this.yPoints = [];
    this.timeForNewPoint = 1 / (this.velocity * nPoints);
    this.noiseJitter = 0.02;
    this.noiseOffset = 1000 * Math.random();

    this.initializeYPoints();
  }

  initializeYPoints() {
    for (var i = 0; i < nPoints; i++) {
      const ratio = i / nPoints;
      const time = ratio / this.velocity;
      const point = this.getNoisePoint(ratio, time);
      this.yPoints.push(point);
    }
  }

  get timeSinceLastNewPoint() {
    return Date.now() - this.lastTimeMadeNewPoint;
  }

  update() {
    if (this.timeSinceLastNewPoint >= this.timeForNewPoint) {
      const point = this.getNoisePoint(1.0, timeElapsed);
      this.yPoints.pop();
      this.yPoints.unshift(point);
    }
  }

  getNoisePoint(ratio, time) {
    this.lastTimeMadeNewPoint = Date.now();
    const noiseFactor = this.noiseOffset + (ratio + time) * this.noiseJitter;
    const n = noise(noiseFactor);
    return map(n, 0, 1, amplitudeStart, amplitudeEnd);
  }

  draw() {
    fill(this.color);
    noStroke();

    beginShape();
    vertex(0, height);
    for (var i = 0; i < nPoints; i++) {
      const yPoint = this.yPoints[i];
      vertex(width * (i / nPoints), height * yPoint);
    }
    vertex(width, height);
    endShape(CLOSE);
  }
}

class Mountains { 
  constructor() {
    this.mountains = _.map(_.range(numMountains), (index) => {
      var firstColor = lerpColor(color(lastColor), color(backColor), 0.8);
      const mountainColor = lerpColor(lastColor, firstColor, (index + 1) / numMountains);
      return new Mountain(mountainColor, 0.001 * (index + 1));
    });
  }
}

window.setup = () => {
  pixelDensity(1);
  frameRate(30);

  createCanvas(displayWidth, displayHeight);
  background(0);
  ellipseMode(CENTER);
  // noiseDetail(50,0.4);
  backColors = [
    color(231, 142, 245),
    color(backColor)
  ]
  frontColors = [
    lastColor = color(91, 47, 145),
    color(lastColor)
  ]

  startTime = Date.now();
  timeElapsed = Date.now() - startTime;

  mountains = new Mountains();
};

window.draw = () => {
  timeElapsed = Date.now() - startTime;

  background(0);

  _.forEach(mountains.mountains, (mountain) => {
    mountain.update();
    mountain.draw();
  });

  // noLoop();
};

export function start() {
  console.log('starting visuals');
}
