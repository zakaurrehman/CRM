/**
 * Renders scripts/og-card.html to public/images/og/site.jpg, the 1200×630
 * share card every page points to. Needs Chrome on the machine.
 *
 * Usage: node scripts/og-card.mjs
 */
import { spawn } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";

const here = path.dirname(fileURLToPath(import.meta.url));
const source = pathToFileURL(path.join(here, "og-card.html")).href;
const out = path.join(here, "..", "public", "images", "og", "site.jpg");
const chromePath = process.env.CHROME || "C:/Program Files/Google/Chrome/Application/chrome.exe";

const port = 9950 + Math.floor(Math.random() * 40);
const chrome = spawn(
  chromePath,
  ["--headless=new", "--disable-gpu", "--hide-scrollbars", "--allow-file-access-from-files", `--remote-debugging-port=${port}`, "--no-first-run", "--user-data-dir=" + path.join(process.env.TEMP || "/tmp", "cdp-og-" + port), "about:blank"],
  { stdio: "ignore" },
);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let targets;
for (let i = 0; i < 40; i++) {
  try { targets = await (await fetch(`http://127.0.0.1:${port}/json`)).json(); break; } catch { await sleep(250); }
}
if (!targets) throw new Error("Chrome did not start");
const ws = new WebSocket(targets.find((t) => t.type === "page").webSocketDebuggerUrl);
await new Promise((r) => (ws.onopen = r));
let id = 0;
const pending = new Map();
ws.onmessage = (e) => { const m = JSON.parse(e.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); } };
const send = (method, params = {}) => new Promise((r) => { const n = ++id; pending.set(n, r); ws.send(JSON.stringify({ id: n, method, params })); });

await send("Emulation.setDeviceMetricsOverride", { width: 1200, height: 630, deviceScaleFactor: 1, mobile: false });
await send("Page.enable");
await send("Page.navigate", { url: source });
await sleep(4000); // fonts and the photograph
const shot = await send("Page.captureScreenshot", { format: "jpeg", quality: 86 });
mkdirSync(path.dirname(out), { recursive: true });
writeFileSync(out, Buffer.from(shot.result.data, "base64"));
console.log(`wrote ${path.relative(process.cwd(), out)}`);
ws.close();
chrome.kill();
