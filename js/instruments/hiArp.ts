import { Player, Loop, AutoPanner } from 'tone';
import { getSecondsFromBPM } from '../utils/time';
import arp from '../../static/samples/m32.mp3';

const panner = new AutoPanner(getSecondsFromBPM(0.25)).toDestination().start();

const arpPlayer = new Player({
  url: arp,
  volume: -15,
  loop: false,
}).connect(panner);

export const triggerArp = () => {
  new Loop((time) => {
    console.log('yo');
    if (Math.random() >= 0.3) {
      arpPlayer.start();
    }
  }, getSecondsFromBPM(32)).start();
};
