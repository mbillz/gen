import * as Tone from 'tone';

import './styles.css';

const synth = new Tone.Synth().toDestination();

const loop = new Tone.Loop((time) => {
  synth.triggerAttackRelease('C4', '8n', time);
}, '4n');

const button = document.querySelector('.button');

button.addEventListener('click', () => {
  loop.start('1m').stop('4m');
  Tone.Transport.start();
});
