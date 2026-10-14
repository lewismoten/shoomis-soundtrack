import { TRACKS } from './music-theory.js';
import { createDreamSoundtrackController } from './midi-engine.js';

const builtInTracks = Object.entries(TRACKS).map(([path, details]) => ({
  path,
  label: details.label,
  caption: details.caption
}));

export function mountStandalonePlayer(target, options = {}) {
  if (!target) throw new Error('A target element is required to mount the standalone player.');

  const tracks = options.tracks || builtInTracks;
  const assetBase = options.assetBase ?? window.__shoomisAssetBase ?? '';
  let controller = null;

  const select = document.createElement('select');
  const button = document.createElement('button');
  const status = document.createElement('p');
  const caption = document.createElement('p');
  const audio = document.createElement('audio');

  select.className = 'standalone-select';
  button.className = 'standalone-play';
  button.type = 'button';
  button.setAttribute('aria-label', 'Play selected MIDI');
  status.className = 'standalone-status';
  caption.className = 'standalone-caption';
  audio.hidden = true;

  tracks.forEach((track) => {
    const option = document.createElement('option');
    option.value = track.path;
    option.textContent = track.label;
    select.append(option);
  });

  target.replaceChildren(select, button, status, caption, audio);

  function loadTrack() {
    const track = tracks.find((entry) => entry.path === select.value) || tracks[0];
    if (!track) return;
    if (controller?.destroy) controller.destroy();

    caption.textContent = track.caption || '';
    controller = createDreamSoundtrackController({
      toggleEl: button,
      statusEl: status,
      fallbackAudioEl: audio,
      assetBase,
      midiUrl: assetBase ? `${assetBase}/${track.path}` : track.path,
      preloadMidi: true,
      onLoadError: () => {
        status.textContent = 'Unable to load this MIDI.';
      }
    });
  }

  select.addEventListener('change', loadTrack);
  loadTrack();

  return {
    destroy() {
      if (controller?.destroy) controller.destroy();
      target.replaceChildren();
    },
    load(path) {
      select.value = path;
      loadTrack();
    }
  };
}
