export const MEASURE_LENGTH = '8n';

export const keyProgression = {
  C: ['A#', 'D#', 'G'],
  D: ['F', 'A#'],
  'D#': ['C', 'A#', 'G', 'F'],
  F: ['C', 'D#'],
  G: ['D', 'A#'],
  'G#': ['D#', 'A#'],
  'A#': ['F', 'G'],
};

const getRandomArbitrary = (min, max) => {
  return Math.round(Math.random() * (max - min) + min);
};

export const getRandomNextKey = (currentNote: string): string => {
  const nextNotes = keyProgression[currentNote.slice(0, -1)];
  return `${
    nextNotes[Math.floor(Math.random() * nextNotes.length)]
  }${getRandomArbitrary(2, 4)}`;
};
