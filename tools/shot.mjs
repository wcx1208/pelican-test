// tools/shot.mjs
// 单帧截图质检工具: node tools/shot.mjs <out.png> [t0 t1 t2 ...]
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
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.png': 'image/png',
  '.json': 'application/json',
  '.wav': 'audio/wav'
};

const args = process.argv.slice(2);
const outPath = args[0] || 'out/shot.png';
const times = args.slice(1).length ? args.slice(1).map(Number) : [2.5];

// 自动探测 Chrome 路径
const CHROME_PATHS = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome'
];
const chromeExe = CHROME_PATHS.find(p => fs.existsSync(p));
if (!chromeExe) {
  console.error('未找到 Google Chrome 可执行文件！');
  process.exit(1);
}

// 启动本地静态服务器
const server = http.createServer((req, res) => {
  let u = decodeURIComponent(req.url.split('?')[0]);
  if (u === '/') u = '/index.html';
  const cleanPath = u.replace(/^[/\\]+/, ''); // 去掉开头的斜杠，防止 Windows path.join 跑到盘符根目录

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
    console.log('[server 404]', u, '->', filePath);
    res.statusCode = 404;
    return res.end('Not Found');
  }
  res.setHeader('content-type', mime[path.extname(filePath)] || 'application/octet-stream');
  fs.createReadStream(filePath).pipe(res);
});

await new Promise(r => server.listen(0, r));
const port = server.address().port;

console.log(`[shot] 本地服务启动于端口 ${port}，正在调用 Chrome (${chromeExe})...`);

const browser = await puppeteer.launch({
  executablePath: chromeExe,
  headless: true,
  args: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--hide-scrollbars',
    '--force-device-scale-factor=1',
    '--disable-gpu-rasterization'
  ],
  defaultViewport: { width: 1920, height: 1080, deviceScaleFactor: 1 }
});

const page = await browser.newPage();
page.on('console', msg => console.log('[page]', msg.text()));
page.on('pageerror', err => console.log('[page error]', err.stack || err.message));
await page.goto(`http://localhost:${port}/`, { waitUntil: 'networkidle0' });
await page.waitForFunction('window.__ready === true', { timeout: 15000 });

fs.mkdirSync(path.dirname(path.resolve(outPath)), { recursive: true });

for (let i = 0; i < times.length; i++) {
  const t = times[i];
  console.log(`[shot] 正在捕获时间戳 t = ${t}s...`);

  await page.evaluate((evalT) => {
    window.renderAt(evalT);
  }, t);

  // 确保画布已重绘
  await new Promise(r => setTimeout(r, 120));

  const targetOut = times.length > 1 ? outPath.replace(/(\.[^.]+)$/, `-${i}$1`) : outPath;
  const canvasElement = await page.$('canvas');
  if (canvasElement) {
    await canvasElement.screenshot({ path: targetOut });
  } else {
    await page.screenshot({ path: targetOut });
  }
  console.log(`[shot] 成功输出截图: ${targetOut}`);
}

await browser.close();
server.close();
console.log('[shot] 任务完成！');
