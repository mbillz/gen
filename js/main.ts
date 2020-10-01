import * as Tone from 'tone';
import 'minireset.css';

import '../css/styles.css';
import { loopKick } from './instruments/kick';

// constants
const BPM = 100;

const initInst = () => {
  Tone.Transport.start();
  loopKick();
};

Tone.Transport.bpm.value = BPM;
Tone.start();
initInst();
