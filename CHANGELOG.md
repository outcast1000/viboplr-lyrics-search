# Changelog

## v1.4.0
- **One search box for lyrics, titles and artists.** Every word you type must appear somewhere in the song's lyrics, title or artist, in any order — "bush heaven" finds Bush songs that mention heaven. The separate "Filter results" box is gone.
- **"Quotes" keep words together** as an exact phrase: `"hello darkness" friend`. Punctuation inside the lyrics doesn't get in the way, and apostrophes are optional ("dont" finds "don't").
- Results are ranked: the words as a phrase first, then all of them on one line, then anywhere in the lyrics, then songs that matched only by title or artist.
- **Lyrics in Cmd+K.** Type in the global search and pick *Search “…” on Lyrics* to find songs by their lyrics without opening the view; each result shows the line that matched. Songs that match only by title or artist are left out there, since the library results above already list them. You can hide the row in Extensions → Lyrics Search → Contributions.
- Requires Viboplr 1.0.112.

## v1.3.2
- Each permission now says why the plugin needs it, shown under it when Viboplr asks. No functional changes.

## v1.3.1
- Releases are now signed with the Viboplr plugin-signing key, so Viboplr allows the permissions this plugin asks for without prompting. No functional changes.

## v1.3.0
- **Runs in the plugin worker runtime.** It now gets only what it asks for
  — `library:read`, `playback:control` — and can't reach anything else in the app. Viboplr asks
  you to allow these once when you update. Requires Viboplr 1.0.85.

## v1.2.0
- Adopts Viboplr's host-drawn plugin view header (Viboplr 1.0.77+): the strip at the top of the view now carries a one-line subtitle, "Search the lyrics cached in your library". Older hosts ignore it; no `minAppVersion` change.

## v1.1.0
- Initial release. Externalized from the Viboplr app's built-in plugins (previously bundled as `lyrics-search`); functionally identical, now installable and updatable from the plugin gallery.
