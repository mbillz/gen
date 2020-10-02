var startTime = Date.now();
window.setup = () => {
  createCanvas(displayWidth, displayHeight);
};

const totalRadians = 2 * Math.PI;
const numDots = 100;

const circleRadius = 100;
const dotRadius = 4;

window.draw = () => {
  background(255);

  const timeElapsed = Date.now() - startTime;

  for (var i = 0; i < numDots; i++) {
    const x = (i / numDots);
    const y = transformFunction(x, timeElapsed);
    fill(0, 50);
    ellipse(displayWidth * x, 0.5 * displayHeight + y, 2 * dotRadius, 2 * dotRadius);
  }
  // noLoop();
};

const pulseHeight = 300;

function transformFunction(x, timeElapsed) {
  const period = 2000;
  const periodProgress = timeElapsed / period;
  const scalar = Math.cos(2 * Math.PI * periodProgress);
  return pulseHeight * scalar * Math.sin(2 * Math.PI * x);
}

function gaussian(x, standardDeviation) {
  const factor = 1 / (standardDeviation * Math.sqrt(2 * Math.PI));
  return factor * Math.exp(-0.5 * (x * x) / (standardDeviation * standardDeviation));
}

export function start() {
  console.log('starting visuals');
}
