import { Sequence, Sampler } from 'tone';

import padC3 from '../../static/samples/pads/pad_C3.mp3';
import padC4 from '../../static/samples/pads/pad_C4.mp3';
import padD4 from '../../static/samples/pads/pad_D4.mp3';
import padEb4 from '../../static/samples/pads/pad_Eb4.mp3';
import padAb4 from '../../static/samples/pads/pad_Ab4.mp3';
import padF3 from '../../static/samples/pads/pad_F3.mp3';
import padF4 from '../../static/samples/pads/pad_F4.mp3';
import padG4 from '../../static/samples/pads/pad_G4.mp3';
import { getSecondsFromBPM } from '../utils/time';
import { getRandomNextKey } from '../utils/getNextKey';

const pad = new Sampler({
  urls: {
    C3: padC3,
    F3: padF3,
    C4: padC4,
    D4: padD4,
    'D#4': padEb4,
    F4: padF4,
    G4: padG4,
    'G#4': padAb4,
  },
  volume: -16,
}).toDestination();

let currentNote = 'C4';

export const seqPadSampler = () => {
  new Sequence(
    (time, note) => {
      const nextNote = getRandomNextKey(currentNote);
      console.log(nextNote);
      pad.triggerAttack(getRandomNextKey(nextNote));
    },
    ['C3'],
    getSecondsFromBPM(8)
  ).start(0);
};
