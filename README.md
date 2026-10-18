# Viboplr — Lyrics Search

Search the lyrics cached in your library together with song titles and artists, and jump straight to the track. Every word must appear somewhere in the lyrics, title or artist (`bush heaven`); put words in quotes to search for an exact phrase (`"hello darkness" friend`). The same search is offered in Viboplr's global search (Cmd+K) as *Search “…” on Lyrics*.

Externalized from [Viboplr](https://viboplr.com)'s built-in plugins — same code, now shipped as a standalone gallery plugin (id `lyrics-search`).

## Layout
- `manifest.json` — plugin metadata and contributions.
- `index.js` — the plugin code (ES5, executed via `new Function("api", code)`).
- `scripts/` — `bump.sh` (version + changelog) and `package.sh` (build `lyrics-search.zip` + `update.json`).

## Releasing
See [RELEASING.md](./RELEASING.md): `scripts/bump.sh <patch|minor|major>`, fill the changelog, commit, then push a `vX.Y.Z` tag — CI builds `lyrics-search.zip` + `update.json` and publishes the release.
