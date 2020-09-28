import _ from 'lodash';

var startTime = Date.now();
window.setup = () => {
  createCanvas(displayWidth, displayHeight);
};

const totalRadians = 2 * Math.PI;
const numDots = 500;

const circleRadius = 100;
const dotRadius = 4;

class Fourier {
  constructor(numComponents = 20) {
    this.numComponents = numComponents;
    this.scalars = _.map(_.range(this.numComponents), () => {
      return Math.random();
    });
    this.velocity = _.map(_.range(this.numComponents), () => {
      return 0;
    });
    this.refreshAccelerations();
  }

  fouriers(x) {
    return _.map(_.range(this.numComponents), (index) => {
      const scaleFactor = (index + 1);
      return Math.sin(2 * Math.PI * x * scaleFactor)
    });
  }

  fullWave(x) {
    // console.log('getting fullWave of x', x);
    // console.log('         this.scalars', this.scalars);
    const components = _.map(this.fouriers(x), (value, index) => {
      return this.scalars[index] * value
    });
    // console.log('           components', components);
    const sum = components.reduce((a, b) => { return a + b }, 0);
    // console.log('                  sum', sum);
    return sum / components.length;
  }

  update() {
    this.refreshAccelerations();
    // console.log('doing update');
    // console.log('veloicity was', this.velocity);
    // console.log('scalars was', this.scalars);
    this.velocity = _.map(this.velocity, (velocity, index) => {
      const acceleration = this.acceleration[index];
      return velocity + acceleration;
    });
    this.scalars = _.map(this.scalars, (scalar, index) => {
      const velocity = this.velocity[index];
      return scalar + velocity;
    });
    // console.log('veloicity is', this.velocity);
    // console.log('scalars is', this.scalars);
  }

  refreshAccelerations() {
    this.acceleration = _.map(_.range(this.numComponents), () => {
      return (Math.random() - 0.5) * 0.001;
    });
  }
}

const fourier = new Fourier();
const functionRange = 1;
const pulseHeight = 500;

window.draw = () => {
  background(255);

  const timeElapsed = Date.now() - startTime;

  for (var i = 0; i < numDots; i++) {
    const normalizedX = (i / numDots);
    const x = normalizedX * functionRange;
    const y = pulseHeight * fourier.fullWave(x);
    fill(0, 50);
    ellipse(displayWidth * normalizedX, 0.5 * displayHeight + y, 2 * dotRadius, 2 * dotRadius);
  }

  fourier.update();
  // noLoop();
};

export function start() {
  console.log('starting visuals');
}
