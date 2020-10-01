import _ from 'lodash';

class WormDirector {
  constructor() {
    // all velocities represented in units per second
    this.velocities = {
      controlPoints: 0, // will get bumped
      anchorPoints: 0, // will get bumped
      lineWidth: 0, // will get bumped

      hue: 0.1,
      saturation: 0.1,
    };

    // the noise offsets are a "bucket" of random offsets 1 -> 1000
    // we use a unique offset for each modulating value, to assign it a distinct
    // "region" of the Perlin Noise space from which to move
    this.noiseOffsets = _.map(_.range(100), () => {
      return 10000 * Math.random();
    });

    // will add a cover with this opacity every frame
    this.ghostingDecayRate = 0.0375;

    this.previousFactor = 0;
    this.previousResult = 0;
  }

  getLineStepAlpha(stepIndex, numSteps) {
    return 1 - (stepIndex / numSteps);
  }

  getNoise(key, noiseOffsetIndex, timeElapsed) {
    const noiseOffset = this.noiseOffsets[0] || 0;
    const velocity = this.velocities[key] || 0;
    const factor = (velocity * timeElapsed / 1000) + noiseOffset;
    return noise(factor);
  }

  getRandomRandomAverageZero() {
    return 2 * Math.random() - 1;
  }

  velocityBumpByKey(key) {
    switch (key) {
      case 'controlPoints': return 0.2;
      case 'anchorPoints': return 0.05;
      case 'lineWidth': return 0.2;
      default: return 0;
    }
  }

  bumpForMusicalEvent(musicalIntensity = 1.0) {
    this.velocities = _.mapValues(this.velocities, (oldVelocity, key) => {
      const multiplyFactor = this.velocityBumpByKey(key);
      // musicalIntensity is hard to notice when the spread is already random
      // TODO: make this more visually sensitive to musicalIntensity?
      return oldVelocity + multiplyFactor * musicalIntensity * this.getRandomRandomAverageZero();
    });
  }
}

const numWorms = 30;
const wormDirectors = _.map(_.range(numWorms), () => {
  return new WormDirector();
});

var startTime;
window.setup = () => {
  createCanvas(displayWidth, displayHeight);
  smooth();
  background(0);
  colorMode(HSB, 1);
  noFill();

  startTime = Date.now();

  _.forEach(wormDirectors, (wormDirector) => {
    wormDirector.bumpForMusicalEvent();
  });
};

var numDraws = 0;
window.draw = () => {
  /* First, get all of our constants that determine the look and feel of the animation ready */
  const timeElapsed = Date.now() - startTime;

  _.forEach(wormDirectors, (wormDirector, index) => {
    /* keep each worm in its own "lane" */
    const xMin = (displayWidth / numWorms) * index;
    const xSpread = (displayWidth / numWorms);

    const controlX1 = xMin + xSpread * wormDirector.getNoise('controlPoints', 1, timeElapsed);
    const controlY1 = displayHeight * wormDirector.getNoise('controlPoints', 2, timeElapsed);
    const controlX2 = xMin + xSpread * wormDirector.getNoise('controlPoints', 3, timeElapsed);
    const controlY2 = displayHeight * wormDirector.getNoise('controlPoints', 4, timeElapsed);
  
    const anchorX1 = xMin + xSpread * wormDirector.getNoise('anchorPoints', 5, timeElapsed);
    const anchorY1 = displayHeight * wormDirector.getNoise('anchorPoints', 6, timeElapsed);
    const anchorX2 = xMin + xSpread * wormDirector.getNoise('anchorPoints', 7, timeElapsed);
    const anchorY2 = displayHeight * wormDirector.getNoise('anchorPoints', 8, timeElapsed);
  
    const hue = wormDirector.getNoise('hue', 9, timeElapsed);
    const saturation = 0.3 * wormDirector.getNoise('saturation', 10, timeElapsed) + 0.7;
  
    // blur the line to give it an ethereal feeling
    const numBlurringSteps = 25;
    const lineWidth = 75 * wormDirector.getNoise('lineWidth', 11, timeElapsed);
    const lineWidthPerStep = lineWidth / numBlurringSteps;
  
    /* Now we actually do the drawing, using those constants */
    background(0, 0, 0, wormDirector.ghostingDecayRate);
  
    for (var i = 0; i < numBlurringSteps; i++) {
      const alpha = wormDirector.getLineStepAlpha(i, numBlurringSteps);
      strokeWeight(lineWidthPerStep * i);
      stroke(hue, saturation, 1, alpha);
      bezier(anchorX1, anchorY1, controlX1, controlY1, controlX2, controlY2, anchorX2, anchorY2);
    }
  });

  numDraws++;
  // if (numDraws > 200) {
  //   noLoop();
  // }
};

window.keyPressed = () => {
  const aKey = 65;
  const sKey = 83;
  const dKey = 68;
  if (keyCode === aKey) {
    wormDirectors[0].bumpForMusicalEvent();
  } else if (keyCode === sKey) {
    wormDirectors[1].bumpForMusicalEvent();
  } else if (keyCode === dKey) {
    wormDirectors[2].bumpForMusicalEvent();
  }
};

export function start() {
  console.log('starting visuals');
}
