// tools/sheet.mjs
// 全片接触表生成工具 (Contact Sheet: Intro + 20个时代 + Outro)
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

console.log(`[sheet] 正在启动 Chrome 并行采样 22 个时代关键帧...`);

const browser = await puppeteer.launch({
  executablePath: chromeExe,
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--hide-scrollbars', '--force-device-scale-factor=1'],
  defaultViewport: { width: 1920, height: 1080 }
});

const page = await browser.newPage();
await page.goto(`http://localhost:${port}/`, { waitUntil: 'networkidle0' });
await page.waitForFunction('window.__ready === true', { timeout: 15000 });

// 22 个采样节点时间戳与名称
const sampleFrames = [
  { label: '0. 开场 Intro', t: 2.5 },
  { label: '1. 撒哈拉岩画', t: 8.0 },
  { label: '2. 埃及壁画', t: 14.0 },
  { label: '3. 汉画像石拓片', t: 20.0 },
  { label: '4. 唐代白描', t: 26.0 },
  { label: '5. 宋代山水', t: 32.0 },
  { label: '6. 清明上河图', t: 38.0 },
  { label: '7. 玛雅抄本', t: 44.0 },
  { label: '8. 莫卧儿细密画', t: 50.0 },
  { label: '9. 八大山人写意', t: 56.0 },
  { label: '10. 爪哇皮影戏', t: 62.0 },
  { label: '11. 浮世绘', t: 68.0 },
  { label: '12. 梵高星月夜', t: 74.0 },
  { label: '13. 蒙克呐喊', t: 80.0 },
  { label: '14. 诺斯费拉图', t: 86.0 },
  { label: '15. 示波器矢量图', t: 92.0 },
  { label: '16. 8-bit像素游戏', t: 98.0 },
  { label: '17. 早期聊天窗口', t: 104.0 },
  { label: '18. 蒸汽波美学', t: 110.0 },
  { label: '19. 竖屏短视频', t: 116.0 },
  { label: '20. 代码美学', t: 122.0 },
  { label: '21. 尾声 新闻发布会', t: 130.0 }
];

const capturedDataUrls = [];

for (let i = 0; i < sampleFrames.length; i++) {
  const item = sampleFrames[i];
  console.log(`[sheet] (${i + 1}/22) 采样: ${item.label} (t=${item.t}s)...`);
  await page.evaluate((evalT) => {
    window.renderAt(evalT);
  }, item.t);
  await new Promise(r => setTimeout(r, 120));

  const dataUrl = await page.evaluate(() => {
    const canvas = document.querySelector('canvas');
    return canvas.toDataURL('image/jpeg', 0.88);
  });
  capturedDataUrls.push({ ...item, dataUrl });
}

console.log('[sheet] 正在拼装 4x6 接触表页面...');

// 构建接触表 HTML 页面
const sheetHtml = `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  body {
    margin: 0;
    padding: 32px;
    background: #0f1117;
    color: #e2e8f0;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Microsoft YaHei", sans-serif;
    width: 2560px;
    box-sizing: border-box;
  }
  h1 {
    font-size: 38px;
    margin-bottom: 8px;
    color: #f8fafc;
    letter-spacing: 1px;
  }
  p.subtitle {
    font-size: 18px;
    color: #94a3b8;
    margin-bottom: 28px;
  }
  .grid {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 20px;
  }
  .card {
    background: #1e2433;
    border: 1px solid #334155;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 8px 24px rgba(0,0,0,0.5);
  }
  .thumb-wrap {
    width: 100%;
    aspect-ratio: 16 / 9;
    background: #000;
  }
  .thumb-wrap img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
  .info {
    padding: 12px 14px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .name {
    font-size: 15px;
    font-weight: 600;
    color: #f1f5f9;
  }
  .time {
    font-size: 12px;
    color: #38bdf8;
    background: rgba(56, 189, 248, 0.12);
    padding: 3px 8px;
    border-radius: 4px;
  }
</style>
</head>
<body>
  <h1>《鹈鹕测试》全片 20 时代画风接触表 (Contact Sheet)</h1>
  <p class="subtitle">人类自古以来就痴迷于画鹈鹕骑自行车 · 120 BPM · 137 秒纯代码参数化动画</p>
  <div class="grid">
    ${capturedDataUrls.map(item => `
      <div class="card">
        <div class="thumb-wrap"><img src="${item.dataUrl}"></div>
        <div class="info">
          <span class="name">${item.label}</span>
          <span class="time">${item.t.toFixed(1)}s</span>
        </div>
      </div>
    `).join('')}
  </div>
</body>
</html>
`;

const sheetPage = await browser.newPage();
await sheetPage.setViewport({ width: 2560, height: 1600, deviceScaleFactor: 1 });
await sheetPage.setContent(sheetHtml, { waitUntil: 'load' });

const sheetOutPath = path.join(root, 'out/contact_sheet.png');
fs.mkdirSync(path.dirname(sheetOutPath), { recursive: true });
await sheetPage.screenshot({ path: sheetOutPath, fullPage: true });

console.log(`[sheet] 接触表成功输出: ${sheetOutPath}`);

await browser.close();
server.close();
