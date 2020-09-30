import _ from 'lodash';

var startTime;
window.setup = () => {
  createCanvas(displayWidth, displayHeight);
  smooth();
  background(0);
  colorMode(HSB, 1);
  noFill();

  startTime = Date.now();
};

const noiseOffsets = _.map(_.range(100), () => {
  return 1000 * Math.random();
});

class AnimationDirector {
  constructor() {
    // all velocities represented in units per second
    this.velocities = {
      controlPoints: 0.2,
      anchorPoints: 0.05,
      hue: 0.1,
      saturation: 0.3,
      lineWidth: 0.15,
    };

    // the noise offsets are a "bucket" of random offsets 1 -> 1000
    // we use a unique offset for each modulating value, to assign it a distinct
    // "region" of the Perlin Noise space from which to move
    this.noiseOffsets = _.map(_.range(100), () => {
      return 10000 * Math.random();
    });

    // will add a cover with this opacity every frame
    this.ghostingDecayRate = 0.0375;
  }

  getLineStepAlpha(stepIndex, numSteps) {
    return 1 - (stepIndex / numSteps);
  }

  getNoise(key, noiseOffsetIndex, timeElapsed) {
    const noiseOffset = this.noiseOffsets[noiseOffsetIndex] || 0;
    const velocity = this.velocities[key] || 0;
    const factor = (velocity * timeElapsed / 1000) + noiseOffset;
    if (key === 'controlPoints' && noiseOffsetIndex == 1) {
      console.log('inside getNoise with args', key, noiseOffsetIndex, timeElapsed);
      console.log('  -> noiseOffset is', noiseOffset);
      console.log('  -> velocity is', velocity);
      console.log('  -> factor is', factor);
      console.log('  -> noise(factor) is', noise(factor));  
    }
    return noise(factor);
  }

  getRandomRandomAverageZero() {
    return 2 * Math.random() - 1;
  }

  bumpForMusicalEvent(musicalIntensity) {
    console.log('this.velocities was', this.velocities);
    this.velocities = _.mapValues(this.velocities, (oldVelocity, key) => {
      if (key === 'controlPoints' || key === 'anchorPoints' || key === 'lineWidth') {
        // musicalIntensity is hard to notice when the spread is already random
        // TODO: make this more visually sensitive to musicalIntensity?
        return oldVelocity + 0.05 * musicalIntensity * this.getRandomRandomAverageZero();
      }
      return oldVelocity;
    });
    console.log('this.velocities is now', this.velocities);
  }
}

const Director = new AnimationDirector();

var numDraws = 0;
window.draw = () => {
  /* First, get all of our constants that determine the look and feel of the animation ready */
  const timeElapsed = Date.now() - startTime;
  // console.log('inside draw', timeElapsed, 'frame', numDraws);

  const controlX1 = displayWidth * Director.getNoise('controlPoints', 1, timeElapsed);
  console.log('    --> controlX1', controlX1);
  const controlY1 = displayHeight * Director.getNoise('controlPoints', 2, timeElapsed);
  // console.log('    --> controlY1', controlY1);
  const controlX2 = displayWidth * Director.getNoise('controlPoints', 3, timeElapsed);
  // console.log('    --> controlX2', controlX2);
  const controlY2 = displayHeight * Director.getNoise('controlPoints', 4, timeElapsed);
  // console.log('    --> controlY2', controlY2);

  const anchorX1 = displayWidth * Director.getNoise('anchorPoints', 5, timeElapsed);
  // console.log('    --> anchorX1', anchorX1);
  const anchorY1 = displayHeight * Director.getNoise('anchorPoints', 6, timeElapsed);
  // console.log('    --> anchorY1', anchorY1);
  const anchorX2 = displayWidth * Director.getNoise('anchorPoints', 7, timeElapsed);
  // console.log('    --> anchorX2', anchorX2);
  const anchorY2 = displayHeight * Director.getNoise('anchorPoints', 8, timeElapsed);
  // console.log('    --> anchorY2', anchorY2);

  const hue = Director.getNoise('hue', 9, timeElapsed);
  // console.log('    --> hue', hue);
  const saturation = 0.3 * Director.getNoise('saturation', 10, timeElapsed) + 0.7;
  // console.log('    --> saturation', saturation);

  // blur the line to give it an ethereal feeling
  const numBlurringSteps = 20;
  const lineWidth = 50 * Director.getNoise('lineWidth', 11, timeElapsed);
  console.log('    --> lineWidth', lineWidth);
  const lineWidthPerStep = lineWidth / numBlurringSteps;

  /* Now we actually do the drawing, using those constants */
  background(0, 0, 0, Director.ghostingDecayRate);

  for (var i = 0; i < numBlurringSteps; i++) {
    const alpha = Director.getLineStepAlpha(i, numBlurringSteps);
    strokeWeight(lineWidthPerStep * i);
    stroke(hue, saturation, 1, alpha);
    bezier(anchorX1, anchorY1, controlX1, controlY1, controlX2, controlY2, anchorX2, anchorY2);
  }

  numDraws++;
  if (numDraws > 200) {
    // noLoop();
  }
};

// just a test to test the song's rhythm
setInterval(() => {
  Director.bumpForMusicalEvent(0.75);
}, 666);

export function start() {
  // console.log('starting visuals');
}
