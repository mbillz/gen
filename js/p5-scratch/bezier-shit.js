import _ from 'lodash';

class MovingPoint {
  constructor(x, y) {
    this.vector = createVector(x, y);
  }

  update() {
    // TODO: Velocity
  }
}

class BezierStroke {
  constructor() {
    this.points = _.map(_.range(4), (index) => {
      if (index === 0) {
        return new MovingPoint(100, 100);
      }
      if (index === 1) {
        return new MovingPoint(100, 100);
      }
      if (index === 2) {
        return new MovingPoint(100, 100);
      }
      return new MovingPoint();
    });
  }

  strokeShape() {
    beginShape();
    vertex(this.points[0].x, this.points[0].y);
    bezierVertex(
      this.points[1].x,
      this.points[1].y,
      this.points[2].x,
      this.points[2].y,
      this.points[3].x,
      this.points[3].y,
    );
    endShape();

    console.log('this.points', this.points);
  }

  update() {
    _.forEach(this.points, (point) => {
      point.update();
    })
  }
}

var bezierStroke;

window.setup = () => {
  createCanvas(displayWidth, displayHeight);
  bezierStroke = new BezierStroke();
};

window.draw = () => {
  background(0);

  bezierStroke.update();
  bezierStroke.strokeShape();

  noLoop();
};


function randY() {
  const y = Math.random() * displayHeight;
  // console.log('randY is', y);
  return y;
}

export function start() {
  console.log('starting visuals');
}
