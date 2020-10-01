import { Player, Panner } from 'tone';

import vox1 from '../../static/samples/vox_C.mp3';
import vox2 from '../../static/samples/vox_G2.mp3';
import vox3 from '../../static/samples/vox_G3.mp3';

const vox1Pan = new Panner(-1).toDestination();

const vox1Player = new Player({
  url: vox1,
  volume: -16,
  onstop: () => {
    vox2Player.start();
  },
}).connect(vox1Pan);

const vox2Pan = new Panner(1).toDestination();

const vox2Player = new Player({
  url: vox2,
  volume: -16,
  onstop: () => {
    vox3Player.start();
  },
}).connect(vox2Pan);

const vox3Player = new Player({
  url: vox3,
  volume: -16,
  onstop: () => {
    vox1Player.start();
  },
}).toDestination();

export const startVox = () => {
  vox1Player.start();
};
