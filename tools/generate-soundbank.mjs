import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const sampleRate = 22050;
const outputDir = new URL('../public/soundbank/', import.meta.url);
const midiDir = new URL('../public/midi-tests/', import.meta.url);
const fullFfmpeg = '/opt/homebrew/opt/ffmpeg-full/bin/ffmpeg';
const ffmpeg = process.env.FFMPEG_BIN || (existsSync(fullFfmpeg) ? fullFfmpeg : 'ffmpeg');
const vorbisEncoder = ffmpeg === fullFfmpeg ? 'libvorbis' : 'vorbis';

mkdirSync(outputDir, { recursive: true });
mkdirSync(midiDir, { recursive: true });

function noteFrequency(note) {
  return 440 * 2 ** ((note - 69) / 12);
}

function envelope(time, duration, attack, release) {
  if (time < attack) return time / attack;
  if (time > duration - release) return Math.max(0, (duration - time) / release);
  return 1;
}

function seededNoise(seed) {
  let state = seed >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return (state / 0xffffffff) * 2 - 1;
  };
}

function renderInstrument({ filename, note, duration, attack, release, harmonics, vibrato = 0 }) {
  const frequency = noteFrequency(note);
  const frames = Math.floor(duration * sampleRate);
  const pcm = new Int16Array(frames);

  for (let index = 0; index < frames; index += 1) {
    const time = index / sampleRate;
    const phase = 2 * Math.PI * frequency * time + vibrato * Math.sin(2 * Math.PI * 5 * time);
    const tone = harmonics.reduce(
      (sum, amount, harmonic) => sum + amount * Math.sin(phase * (harmonic + 1)),
      0
    );
    pcm[index] =
      Math.max(-1, Math.min(1, tone * envelope(time, duration, attack, release))) * 32767;
  }

  writeOgg(filename, pcm);
}

function renderDrum({ filename, duration, seed, color, tone = 0 }) {
  const frames = Math.floor(duration * sampleRate);
  const pcm = new Int16Array(frames);
  const noise = seededNoise(seed);

  for (let index = 0; index < frames; index += 1) {
    const time = index / sampleRate;
    const decay = Math.exp((-time * color) / duration);
    const body = tone ? Math.sin(2 * Math.PI * tone * Math.exp(-time * 7) * time) * 0.55 : 0;
    pcm[index] = Math.max(-1, Math.min(1, (noise() * 0.45 + body) * decay)) * 32767;
  }

  writeOgg(filename, pcm);
}

function writeOgg(filename, pcm) {
  const wavPath = join(outputDir.pathname, `${filename}.wav`);
  const oggPath = join(outputDir.pathname, `${filename}.ogg`);
  writeFileSync(wavPath, wavBuffer(pcm));
  const args = [
    '-y',
    '-loglevel',
    'error',
    '-i',
    wavPath,
    '-c:a',
    vorbisEncoder,
    '-ac',
    '2',
    '-q:a',
    '3',
    oggPath
  ];
  if (vorbisEncoder !== 'libvorbis') args.splice(args.indexOf('-q:a'), 0, '-strict', '-2');
  execFileSync(ffmpeg, args);
  rmSync(wavPath);
}

function wavBuffer(pcm) {
  const header = Buffer.alloc(44);
  header.write('RIFF', 0);
  header.writeUInt32LE(36 + pcm.byteLength, 4);
  header.write('WAVEfmt ', 8);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20);
  header.writeUInt16LE(1, 22);
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(sampleRate * 2, 28);
  header.writeUInt16LE(2, 32);
  header.writeUInt16LE(16, 34);
  header.write('data', 36);
  header.writeUInt32LE(pcm.byteLength, 40);
  return Buffer.concat([header, Buffer.from(pcm.buffer)]);
}

function vlq(value) {
  const bytes = [value & 0x7f];
  for (value >>= 7; value; value >>= 7) bytes.unshift((value & 0x7f) | 0x80);
  return bytes;
}

function writeMidi(filename, notes, channel, program) {
  const track = [0, 0xff, 0x51, 3, 0x07, 0xa1, 0x20];
  if (program !== undefined) track.push(0, 0xc0 | channel, program);
  notes.forEach((note, index) => {
    track.push(...vlq(index ? 24 : 0), 0x90 | channel, note, 96);
    track.push(...vlq(72), 0x80 | channel, note, 0);
  });
  track.push(0, 0xff, 0x2f, 0);
  const header = Buffer.from([0x4d, 0x54, 0x68, 0x64, 0, 0, 0, 6, 0, 0, 0, 1, 0, 96]);
  const chunk = Buffer.alloc(8);
  chunk.write('MTrk', 0);
  chunk.writeUInt32BE(track.length, 4);
  writeFileSync(
    join(midiDir.pathname, filename),
    Buffer.concat([header, chunk, Buffer.from(track)])
  );
}

renderInstrument({
  filename: 'bass-f2',
  note: 41,
  duration: 2.4,
  attack: 0.01,
  release: 0.2,
  harmonics: [0.72, 0.22, 0.08]
});
renderInstrument({
  filename: 'strings-g4',
  note: 67,
  duration: 3.2,
  attack: 0.16,
  release: 0.7,
  harmonics: [0.43, 0.28, 0.16, 0.08],
  vibrato: 0.014
});
renderInstrument({
  filename: 'atmosphere-c4',
  note: 60,
  duration: 3.8,
  attack: 0.35,
  release: 1,
  harmonics: [0.32, 0.1, 0.2, 0.08],
  vibrato: 0.021
});
renderDrum({ filename: 'closed-hihat', duration: 0.08, seed: 42, color: 11 });
renderDrum({ filename: 'open-hihat', duration: 0.42, seed: 46, color: 3.2 });
renderDrum({ filename: 'crash', duration: 0.9, seed: 49, color: 1.7 });
renderDrum({ filename: 'ride', duration: 0.65, seed: 51, color: 2.4, tone: 410 });
renderDrum({ filename: 'tambourine', duration: 0.24, seed: 54, color: 5.5, tone: 620 });
renderDrum({ filename: 'cabasa', duration: 0.18, seed: 69, color: 6.2 });
writeMidi(
  'all-notes.mid',
  Array.from({ length: 128 }, (_, note) => note),
  0,
  50
);
writeMidi(
  'drum-range.mid',
  Array.from({ length: 47 }, (_, index) => index + 35),
  9
);
