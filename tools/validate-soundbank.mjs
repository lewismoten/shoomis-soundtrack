import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = resolve(fileURLToPath(new URL('..', import.meta.url)));
const soundbankDir = resolve(projectRoot, 'public/soundbank');
const manifest = JSON.parse(readFileSync(resolve(soundbankDir, 'manifest.json'), 'utf8'));
const failures = [];

function expect(condition, message) {
  if (!condition) failures.push(message);
}

function startsWith(filePath, signature, label) {
  const bytes = readFileSync(filePath);
  expect(
    bytes.subarray(0, signature.length).equals(signature),
    `${label} has an invalid signature`
  );
}

expect(manifest.format === 1, 'Manifest format must be 1');
expect(manifest.sampleRate === 22050, 'Soundbank must remain at 22.05 kHz');
expect(
  manifest.provenance.includes('No external soundbank'),
  'Manifest must document source provenance'
);
expect(manifest.melodic.length === 3, 'Expected three melodic neutral-note samples');
expect(manifest.drums.length === 6, 'Expected six generated drum samples');

[...manifest.melodic, ...manifest.drums].forEach((asset) => {
  startsWith(resolve(soundbankDir, asset.file), Buffer.from('OggS'), asset.file);
});

manifest.fixtures.forEach((fixture) => {
  startsWith(resolve(soundbankDir, fixture.file), Buffer.from('MThd'), fixture.file);
});

if (failures.length) {
  console.error(failures.map((failure) => `• ${failure}`).join('\n'));
  process.exitCode = 1;
} else {
  console.log(
    `Soundbank verified: ${manifest.melodic.length} melodic, ${manifest.drums.length} drum, ${manifest.fixtures.length} MIDI fixtures.`
  );
}
