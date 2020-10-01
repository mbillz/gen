import _ from 'lodash';

// PARAMETERS
var nMountains = 2;
var nPoints = 200;  // from left to right
var mountainStart = 0.3;  // fraction of height
var mountainEnd = 0.1;  // fraction of height
var amplitudeStart = 0.2;
var amplitudeEnd = 0.4;
var stepStart = 0.05;
var stepEnd = 0.01;
var backColor = "#8a4894";
var lastColor = "#5b2f91";
var backColors;
var frontColors;

var purpleMounts;

var decideMainWidth = function(max_width){
  // decide on sketch width
  var disp = floor(min(displayWidth, displayHeight, windowWidth, windowHeight)*0.9);
  // var win  = min(windowWidth , windowWidth);
  var main_width = min(disp, max_width);
  return main_width;
};

// this class describes the properties of a single particle.
class Particle {
// setting the co-ordinates, radius and the
// speed of a particle in both the co-ordinates axes.
    constructor(){
    this.x = random(0,width);
    this.y = random(0,height);
    this.r = random(1,8);
    this.xSpeed = random(-2,2);
    this.ySpeed = random(-1,1.5);
    }

// creation of a particle.
    createParticle() {
    noStroke();
    fill('rgba(200,169,169,1)');
    circle(this.x,this.y,this.r);
    }

// setting the particle in motion.
    moveParticle() {
    if(this.x < 0 || this.x > width)
        this.xSpeed*=-1;
    if(this.y < 0 || this.y > height)
        this.ySpeed*=-1;
    this.x+=this.xSpeed;
    this.y+=this.ySpeed;
    }

    moveParticleAway() {
      // change x direction if particle is moving towards mouse on x axis
      if (this.x < mouseX && this.xSpeed > 0) {
        this.xSpeed*=-1;
      } else if (this.x > mouseX && this.xSpeed < 0) {
        this.xSpeed*=-1;
      }

      // change y direction if particle is moving towards mouse on y axis
      if (this.y < mouseY && this.ySpeed > 0) {
        this.ySpeed*=-1;
      } else if (this.y > mouseY && this.ySpeed < 0) {
        this.ySpeed*=-1;
      }
    }

// this function creates the connections(lines)
// between particles which are less than a certain distance apart
    joinParticles(particles) {
    particles.forEach(element =>{
        let dis = dist(this.x,this.y,element.x,element.y);
        if(dis<85) {
        stroke('rgba(255,255,255,0.1)');
        line(this.x,this.y,element.x,element.y);
        }
    });
    }
};
    
    

class Mountains { 
  constructor() {
    this.nMountains = nMountains;
    this.mountainPoints = [];
    this.createAllMountainPoints()
  }

  createAllMountainPoints() {
    for (var i=nMountains; i>=0; i--) {
      var ratio = i/nMountains;
      var pos = map(ratio, 1, 0, mountainStart, mountainEnd)
      var amp = map(ratio, 1, 0, amplitudeStart, amplitudeEnd);
      var step = map(ratio, 1, 0, stepStart, stepEnd);
      noiseDetail(map(ratio, 1, 0, 70, 10), map(ratio,1,0,0.3,0.7));
      this.mountainPoints[i] = this.createSingleMountain(pos, amp, step, i);
    }
  }

  createSingleMountain(position, amplitude, step, z) {
    var mountain = [];
    var moyenne = 0;
    for (var i=0; i<=nPoints; i++){
        var v = height*amplitude*noise(i*step, 100*z);
        moyenne += v;
        mountain[i] =  v;
    }
    moyenne = moyenne/mountain.length
    var delta = (mountainEnd - mountainStart)/nMountains;
    for (var i=0; i<=nPoints; i++) {
        mountain[i] = height*(1-position) + mountain[i]-moyenne + map(noise(z), 0, 1, -delta, delta);
    }
    return mountain;
  }

  drawAllMontains() {
    var firstColor = lerpColor(color(lastColor), color(backColor), 0.8);
    for (var i=nMountains; i>=0; i--) {
      var ratio = i/nMountains
      fill(lerpColor(lastColor, firstColor, ratio));
      noStroke();
      beginShape();
      vertex(0, height);
      for (var j=0; j<=nPoints; j++){
          vertex(j/nPoints*width, this.mountainPoints[i][j]);
      }
      vertex(width, height);
      endShape(CLOSE);
    }
  }
  // will just take first point and make it last point for now.
  updateMountainPoints() {
    for (var i=nMountains; i>=0; i--) {
      var curMountain = this.mountainPoints[i]
      var updatedMountain = []
      updatedMountain.push(curMountain[curMountain.length - 1]);
      updatedMountain = updatedMountain.concat(curMountain.slice(0, curMountain.length - 1));
      this.mountainPoints[i] = updatedMountain;
    };
  }
}

// an array to add multiple particles
let particles = [];

window.setup = () => {
    pixelDensity(1);
    frameRate(30);
    var w = decideMainWidth(800);
  
    createCanvas(w, w * 3/5);
    background(0);
    ellipseMode(CENTER);
    // noiseDetail(50,0.4);
    backColors = [
        color(231, 142, 245),
        color(backColor)
    ]
    frontColors = [
        lastColor = color(91, 47, 145),
        color(lastColor)
    ]
  
    purpleMounts = new Mountains();
    purpleMounts.drawAllMontains();

    for(let i = 0;i<width/5;i++){
      particles.push(new Particle());
    }
  
  };

let locked = true;

window.draw = () => {
  background(0);
  if (locked) {
    fill(255, 255, 255);
  }
  else {
    fill(255, 224, 138);
  }
  circle(mouseX, mouseY, 100);
  for(let i = 0;i<particles.length;i++) {
    particles[i].createParticle();
    particles[i].moveParticle();
    particles[i].joinParticles(particles.slice(i));
  }
  purpleMounts.updateMountainPoints();
  purpleMounts.drawAllMontains();
  
};

window.mousePressed = () => {
  locked = false;
  for(let i = 0;i<particles.length;i++) {
    particles[i].moveParticleAway();
  }
}

window.mouseReleased = () => {
  locked = true;
}

export function start() {
  console.log('starting visuals');
}