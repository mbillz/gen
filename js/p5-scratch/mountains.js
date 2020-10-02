import _ from 'lodash';

// PARAMETERS
var nMountains = 2;
var nPoints = 200;  // from left to right
var mountainStart = 0.5;  // fraction of height
var mountainEnd = 0.2;  // fraction of height
var amplitudeStart = 0.2;
var amplitudeEnd = 0.4;
var stepStart = 0.05;
var stepEnd = 0.01;
var backColor = "#bd73c9";
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

window.draw = () => {
  background(0);
  purpleMounts.updateMountainPoints();
  purpleMounts.drawAllMontains();
  
};

export function start() {
  console.log('starting visuals');
  var test = [1,2,3];
  console.log(test[test.length - 1]);
}
