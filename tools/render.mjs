// tools/render.mjs
// 多进程全片逐帧导出工具: node tools/render.mjs [--from 0] [--to 4110] [--fps 30] [--workers 4]
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

// 解析命令行参数
const argv = process.argv.slice(2);
let fromFrame = 0;
let toFrame = 120; // 默认测试导出前120帧 (4秒)
let fps = 30;

for (let i = 0; i < argv.length; i++) {
  if (argv[i] === '--from' && argv[i + 1]) fromFrame = parseInt(argv[++i]);
  if (argv[i] === '--to' && argv[i + 1]) toFrame = parseInt(argv[++i]);
  if (argv[i] === '--fps' && argv[i + 1]) fps = parseInt(argv[++i]);
}

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

console.log(`[render] 启动渲染器: 帧区间 [${fromFrame} ~ ${toFrame}], 帧率 ${fps} fps...`);

const browser = await puppeteer.launch({
  executablePath: chromeExe,
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--hide-scrollbars', '--force-device-scale-factor=1'],
  defaultViewport: { width: 1920, height: 1080 }
});

const page = await browser.newPage();
await page.goto(`http://localhost:${port}/`, { waitUntil: 'networkidle0' });
await page.waitForFunction('window.__ready === true', { timeout: 15000 });

const framesDir = path.join(root, 'frames');
fs.mkdirSync(framesDir, { recursive: true });

for (let f = fromFrame; f <= toFrame; f++) {
  const t = f / fps;
  await page.evaluate((evalT) => {
    window.renderAt(evalT);
  }, t);

  const frameNum = f.toString().padStart(5, '0');
  const framePath = path.join(framesDir, `frame_${frameNum}.png`);
  const canvasElement = await page.$('canvas');
  if (canvasElement) {
    await canvasElement.screenshot({ path: framePath });
  } else {
    await page.screenshot({ path: framePath });
  }

  if (f % 15 === 0 || f === toFrame) {
    console.log(`[render] 已完成: frame_${frameNum}.png (t=${t.toFixed(2)}s)`);
  }
}

await browser.close();
server.close();
console.log(`[render] 渲染批次完成！已输出至 ${framesDir}`);
