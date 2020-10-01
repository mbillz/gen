import { PolySynth, Loop, Filter, LFO } from 'tone';
import { getSecondsFromBPM } from '../utils/time';

const pad = new PolySynth({
  volume: -15,
});
const filter = new Filter({ type: 'lowpass' }).toDestination();
const lfo = new LFO({
  type: 'sine',
  frequency: getSecondsFromBPM(4),
  min: 300,
  max: 800,
});
lfo.connect(filter.frequency);
lfo.start();
const synth = pad.connect(filter);

const chords = [
  ['F#3', 'A3', 'C#3'],
  ['F#3', 'B3', 'D#3'],
  ['A3', 'C#3', 'E3'],
  ['B3', 'D#3', 'F#3'],
];

const getRandomChord = () => {
  const randomInt = Math.floor(Math.random() * Math.floor(chords.length));
  return chords[randomInt];
};

export const seqPad = () => {
  const noteLength = getSecondsFromBPM(16);
  new Loop(() => {
    synth.triggerAttackRelease(getRandomChord(), noteLength);
  }, noteLength).start(0);
};
