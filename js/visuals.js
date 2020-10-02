import _ from 'lodash';

/* @Matt check out all of these constants to twiddle with things in the scene */

const backgroundGradientA = ['#03071e', '#01030F'];

const mountainGradientA = ['#3d0061', '#264038'];

const auroraGradientA = ['#7400b8', '#80ffdb'];

const rainPalletteA = ['#6930c3', '#5390d9', '#4ea8de', '#56cfe1', '#72efdd'];

const backgroundGradientB = ['#caf0f8', '#ade8f4'];

const mountainGradientB = ['#143601', '#242424'];

const auroraGradientB = ['#74c69d', '#48cae4'];

const rainPalletteB = ['#03045e', '#023e8a', '#0077b6', '#0096c7', '#00b4d8'];

/* Stars */
const numStars = 1000; // Performance-critical
const starsMinWidth = 1;
const starsMaxWidth = 3;
const maxStarAlpha = 255;
const minStarAlpha = 50;
const starRotationSpeed = 0.0005 * Math.PI;

/* Rain */
const numRainStreaks = 200; // Performance-critical
const numRainGhostLines = 1; // Performance-critical
const maxRainThickness = 3;
const maxRainLength = 0.05; // as a portion of screen height
const minRainVelocity = 0.05;
const maxRainVelocity = 0.15;
const minRainProbability = 0.1;

/* Aurora */
const numAuroraLayers = 100; // Performance-critical
const auroraHeight = 400;
const auroraSwellSinusoidPeriodX = 3500;
const auroraSwellSinusoidPeriodY = 5000;

/* Mountains */
const nMountains = 4;
const nPoints = 300;
const mountainStart = 0.6; // fraction of height
const mountainEnd = 0.4; // fraction of height
const amplitudeStart = 0.2;
const amplitudeEnd = 0.5;
const stepStart = 0.05;
const stepEnd = 0.01;
const mountainAlpha = 100;

var stars;
var aurora;
var mountains;
var startTime;
var timeElapsed;
var rainStreaks;
var starOriginPoint;
var gradientBackground;
var rainSwellFactor = 1.0;
let shouldFlood = false;
let floodVal = 1;

function getVibeInterpolation() {
  /* @Matt, this is the "vibe interpolation" between the modes. It's all gradual interpolation.
     This value is from (0 -> 1) and changes these things in the scene:
        - The amount of rain
        - The speed of the rain
        - The color pallete

     So to make this respond to the music, we can just use a timing function to make this swell up then down?
     Feel free to modify this however you choose.
  */
  const mouseRatio = 1 - mouseY / height;
  const bufferArea = 0.25;
  if (mouseRatio < bufferArea) {
    return 0;
  }
  if (mouseRatio > 1 - bufferArea) {
    return 1;
  }
  return (mouseRatio - bufferArea) / (1 - 2 * bufferArea);
}

class AuroraLine {
  constructor(points) {
    this.points = points;
    this.movementWeight = numAuroraLayers * (auroraHeight / numAuroraLayers);

    this.colorsA = _.map(auroraGradientA, (c) => {
      return color(c);
    });
    this.colorsB = _.map(auroraGradientB, (c) => {
      return color(c);
    });

    this.alphaNoiseXOffset = 0;
  }

  drawEnd() {
    this.alphaNoiseXOffset += 0.01;
    let alphaNoise = 255 * noise(this.alphaNoiseXOffset);

    const startColor = lerpColor(
      this.colorsA[0],
      this.colorsB[0],
      getVibeInterpolation()
    );
    const endColor = lerpColor(
      this.colorsA[1],
      this.colorsB[1],
      getVibeInterpolation()
    );
    for (var i = 0; i < numAuroraLayers; i++) {
      let ratio = i / numAuroraLayers;
      let ratio_minus = 1 - ratio;
      let interpColor = lerpColor(startColor, endColor, ratio_minus);
      const alpha = alphaNoise * (1 - Math.abs(-2 * ratio + 1));
      interpColor.setAlpha(alpha);
      stroke(interpColor);
      strokeWeight(20);
      let fillColor = color(0);
      fillColor.setAlpha(0);
      fill(fillColor);

      const offsetPoints = _.map(this.points, (point, index) => {
        return this.getPointOffset(point, index);
      });

      bezier(
        offsetPoints[0].x,
        offsetPoints[0].y,
        offsetPoints[1].x,
        offsetPoints[1].y + -this.movementWeight * ratio,
        offsetPoints[2].x,
        offsetPoints[2].y + -this.movementWeight * ratio,
        offsetPoints[3].x,
        offsetPoints[3].y
      );
    }
  }

