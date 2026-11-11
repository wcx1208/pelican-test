// src/scenes/s07_maya_codex.js
// 7. 玛雅抄本 (约1200，折页手抄本)
// 折页书的一页，旁边用玛雅点横数字实时记录踏板圈数

import { computePelicanRig, drawDefaultPelican } from '../rig/rig.js';
import { drawParchmentBackground } from '../kit/kit.js';

export function render(p, localT, beat, camera) {
  p.push();

  // 1. 玛雅树皮纸 (Amate) 做旧粗纤维底质
  drawParchmentBackground(p, 1000, 1000, [228, 205, 168], 1200);

  // 玛雅手抄本折页中央折痕阴影
  p.noStroke();
  p.fill(80, 60, 40, 35);
  p.rect(495, 0, 10, 1000);

  // 玛雅经典红黑边框分栏 (上中下三界图式)
  p.stroke(185, 45, 30); // 玛雅朱砂红
  p.strokeWeight(8);
  p.noFill();
  p.rect(60, 60, 880, 880);
  p.stroke(35, 30, 25);
  p.strokeWeight(2.5);
  p.rect(70, 70, 860, 860);

  // 2. 玛雅天神与象形图徽
  p.noStroke();
  p.fill(60, 140, 160); // 著名的“玛雅蓝” (Maya Blue)
  p.rect(80, 80, 840, 40);

  // 3. 核心笑点：玛雅祭司用点横数字符号实时记录踏板圈数
  // 踏板每 1.0s 转一圈，当前圈数 = Math.floor(localT)
  const crankRounds = Math.min(6, Math.floor(localT));

  p.push();
  p.translate(720, 160);
  // 记数石碑框
  p.stroke(170, 50, 35);
  p.strokeWeight(4);
  p.fill(245, 230, 200, 230);
  p.rect(0, 0, 180, 260, 12);

  p.fill(40, 35, 30);
  p.noStroke();
  p.textAlign(p.CENTER, p.TOP);
  p.textSize(15);
  p.text('踏板周数 (K\'atun)', 90, 14);

  // 绘制玛雅数字 (一点=1，一横=5)
  const drawMayaNumber = (val, x, y) => {
    p.push();
    p.translate(x, y);
    const bars = Math.floor(val / 5);
    const dots = val % 5;

    // 画点
    p.fill(180, 45, 30);
    p.noStroke();
    const dotSpacing = 16;
    const startX = -((dots - 1) * dotSpacing) / 2;
    for (let d = 0; d < dots; d++) {
      p.ellipse(startX + d * dotSpacing, 0, 10, 10);
    }

    // 画横杠
    p.stroke(40, 35, 30);
    p.strokeWeight(7);
    for (let b = 0; b < bars; b++) {
      p.line(-30, 18 + b * 12, 30, 18 + b * 12);
    }
    p.pop();
  };

  drawMayaNumber(crankRounds, 90, 85);

  p.fill(60, 130, 150);
  p.textSize(12);
  p.text(`当前累计: ${crankRounds} 圈`, 90, 215);
  p.pop();

  // 4. 背景站立的玛雅鸟首羽蛇神侍卫 (侧视面容、巨大鼻饰与绿咬鹃羽毛头冠)
  const drawMayaPriest = (px, py) => {
    p.push();
    p.translate(px, py);
    // 头饰咬鹃绿毛
    p.stroke(50, 160, 110);
    p.strokeWeight(5);
    p.noFill();
    for (let f = 0; f < 6; f++) {
      p.bezier(0, -60, 30, -90 - f * 10, 80, -80 - f * 5, 110, -50 - f * 5);
    }

    // 玛雅侧面面容 (斜额高鼻梁典型颅骨修饰)
    p.fill(195, 105, 60);
    p.stroke(40, 30, 25);
    p.strokeWeight(3);
    p.beginShape();
    p.vertex(-10, -30);
    p.vertex(15, -60);
    p.vertex(35, -25); // 高耸鹰钩鼻
    p.vertex(18, -15);
    p.vertex(25, 0);   // 下巴
    p.vertex(-15, 0);
    p.endShape(p.CLOSE);

    // 翡翠耳环
    p.fill(50, 180, 120);
    p.ellipse(-5, -15, 14, 14);

    // 身躯与玛雅织花围裙
    p.fill(210, 80, 50);
    p.rect(-20, 0, 45, 90);
    p.pop();
  };

  drawMayaPriest(180, 460);

  // 5. 鹈鹕与自行车 (玛雅抄本图腾化粗线条勾勒风格)
  const pelicanX = 220 + (localT / 6.0) * 520;
  const groundY = 705;

  const rig = computePelicanRig(localT, {
    x: pelicanX,
    y: groundY,
    scale: 1.05
  });

  drawDefaultPelican(p, rig, {
    bodyColor: [245, 235, 215],
    beakColor: [215, 140, 45],
    pouchColor: [195, 65, 45],
    frameColor: [55, 120, 140], // 玛雅青蓝车架
    wheelColor: [60, 45, 35],
    eyeColor: [30, 20, 15]
  });

  // 玛雅象形石径地面
  p.stroke(170, 40, 30);
  p.strokeWeight(6);
  p.line(70, 785, 930, 785);

  p.pop();
}
