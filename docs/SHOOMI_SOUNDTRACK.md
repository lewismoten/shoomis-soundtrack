# Shoomi's Soundtrack

## Open The Player

- Standalone page: [Shoomi's Soundtrack](../index.html)

This page can be used as a simple in-browser MIDI player, but it also includes a lot of inspection tools for tracks, lyrics, metadata, controller changes, and remapping.

For a minimal player without the inspection interface, open [the standalone player](../player.html). Choose a MIDI, then use its round play/pause button. It includes the same soundtrack and soundbank diagnostic files.

For local setup, soundbank generation, diagnostics, and deployment details, see the [development guide](DEVELOPMENT.md).

## Quick Start

1. Install dependencies and start the Vite development server from the project root:
   ```bash
   npm install
   npm run dev
   ```
2. Open the soundtrack page:
   [index.html](../index.html)
3. Either:
   - pick a soundtrack or soundbank diagnostic from the dropdown
   - or choose `Use a MIDI file from your computer` and load your own `.mid` / `.midi` file
4. Click the play button in the sticky header.

If you only want to use this as a MIDI player for your own file, the simplest flow is:

- open the page
- choose `Use a MIDI file from your computer`
- select your MIDI file
- click play

## What The Page Does

The soundtrack page:

- parses the MIDI in the browser
- visualizes note tracks and timed meta/control tracks
- plays the file through a compact, original generated OGG soundbank with Web Audio waveform fallbacks
- lets you remap tracks if the original instrument choices do not fit the compact soundbank

Important limitation:

- MIDI files are instructions, not recordings
- this page does not contain a full General MIDI soundfont
- imported files may sound different from their original intended playback

## Header Controls

At the top of the page, the sticky header contains:

- the page title
- a live spectrum analyzer
- the main play/pause button

The header stays visible while you scroll, so you can pause or resume without going back to the top.

## Song Source Controls

In the `Choose a dream tune` panel:

- `Select a built-in MIDI`
  - uses one of the soundtrack tracks or diagnostics packaged with the site
- the dropdown
  - groups regular tracks under `Soundtrack` and test files under `Soundbank diagnostics`
- `Use a MIDI file from your computer`
  - loads a local MIDI file from your machine
- the file picker
  - accepts `.mid` and `.midi`

Behavior notes:

- switching the dropdown moves the page back to the built-in soundtrack mode
- selecting a local file switches the page into file mode

### Soundbank diagnostics

The dropdown contains two generated test files that can be played exactly like soundtrack tracks:

- `All melodic notes (0–127)`
  - verifies the neutral melodic root note can be pitch-shifted across the entire MIDI note range
- `GM drum range (35–81)`
  - verifies generated drum sounds and the nearest-hit fallback mapping for common GM percussion notes

These fixtures live in `public/midi-tests/`; their expected files and mappings are recorded in `public/soundbank/manifest.json` and checked with `npm run validate:soundbank`.

## Program Meaning Profile

The `Program meaning profile` dropdown changes how MIDI program numbers are interpreted when shown in the UI and when suggestions are made.

Options:

- `General MIDI (GM)`
- `Roland GS`
- `Yamaha XG`
- `Game / chip heuristic`

This does not magically load a new sound bank. It mainly affects interpretation and suggestion behavior.

## Track Sound Mapper

The `Track Sound Mapper` section appears for playable tracks and lets you decide what each MIDI track should use for playback on this page.

You may see:

- `Playback Sound`
  - the actual sound choice used by the player
- `Preview`
  - a visual thumbnail of the chosen sound
- preview play button
  - click for a short preview
  - press and hold for a longer held preview
- per-drum mapping rows
  - shown when a track is using `Drum Kit`

Possible playback choices include:

- generated neutral-note soundbank choices such as:
  - `35: Neutral Bass F2`
  - `50: Neutral Strings G4`
  - `99: Neutral Atmosphere C4`
  - `Generated Drum Kit`
- waveform synth choices such as:
  - `Wave: Sine`
  - `Wave: Triangle`
  - `Wave: Square`
  - `Wave: Saw`

Use this section when:

- a MIDI file sounds wrong with the default mapping
- you want a more game-like sound
- you want to force a melodic track to a drum sound
- you want to remap individual drum notes inside a drum track

## Track Flow

The `Track flow` canvas is the main sequencer-style view.

It shows:

- each playable lane
- note activity over time
- the current playhead
- mute icons on the canvas
- optional control/program markers

### Track Flow Controls

- `Show full song`
  - shows the entire song at once
- `Range`
  - chooses the visible time window when full-song mode is off
  - goes down to `1 sec`
- `Show change markers`
  - reveals markers for program/control changes when that file contains meaningful ones

### Marker Type Filters

When a file actually uses nontrivial controller/program changes, additional checkboxes may appear, such as:

- `Program`
- `Bank M`
- `Bank L`
- `NRPN M`
- `NRPN L`
- `Data`
- `Volume`
- `Pan`
- `Expression`
- `Attack`
- `Reverb`
- `Other`

Only relevant types for the loaded MIDI are shown.

### Register Options

For files that use `NRPN`, `RPN`, or `Data Entry`, you may also see:

- `Show register links`
  - draws visual links from a write back to the most relevant register selectors
- `Track register values`
  - shows a live register-state grid below the track flow

### Canvas Interactions

You can interact directly with the track flow:

- click the timeline to seek
- click a marker to jump to that event
- click the speaker icon on a lane to mute/unmute
- click the drum expand/collapse icon on the `Drums` row
- while paused, use a mousepad/two-finger scroll to pan the window left/right
- while paused, clicking changes the next play position without recentering the view immediately

## Meta / Control Flow

If the MIDI contains timed non-note events, the page may show a separate `Meta / control flow` section.

This can include:

- lyrics
- text events
- program/meta changes
- tempo changes
- time signatures
- key signatures
- sequencer-specific events

Features in this section:

- labels inside visible event bars
- hover tooltips for full event text
- a separate playhead
- click-to-seek
- paused trackpad panning

## Lyrics

When lyric metadata exists, the page shows:

- a full lyric list
- timestamps for each lyric line
- the currently active lyric highlight
- a vertical progress indicator between timestamp and lyric text

You can:

- click a lyric line to jump to that point
- click the timestamp or lyric text itself

## Metadata And Detail Sections

Below the canvases, the page may show several grids/tables depending on the MIDI contents.

Possible sections include:

- `Track details`
  - track role, source channel/program, contents, drum notes, controller summaries
- `MIDI Metadata`
  - file-level text and technical metadata
- `Meta lane guide`
  - descriptions of meta/control-only lanes
- `Unhandled / Tracked CC Inventory`
  - which CCs are applied, tracked, or not yet handled
- `Controller impact in this player`
  - counts, channels, and tracks for active controllers
- `NRPN / Data Registers`
  - register selection/write summaries when present
- live register state
  - shown only when relevant and enabled

## What Works Best

This page works especially well when you want to:

- play a local MIDI file quickly in the browser
- inspect track structure
- view embedded lyrics
- inspect metadata and controller usage
- experiment with remapping tracks to a smaller sound palette

## What To Expect From Sound

Because the player uses a compact generated soundbank rather than a full General MIDI soundfont:

- strings, bass, and pad-like parts may need manual soundbank or waveform remapping
- drum-heavy or controller-heavy files may need manual remapping
- advanced MIDI synth behavior may be approximated rather than perfectly reproduced

## Continue Exploring

- [Back to the main project overview](../README.md)
- [Shoomi's Soundtrack](SHOOMI_SOUNDTRACK.md)
