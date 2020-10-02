import { MembraneSynth, Loop } from 'tone';
import { getSecondsFromBPM } from '../utils/time';

const kick = new MembraneSynth({
  volume: -10,
  envelope: {
    attack: 0.1,
    decay: 0.4,
  },
}).toDestination();

export const loopKick = () => {
  new Loop((time) => {
    if (Math.random() >= 0.1) {
      kick.triggerAttackRelease('E1', time);
    }
  }, '2n').start(getSecondsFromBPM(16));
};
