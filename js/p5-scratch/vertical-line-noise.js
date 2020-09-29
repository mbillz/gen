import _ from 'lodash';
import { isLineBreak } from 'typescript';

var startTime;
window.setup = () => {
  createCanvas(displayWidth, displayHeight);
  smooth();
  background(0);
  colorMode(HSB, 1);

  startTime = Date.now();
};

window.draw = () => {
  background(0);

  const timeElapsed = Date.now() - startTime;
  const normX = noise(0.0001 * timeElapsed);
  for (var i = 0; i < 10; i++) {
    const weight = 10 - i;
    strokeWeight(weight);

    const alpha = 0.5;
    stroke(1, 1, 1, alpha);

    const xPadding = 200 * noise(0.0005 * timeElapsed + 12345 * i);
    // console.log('xPadding', xPadding);
    const lineX = mouseX + xPadding;
    line(lineX, 0, lineX, displayHeight);
  }

  // noLoop();
};

export function start() {
  console.log('starting visuals');
}
