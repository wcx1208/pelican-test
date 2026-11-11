// src/scenes/s08_mughal_miniature.js
// 8. 莫卧儿细密画 (约1600，宫廷工笔)
// 金色花边框，宫廷花园里，宾客从多个视角同时围观

import { computePelicanRig, drawDefaultPelican } from '../rig/rig.js';

export function render(p, localT, beat, camera) {
  p.push();

  // 1. 奢华金碧莫卧儿宫廷庭院底色 (象牙白石板地与孔雀绿草坪)
  p.noStroke();
  p.fill(245, 240, 228);
  p.rect(0, 0, 1000, 1000);

  // 莫卧儿华美外金滚边 (伊斯兰缠枝纹色块)
  p.fill(218, 165, 32);
  p.rect(0, 0, 1000, 45);
  p.rect(0, 955, 1000, 45);
  p.rect(0, 0, 45, 1000);
  p.rect(955, 0, 45, 1000);

  // 皇家宫廷四分花园草坪 (深翠绿)
  p.fill(45, 110, 75);
  p.rect(50, 180, 900, 520);

  // 反透视俯视水渠与八角形大理石喷泉水池
  p.fill(40, 150, 185); // 绿松石水色
  p.rect(50, 410, 900, 60);
  p.rect(470, 180, 60, 520);

  // 八角形中央喷泉 (完全俯视角，与侧视背景并存的反透视特征)
  p.push();
  p.translate(500, 440);
  p.fill(235, 235, 230);
  p.stroke(218, 165, 32);
  p.strokeWeight(4);
  p.beginShape();
  for (let a = 0; a < 8; a++) {
    const angle = (a * Math.PI) / 4;
    p.vertex(Math.cos(angle) * 75, Math.sin(angle) * 75);
  }
  p.endShape(p.CLOSE);
  p.fill(30, 160, 195);
  p.ellipse(0, 0, 80, 80);
  p.pop();

  // 2. 对称栽种的经典莫卧儿丝柏树 (Cypress) 与盛开的繁花树
  const drawCypress = (cx, cy) => {
    p.push();
    p.translate(cx, cy);
    p.noStroke();
    p.fill(20, 60, 40); // 浓密墨绿
    const ctx = p.drawingContext;
    ctx.save();
    ctx.fillStyle = 'rgb(20, 60, 40)';
    ctx.beginPath();
    ctx.moveTo(0, -110);
    ctx.bezierCurveTo(22, -60, 18, 10, 0, 20);
    ctx.bezierCurveTo(-18, 10, -22, -60, 0, -110);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
    p.fill(90, 60, 30);
    p.rect(-3, 20, 6, 25);
    p.pop();
  };

  drawCypress(120, 300);
  drawCypress(240, 300);
  drawCypress(760, 300);
  drawCypress(880, 300);

  // 3. 多视角围观的莫卧儿贵族与侍从 (戴金丝头巾 Turban、佩长剑、神情端庄严肃)
  const drawMughalCourtier = (mx, my, lookLeft = false, robes = [190, 40, 40]) => {
    p.push();
    p.translate(mx, my);
    if (lookLeft) p.scale(-1, 1);

    // 华丽头巾 (缠绕式金纹 Turban)
    p.noStroke();
    p.fill(230, 185, 45);
    p.ellipse(0, -32, 26, 22);
    p.fill(robes[0], robes[1], robes[2]);
    p.ellipse(8, -36, 12, 10);
    // 额前插的羽毛珠宝
    p.stroke(218, 165, 32);
    p.strokeWeight(2);
    p.line(0, -42, 6, -55);

    // 严格侧面侧影脸庞与黑色卷须
    p.fill(225, 185, 150);
    p.noStroke();
    p.ellipse(0, -18, 18, 20);
    p.fill(30, 25, 20);
    p.ellipse(4, -18, 4, 3); // 细长眼
    p.rect(2, -12, 8, 3); // 小胡子

    // 莫卧儿交领长袍 (Jama)
    p.fill(robes[0], robes[1], robes[2]);
    p.triangle(0, -8, -16, 65, 16, 65);
    // 金腰带 (Patka)
    p.fill(220, 175, 40);
    p.rect(-14, 18, 28, 8);
    p.pop();
  };

  drawMughalCourtier(180, 520, false, [185, 45, 45]);
  drawMughalCourtier(320, 510, false, [65, 95, 160]);
  drawMughalCourtier(720, 515, true, [205, 135, 45]);
  drawMughalCourtier(850, 525, true, [140, 60, 120]);

  // 4. 鹈鹕与自行车
  const pelicanX = 220 + (localT / 6.0) * 560;
  const groundY = 715;

  const rig = computePelicanRig(localT, {
    x: pelicanX,
    y: groundY,
    scale: 1.05
  });

  // 细密画工笔重彩风格 (金色牙盘、皇家青金石蓝车身、宝石级鲜艳羽毛)
  drawDefaultPelican(p, rig, {
    bodyColor: [255, 255, 255],
    beakColor: [225, 175, 35],
    pouchColor: [210, 65, 55],
    frameColor: [20, 65, 130], // 皇家青金石蓝车架
    wheelColor: [210, 165, 35], // 镀金轮辐
    eyeColor: [20, 20, 25]
  });

  // 铺满波斯花草的石板路基
  p.stroke(218, 165, 32);
  p.strokeWeight(8);
  p.line(50, 795, 950, 795);

  p.pop();
}
