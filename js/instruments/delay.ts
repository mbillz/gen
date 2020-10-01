import { PingPongDelay } from 'tone';

export const pingPongDelay = new PingPongDelay({
  delayTime: 0.5,
  feedback: 0.2,
  wet: 0.2,
}).toDestination();
