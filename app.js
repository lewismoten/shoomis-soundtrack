const audio = document.querySelector('#audio');
const list = document.querySelector('#track-list');
const toggle = document.querySelector('#play-toggle');
const progress = document.querySelector('#progress');
const elapsed = document.querySelector('#elapsed');
const duration = document.querySelector('#duration');
const title = document.querySelector('#now-playing');
const artist = document.querySelector('#artist');
const empty = document.querySelector('#empty-state');
let tracks = [];
let selected = -1;

const time = (value) =>
  Number.isFinite(value)
    ? `${Math.floor(value / 60)}:${String(Math.floor(value % 60)).padStart(2, '0')}`
    : '0:00';
const render = () => {
  list.innerHTML = tracks
    .map(
      (track, index) =>
        `<li><button type="button" data-index="${index}" aria-current="${index === selected}"><span class="track-number">${String(index + 1).padStart(2, '0')}</span><span>${track.title}</span><span class="track-duration">${track.duration || ''}</span></button></li>`
    )
    .join('');
  document.querySelector('#track-count').textContent = tracks.length
    ? `${tracks.length} tracks`
    : '';
};
const select = (index) => {
  selected = index;
  const track = tracks[index];
  audio.src = track.file;
  title.textContent = track.title;
  artist.textContent = track.artist || 'Shoomis soundtrack';
  toggle.disabled = false;
  progress.disabled = false;
  render();
};
list.addEventListener('click', (event) => {
  const button = event.target.closest('button');
  if (button) {
    select(Number(button.dataset.index));
    audio.play();
  }
});
toggle.addEventListener('click', () => (audio.paused ? audio.play() : audio.pause()));
audio.addEventListener('play', () => {
  toggle.textContent = '❚❚';
  toggle.setAttribute('aria-label', 'Pause selected track');
});
audio.addEventListener('pause', () => {
  toggle.textContent = '▶';
  toggle.setAttribute('aria-label', 'Play selected track');
});
audio.addEventListener('loadedmetadata', () => {
  progress.max = audio.duration;
  duration.textContent = time(audio.duration);
});
audio.addEventListener('timeupdate', () => {
  progress.value = audio.currentTime;
  elapsed.textContent = time(audio.currentTime);
});
audio.addEventListener('ended', () => {
  if (selected + 1 < tracks.length) {
    select(selected + 1);
    audio.play();
  }
});
progress.addEventListener('input', () => {
  audio.currentTime = progress.value;
});
fetch('tracks.json')
  .then((response) => (response.ok ? response.json() : []))
  .then((data) => {
    tracks = Array.isArray(data) ? data : [];
    empty.hidden = tracks.length > 0;
    render();
    if (tracks.length) select(0);
  })
  .catch(() => {
    empty.hidden = false;
  });