  getPointOffset(originalPoint, pointIndex) {
    // don't have motion on the fixed points, only the control points
    if (pointIndex === 0 || pointIndex === 3) {
      return originalPoint;
    }

    const range = 0.1;
    const sinX = Math.sin(
      (timeElapsed / auroraSwellSinusoidPeriodX) * Math.PI * 2
    );
    const sinY = Math.sin(
      (timeElapsed / auroraSwellSinusoidPeriodY) * Math.PI * 2
    );

    // const speed = 0.0005;
    // let noiseOffset = 1000 * pointIndex;
    // not using these right now, looked jittery
    // const noiseX = noise(noiseOffset + timeElapsed * speed) - 0.5;
    // const noiseY = noise(noiseOffset + timeElapsed * speed) - 0.5;
    const nX = range * sinX;
    const nY = range * sinY;

    return {
      x: originalPoint.x + width * nX,
      y: originalPoint.y + height * nY,
    };
  }
}

class Stars {
  constructor() {
    this.starPoints = this.createStars();
    this.twinkleSpeed = 0.001 * Math.random() + 0.0005;
  }

  createStars() {
    let curStarPoints = [];
    for (var i = 0; i < numStars; i++) {
      curStarPoints.push(this.generateNewStarPoint());
    }
    return curStarPoints;
  }

  generateNewStarPoint() {
    // multiply by 1.5 so that our star grid is larger than the bounding box
    // this avoids any "holes" as the scene rotates about the origin
    let x = width * 2 * (Math.random() - 0.5); // TODO: If we bring back rotation, make this larger
    let y = height * 2 * (Math.random() - 0.5); // TODO: If we bring back rotation, make this larger
    let r = starsMinWidth + (starsMaxWidth - starsMinWidth) * Math.random();
    return { x: x, y: y, r: r };
  }

  drawStars() {
    for (var i = 0; i < numStars; i++) {
      let curPoints = this.starPoints[i];
      let c = color(255, 255, 255);

      let noiseOffset = 1000 * i;
      let noiseFactor = noiseOffset + timeElapsed * this.twinkleSpeed;
      let a = minStarAlpha + (maxStarAlpha - minStarAlpha) * noise(noiseFactor);

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
    for (var i = 0; i < numStars; i++) {
      this.rotatePoint(this.starPoints[i], starRotationSpeed, starOriginPoint);
    }
  }
}

class RainStreak {
  constructor() {
    this.palletteA = _.map(rainPalletteA, (c) => {
      return color(c);
    });
    this.palletteB = _.map(rainPalletteB, (c) => {
      return color(c);
    });

    this.reset();
  }

  get alpha() {
    return 1.0;
  }

  palletteColor(alpha) {
    const colorA = this.palletteA[this.palletteIndex];
    const colorB = this.palletteB[this.palletteIndex];
    const c = lerpColor(colorA, colorB, getVibeInterpolation());
    c.setAlpha(255 * alpha);
    return c;
  }

  get thickness() {
    return maxRainThickness * this.velocityNormalized * rainSwellFactor;
  }

  get averageRainVelocity() {
    return (
      minRainVelocity +
      (maxRainVelocity - minRainVelocity) * (1 - getVibeInterpolation())
    );
  }

  get velocity() {
    return this.velocityNormalized * this.averageRainVelocity;
  }

  rainProbablity() {
    return (
      (1 - minRainProbability) * (1 - getVibeInterpolation()) +
      minRainProbability
    );
  }

  reset() {
    this.isOn = Math.random() <= this.rainProbablity();

    this.top = Math.random();
    this.velocityNormalized = 0.75 * Math.random() + 0.25;
    this.length = maxRainLength * this.velocityNormalized;
    this.centerX = Math.random();
    this.palletteIndex = Math.floor(_.size(this.palletteA) * Math.random());
    this.angle = Math.PI * 0.1 * (mouseX / width - 0.5);
  }

  draw(width, height) {
    if (!this.isOn) {
      return;
    }

    strokeWeight(this.thickness);
    const displacementX = this.length * sin(this.angle);
    for (var i = 0; i < numRainGhostLines; i++) {
      const alpha = this.alpha * Math.pow(0.8, i);
      const lineTopYChange = i * this.velocity * 0.25;
      const lineTopDisplacement = lineTopYChange * sin(this.angle);
      const lineTop = this.top;
      const color = this.palletteColor(alpha);

      stroke(color);
      line(
        width * (this.centerX - lineTopDisplacement),
        height * (this.top - lineTopYChange),
        width * (this.centerX + displacementX - lineTopDisplacement),
        height * (this.top - lineTopYChange + cos(this.angle) * this.length)
      );
    }
  }

  update(timeElapsed) {
    const topBefore = this.top;
    this.top += this.velocity;
    const topDiff = this.top - topBefore;

    this.centerX += topDiff * sin(this.angle);

    if (this.top > 1) {
      this.reset();
      this.top = -this.length;
    }
  }
}

class Mountains {
  constructor() {
    this.mountainPoints = [];
    this.createAllMountainPoints();
    this.colorsA = _.map(mountainGradientA, (c) => {
      return color(c);
    });
    this.colorsB = _.map(mountainGradientB, (c) => {
      return color(c);
    });
  }

