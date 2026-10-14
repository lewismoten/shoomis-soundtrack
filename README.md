# Shoomis Soundtrack

A browser-based MIDI player and soundtrack inspector designed to deploy on GitHub Pages. It includes Shoomi MIDI tracks, Web Audio waveform playback, track visualization, metadata inspection, lyric display when present in a MIDI file, and support for loading local MIDI files.

## Included soundtrack

- `rock_a_bye_baby.mid`, `hush_little_baby.mid`, and `twinkle_twinkle_little_star.mid`

See [the player guide](docs/SHOOMI_SOUNDTRACK.md).

## Add music

The player can load any local `.mid` or `.midi` file with its file picker. To add another built-in song, place the MIDI at the repository root and add it to the select list in `index.html`.

## Development

Install the linting dependencies and check the JavaScript with:

```sh
npm install
npm run lint
npm run format:check
```

Use `npm run format` to apply the project's formatting rules.

## Publish to GitHub Pages

The included workflow deploys the repository whenever `main` is pushed. In the GitHub repository, open **Settings → Pages**, set **Source** to **GitHub Actions**, then push this project to `main`.

The page will be available at `https://lewismoten.github.io/shoomis-soundtrack/` once the action finishes.
