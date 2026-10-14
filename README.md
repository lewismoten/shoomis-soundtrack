# Shoomis Soundtrack

A lightweight, dependency-free music player designed to deploy on GitHub Pages.

## Add music

1. Put audio files in `audio/` (for example, `audio/01-dawn.mp3`).
2. Add each track to `tracks.json`:

```json
[
  {
    "title": "Dawn",
    "artist": "Shoomis",
    "file": "audio/01-dawn.mp3",
    "duration": "3:42"
  }
]
```

The `duration` label is optional; the player reads the real playback duration from the file.

## Development

Install the linting dependencies and check the JavaScript with:

```sh
npm install
npm run lint
```

## Publish to GitHub Pages

The included workflow deploys the repository whenever `main` is pushed. In the GitHub repository, open **Settings → Pages**, set **Source** to **GitHub Actions**, then push this project to `main`.

The page will be available at `https://lewismoten.github.io/shoomis-soundtrack/` once the action finishes.
