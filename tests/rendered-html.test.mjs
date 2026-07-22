import assert from "node:assert/strict";
import { access } from "node:fs/promises";
import test from "node:test";

async function render(url, headers = {}) {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${Math.random()}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(
    new Request(url, { headers: { accept: "text/html", ...headers } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("renders the complete local ORBITAL experience", async () => {
  const response = await render("http://localhost/", { host: "localhost", "x-forwarded-host": "localhost" });
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
  const html = await response.text();
  assert.match(html, /ORBITAL\/26/);
  assert.match(html, /WE[\s\S]*CREATE/i);
  assert.match(html, /GRAVITY LOOM/);
  assert.match(html, /SIGNAL GARDEN/);
  assert.match(html, /mailto:tmxkir14@gmail\.com/);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton|orbital\.fake/i);
});

test("protects the hosted experience with the email access portal", async () => {
  const response = await render("https://orbital.example/");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /YOUR.*SIGNAL.*IS WELCOME/i);
  assert.match(html, /CONTINUE WITH EMAIL/);
  assert.match(html, /signin-with-chatgpt/);
  assert.doesNotMatch(html, /GRAVITY LOOM/);
});

test("keeps every advertised experiment route present", async () => {
  const routes = [
    "archive", "artifact", "echo-chamber", "gravity-loom", "observatory",
    "signal-garden", "signal-lab", "time-rift", "type-engine",
    "projects/afterlight", "projects/fluid-signal", "projects/neon-object", "projects/sonic-bloom",
  ];
  await Promise.all(routes.map((route) => access(new URL(`../app/${route}/page.tsx`, import.meta.url))));
});
