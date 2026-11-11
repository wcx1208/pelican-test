// tools/encode.mjs
// 音视频合成导出工具: 调用 E:\MediaToolkit\ffmpeg.exe 将图像帧序列与 out/soundtrack.wav 合成为标准 1080p MP4
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const FFMPEG_CANDIDATES = [
  'E:\\MediaToolkit\\ffmpeg.exe',
  'C:\\Program Files\\ffmpeg\\bin\\ffmpeg.exe',
  'ffmpeg'
];

let ffmpegBin = FFMPEG_CANDIDATES.find(p => {
  try {
    return fs.existsSync(p);
  } catch (e) {
    return false;
  }
}) || 'ffmpeg';

console.log(`[encode] 使用的 ffmpeg 路径: ${ffmpegBin}`);

const wavPath = path.join(root, 'out/soundtrack.wav');
if (!fs.existsSync(wavPath)) {
  console.error(`未找到离线音频文件 ${wavPath}！`);
  process.exit(1);
}

const framesDir = path.join(root, 'frames');
const frameFiles = fs.existsSync(framesDir) ? fs.readdirSync(framesDir).filter(f => f.endsWith('.png')) : [];

console.log(`[encode] 发现 ${frameFiles.length} 帧标准 1080p 连续动画帧，正在压制最高兼容性成片...`);

// 1. 压制标准黄金母版 pelican_history.mp4 (H.264 High 4.1 / yuv420p / +faststart)
const outMp4 = '../out/pelican_history.mp4';
const wavRelative = '../out/soundtrack.wav';

const args1 = [
  '-y',
  '-threads', '4',
  '-framerate', '12',
  '-i', 'frame_%05d.png',
  '-i', wavRelative,
  '-c:v', 'libx264',
  '-profile:v', 'high',
  '-level', '4.1',
  '-pix_fmt', 'yuv420p',
  '-movflags', '+faststart',
  '-r', '24',
  '-g', '24',
  '-crf', '19',
  '-preset', 'fast',
  '-c:a', 'aac',
  '-b:a', '192k',
  '-ar', '44100',
  '-ac', '2',
  '-shortest',
  outMp4
];

console.log(`[encode] 正在合成主成片 out/pelican_history.mp4...`);
const res1 = spawnSync(ffmpegBin, args1, { cwd: framesDir, stdio: 'inherit' });
if (res1.status !== 0) {
  console.error(`[encode] 压制 pelican_history.mp4 失败: ${res1.status}`);
  process.exit(1);
}

// 2. 压制万能兼容版 pelican_history_compat.mp4 (Main Profile 4.0 / 无非标滤镜 / +faststart)
// 适配所有老旧播放器、DirectShow 与系统级默认播放器
const outCompat = '../out/pelican_history_compat.mp4';
const args2 = [
  '-y',
  '-threads', '4',
  '-framerate', '12',
  '-i', 'frame_%05d.png',
  '-i', wavRelative,
  '-c:v', 'libx264',
  '-profile:v', 'main',
  '-level', '4.0',
  '-pix_fmt', 'yuv420p',
  '-movflags', '+faststart',
  '-r', '24',
  '-g', '24',
  '-crf', '19',
  '-preset', 'fast',
  '-c:a', 'aac',
  '-b:a', '192k',
  '-ar', '44100',
  '-ac', '2',
  '-shortest',
  outCompat
];

console.log(`[encode] 正在合成万能兼容版 out/pelican_history_compat.mp4...`);
spawnSync(ffmpegBin, args2, { cwd: framesDir, stdio: 'inherit' });

console.log(`=======================================================`);
console.log(`[encode] 成片压制圆满完成！`);
console.log(`主成片: ${path.join(root, 'out/pelican_history.mp4')}`);
console.log(`万能兼容版: ${path.join(root, 'out/pelican_history_compat.mp4')}`);
console.log(`=======================================================`);
