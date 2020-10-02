import { Player, Loop } from 'tone';
import { getSecondsFromBPM } from '../utils/time';
import kick from '../../static/samples/kick.mp3';
import { swellRain } from '../visuals';

const kickPlayer = new Player({
  url: kick,
  volume: -15,
  loop: false,
}).toDestination();

export const loopKick = () => {
  new Loop((time) => {
    if (Math.random() >= 0.1) {
      kickPlayer.start();
      swellRain();
    }
  }, '2n').start(getSecondsFromBPM(16));
};
