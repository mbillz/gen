import { Player, AutoPanner } from 'tone';

import whiteNoise from '../../static/samples/white_noise.mp3';

const panner = new AutoPanner(0.01).toDestination().start();

const noisePlayer = new Player({
  url: whiteNoise,
  loop: true,
  volume: -16,
}).connect(panner);

export const loopNoise = () => {
  noisePlayer.start();
};
