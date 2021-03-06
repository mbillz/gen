let xoff = 0.0;
  
let purple = '#5402f7';
let green = '#22e633';
let yellow = '#ffff1f';

let p1 = { x: 20, y: 800 };
let p2 = { x: -100, y: 300 };
let p3 = { x: 900, y: 300 };
let p4 = { x: 250, y: -200 };


class auroraLine { 
    constructor(points, color, endColor) {
      this.points = points;
      this.layers = 100;
      this.movementWeight = this.layers * 2.5
      this.color = color;
      this.endColor = endColor
      this.alpha = alpha;
    }

    drawEnd(up) {
        xoff = xoff + 0.01;
        let n = noise(xoff) * width;
        let directionMulti = 1
        if (up) {
            directionMulti = -1;
        }
        for (var i=0; i<this.layers; i++) {
            let ratio = i / this.layers
            let ratio_minus = 1 - ratio
            this.color
            let interpColor = lerpColor(this.color, this.endColor, ratio_minus);
            interpColor.setAlpha(n * ratio_minus / 3 - 20)
            stroke(interpColor);
            strokeWeight(20)
            let fillColor = color(0)
            fillColor.setAlpha(0)
            fill(fillColor);
            curve(this.points[0].x, this.points[0].y + n, 
                    this.points[1].x,  this.points[1].y + (directionMulti * this.movementWeight * ratio), 
                    this.points[2].x,  this.points[2].y + (directionMulti * this.movementWeight * ratio), 
                    this.points[3].x, this.points[3].y);
        }
    }
};


var purpleLine;

window.setup = () => {
    createCanvas(800, 500)
    purpleLine = new auroraLine([p1, p2, p3, p4], color(purple), color(green));
};

window.draw = () => {
    background(0);
    purpleLine.drawEnd(true);
}

export function start() {
console.log('starting visuals');
}