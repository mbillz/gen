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
import { triggerArp } from './instruments/hiArp';
import { triggerPerc } from './instruments/revPerc';

const initInst = () => {
  Tone.Transport.start();
  visuals.start();
  loopNoise();
  startVox();
  seqPadSampler();
  loopKick();
  loopBells();
  triggerArp();
  triggerPerc();
  visuals.loopRain();
};

Tone.Transport.bpm.value = BPM;

const doIt = async () => {
  Tone.start();
  await Tone.loaded();
  initInst();
};

doIt();

// adding this in case keydown doesn't work
document.addEventListener('keydown', async (e) => {
  if (e.which === 13) {
    doIt();
  }
});
