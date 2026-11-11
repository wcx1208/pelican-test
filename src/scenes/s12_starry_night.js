// src/scenes/s12_starry_night.js
// 12. 梵高《星月夜》 (1889，后印象派)
// 漩涡星空随车轮一起旋转，厚涂流场短笔触

import { computePelicanRig, drawDefaultPelican } from '../rig/rig.js';

export function render(p, localT, beat, camera) {
  p.push();

  // 1. 深邃群青与夜空底色
  p.noStroke();
  p.fill(20, 32, 68);
  p.rect(0, 0, 1000, 1000);

  // 2. 随车轮旋转的梵高标志性夜空巨大星云漩涡
  // 旋转角度与脚踏时间完全同步
  const swirlAngle = localT * Math.PI * 2;

  const drawSwirlStroke = (cx, cy, radius, startA, color, len = 25) => {
    p.push();
    p.translate(cx, cy);
    p.rotate(swirlAngle * 0.5);
    p.stroke(color[0], color[1], color[2]);
    p.strokeWeight(7);
    p.strokeCap(p.ROUND);
    for (let a = startA; a < startA + Math.PI * 1.5; a += 0.18) {
      const r = radius + a * 18;
      const x = Math.cos(a) * r;
      const y = Math.sin(a) * r * 0.7; // 椭圆漩涡
      p.line(x, y, x + Math.cos(a + 0.3) * len, y + Math.sin(a + 0.3) * len);
    }
    p.pop();
  };

  // 绘制星云漩涡重叠笔触
  for (let ring = 40; ring < 200; ring += 35) {
    drawSwirlStroke(520, 320, ring, 0, [245, 215, 60], 18);   // 明黄
    drawSwirlStroke(520, 320, ring + 15, 0.4, [65, 140, 205], 22); // 钴蓝
    drawSwirlStroke(520, 320, ring + 25, 0.8, [230, 240, 255], 16); // 纯白光晕
  }

  // 右上角明月光晕 (橙黄双色同心圆厚涂短线)
  p.push();
  p.translate(850, 180);
  p.strokeWeight(6);
  for (let r = 20; r <= 80; r += 14) {
    for (let a = 0; a < Math.PI * 2; a += 0.35) {
      const col = (r > 40) ? [240, 180, 40] : [255, 240, 120];
      p.stroke(col[0], col[1], col[2]);
      p.line(Math.cos(a) * r, Math.sin(a) * r, Math.cos(a + 0.15) * (r + 8), Math.sin(a + 0.15) * (r + 8));
    }
  }
  p.pop();

  // 3. 左侧如黑色火焰般直插天穹的巨型丝柏树 (Cypress)
  p.push();
  p.translate(140, 680);
  p.stroke(18, 30, 24);
  p.strokeWeight(12);
  for (let i = 0; i < 45; i++) {
    const tx = (Math.sin(i * 13) * 35) * (1 - i / 45);
    const ty = -i * 12;
    p.line(tx, ty, tx + Math.cos(i) * 15, ty - 18);
  }
  p.pop();

  // 4. 起伏滚动的阿尔卑斯山脉与村庄小丘
  p.stroke(25, 45, 95);
  p.strokeWeight(10);
  for (let x = 0; x < 1000; x += 30) {
    const hillY = 620 + Math.sin(x * 0.008) * 60;
    p.line(x, hillY, x + 20, hillY + 5);
  }

  // 5. 鹈鹕与自行车
  const pelicanX = 220 + (localT / 6.0) * 560;
  const groundY = 710;

  const rig = computePelicanRig(localT, {
    x: pelicanX,
    y: groundY,
    scale: 1.05
  });

  // 梵高厚涂补色对比风格 (耀眼明黄车架、纯白带蓝厚涂羽毛、深蓝厚轮)
  drawDefaultPelican(p, rig, {
    bodyColor: [245, 248, 255],
    beakColor: [255, 195, 30],
    pouchColor: [230, 105, 35],
    frameColor: [245, 200, 45],  // 梵高向日葵黄车架
    wheelColor: [30, 45, 100],  // 群青轮圈
    eyeColor: [15, 20, 40]
  });

  // 地面黄色泥土与鹅卵石厚涂短线
  p.stroke(210, 160, 45);
  p.strokeWeight(8);
  for (let x = 0; x < 1000; x += 25) {
    p.line(x, 790, x + 18, 790);
  }

  p.pop();
}
