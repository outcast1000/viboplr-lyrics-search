# Viboplr — Lyrics Search

Search the lyrics cached in your library, filter the matches by artist, title or album, and jump straight to the track.

Externalized from [Viboplr](https://viboplr.com)'s built-in plugins — same code, now shipped as a standalone gallery plugin (id `lyrics-search`).

## Layout
- `manifest.json` — plugin metadata and contributions.
- `index.js` — the plugin code (ES5, executed via `new Function("api", code)`).
- `scripts/` — `bump.sh` (version + changelog) and `package.sh` (build `lyrics-search.zip` + `update.json`).

## Releasing
See [RELEASING.md](./RELEASING.md): `scripts/bump.sh <patch|minor|major>`, fill the changelog, commit, then push a `vX.Y.Z` tag — CI builds `lyrics-search.zip` + `update.json` and publishes the release.
