import _ from 'lodash';

class ForceFieldDot {
  constructor(x, y) {
    this.home = createVector(x, y);

    const xDisplacement = 0 * Math.random();
    const yDisplacement = 0 * Math.random();
    this.position = createVector(x + xDisplacement, y + yDisplacement);

    this.velocity = createVector(0, 0);
    this.force = createVector(0, 0);

    this.springHardness = 0.01 * Math.random() + 0.005;
  }

  get springForce() {
    // force proportional to negative displacement from home
    return this.home.copy().sub(this.position).mult(this.springHardness);
  }

  get netForce() {
    return this.force.copy().add(this.springForce);
  }

  update() {
    this.velocity.add(this.netForce);
    this.position.add(this.velocity);
    this.force.mult(0.5);
  }

  draw() {
    stroke('red');
    strokeWeight(10);
    point(displayWidth * this.position.x, displayHeight * this.position.y);
  }

  disruptionAt(clickPoint) {
    console.log('clickPoint is', clickPoint);
    const distance = clickPoint.dist(this.position);
    console.log('distance is', distance);
    const forceFactor = Math.pow(distance, -2); // inverse square law
    console.log('forceFactor is', forceFactor);
    this.force = this.position.copy().sub(clickPoint).mult(0.0003 * forceFactor);
  }
}

class ForceFieldDots {
  constructor() {
    this.numRows = 10;
    this.numColumns = 10;

    this.dots = _.map(_.range(this.numRows), (rowIndex) => {
      return _.map(_.range(this.numColumns), (colIndex) => {
        const homeX = (rowIndex + 0.5) / this.numRows;
        const homeY = (colIndex + 0.5) / this.numColumns;
        return new ForceFieldDot(homeX, homeY);
      });
    });
  }

  applyFnToAllPoints(fn) {
    _.forEach(this.dots, (row) => {
      _.forEach(row, (point) => {
        fn(point);
      });
    });
  }

  update() {
    this.applyFnToAllPoints((point) => {
      point.update();
    });
  }

  draw() {
    this.applyFnToAllPoints((point) => {
      point.draw();
    });
  }

  causeForceDisruption(mouseX, mouseY) {
    this.applyFnToAllPoints((point) => {
      const clickPoint = createVector(mouseX, mouseY);
      point.disruptionAt(clickPoint);
    });
  }
}

var dots;
window.setup = () => {
  createCanvas(displayWidth, displayHeight);
  smooth();
  background(0);
  noFill();

  dots = new ForceFieldDots();
};

var numDraws = 0;
window.draw = () => {
  background(0, 0, 0, 255 * 0.05);

  // console.log("WILL DO DRAW", numDraws + 1);
  dots.update();
  dots.draw(displayWidth, displayHeight);

  numDraws++;
  if (numDraws > 100) {
    // noLoop();
  }
};

window.mouseClicked = () => {
  dots.causeForceDisruption(mouseX / displayWidth, mouseY / displayHeight);
};

export function start() {
  console.log('starting visuals');
}
