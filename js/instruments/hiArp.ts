import { Filter, Sequence, PluckSynth } from 'tone';

const plucker = new PluckSynth({
  volume: -12,
});
const filter = new Filter({
  type: 'highpass',
  frequency: 1000,
}).toDestination();

const synth = plucker.connect(filter);

export const seqArp = () => {
  new Sequence(
    (time, note) => {
      synth.triggerAttackRelease(note, 0.6, time);
    },
    [['E4', 'A5', 'B5']]
  ).start(0);
};
