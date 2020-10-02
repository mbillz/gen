var startTime = Date.now();
window.setup = () => {
  createCanvas(displayWidth, displayHeight);
};

const totalRadians = 2 * Math.PI;
const numDots = 120;

const circleRadius = 100;
const dotRadius = 4;

const pulsePeriod = 5000;

window.draw = () => {
  background(255);

  const timeElapsed = Date.now() - startTime;
  const periodScalar = timeElapsed / pulsePeriod;

  const circleCenterX = 0.5 * displayWidth;
  const circleCenterY = 0.5 * displayHeight;
  for (var i = 0; i < numDots; i++) {
    const angleProgress = i / numDots;
    const angle = angleProgress * totalRadians;
    const effectiveRadius = circleRadius + radiusExtension(angleProgress, timeElapsed);
    console.log('radiusExtension at', angleProgress, timeElapsed, 'is', effectiveRadius - circleRadius);
    const aX = circleCenterX + (effectiveRadius * Math.cos(-angle));
    const aY = circleCenterY + (effectiveRadius * Math.sin(-angle));
    const bX = circleCenterX + (circleRadius * Math.cos(-angle));
    const bY = circleCenterY + (circleRadius * Math.sin(-angle));
    fill(0, 50);
    ellipse(aX, aY, 2 * dotRadius + 10 * angleProgress, 2 * dotRadius + 10 * angleProgress);
    fill(255, 0, 0, 50);
    ellipse(bX, bY, 2 * dotRadius + 10 * angleProgress, 2 * dotRadius + 10 * angleProgress);
  }
  // noLoop();
};

const pulseHeight = 300;

function radiusExtension(angleProgress, timeElapsed) {
  const shiftedProgress = angleProgress - 0.5
  // const progressRadians = 2 * Math.PI * angleProgress;
  return (timeElapsed / 10) * gaussian(shiftedProgress, 0.1);
  // return (timeElapsed / 1000) * Math.sin(progressRadians);
  // const pulseWidth = (1 / 3) * Math.PI;
  // // const rotationDuration = 5000;
  // // const rotationProgress = timeElapsed / rotationDuration;
  // const pulseMidpoint = 0;
  // const distanceFromZero = Math.max(progressRadians - pulseMidpoint, pulseMidpoint - progressRadians);
}

function gaussian(x, standardDeviation) {
  const factor = 1 / (standardDeviation * Math.sqrt(2 * Math.PI));
  return factor * Math.exp(-0.5 * (x * x) / (standardDeviation * standardDeviation));
}

export function start() {
  console.log('starting visuals');
}
