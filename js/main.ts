import * as Tone from 'tone';
import 'minireset.css';

import '../css/styles.css';
import { BPM } from './utils/time';
import { loopNoise } from './instruments/noise';
import { startVox } from './instruments/vox';
import { seqPadSampler } from './instruments/padSampler';
import { loopKick } from './instruments/kick';

const initInst = () => {
  Tone.Transport.start();
  loopNoise();
  startVox();
  seqPadSampler();
  loopKick();
};

Tone.Transport.bpm.value = BPM;

document.addEventListener('keydown', async (e) => {
  if (e.which === 13) {
    Tone.start();
    await Tone.loaded();
    initInst();
  }
});
