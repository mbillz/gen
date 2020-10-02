let xoff = 0.0;
  
let purple = '#5402f7';
let green = '#22e633';
let yellow = '#ffff1f';

var originPoint;
let rotationAngle = .001;
let numStars = 10000;


class Stars { 
    constructor(nStars, minSize, maxSize) {
      this.nStars = nStars;
      this.minSize = minSize;
      this.maxSize = maxSize;
      this.maxAlpha = 255;
      this.minAlpha = 120;
      this.starPoints = this.createStars();
      
    }

    createStars() {
      let curStarPoints = []
      for (var i=0; i < this.nStars; i++) {
        let side = round(Math.random()) == 0 ? 1 : -1;
        let x = width * 2 * side * Math.random();
        let y = height * 3 * side * Math.random();
        let r = this.minSize + (this.maxSize - this.minSize) * Math.random();
        let a = this.minAlpha + (this.maxAlpha - this.minAlpha) * Math.random();
        let starPoint = {x: x, y: y, r: r, a: a};
        curStarPoints.push(starPoint);
      }
      return curStarPoints;
    }

    drawStars() {
      for (var i=0; i < this.nStars; i++) {
        let curPoints = this.starPoints[i];
        let c = color(255, 255, 255);
        c.setAlpha(curPoints.a);
        fill(c);
        noStroke();
        circle(curPoints.x, curPoints.y, curPoints.r);
      }
    }

    rotatePoint(point, angle, origin) {
      let s = Math.sin(angle);
      let c = Math.cos(angle);

      // translate point back to origin:
      point.x -= origin.x;
      point.y -= origin.y;

      // rotate point
      let xnew = point.x * c - point.y * s;
      let ynew = point.x * s + point.y * c;

      // translate point back:
      point.x = xnew + origin.x;
      point.y = ynew + origin.y;
    }

    // rotate stars around origin
    updateStars() {
      for (var i=0; i < this.nStars; i++) {
        this.rotatePoint(this.starPoints[i], rotationAngle, originPoint)
      }
    }
};

var stars;

window.setup = () => {
    createCanvas(800, 500)
    stars = new Stars(numStars, 1, 2);
    originPoint = {x: width / 2, y: height / 2};
};

window.draw = () => {
    background(0);
    stars.updateStars();
    stars.drawStars();
    // console.log(stars.starPoints);
}

export function start() {
console.log('starting visuals');
console.log(Math.random());
}