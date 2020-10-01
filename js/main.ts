import * as Tone from 'tone';
import 'minireset.css';

import '../css/styles.css';
import { loopKick } from './instruments/kick';
import { seqPad } from './instruments/pad';
import { BPM } from './utils/time';
import { seqArp } from './instruments/hiArp';
import { seqSynth } from './instruments/hiSynth';

const initInst = () => {
  Tone.Transport.start();
  loopKick();
  seqPad();
  seqArp();
  seqSynth();
};

Tone.Transport.bpm.value = BPM;
Tone.start();
initInst();
