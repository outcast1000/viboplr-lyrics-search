# Changelog

## v1.3.0
- **Runs in the plugin worker runtime.** It now gets only what it asks for
  — `library:read`, `playback:control` — and can't reach anything else in the app. Viboplr asks
  you to allow these once when you update. Requires Viboplr 1.0.85.

## v1.2.0
- Adopts Viboplr's host-drawn plugin view header (Viboplr 1.0.77+): the strip at the top of the view now carries a one-line subtitle, "Search the lyrics cached in your library". Older hosts ignore it; no `minAppVersion` change.

## v1.1.0
- Initial release. Externalized from the Viboplr app's built-in plugins (previously bundled as `lyrics-search`); functionally identical, now installable and updatable from the plugin gallery.
