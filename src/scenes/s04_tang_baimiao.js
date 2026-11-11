// src/scenes/s04_tang_baimiao.js
// 4. 唐代白描 (约750，水墨，“吴带当风”)
// 纯墨线，鹈鹕的羽毛和飘带随风翻飞

import { computePelicanRig, drawDefaultPelican } from '../rig/rig.js';
import { drawParchmentBackground } from '../kit/kit.js';

export function render(p, localT, beat, camera) {
  p.push();

  // 1. 盛唐熟绢暖黄底色 (做旧熟绫纸色)
  drawParchmentBackground(p, 1000, 1000, [246, 238, 222], 750);

  // 2. 背景飞动祥云 (唐代敦煌壁画与法海寺白描勾云纹)
  p.noFill();
  p.stroke(40, 38, 35, 140);
  p.strokeWeight(2.5);

  const drawCloud = (cx, cy, s = 1.0) => {
    p.push();
    p.translate(cx, cy);
    p.scale(s);
    const ctx = p.drawingContext;
    ctx.save();
    ctx.strokeStyle = 'rgba(40, 38, 35, 0.55)';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(20, -25, 60, -25, 80, 0);
    ctx.bezierCurveTo(100, -35, 150, -20, 160, 15);
    ctx.bezierCurveTo(180, 35, 140, 70, 90, 50);
    ctx.bezierCurveTo(60, 65, 10, 50, 0, 0);
    ctx.stroke();
    ctx.restore();
    p.arc(60, 20, 30, 25, 0, Math.PI * 1.5);
    p.pop();
  };

  drawCloud(120, 220, 1.2);
  drawCloud(680, 180, 1.0);
  drawCloud(420, 310, 0.85);

  // 3. 鹈鹕与自行车
  const pelicanX = 220 + (localT / 6.0) * 560;
  const groundY = 705;

  const rig = computePelicanRig(localT, {
    x: pelicanX,
    y: groundY,
    scale: 1.05
  });

  // 唐代白描纯墨线勾勒 (无厚重填色，仅兰叶描微淡墨)
  drawDefaultPelican(p, rig, {
    bodyColor: [250, 245, 235],
    beakColor: [248, 240, 225],
    pouchColor: [245, 235, 220],
    frameColor: [32, 30, 28],
    wheelColor: [40, 38, 36],
    eyeColor: [20, 18, 16]
  });

  // 4. “吴带当风”：鹈鹕肩头缠绕的超长盛唐仙人披帛飘带！
  // 随着骑行向前，长飘带向后剧烈波浪翻卷
  p.noFill();
  p.stroke(28, 25, 22);
  p.strokeWeight(3.5);

  const waveOffset = localT * 12;
  const ribbonX = rig.shoulder.x;
  const ribbonY = rig.shoulder.y;

  // 上飘带
  p.beginShape();
  p.vertex(ribbonX, ribbonY);
  for (let i = 1; i <= 8; i++) {
    const px = ribbonX - i * 45;
    const py = ribbonY - 20 + Math.sin(waveOffset + i * 0.9) * (18 + i * 4.5);
    p.vertex(px, py);
  }
  p.endShape();

  // 下飘带
  p.beginShape();
  p.vertex(ribbonX + 5, ribbonY + 8);
  for (let i = 1; i <= 8; i++) {
    const px = ribbonX - i * 48;
    const py = ribbonY + 15 + Math.cos(waveOffset + i * 0.9) * (20 + i * 5.0);
    p.vertex(px, py);
  }
  p.endShape();

  // 随风飘舞的飞仙羽翎 (尾翼飞毛)
  p.strokeWeight(2);
  for (let f = 0; f < 5; f++) {
    const fx = rig.hip.x - 22;
    const fy = rig.hip.y - 10 + f * 6;
    const flen = 40 + f * 8;
    const fAngle = Math.PI * 0.95 + Math.sin(waveOffset + f) * 0.35;
    p.line(fx, fy, fx + Math.cos(fAngle) * flen, fy + Math.sin(fAngle) * flen);
  }

  // 飘逸地平流水墨线
  p.stroke(50, 45, 40, 160);
  p.strokeWeight(2.5);
  p.line(0, 785, 1000, 785);

  p.pop();
}
