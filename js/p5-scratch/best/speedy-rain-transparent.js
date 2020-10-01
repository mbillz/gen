import _ from 'lodash';
import { isLineBreak } from 'typescript';

class RainStreak {
  constructor() {

    this.pallette = [
      color('#03045e'),
      color('#023e8a'),
      color('#0096c7'),
      color('#48cae4'),
      color('#90e0ef'),
    ];

    this.reset();
  }

  get alpha() {
    return 0.7 * noise(this.alphaNoiseFactor + this.alphaNoiseOffset) + 0.3;
  }

  palletteColor(alpha) {
    const c = this.pallette[this.palletteIndex]
    c.setAlpha(255 * alpha);
    return c;
  }

  get thickness() {
    return 25 * this.velocityNormalized;
  }

  get averageRainVelocity() {
    return 0.1 * (mouseY / displayHeight);
  }

  get velocity() {
    return this.velocityNormalized * this.averageRainVelocity;
  }

  reset() {
    this.top = Math.random();
    this.velocityNormalized = (0.75 * Math.random() + 0.25)
    this.length = 0.2 * this.velocityNormalized;
    this.centerX = Math.random();
    this.palletteIndex = Math.floor(_.size(this.pallette) * Math.random());

    this.alphaNoiseOffset = 1000 * Math.random();
    this.alphaNoiseFactor = 0;
  }

  draw() {
    strokeWeight(this.thickness);
    const numGhostLines = 10;
    for (var i = 0; i < numGhostLines; i++) {
      const alpha = this.alpha * (1 - i / numGhostLines);
      const lineTop = this.top - i * this.velocity;
      const color = this.palletteColor(alpha);
  
      stroke(color);
      line(
        displayWidth * this.centerX,
        displayHeight * lineTop,
        displayWidth * this.centerX,
        displayHeight * (this.top + this.length),
      );
    }
  }

  update(timeElapsed) {
    this.top += this.velocity;

    this.alphaNoiseFactor = timeElapsed * 0.00001;

    if (this.top > 1) {
      this.reset();
      this.top = -this.length;
    }
  }
}

const numRainStreaks = 250;
var rainStreaks;

var startTime;
window.setup = () => {
  createCanvas(displayWidth, displayHeight);
  smooth();
  // background(0);
  noFill();

  rainStreaks = _.map(_.range(numRainStreaks), () => {
    return new RainStreak();
  });

  startTime = Date.now();
};

var numDraws = 0;
window.draw = () => {
  const timeElapsed = Date.now() - startTime;

  clear();

  // const backgroundColor = color(0, 0, 0);
  // backgroundColor.setAlpha(255 * 0.2);
  // background(backgroundColor);

  _.forEach(rainStreaks, (rainStreak) => {
    rainStreak.update(timeElapsed);
    rainStreak.draw(displayWidth, displayHeight);
  });

  // if (numDraws > 200) {
  //   noLoop();
  // }
};

export function start() {
  console.log('starting visuals');
}
