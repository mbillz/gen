import p5 from 'p5';

const s = (sk) => {
  window.p5 = sk;

  sk.setup = () => {
    sk.createCanvas(800, 800);

    sk.background(40);
  };

  sk.draw = () => {};
};

new p5(s);
