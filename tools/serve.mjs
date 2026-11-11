// tools/serve.mjs
// 本地轻量静态服务器与自动打开浏览器
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { exec } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const pub = path.join(root, 'public');

const mime = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.png': 'image/png',
  '.json': 'application/json',
  '.wav': 'audio/wav',
  '.mp4': 'video/mp4'
};

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

const PORT = 3000;
server.listen(PORT, () => {
  const url = `http://localhost:${PORT}/`;
  console.log(`=======================================================`);
  console.log(`《鹈鹕测试》本地预览服务已启动: ${url}`);
  console.log(`正在自动调起默认浏览器打开页面...`);
  console.log(`提示：按 Ctrl+C 可停止服务`);
  console.log(`=======================================================`);

  // Windows 自动调用默认浏览器打开
  exec(`start ${url}`);
});
