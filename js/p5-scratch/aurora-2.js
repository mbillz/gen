let xoff = 0.0;
  
let purple = '#5402f7';
let green = '#26ff38';
let yellow = '#ffff1f';

let p1 = { x: 20, y: 150 };
let p2 = { x: 100, y: 150 };
let p3 = { x: 600, y: 210 };
let p4 = { x: 250, y: -200 };

let x_adjust = 10;
let y_adjust = 60;


class auroraLine { 
    constructor(points, color) {
      this.points = points;
      this.layers = 200;
      this.movementWeight = this.layers / 3
      this.color = color;
      this.alpha = alpha;
      this.lines = [];
      this.startingNoise = 100;
      this.up = true
      this.createLines();
    }

    createLines() {
        let directionMulti = 1
        if (this.up) {
            directionMulti = -1;
        }
        for (var i=0; i<this.layers; i++) {
            // let ratio = i / this.layers
            let new_p1 = Object.assign([], this.points[0])
            let new_p2 = Object.assign([], this.points[1])
            let new_p3 = Object.assign([], this.points[2])
            let new_p4 = Object.assign([], this.points[3])
            // new_p2.y += (directionMulti * this.movementWeight * ratio)
            // new_p3.y += (directionMulti * this.movementWeight * ratio)
            this.lines.push([new_p1, new_p2, new_p3, new_p4])
        }
        console.log(this.lines);
    }

    updateLines() {
        xoff = xoff + 0.01;
        var m = Math.round(Math.random());
        if (m == 0) {
          m = -1;
        }
        let n = (this.startingNoise * m) + noise(xoff) * (width / 10);
        this.startingNoise = n;
        // add some noise to the first line
        let firstLine = Object.assign([], this.points)
        firstLine[0] = Object.assign({}, this.points[0])
        firstLine[0].y += n
        
        // ditch the top most or bottom most line, and add the new first line to beginning
        let newLines = [firstLine].concat(this.lines.slice(0, this.lines.length - 1))
        this.lines = newLines
    }

    drawLines() {
      let n = noise(xoff) * width;
      for (var i=0; i<this.layers; i++) {
        let directionMulti = 1
        if (this.up) {
          directionMulti = -1;
        }

        xoff = xoff + 0.01;
        let ratio = i / this.layers
        let ratio_minus = 1 - ratio
        // this.color.setAlpha(n * ratio_minus / 10)
        this.color.setAlpha(100 * ratio_minus)

        // this.color.setAlpha(200)
        
        stroke(this.color);
        strokeWeight(20)
        let fillColor = color(0)
        fillColor.setAlpha(0)
        fill(fillColor);
        curve(this.lines[i][0].x, this.lines[i][0].y, 
              this.lines[i][1].x,  this.lines[i][1].y + (directionMulti * this.movementWeight * ratio), 
              this.lines[i][2].x,  this.lines[i][2].y + (directionMulti * this.movementWeight * ratio), 
              this.lines[i][3].x, this.lines[i][3].y);
      }
    }
};


var purpleLine;

window.setup = () => {
    createCanvas(800, 500)
    purpleLine = new auroraLine([p1, p2, p3, p4], color(purple));
    purpleLine.drawLines();
};

window.draw = () => {
    background(0);
    purpleLine.updateLines();
    purpleLine.drawLines();

}

export function start() {
  console.log('starting visuals');
}