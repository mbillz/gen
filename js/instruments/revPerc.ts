import { Player, Loop } from 'tone';
import { getSecondsFromBPM } from '../utils/time';
import revPerc from '../../static/samples/rev_perc.mp3';

const percPlayer = new Player({
  url: revPerc,
  volume: -15,
  loop: false,
}).toDestination();

export const triggerPerc = () => {
  new Loop((time) => {
    if (Math.random() >= 0.5) {
      percPlayer.start();
    }
  }, getSecondsFromBPM(64)).start();
};
