import { MembraneSynth, Loop } from 'tone';

export const kickInst = new MembraneSynth({
  envelope: {
    attack: 0.1,
    decay: 0.2,
  },
}).toDestination();

export const loopKick = () => {
  new Loop((time) => {
    kickInst.triggerAttackRelease('E1', time);
  }, '2n').start(0);
};
