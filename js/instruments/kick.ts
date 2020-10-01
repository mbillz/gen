import { MembraneSynth, Loop } from 'tone';

const kick = new MembraneSynth({
  volume: -6,
  envelope: {
    attack: 0.1,
    decay: 0.2,
  },
}).toDestination();

export const loopKick = () => {
  new Loop((time) => {
    kick.triggerAttackRelease('E1', time);
  }, '2n').start(0);
};
