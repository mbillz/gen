var core = require("@magenta/music/node/core");
var fs = require("fs");

const STATICPATH = '/Users/shaeselix/Projects/gen/static'
const INPUTDIR = `${STATICPATH}/generated_midi/cmin`;
const OUTPUTDIR = `${STATICPATH}/generated_midi/cmin`;
const STEPSPERQUARTER = 4;

function readMidiFile(inputPath, stepsPerQuarter) {
    var midiData = fs.readFileSync(inputPath);
    var ns = core.midiToSequenceProto(midiData);
    var qns = core.sequences.quantizeNoteSequence(ns, stepsPerQuarter);
    lastNote = qns.notes[qns.notes.length-1];
    if (lastNote.endTime - lastNote.startTime > 3) {
        qns.notes = qns.notes.splice(-1,1);
    }
    return qns;
}

function writeNoteSequenceJSON(seq, outputPath) {
    var jString = JSON.stringify(seq.toJSON(), null, '\t');
    fs.writeFileSync(outputPath, Buffer.from(jString));
}

function getInputOutputPaths(file, inputDir, outputDir) {
    const name = file.split('.')[0];
    const inputFile = `${inputDir}/${file}`;
    const outputFile = `${outputDir}/${name}.json`;
    return {
        i: inputFile,
        o: outputFile
    }
}

function processDir(inputDir, outputDir, stepsPerQuarter) {
    fs.readdir( 
        inputDir,
        (err, files) => { 
            if (err) console.log("Error:", err); 
            else {
                files.forEach(file => {
                    if (['mid', 'midi'].includes(file.split('.')[1])) {
                        const io = getInputOutputPaths(file, inputDir, outputDir);
                        console.log(`Processing MIDI: ${io.i}`);
                        const seq = readMidiFile(io.i, stepsPerQuarter);
                        console.log(`Writing JSON to: ${io.o}`);
                        writeNoteSequenceJSON(seq, io.o);
                        console.log();
                    } else {
                        console.log(`Not a midi file: ${file}`);
                    }
                });
            }
        }
    );
}

processDir(INPUTDIR, OUTPUTDIR, STEPSPERQUARTER);
