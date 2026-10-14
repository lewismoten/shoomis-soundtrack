# Shoomis Soundtrack

A Vite-powered browser MIDI player and soundtrack inspector designed to deploy on GitHub Pages. It includes Shoomi MIDI tracks, Web Audio waveform playback, track visualization, metadata inspection, lyric display when present in a MIDI file, and support for loading local MIDI files.

## Included soundtrack

- `public/midi/rock_a_bye_baby.mid`, `public/midi/hush_little_baby.mid`, and `public/midi/twinkle_twinkle_little_star.mid`

See [the player guide](docs/SHOOMI_SOUNDTRACK.md).

## Add music

The player can load any local `.mid` or `.midi` file with its file picker. To add another built-in song, place it in `public/midi/` and add it to the select list in `index.html` and the metadata map in `src/player/index-shared.js`.

## Development

Install the linting dependencies and check the JavaScript with:

```sh
npm install
npm run lint
npm run format:check
npm run build
```

Use `npm run format` to apply the project's formatting rules.

Use `npm run dev` for a local development server, or `npm run preview` to inspect the production build. Vite source code lives in `src/`; static MIDI assets live in `public/midi/`; `dist/` is generated and deployed by GitHub Actions.

## Project layout

- `src/main.js` — application entry point and load order for the restored browser player
- `src/player/` — MIDI parsing, playback, visualization, metadata, and interaction modules
- `src/styles/` — site styling
- `public/midi/` — files copied unchanged into the deployed site
- `docs/` — player reference documentation
- `dist/` — generated production site; never edit or commit it

## Publish to GitHub Pages

The included workflow deploys the repository whenever `main` is pushed. In the GitHub repository, open **Settings → Pages**, set **Source** to **GitHub Actions**, then push this project to `main`.

The page will be available at `https://lewismoten.github.io/shoomis-soundtrack/` once the action finishes.
