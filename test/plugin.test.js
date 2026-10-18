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

// Drive the view with a fake host API: one search box, an all-terms search,
// and results straight from the host (no client-side filter).
test("searches lyrics + title + artist in allTerms mode from one box", async () => {
  const code = fs.readFileSync(path.join(root, "index.js"), "utf8");
  const actions = {};
  let view = null;
  let call = null;
  const api = {
    ui: {
      onAction: (id, fn) => { actions[id] = fn; },
      setViewData: (_id, data) => { view = data; },
    },
    informationTypes: {
      searchValues: (q, opts) => {
        call = { q, opts };
        return Promise.resolve([
          { snippet: "Could have a soul of heaven", track: { title: "Glycerine", artist_name: "Bush", path: "file:///g.mp3" } },
          { snippet: "unplayable", track: null },
        ]);
      },
    },
    playback: { playTracks() {} },
  };
  // eslint-disable-next-line no-new-func
  new Function("api", code)({}).activate(api);
  const inputs = view.children.filter((c) => c.type === "search-input");
  assert.strictEqual(inputs.length, 1, "a single search box");
  assert.strictEqual(actions.filter, undefined, "no filter action");

  actions.search({ query: "bush heaven" });
  await new Promise((r) => setTimeout(r, 0));
  assert.strictEqual(call.q, "bush heaven");
  assert.strictEqual(call.opts.matchMode, "allTerms");
  assert.strictEqual(call.opts.typeId, "lyrics");
  const list = view.children.find((c) => c.type === "track-row-list");
  assert.strictEqual(list.items.length, 1, "unresolved matches are dropped");
  assert.strictEqual(list.items[0].title, "Glycerine");
});

test("answers Cmd+K with lyric-matched tracks and their matched line", async () => {
  const code = fs.readFileSync(path.join(root, "index.js"), "utf8");
  const handlers = {};
  let opts = null;
  let answer = [];
  const api = {
    ui: { onAction() {}, setViewData() {} },
    search: { onQuery: (id, fn) => { handlers[id] = fn; } },
    informationTypes: {
      searchValues: (_q, o) => { opts = o; return Promise.resolve(answer); },
    },
    playback: { playTracks() {} },
  };
  // eslint-disable-next-line no-new-func
  new Function("api", code)({}).activate(api);
  const m = JSON.parse(fs.readFileSync(path.join(root, "manifest.json"), "utf8"));
  assert.deepStrictEqual(m.contributes.searchProviders.map((p) => p.id), Object.keys(handlers));

  answer = [
    { snippet: "Could have a soul of heaven", track: { title: "Glycerine", artist_name: "Bush", path: "file:///g.mp3", album_title: "Sixteen Stone", duration_secs: 266 } },
    { snippet: "x", track: null },
  ];
  const result = await handlers.lyrics(" bush heaven ", 6);
  assert.strictEqual(opts.requireTextMatch, true, "name-only hits stay out of Cmd+K");
  assert.strictEqual(opts.matchMode, "allTerms");
  assert.strictEqual(opts.limit, 6);
  assert.deepStrictEqual(result, {
    status: "ok",
    tracks: [{
      path: "file:///g.mp3",
      title: "Glycerine",
      artist_name: "Bush",
      album_title: "Sixteen Stone",
      duration_secs: 266,
      snippet: "Could have a soul of heaven",
    }],
  });

  answer = [];
  assert.deepStrictEqual(await handlers.lyrics("nothing", 6), { status: "empty" });
  api.informationTypes.searchValues = () => Promise.reject("boom");
  assert.strictEqual((await handlers.lyrics("x", 6)).status, "error");
});
