import * as Tone from 'tone';
import 'minireset.css';

import '../css/styles.css';
import { BPM } from './utils/time';
import { loopNoise } from './instruments/noise';
import { startVox } from './instruments/vox';
import { seqPadSampler } from './instruments/padSampler';
import { loopKick } from './instruments/kick';
import { loopBells } from './instruments/bells';
import * as visuals from './visuals';

const initInst = () => {
  Tone.Transport.start();
  visuals.start();
  loopNoise();
  startVox();
  seqPadSampler();
  loopKick();
  loopBells();
};

Tone.Transport.bpm.value = BPM;

// maybe we can do this without keydown - sometimes browsers are cool with it and sometimes not
const doIt = async () => {
  Tone.start();
  await Tone.loaded();
  initInst();
};

document.addEventListener('keydown', async (e) => {
  if (e.which === 13) {
    doIt();
  }
});
