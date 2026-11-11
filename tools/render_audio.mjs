// tools/render_audio.mjs
// 离线高保真音频导出工具: 通过无头 Chrome 运行 OfflineAudioContext 并输出 out/soundtrack.wav
import puppeteer from 'puppeteer-core';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const pub = path.join(root, 'public');

const mime = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.png': 'image/png',
  '.json': 'application/json'
};

const CHROME_PATHS = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome'
];
const chromeExe = CHROME_PATHS.find(p => fs.existsSync(p));

const server = http.createServer((req, res) => {
  let u = decodeURIComponent(req.url.split('?')[0]);
  if (u === '/') u = '/index.html';
  const cleanPath = u.replace(/^[/\\]+/, '');

  let filePath;
  if (cleanPath.startsWith('src') || cleanPath.startsWith('audio')) {
    filePath = path.join(root, cleanPath);
  } else if (cleanPath.startsWith('beat') || cleanPath.startsWith('kit') || cleanPath.startsWith('rig') || cleanPath.startsWith('scenes') || cleanPath.startsWith('main')) {
    filePath = path.join(root, 'src', cleanPath);
  } else {
    filePath = path.join(pub, cleanPath);
    if (!fs.existsSync(filePath)) {
      filePath = path.join(root, cleanPath);
    }
  }

  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    res.statusCode = 404;
    return res.end('Not Found');
  }
  res.setHeader('content-type', mime[path.extname(filePath)] || 'application/octet-stream');
  fs.createReadStream(filePath).pipe(res);
});

await new Promise(r => server.listen(0, r));
const port = server.address().port;

console.log('[audio] 正在启动 Chrome 并执行 OfflineAudioContext 离线音频渲染 (137秒全片)...');

const browser = await puppeteer.launch({
  executablePath: chromeExe,
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox']
});

const page = await browser.newPage();
await page.goto(`http://localhost:${port}/`, { waitUntil: 'networkidle0' });
await page.waitForFunction('typeof window.renderOfflineAudioWav === "function"', { timeout: 15000 });

console.log('[audio] 正在合成全片 20 时代乐器音色、车铃打击乐与蒸汽波磁带效果...');
const wavBytesArray = await page.evaluate(async () => {
  return await window.renderOfflineAudioWav();
});

const outWavPath = path.join(root, 'out/soundtrack.wav');
fs.mkdirSync(path.dirname(outWavPath), { recursive: true });
fs.writeFileSync(outWavPath, Buffer.from(wavBytesArray));

console.log(`[audio] 离线音频成功导出: ${outWavPath} (${(wavBytesArray.length / 1024 / 1024).toFixed(2)} MB)`);

await browser.close();
server.close();
