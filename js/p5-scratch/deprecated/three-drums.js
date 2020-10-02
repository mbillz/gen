window.setup = () => {
  createCanvas(displayWidth, displayHeight);
};

window.draw = () => {
  background(0);

  Object.values(vibratorsByType).forEach((vibrator) => {
    vibrator.update();
    vibrator.draw();
  });
};

window.mouseClicked = () => {
  noLoop();
};

export function snareHit() {
  vibratorsByType.snare.handleDrumHit();
}

export function kickHit() {
  vibratorsByType.kick.handleDrumHit();
}

export function hatHit() {
  vibratorsByType.hat.handleDrumHit();
}

class Vibrator {
  constructor(drumType) {
    this.drumType = drumType;

    this.scale = 0;
    this.velocity = 0;
  }

  handleDrumHit() {
    this.velocity = 0.3 + 0.1 * Math.random();
  }

  update() {
    this.scale += this.velocity

    // limits to stay in bounds
    this.scale = Math.max(0.3, this.scale);

    const gravity = -0.1;
    this.velocity += gravity;
    console.log('this.velocity is', this.velocity);
  }

  positionX() {
    switch (this.drumType) {
      case 'kick': return 0.5 * displayWidth - 500;
      case 'snare': return 0.5 * displayWidth;
      case 'hat': return 0.5 * displayWidth + 500;
    }
  }

  draw() {
    noStroke();

    if (this.drumType === 'kick') {
      fill(146, 34, 39);
    } else if (this.drumType === 'snare') {
      fill(38, 67, 52);
    } else if (this.drumType === 'hat') {
      fill(72, 34, 138);
    }

    const naturalDimension = 100;
    const dimension = naturalDimension * this.scale;
    console.log('this.scale is', this.scale);
    ellipse(this.positionX(), 0.5 * displayHeight, dimension, dimension);
  }
}

const vibratorsByType = {
  kick: new Vibrator('kick'),
  snare: new Vibrator('snare'),
  hat: new Vibrator('hat'),
};
