import * as Tone from 'tone';
import 'minireset.css';
import '../css/styles.css';
import { kickInst } from './instruments/kick';

kickInst.triggerAttackRelease('C2', '8n');
