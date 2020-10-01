import _ from 'lodash';


window.setup = () => {
  createCanvas(displayWidth, displayHeight, WEBGL);
  smooth();
  background(0);
  colorMode(HSB, 1);

};

function drawMountains() {
  let dirX = (mouseX / width - 0.5) * 2;
  let dirY = (mouseY / height - 0.5) * 2;
  let c = color(100, 100, 10);
  directionalLight(c, -dirX, -dirY, -1);
  ambientMaterial(c);
  translate(-100, 425, 0)
  push();
  rotateZ(500);
  rotateX(0.01);
  rotateY(0.01);
  box(200, 200, 70);
  pop();
  
  push();
  translate(100, 0, 0)
  rotateZ(500);
  rotateX(50);
  rotateY(50);
  box(150, 150, 150);
  pop();
  
  push();
  translate(200, 0, 0)
  rotateZ(500);
  rotateX(250);
  rotateY(50);
  box(150, 200, 200);
  pop();
  
  push();
  translate(350, 0, 0)
  rotateZ(500);
  rotateX(350);
  rotateY(50);
  box(200, 250, 250);
  pop();

  push();
  translate(-100, 0, 0)
  rotateZ(500);
  rotateX(350);
  rotateY(50);
  box(200, 250, 250);
  pop();

  push();
  translate(-200, 0, 0)
  rotateZ(500);
  rotateX(350);
  rotateY(50);
  box(200, 200, 200);
  pop();
}

function draw_sun() {
  color(100, 100, 100);
  circle(mouseX, mouseY, 100);

}

window.draw = () => {
  background(0);
  

drawMountains();
draw_sun();
};

export function start() {
  console.log('starting visuals');
}
