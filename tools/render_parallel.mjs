// tools/render_parallel.mjs
// 多进程并行渲染 1080p 动画全片 (12 fps, 137 秒, 1644 帧)
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
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
];
const chromeExe = CHROME_PATHS.find(p => fs.existsSync(p));

const server = http.createServer((req, res) => {
  let u = decodeURIComponent(req.url.split('?')[0]);
  if (u === '/') u = '/index.html';
  const cleanPath = u.replace(/^[/\\]+/, '');

  let filePath = path.join(pub, cleanPath);
  if (!fs.existsSync(filePath)) {
    filePath = path.join(root, cleanPath);
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

const FPS = 12;
const TOTAL_DURATION = 137.0;
const TOTAL_FRAMES = Math.floor(TOTAL_DURATION * FPS); // 1644 帧
const NUM_WORKERS = 2;

const framesDir = path.join(root, 'frames');
fs.mkdirSync(framesDir, { recursive: true });

console.log(`[render_parallel] 启动 ${NUM_WORKERS} 个并行 Chrome 实例渲染全片 ${TOTAL_FRAMES} 帧 (12fps, 1080p)...`);

const framesPerWorker = Math.ceil(TOTAL_FRAMES / NUM_WORKERS);

async function runWorker(workerId) {
  const startFrame = workerId * framesPerWorker;
  const endFrame = Math.min(TOTAL_FRAMES - 1, (workerId + 1) * framesPerWorker - 1);

  // 稍微错开启动时间，避免高并发争抢资源
  await new Promise(r => setTimeout(r, workerId * 400));

  const browser = await puppeteer.launch({
    executablePath: chromeExe,
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--hide-scrollbars',
      '--force-device-scale-factor=1',
      '--disable-gpu-rasterization'
    ],
    defaultViewport: { width: 1920, height: 1080 }
  });

  const page = await browser.newPage();
  await page.goto(`http://localhost:${port}/`, { waitUntil: 'load', timeout: 30000 });
  await page.waitForFunction('window.__ready === true', { timeout: 30000 });

  // 隐藏底部控制条，确保画布 100% 原生 1920x1080 铺满视口
  await page.evaluate(() => {
    const bar = document.getElementById('control-bar');
    if (bar) bar.style.display = 'none';
    const stage = document.getElementById('stage-container');
    if (stage) stage.style.height = '100vh';
  });

  console.log(`[Worker ${workerId}] 开始渲染帧范围: ${startFrame} ~ ${endFrame}`);

  for (let f = startFrame; f <= endFrame; f++) {
    const t = f / FPS;
    await page.evaluate((evalT) => {
      window.renderAt(evalT);
    }, t);

    const frameNum = f.toString().padStart(5, '0');
    const framePath = path.join(framesDir, `frame_${frameNum}.png`);

    // 1:1 原生 1920x1080 截图 (带重试保护)
    let captured = false;
    for (let retry = 0; retry < 3 && !captured; retry++) {
      try {
        await page.screenshot({ path: framePath });
        captured = true;
      } catch (e) {
        await new Promise(r => setTimeout(r, 150));
      }
    }

    if (f % 40 === 0 || f === endFrame) {
      const progress = (((f - startFrame) / (endFrame - startFrame + 1)) * 100).toFixed(1);
      console.log(`[Worker ${workerId}] 进度 ${progress}% -> frame_${frameNum}.png (t=${t.toFixed(1)}s)`);
    }
  }

  await browser.close();
  console.log(`[Worker ${workerId}] 完成！`);
}

// 启动全部 worker 并行渲染
const startTime = Date.now();
await Promise.all(Array.from({ length: NUM_WORKERS }, (_, i) => runWorker(i)));

server.close();
const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
console.log(`[render_parallel] 全片 1644 帧全量渲染完成！耗时: ${elapsed} 秒`);
