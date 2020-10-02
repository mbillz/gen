import { Player, AutoPanner, Loop } from 'tone';
import { getSecondsFromBPM } from '../utils/time';

import bells1 from '../../static/samples/bells/bells1.mp3';
import bells2 from '../../static/samples/bells/bells2.mp3';
import bells3 from '../../static/samples/bells/bells3.mp3';
import bells4 from '../../static/samples/bells/bells4.mp3';
import bells5 from '../../static/samples/bells/bells5.mp3';
import bells6 from '../../static/samples/bells/bells6.mp3';
import bells7 from '../../static/samples/bells/bells7.mp3';
import bells8 from '../../static/samples/bells/bells8.mp3';

const bellsArray = [
    bells1,
    bells2,
    bells3,
    bells4,
    bells5,
    bells6,
    bells7,
    bells8
];

const panner = new AutoPanner(0.01).toDestination().start();

function bellsPlayer(bellsUrl) {
    const bellsPlayer = new Player({
        url: bellsUrl,
        loop: false,
        volume: -16
    }).connect(panner);
    return bellsPlayer
}

const bellPlayerArray = bellsArray.map(bellsUrl => bellsPlayer(bellsUrl));

const getRandomBell = () => {
    const index = Math.floor(Math.random() * bellsArray.length);
    return bellPlayerArray[index];
}


export const loopBells = () => {
    const loopLength = getSecondsFromBPM(32);
    new Loop(() => {
        getRandomBell().start();
    }, loopLength).start(loopLength);
};
