export const BPM = 100;

export const getSecondsFromBPM = (numQuarterNotes: number) => {
  return (numQuarterNotes * 60) / BPM;
};
