// src/scenes/s05_song_landscape.js
// 5. 宋代山水 (约1000，水墨，致敬范宽《溪山行旅图》)
// 巨峰之下，万仞绝壁，山径幽深，鹈鹕小到几乎看不见，镜头推近才找到它

import { computePelicanRig, drawDefaultPelican } from '../rig/rig.js';
import { drawParchmentBackground, pseudoNoise } from '../kit/kit.js';

export function render(p, localT, beat, camera) {
  p.push();

  // 1. 绢本设色古画底色 (深沉静穆的古铜绢色)
  drawParchmentBackground(p, 1000, 1000, [218, 196, 160], 1000);

  // 2. 动态镜头控制 (小梗核心：先全景见巨山之宏伟，然后镜头大幅推进找到小鹈鹕，最后拉开)
  const pelicanX = 280 + (localT / 6.0) * 480;
  const groundY = 745;

  p.push();
  if (localT >= 1.5 && localT <= 4.0) {
    const focusProgress = Math.sin(((localT - 1.5) / 2.5) * Math.PI);
    const camZoom = 1.0 + focusProgress * 1.6;
    p.translate(pelicanX, groundY - 30);
    p.scale(camZoom);
    p.translate(-pelicanX, -(groundY - 30));
  }

  // 3. 范宽《溪山行旅图》式千仞主峰 (顶天立地，豆瓣皴与雨点皴密密麻麻)
  // 主峰巨岩轮廓
  p.fill(68, 62, 54);
  p.noStroke();
  p.beginShape();
  p.vertex(140, 680);
  p.vertex(120, 260);
  p.vertex(180, 120);
  p.vertex(280, 60);
  p.vertex(520, 50);
  p.vertex(760, 80);
  p.vertex(860, 180);
  p.vertex(880, 680);
  p.endShape(p.CLOSE);

  // 山顶密密层层的寒林密树 (范宽标志性浓墨点树丛)
  p.fill(28, 25, 22);
  for (let t = 0; t < 90; t++) {
    const tx = 200 + pseudoNoise(t * 13) * 620;
    const ty = 50 + pseudoNoise(t * 19) * 90;
    const tw = 12 + pseudoNoise(t * 7) * 20;
    const th = 8 + pseudoNoise(t * 11) * 16;
    p.ellipse(tx, ty, tw, th);
  }

  // 绝壁悬崖深邃浓墨雨点皴 (密集排布的墨点与斧劈肌理)
  p.fill(42, 38, 32, 160);
  for (let i = 0; i < 280; i++) {
    const qx = 160 + pseudoNoise(i * 23) * 700;
    const qy = 120 + pseudoNoise(i * 37) * 450;
    const qh = 4 + pseudoNoise(i * 5) * 14;
    p.rect(qx, qy, 3, qh, 1);
  }

  // 右侧绝壁如线飞流直下的悬泉飞瀑 (一线白练)
  p.stroke(242, 235, 220, 210);
  p.strokeWeight(3.5);
  p.line(780, 120, 785, 340);
  p.strokeWeight(5);
  p.line(785, 340, 792, 540);

  // 山腰缭绕的淡墨云气与留白岚烟 (使主峰悬浮于天地之间)
  p.noStroke();
  p.fill(218, 196, 160, 210);
  p.ellipse(450, 560, 650, 140);
  p.ellipse(750, 580, 400, 120);

  // 4. 中景次峰与苍松古木
  p.fill(52, 46, 40);
  p.beginShape();
  p.vertex(60, 850);
  p.vertex(80, 620);
  p.vertex(280, 560);
  p.vertex(440, 640);
  p.vertex(480, 850);
  p.endShape(p.CLOSE);

  // 坡岸上的盘曲老松 (蟹爪枝、铁骨虬枝)
  const drawPineTree = (px, py, s = 1.0) => {
    p.push();
    p.translate(px, py);
    p.scale(s);
    p.stroke(24, 20, 18);
    p.strokeWeight(6);
    p.noFill();
    // 树干
    p.bezier(0, 0, 10, -50, -25, -90, -10, -140);
    p.bezier(-10, -140, 30, -160, 60, -140, 80, -120);
    // 墨线针叶团
    p.fill(32, 28, 24);
    p.noStroke();
    p.ellipse(-20, -110, 55, 30);
    p.ellipse(10, -150, 65, 35);
    p.ellipse(75, -130, 50, 25);
    p.pop();
  };

  drawPineTree(240, 680, 1.1);
  drawPineTree(360, 720, 0.95);

  // 5. 山脚激流溪水与木桥小径
  p.fill(40, 35, 30);
  p.beginShape();
  p.vertex(0, 780);
  p.vertex(350, 760);
  p.vertex(700, 770);
  p.vertex(1000, 760);
  p.vertex(1000, 1000);
  p.vertex(0, 1000);
  p.endShape(p.CLOSE);

  // 溪水波纹
  p.stroke(218, 196, 160, 120);
  p.strokeWeight(2);
  for (let r = 0; r < 8; r++) {
    p.line(80 + r * 100, 840 + (r % 3) * 15, 160 + r * 100, 840 + (r % 3) * 15);
  }

  // 6. 核心主体：小径深处极小、悠闲骑行的水墨鹈鹕 (致敬范宽“行旅”骡队！)
  // 按照范宽原作比例，行旅人物极小，仅占巨轴下部毫厘之地！
  const rig = computePelicanRig(localT, {
    x: pelicanX,
    y: groundY,
    scale: 0.38 // 极小！仅相当于常规比例的 1/3，融入巨碑山水！
  });

  drawDefaultPelican(p, rig, {
    bodyColor: [248, 244, 235],
    beakColor: [180, 140, 90],
    pouchColor: [160, 110, 60],
    frameColor: [30, 25, 20],
    wheelColor: [45, 40, 35],
    eyeColor: [15, 15, 15]
  });

  // 7. 高光小梗：当推近至特写时，弹出古画考据放大镜圆框并标注“在此”
  if (localT >= 2.0 && localT <= 3.6) {
    p.push();
    p.translate(pelicanX, groundY - 70);
    // 红色宋代朱印楷书标识
    p.fill(185, 45, 35, 220);
    p.noStroke();
    p.rect(-32, -26, 64, 24, 4);
    p.fill(255, 255, 255);
    p.textSize(14);
    p.textAlign(p.CENTER, p.CENTER);
    p.text('在此', 0, -14);
    p.pop();
  }

  p.pop(); // 恢复镜头

  p.pop();
}
