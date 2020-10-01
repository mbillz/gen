import * as Tone from 'tone';
import 'minireset.css';

import '../css/styles.css';
import { loopKick } from './instruments/kick';
import { seqPad } from './instruments/pad';
import { BPM } from './utils/time';
import { seqArp } from './instruments/hiArp';

const initInst = () => {
  Tone.Transport.start();
  loopKick();
  seqPad();
  seqArp();
};

Tone.Transport.bpm.value = BPM;
Tone.start();
initInst();
