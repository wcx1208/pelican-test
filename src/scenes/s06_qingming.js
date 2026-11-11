// src/scenes/s06_qingming.js
// 6. 清明上河图 (约1100，北宋界画水墨淡彩)
// 骑过汴水虹桥，编木拱梁穿插精妙，桥上凭栏挑担的市井百工纷纷回头围观

import { computePelicanRig, drawDefaultPelican } from '../rig/rig.js';
import { drawParchmentBackground, pseudoNoise } from '../kit/kit.js';

export function render(p, localT, beat, camera) {
  p.push();

  // 1. 北宋张择端式老熟绢底色 (温润的牙黄淡赭色)
  drawParchmentBackground(p, 1000, 1000, [238, 222, 192], 1100);

  // 2. 远景汴京城堞与岸边古树
  p.noStroke();
  p.fill(210, 195, 168);
  // 远岸平沙
  p.rect(0, 480, 1000, 80);

  // 岸边丛丛杂树 (宋代蟹爪柳树与枯柳)
  const drawRiverWillow = (wx, wy) => {
    p.push();
    p.translate(wx, wy);
    p.stroke(65, 52, 42);
    p.strokeWeight(3.5);
    p.noFill();
    p.bezier(0, 0, -10, -40, 15, -70, 0, -110);
    p.strokeWeight(1.8);
    p.line(0, -110, -25, -140);
    p.line(0, -110, 20, -135);
    // 淡绿花青树点
    p.fill(120, 135, 100, 140);
    p.noStroke();
    p.ellipse(-20, -135, 30, 20);
    p.ellipse(15, -130, 35, 22);
    p.pop();
  };

  drawRiverWillow(80, 490);
  drawRiverWillow(220, 500);
  drawRiverWillow(780, 495);
  drawRiverWillow(910, 485);

  // 3. 汴河清波 (水墨花青淡染)
  p.fill(168, 185, 172, 180);
  p.rect(0, 560, 1000, 440);

  // 粼粼细波纹
  p.stroke(140, 160, 148, 150);
  p.strokeWeight(1.5);
  for (let r = 0; r < 20; r++) {
    const rx = pseudoNoise(r * 19) * 900;
    const ry = 620 + pseudoNoise(r * 29) * 320;
    p.line(rx, ry, rx + 60, ry);
  }

  // 4. 桥下正欲穿过桥洞的客货大船 (放倒的桅杆与船夫)
  p.push();
  p.translate(500, 760);
  // 木船身
  p.fill(145, 110, 75);
  p.stroke(55, 40, 28);
  p.strokeWeight(2.5);
  p.beginShape();
  p.vertex(-120, 0);
  p.vertex(120, 0);
  p.vertex(90, 45);
  p.vertex(-90, 45);
  p.endShape(p.CLOSE);
  // 放倒的木桅杆
  p.stroke(45, 30, 20);
  p.strokeWeight(4);
  p.line(-100, -5, 80, 15);
  // 仓皇撑篙的船工
  p.strokeWeight(2.5);
  p.line(70, 0, 95, 60); // 撑篙
  p.fill(195, 85, 70);
  p.ellipse(65, -12, 10, 12);
  p.pop();

  // 5. 北宋汴水著名无柱编木拱桥 (虹桥) 经典木构！
  // 巨弧主梁架构
  p.noFill();
  p.stroke(85, 60, 40);
  p.strokeWeight(12);
  p.arc(500, 920, 960, 520, Math.PI * 1.05, Math.PI * 1.95);
  p.strokeWeight(6);
  p.arc(500, 905, 960, 520, Math.PI * 1.05, Math.PI * 1.95);

  // 纵横交错穿插的纵梁与横木排架 (北宋界画木工精髓！)
  p.strokeWeight(3.5);
  p.stroke(70, 50, 32);
  for (let b = -400; b <= 400; b += 45) {
    const bridgeY = 660 - Math.cos((b / 480) * (Math.PI / 2)) * 140;
    p.line(500 + b, bridgeY, 500 + b, bridgeY + 35);
  }

  // 桥面石板与木栏杆立柱
  p.stroke(60, 42, 28);
  p.strokeWeight(2.5);
  for (let pIdx = -420; pIdx <= 420; pIdx += 28) {
    const by = 650 - Math.cos((pIdx / 480) * (Math.PI / 2)) * 140;
    p.line(500 + pIdx, by, 500 + pIdx, by - 24); // 栏杆柱
    // 柱头圆望柱
    p.fill(70, 50, 35);
    p.ellipse(500 + pIdx, by - 25, 5, 5);
  }
  // 贯穿栏杆扶手
  p.noFill();
  p.strokeWeight(3);
  p.arc(500, 895, 960, 520, Math.PI * 1.06, Math.PI * 1.94);

  // 6. 桥头酒肆挑出的“正店”酒旗 (宋代青帘)
  p.push();
  p.translate(880, 560);
  p.stroke(50, 35, 25);
  p.strokeWeight(4);
  p.line(0, 0, -20, -90); // 旗杆
  // 杏黄酒旗
  p.fill(215, 175, 110);
  p.strokeWeight(1.5);
  p.rect(-70, -90, 50, 75, 2);
  p.fill(160, 40, 30);
  p.noStroke();
  p.textSize(18);
  p.textStyle(p.BOLD);
  p.textAlign(p.CENTER, p.CENTER);
  p.text('正\n店', -45, -52);
  p.pop();

  // 7. 桥上凭栏驻足、回头惊叹的宋代市民百工！
  const drawCitizen = (px, py, color, isCarrying = false) => {
    p.push();
    p.translate(px, py);
    p.noStroke();
    // 头部戴幞头或斗笠
    p.fill(35, 28, 22);
    p.ellipse(0, -18, 10, 11);
    // 宋人长衫袍服
    p.fill(color[0], color[1], color[2]);
    p.quad(-7, -10, 7, -10, 9, 12, -9, 12);
    // 回头围观姿势 (身体面向桥内，脸转过来)
    p.stroke(35, 28, 22);
    p.strokeWeight(1.8);
    if (isCarrying) {
      // 挑着扁担
      p.line(-22, -15, 22, -15);
      p.fill(160, 120, 80);
      p.rect(-24, -12, 10, 12);
      p.rect(14, -12, 10, 12);
    } else {
      // 趴在栏杆上用手指
      p.line(0, -6, -10, -2);
    }
    p.pop();
  };

  // 一排形形色色的北宋路人回头围观
  drawCitizen(260, 605, [180, 80, 65], true);
  drawCitizen(320, 565, [75, 110, 130]);
  drawCitizen(370, 545, [135, 105, 80]);
  drawCitizen(680, 540, [170, 130, 85]);
  drawCitizen(740, 560, [95, 125, 90], true);
  drawCitizen(800, 600, [155, 75, 70]);

  // 8. 骑车过虹桥的鹈鹕与自行车
  // 随着走过拱桥，纵坐标跟随虹桥圆弧起伏！
  const pelicanX = 220 + (localT / 6.0) * 560;
  const bridgeOffset = 500 - pelicanX;
  const bridgeCurveY = 650 - Math.cos((bridgeOffset / 480) * (Math.PI / 2)) * 140;

  const rig = computePelicanRig(localT, {
    x: pelicanX,
    y: bridgeCurveY - 15,
    scale: 0.95
  });

  drawDefaultPelican(p, rig, {
    bodyColor: [248, 245, 238],
    beakColor: [215, 150, 70],
    pouchColor: [185, 110, 50],
    frameColor: [65, 45, 30],
    wheelColor: [50, 35, 25],
    eyeColor: [20, 20, 20]
  });

  p.pop();
}
