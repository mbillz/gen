import { Player, Panner } from 'tone';

import vox1 from '../../static/samples/vox_C.mp3';
import vox2 from '../../static/samples/vox_G2.mp3';
import vox3 from '../../static/samples/vox_G3.mp3';

const playRandomVox = () => {
  const players = [vox1Player, vox2Player, vox3Player];
  const randomInt = Math.floor(Math.random() * Math.floor(players.length));
  players[randomInt].start();
};

const vox1Pan = new Panner(-1).toDestination();

const vox1Player = new Player({
  url: vox1,
  volume: -16,
  onstop: playRandomVox,
}).connect(vox1Pan);

const vox2Pan = new Panner(1).toDestination();

const vox2Player = new Player({
  url: vox2,
  volume: -16,
  onstop: playRandomVox,
}).connect(vox2Pan);

const vox3Player = new Player({
  url: vox3,
  volume: -16,
  onstop: () => playRandomVox,
}).toDestination();

export const startVox = () => {
  vox1Player.start();
};
