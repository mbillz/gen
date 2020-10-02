import { Player, AutoPanner } from 'tone';

import rain from '../../static/samples/rain.mp3';
import { addRain } from '../visuals';

// dropping visual dependant audio here
const panner = new AutoPanner(0.01).toDestination().start();

const rainPlayer = new Player({
  url: rain,
  loop: true,
  volume: -24,
  onload: () => {
    addRain();
  },
  onstop: () => {
    console.log('stop rain');
  },
}).connect(panner);

export const loopRain = () => {
  rainPlayer.start();
};
