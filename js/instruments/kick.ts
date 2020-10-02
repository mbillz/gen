import { Player, Loop } from 'tone';
import { getSecondsFromBPM } from '../utils/time';
import kick from '../../static/samples/kick.mp3';

const kickPlayer = new Player({
  url: kick,
  volume: -10,
  loop: false,
}).toDestination();

export const loopKick = () => {
  new Loop((time) => {
    if (Math.random() >= 0.1) {
      kickPlayer.start();
    }
  }, '2n').start(getSecondsFromBPM(16));
};
