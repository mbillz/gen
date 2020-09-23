new p5((s) => {
  s.draw = () => {
    s.background(127);
    s.noStroke();
    for (let i = 0; i < s.height; i += 20) {
      s.fill(129, 206, 15);
      s.rect(0, i, s.width, 10);
      s.fill(255);
      s.rect(i, 0, 10, s.height);
    }
  }

  s.setup = () => {
    console.log('inside setup');
    s.createCanvas(s.displayWidth, s.displayHeight);
  }
});
