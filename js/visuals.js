import _ from 'lodash';

const backgroundGradient = [
  '#03071e',
  '#01030F',
]

const mountainGradientA = [
  '#3d0061',
  '#264038',
]

const mountainGradientB = [
  '#143601',
  '#242424',
]

const auroraGradientA = [
  '#7400b8',
  '#80ffdb',
]

const auroraGradientB = [
  '#04206A',
  '#143601',
]

const rainPalletteA = [
  '#6930c3',
  '#5390d9',
  '#4ea8de',
  '#56cfe1',
  '#72efdd',
]

const rainPalletteB = [
  '#143601',
  '#1a4301',
  '#245501',
  '#538d22',
  '#73a942',
]

/* @Matt check out all of these constants to twiddle with things in the scene */

/* Stars */
const numStars = 500; // Performance-critical
const starsMinWidth = 1;
const starsMaxWidth = 3;
const maxStarAlpha = 255;
const minStarAlpha = 50;

/* Rain */
const numRainStreaks = 500; // Performance-critical
const numRainGhostLines = 1; // Performance-critical
const maxRainThickness = 5;
const maxRainLength = 0.1; // as a portion of screen height
const minRainVelocity = 0.05;
const maxRainVelocity = 0.15;
const minRainProbability = 0.05;

/* Aurora */
const numAuroraLayers = 100; // Performance-critical
const auroraHeight = 400;
const auroraSwellSinusoidPeriodX = 3500;
const auroraSwellSinusoidPeriodY = 5000;

/* Mountains */
const nMountains = 4;
const nPoints = 200;
const mountainStart = 0.55;  // fraction of height
const mountainEnd = 0.4; // fraction of height
const amplitudeStart = 0.2;
const amplitudeEnd = 0.5;
const stepStart = 0.05;
const stepEnd = 0.01;

var stars;
var aurora;
var mountains;
var startTime;
var timeElapsed;
var rainStreaks;
var starOriginPoint;


function getVibeInterpolation() {
  /* @Matt, this is the "vibe interpolation" between the modes. It's all gradual interpolation.
     This value is from (0 -> 1) and changes these things in the scene:
        - The amount of rain
        - The speed of the rain
        - The color pallete

     So to make this respond to the music, we can just use a timing function to make this swell up then down?
     Feel free to modify this however you choose.
  */
  return mouseY / displayHeight;
}

class AuroraLine { 
  constructor(points) {
    this.points = points;
    this.movementWeight = numAuroraLayers * (auroraHeight / numAuroraLayers);

    this.colorsA = _.map(auroraGradientA, (c) => { return color(c) });
    this.colorsB = _.map(auroraGradientB, (c) => { return color(c) });

    this.alphaNoiseXOffset = 0;
  }

