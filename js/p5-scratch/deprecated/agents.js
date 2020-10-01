var NORTH = 0;
var NORTHEAST = 1; 
var EAST = 2;
var SOUTHEAST = 3;
var SOUTH = 4;
var SOUTHWEST = 5;
var WEST = 6;
var NORTHWEST = 7;

var stepSize = 1;
var diameter = 1;

var drawMode = 2;
var counter = 0;

var direction;
var posX, posY;

window.setup = () => {
  createCanvas(500, 500);

  colorMode(HSB, 360, 100, 100, 100);
  background(360);
  smooth();
  noStroke();

  posX = width / 2;
  posY = height / 2;
};

window.draw = () => {
  console.log('inside draw');
  for (var i=0; i<=mouseX; i++) {
    counter++;

    // random number for the direction of the next step
    if (drawMode == 2) {
      direction = round(random(0, EAST + 1));    // only NORTH, NORTHEAST, EAST possible
    }
    else {
      direction = Math.floor(random(0, NORTHWEST));    // all directions without NORTHWEST
    }

    if (direction == NORTH) {  
      posY -= stepSize;  
    } 
    else if (direction == NORTHEAST) {
      posX += stepSize;
      posY -= stepSize;
    } 
    else if (direction == EAST) {
      posX += stepSize;
    } 
    else if (direction == SOUTHEAST) {
      posX += stepSize;
      posY += stepSize;
    }
    else if (direction == SOUTH) {
      posY += stepSize;
    }
    else if (direction == SOUTHWEST) {
      posX -= stepSize;
      posY += stepSize;
    }
    else if (direction == WEST) {
      posX -= stepSize;
    }
    else if (direction == NORTHWEST) {
      posX -= stepSize;
      posY -= stepSize;
    }

    if (posX > width) posX = 0;
    if (posX < 0) posX = width;
    if (posY < 0) posY = height;
    if (posY > height) posY = 0;

    if (drawMode == 3) {
      if (counter >= 100){
        counter = 0;
        fill(192, 100, 64, 80);
        console.log('making ellipse A', posX+stepSize/2, posY+stepSize/2, diameter+7, diameter+7);
        ellipse(posX+stepSize/2, posY+stepSize/2, diameter+7, diameter+7);
      } 
    }

    fill(0, 40);
    ellipse(posX+stepSize/2, posY+stepSize/2, diameter, diameter);
    console.log('making ellipse B', posX+stepSize/2, posY+stepSize/2, diameter, diameter);
  }
};

// window.mouseClicked = () => {
//   noLoop();
// };

// export function snareHit() {
//   vibratorsByType.snare.handleDrumHit();
// }

export function kickHit() {
  console.log('kickHit');
  // vibratorsByType.kick.handleDrumHit();
}

// export function hatHit() {
//   vibratorsByType.hat.handleDrumHit();
// }

// class Vibrator {
//   constructor(drumType) {
//     this.drumType = drumType;

//     this.scale = 0;
//     this.velocity = 0;
//   }

//   handleDrumHit() {
//     this.velocity = 0.3 + 0.1 * Math.random();
//   }

//   update() {
//     this.scale += this.velocity

//     // limits to stay in bounds
//     this.scale = Math.max(0.3, this.scale);

//     const gravity = -0.1;
//     this.velocity += gravity;
//     console.log('this.velocity is', this.velocity);
//   }

//   positionX() {
//     switch (this.drumType) {
//       case 'kick': return 0.5 * displayWidth - 500;
//       case 'snare': return 0.5 * displayWidth;
//       case 'hat': return 0.5 * displayWidth + 500;
//     }
//   }

//   draw() {
//     noStroke();

//     if (this.drumType === 'kick') {
//       fill(146, 34, 39);
//     } else if (this.drumType === 'snare') {
//       fill(38, 67, 52);
//     } else if (this.drumType === 'hat') {
//       fill(72, 34, 138);
//     }

//     const naturalDimension = 100;
//     const dimension = naturalDimension * this.scale;
//     console.log('this.scale is', this.scale);
//     ellipse(this.positionX(), 0.5 * displayHeight, dimension, dimension);
//   }
// }

// const vibratorsByType = {
//   kick: new Vibrator('kick'),
//   snare: new Vibrator('snare'),
//   hat: new Vibrator('hat'),
// };
