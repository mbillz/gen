import _ from 'lodash';
import { isLineBreak } from 'typescript';

var timeElapsed;

const bgColor = '#370617';

class RainStreak {
  constructor() {

    // blues and purples
    // this.pallette = [
    //   color('#7400b8'),
    //   color('#6930c3'),
    //   color('#5e60ce'),
    //   color('#48bfe3'),
    //   color('#64dfdf'),
    // ];

    // // blues
    // this.pallette = [
    //   color('#03045e'),
    //   color('#023e8a'),
    //   color('#0096c7'),
    //   color('#48cae4'),
    //   color('#90e0ef'),
    // ];

    // reds and oranges
    this.pallette = [
      color('#370617'),
      color('#9d0208'),
      color('#dc2f02'),
      color('#f48c06'),
      color('#ffba08'),
    ];

    // reds and oranges
    this.pallette = [
      color('#132a13'),
      color('#31572c'),
      color('#4f772d'),
      color('#90a955'),
      color('#ecf39e'),
    ];

    this.reset();
  }

  get alpha() {
    return 0.7 * noise(this.alphaNoiseFactor + this.alphaNoiseOffset) + 0.3;
  }

  get palletteColor() {
    const c = this.pallette[this.palletteIndex]
    c.setAlpha(255 * this.alpha);
    return c;
  }

  get thickness() {
    return 10 * this.velocityNormalized;
  }

  get averageRainVelocity() {
    const pulse = sin(timeElapsed / 1000 * 2 * Math.PI);
    return 0.005 * (pulse + 2);
  }

  get velocity() {
    return this.velocityNormalized * this.averageRainVelocity;
  }

  reset() {
    this.top = Math.random();
    this.velocityNormalized = (0.75 * Math.random() + 0.25)
    this.length = 0.1 * this.velocityNormalized;
    this.centerX = Math.random();
    this.palletteIndex = Math.floor(_.size(this.pallette) * Math.random());

    this.alphaNoiseOffset = 1000 * Math.random();
    this.alphaNoiseFactor = 0;
  }

  draw(width, height) {
    strokeWeight(this.thickness);
    stroke(this.palletteColor);
    line(width * this.centerX, height * this.top, width * this.centerX, height * (this.top + this.length));
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

const numRainStreaks = 500;
var rainStreaks;

var startTime;
window.setup = () => {
  createCanvas(displayWidth, displayHeight);
  smooth();
  background(bgColor);
  noFill();

  rainStreaks = _.map(_.range(numRainStreaks), () => {
    return new RainStreak();
  });

  startTime = Date.now();
};

var numDraws = 0;
window.draw = () => {
  timeElapsed = Date.now() - startTime;

  const backgroundColor = color(bgColor);
  backgroundColor.setAlpha(255 * 0.05);
  background(backgroundColor);

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