  drawEnd() {
    this.alphaNoiseXOffset += 0.01;
    let alphaNoise = 255 * noise(this.alphaNoiseXOffset);

    const startColor = lerpColor(this.colorsA[0], this.colorsB[0], getVibeInterpolation());
    const endColor = lerpColor(this.colorsA[1], this.colorsB[1], getVibeInterpolation());
    for (var i=0; i<numAuroraLayers; i++) {
      let ratio = i / numAuroraLayers
      let ratio_minus = 1 - ratio
      let interpColor = lerpColor(startColor, endColor, ratio_minus);
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
        offsetPoints[1].y + (-this.movementWeight * ratio),
        offsetPoints[2].x,
        offsetPoints[2].y + (-this.movementWeight * ratio),
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
    const sinX = Math.sin(timeElapsed / auroraSwellSinusoidPeriodX * Math.PI * 2)
    const sinY = Math.sin(timeElapsed / auroraSwellSinusoidPeriodY * Math.PI * 2)

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

class Stars { 
  constructor(nStars, minSize, maxSize) {
    this.nStars = nStars;
    this.minSize = minSize;
    this.maxSize = maxSize;
    this.starPoints = this.createStars();

    this.twinkleSpeed = 0.001 * Math.random() + 0.0005;
  }

  createStars() {
    let curStarPoints = []
    for (var i=0; i < this.nStars; i++) {
      curStarPoints.push(this.generateNewStarPoint());
    }
    return curStarPoints;
  }

  generateNewStarPoint() {
    // multiply by 1.5 so that our star grid is larger than the bounding box
    // this avoids any "holes" as the scene rotates about the origin
    let x = width * Math.random(); // TODO: If we bring back rotation, make this larger
    let y = height * Math.random(); // TODO: If we bring back rotation, make this larger
    let r = this.minSize + (this.maxSize - this.minSize) * Math.random();
    return {x: x, y: y, r: r};
  }

  drawStars() {
    for (var i=0; i < this.nStars; i++) {
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
    for (var i=0; i < this.nStars; i++) {
      this.rotatePoint(this.starPoints[i], starRotationAngle, starOriginPoint)
    }
  }
};

class RainStreak {
  constructor() {
    this.palletteA = _.map(rainPalletteA, (c) => { return color(c) })
    this.palletteB = _.map(rainPalletteB, (c) => { return color(c) })

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
    return maxRainThickness * this.velocityNormalized;
  }

  get averageRainVelocity() {
    return minRainVelocity + (maxRainVelocity - minRainVelocity) * getVibeInterpolation();
  }

  get velocity() {
    return this.velocityNormalized * this.averageRainVelocity;
  }

  rainProbablity() {
    return (1 - minRainProbability) * getVibeInterpolation() + minRainProbability;
  }

  reset() {
    this.isOn = Math.random() <= this.rainProbablity();

    this.top = Math.random();
    this.velocityNormalized = (0.75 * Math.random() + 0.25)
    this.length = maxRainLength * this.velocityNormalized;
    this.centerX = Math.random();
    this.palletteIndex = Math.floor(_.size(this.palletteA) * Math.random());
    this.angle = Math.PI * 0.1 * ((mouseX / displayWidth) - 0.5);
  }

  draw(width, height) {
    if (!this.isOn) {
      return;
    }

    strokeWeight(this.thickness);
    const displacementX = this.length * sin(this.angle);
    for (var i = 0; i < numRainGhostLines; i++) {
      const alpha = this.alpha * Math.pow(0.8, i);
      const lineTopYChange = i * this.velocity;
      const lineTopDisplacement = lineTopYChange * sin(this.angle);
      const lineTop = this.top;
      const color = this.palletteColor(alpha);
  
      stroke(color);
      line(
        displayWidth * (this.centerX - lineTopDisplacement),
        displayHeight * (this.top - lineTopYChange),
        displayWidth * (this.centerX + displacementX - lineTopDisplacement),
        displayHeight * (this.top - lineTopYChange + cos(this.angle) * this.length),
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
    this.colorsA = _.map(mountainGradientA, (c) => { return color(c) });
    this.colorsB = _.map(mountainGradientB, (c) => { return color(c) });
  }

  createAllMountainPoints() {
    for (var i=nMountains; i>=0; i--) {
      var ratio = i/nMountains;
      var pos = map(ratio, 1, 0, mountainStart, mountainEnd)
      var amp = map(ratio, 1, 0, amplitudeStart, amplitudeEnd);
      var step = map(ratio, 1, 0, stepStart, stepEnd);
      noiseDetail(map(ratio, 1, 0, 70, 10), map(ratio,1,0,0.3,0.7));
      this.mountainPoints[i] = this.createSingleMountain(pos, amp, step, i);
    }
  }

  createSingleMountain(position, amplitude, step, z) {
    var mountain = [];
    var moyenne = 0;
    for (var i=0; i<=nPoints; i++){
        var v = height*amplitude*noise(i*step, 100*z);
        moyenne += v;
        mountain[i] =  v;
    }
    moyenne = moyenne/mountain.length
    var delta = (mountainEnd - mountainStart)/nMountains;
    for (var i=0; i<=nPoints; i++) {
        mountain[i] = height*(1-position) + mountain[i]-moyenne + map(noise(z), 0, 1, -delta, delta);
    }
    return mountain;
  }

  drawAllMontains() {
    const startColor = lerpColor(this.colorsA[0], this.colorsB[0], getVibeInterpolation());
    const endColor = lerpColor(this.colorsA[1], this.colorsB[1], getVibeInterpolation());
    var firstColor = lerpColor(startColor, endColor, 0.8);
    for (var i=nMountains; i>=0; i--) {
      var ratio = i/nMountains
      fill(lerpColor(endColor, firstColor, ratio));
      noStroke();
      beginShape();
      vertex(0, height);
      for (var j=0; j<=nPoints; j++){
          vertex(j/nPoints*width, this.mountainPoints[i][j]);
      }
      vertex(width, height);
      endShape(CLOSE);
    }
  }
  // will just take first point and make it last point for now.
  // won't be using this, just going to make it static
  updateMountainPoints() {
    for (var i=nMountains; i>=0; i--) {
      var curMountain = this.mountainPoints[i]
      var updatedMountain = []
      updatedMountain.push(curMountain[curMountain.length - 1]);
      updatedMountain = updatedMountain.concat(curMountain.slice(0, curMountain.length - 1));
      this.mountainPoints[i] = updatedMountain;
    };
  }
}

window.setup = () => {
  startTime = Date.now();
  timeElapsed = Date.now() - startTime;

  frameRate(10); // TODO: See if this is the max? If we're rastering to video, we can set to 60
  createCanvas(displayWidth, displayHeight);
  smooth();
  noFill();

  let p1 = { x: -0.3 * width, y: 0.3 * height };
  let p2 = { x: 0.7 * width, y: 0.1 * height };
  let p3 = { x: 0.35 * width, y: 0.55 * height };
  let p4 = { x: 1.3 * width, y: 0.4 * height };
  aurora = new AuroraLine([p1, p2, p3, p4]);
  mountains = new Mountains();
  stars = new Stars(numStars, starsMinWidth, starsMaxWidth);
  starOriginPoint = {x: 0.75 * width, y: 0.5 * height};
  console.log(stars.starPoints.slice(0, 50));
    
  rainStreaks = _.map(_.range(numRainStreaks), () => {
    return new RainStreak();
  });
};

function drawBackgroundGradient(color1, color2) {
  noFill();

  // Left to right gradient
  for (let x = 0; x <= displayWidth; x++) {
    let interpColor = lerpColor(color1, color2, x / displayWidth);
    stroke(interpColor);
    line(x, 0, x, displayHeight);
  }
}

window.draw = () => {
  timeElapsed = Date.now() - startTime;

  drawBackgroundGradient(color(backgroundGradient[0]), color(backgroundGradient[1]));

  // stars
  // stars.updateStars(); // we removed this, because we don't need to rotate the stars, just twinkle
  stars.drawStars();
  
  // draw mountains
  mountains.drawAllMontains();

  // // aurora
  aurora.drawEnd(true);

  // // rain
  _.forEach(rainStreaks, (rainStreak) => {
    rainStreak.update(timeElapsed);
    rainStreak.draw(displayWidth, displayHeight);
  });
}

export function start() {
  console.log('starting visuals');
}
