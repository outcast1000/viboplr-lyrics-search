# Releasing

1. `scripts/bump.sh patch` (or minor|major|X.Y.Z) — bumps `manifest.json` and stamps `CHANGELOG.md`. Fill the TODO.
2. `git add manifest.json CHANGELOG.md index.js && git commit -m "Release vX.Y.Z"`
3. `git push origin main && git tag vX.Y.Z && git push origin vX.Y.Z` — CI builds `lyrics-search.zip` + `update.json` and publishes the release.

CI enforces: `manifest.json` version == tag version, and `lyrics-search.zip` has `manifest.json` at its root. The gallery resolves this plugin via its `updateUrl`.
