"use strict";
// Smoke test: the plugin loads exactly as the host runs it
// (new Function("api", code)) and exports an activate function; manifest valid.
const { test } = require("node:test");
const assert = require("node:assert");
const fs = require("node:fs");
const path = require("node:path");

const root = path.join(__dirname, "..");

test("loads and exports activate/deactivate", () => {
  const code = fs.readFileSync(path.join(root, "index.js"), "utf8");
  // eslint-disable-next-line no-new-func
  const plugin = new Function("api", code)({});
  assert.strictEqual(typeof plugin.activate, "function");
  assert.ok(plugin.deactivate === undefined || typeof plugin.deactivate === "function");
});

test("manifest is valid", () => {
  const m = JSON.parse(fs.readFileSync(path.join(root, "manifest.json"), "utf8"));
  assert.strictEqual(m.id, "lyrics-search");
  assert.ok(m.name && m.version && m.contributes, "name/version/contributes present");
});

test("manifest viewHeader fits the host's limits", () => {
  const m = JSON.parse(fs.readFileSync(path.join(root, "manifest.json"), "utf8"));
  assert.ok(m.viewHeader, "viewHeader present");
  assert.strictEqual(typeof m.viewHeader.subtitle, "string");
  assert.ok(m.viewHeader.subtitle.length > 0 && m.viewHeader.subtitle.length <= 160, "subtitle 1..160 chars");
  // Only fields the host accepts from a manifest; colours/HTML are not a thing.
  for (const k of Object.keys(m.viewHeader)) {
    assert.ok(["title", "subtitle", "logo", "logoLight", "banner", "hidden"].includes(k), "unexpected key " + k);
  }
});
