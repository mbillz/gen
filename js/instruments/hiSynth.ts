import { Filter, Sequence, Synth } from 'tone';

const synth = new Synth({
  oscillator: 'sawtooth',
  volume: -16,
});
const filter = new Filter({
  type: 'lowpass',
  frequency: 300,
}).toDestination();

const filteredSynth = synth.connect(filter);

export const seqSynth = () => {
  new Sequence(
    (time, note) => {
      filteredSynth.triggerAttackRelease(note, 0.2, time);
    },
    ['A5', 'F#5', 'E5', 'C#5'],
    '1n'
  ).start(0);
};
