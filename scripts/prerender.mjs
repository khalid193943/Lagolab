/**
 * Pré-rendu : transforme chaque page (5 pages + villes + guides + pages légales, × 3 langues) en vrai fichier HTML.
 * Google, Bing et surtout les robots des IA (GPTBot, ClaudeBot, PerplexityBot…), qui n'exécutent souvent pas
 * le JavaScript, lisent ainsi tout le contenu, les titres, les descriptions et les données structurées.
 *
 * Utilisation : npm run build:seo   (compile, puis pré-rend dans dist/)
 * Première fois : npx playwright install chromium
 */
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import { mkdirSync, writeFileSync, readFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';

const PORT = 4321;
const routes = JSON.parse(readFileSync(new URL('../scripts_routes.json', import.meta.url)));
const all = [];
for (const r of routes) for (const lg of ['', '/en', '/ar']) all.push(lg ? (r === '/' ? lg : lg + r) : r);
/* L'accueil en dernier : dist/index.html sert de coquille pendant la capture des autres pages */
all.sort((a, b) => (a === '/') - (b === '/'));

const server = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], { stdio: 'ignore', shell: process.platform === 'win32' });
await new Promise((r) => setTimeout(r, 2500));
const PNG = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=', 'base64');

const browser = await chromium.launch();
const ctx = await browser.newContext({ reducedMotion: 'reduce', viewport: { width: 1440, height: 900 } });
/* Les images distantes ne sont pas nécessaires pour capturer le HTML : on répond vite pour ne pas bloquer */
await ctx.route(/cloudfront\.net/, (route) => route.fulfill({ status: 200, contentType: 'image/png', body: PNG }));

const out = (p) => (p === '/' ? 'dist/index.html' : `dist${p}.html`);
let n = 0;
const capture = async (path, file) => {
  const page = await ctx.newPage();
  await page.goto(`http://localhost:${PORT}${path}`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(400);
  const html = '<!doctype html>\n' + (await page.evaluate(() => {
    document.querySelectorAll('[aria-hidden="true"][data-prerender-skip]').forEach((e) => e.remove());
    return document.documentElement.outerHTML;
  }));
  mkdirSync(dirname(file), { recursive: true }); writeFileSync(file, html); n++;
  await page.close();
};
for (const p of all) await capture(p, out(p));
await capture('/cette-page-n-existe-pas', 'dist/404.html');

await browser.close(); server.kill();
console.log(`Pré-rendu terminé : ${n} pages HTML.`);