  createAllMountainPoints() {
    for (var i = nMountains; i >= 0; i--) {
      var ratio = i / nMountains;
      var pos = map(ratio, 1, 0, mountainStart, mountainEnd);
      var amp = map(ratio, 1, 0, amplitudeStart, amplitudeEnd);
      var step = map(ratio, 1, 0, stepStart, stepEnd);
      noiseDetail(map(ratio, 1, 0, 70, 10), map(ratio, 1, 0, 0.3, 0.7));
      this.mountainPoints[i] = this.createSingleMountain(pos, amp, step, i);
    }
  }

  createSingleMountain(position, amplitude, step, z) {
    var mountain = [];
    var moyenne = 0;
    for (var i = 0; i <= nPoints; i++) {
      var v = height * amplitude * noise(i * step, 100 * z);
      moyenne += v;
      mountain[i] = v;
    }
    moyenne = moyenne / mountain.length;
    var delta = (mountainEnd - mountainStart) / nMountains;
    for (var i = 0; i <= nPoints; i++) {
      mountain[i] =
        height * (1 - position) +
        mountain[i] -
        moyenne +
        map(noise(z), 0, 1, -delta, delta);
    }
    return mountain;
  }

  drawAllMontains() {
    const startColor = lerpColor(
      this.colorsA[0],
      this.colorsB[0],
      getVibeInterpolation()
    );
    const endColor = lerpColor(
      this.colorsA[1],
      this.colorsB[1],
      getVibeInterpolation()
    );
    var firstColor = lerpColor(startColor, endColor, 0.8);
    for (var i = nMountains; i >= 0; i--) {
      var ratio = i / nMountains;
      let actualColor = lerpColor(endColor, firstColor, ratio);
      actualColor.setAlpha(mountainAlpha);
      fill(actualColor);
      noStroke();
      beginShape();
      vertex(0, height);
      for (var j = 0; j <= nPoints; j++) {
        vertex((j / nPoints) * width, this.mountainPoints[i][j]);
      }
      vertex(width, height);
      endShape(CLOSE);
    }
  }

  // will just take first point and make it last point for now.
  // won't be using this, just going to make it static
  updateMountainPoints() {
    for (var i = nMountains; i >= 0; i--) {
      var curMountain = this.mountainPoints[i];
      var updatedMountain = [];
      updatedMountain.push(curMountain[curMountain.length - 1]);
      updatedMountain = updatedMountain.concat(
        curMountain.slice(0, curMountain.length - 1)
      );
      this.mountainPoints[i] = updatedMountain;
    }
  }
}

window.setup = () => {
  startTime = Date.now();
  timeElapsed = Date.now() - startTime;

  createCanvas(displayWidth, displayHeight);
  smooth();
  noFill();

  starOriginPoint = { x: 0.5 * width, y: 0.5 * height };

  let p1 = { x: -0.3 * width, y: 0.3 * height };
  let p2 = { x: 0.7 * width, y: 0.1 * height };
  let p3 = { x: 0.35 * width, y: 0.55 * height };
  let p4 = { x: 1.3 * width, y: 0.4 * height };
  aurora = new AuroraLine([p1, p2, p3, p4]);
  mountains = new Mountains();
  stars = new Stars();
  gradientBackground = new GradientBackground();
  rainStreaks = _.map(_.range(numRainStreaks), () => {
    return new RainStreak();
  });
};

class GradientBackground {
  constructor() {
    this.colorsA = _.map(backgroundGradientA, (c) => {
      return color(c);
    });
    this.colorsB = _.map(backgroundGradientB, (c) => {
      return color(c);
    });
  }

  draw() {
    const startColor = lerpColor(
      this.colorsA[0],
      this.colorsB[0],
      getVibeInterpolation()
    );
    const endColor = lerpColor(
      this.colorsA[1],
      this.colorsB[1],
      getVibeInterpolation()
    );

    noFill();

    // Left to right gradient
    for (let x = 0; x <= width; x++) {
      let interpColor = lerpColor(startColor, endColor, x / width);
      stroke(interpColor);
      line(x, 0, x, height);
    }
  }
}

window.draw = () => {
  timeElapsed = Date.now() - startTime;

  gradientBackground.draw();

  // stars
  stars.updateStars();
  stars.drawStars();

  // draw mountains
  mountains.drawAllMontains();

  // aurora
  aurora.drawEnd(true);

  rainSwellFactor = 0.75 * (rainSwellFactor - 1.0) + 1;

  // rain
  _.forEach(rainStreaks, (rainStreak) => {
    rainStreak.update(timeElapsed);
    rainStreak.draw(width, height);
  });
};

export function start() {
  console.log('starting visuals');
}

export function swellRain() {
  rainSwellFactor = 15.0;
}

export function addRain() {
  setTimeout(() => {
    shouldFlood = true;
  }, 10000);

  setTimeout(() => {
    shouldFlood = false;
  }, 30000);
}
