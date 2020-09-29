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

window.draw = () => {
  background(0, 0, 0, 0.02);

  const timeElapsed = Date.now() - startTime;
  const lineX = mouseX;

  const controlX1 = displayWidth * noise(0.0002 * timeElapsed + noiseOffsets[0]);
  const controlY1 = displayHeight * noise(0.0002 * timeElapsed + noiseOffsets[1]);
  const controlX2 = displayWidth * noise(0.0002 * timeElapsed + noiseOffsets[2]);
  const controlY2 = displayHeight * noise(0.0002 * timeElapsed + noiseOffsets[3]);

  const anchorX1 = displayWidth * noise(0.00005 * timeElapsed + noiseOffsets[4]);
  const anchorY1 = displayHeight * noise(0.00005 * timeElapsed + noiseOffsets[5]);
  const anchorX2 = displayWidth * noise(0.00005 * timeElapsed + noiseOffsets[6]);
  const anchorY2 = displayHeight * noise(0.00005 * timeElapsed + noiseOffsets[7]);

  const hue = noise(0.0001 * timeElapsed + noiseOffsets[8]);
  const saturation = 0.5 * noise(0.0003 * timeElapsed + noiseOffsets[9]) + 0.5;

  const numSteps = 20;
  for (var i = 0; i < numSteps; i++) {
    strokeWeight(2 + 4 * i);
    const alpha = 1 - (i / numSteps);
    stroke(hue, saturation, 1, alpha);
    bezier(anchorX1, anchorY1, controlX1, controlY1, controlX2, controlY2, anchorX2, anchorY2);
  }
};

export function start() {
  console.log('starting visuals');
}
