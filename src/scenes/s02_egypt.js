// src/scenes/s02_egypt.js
// 2. 埃及壁画 (约前1300，新王国第十九王朝石灰岩彩绘)
// 象形文字王名框写着“鹈鹕测试”，背景隐约可见画师起草红网格底稿，放慢定格摆出壁画标准姿态

import { computePelicanRig, drawDefaultPelican } from '../rig/rig.js';

export function render(p, localT, beat, camera) {
  p.push();

  // 1. 石灰岩墓室石壁 (金黄暖砂岩色底)
  p.noStroke();
  p.fill(238, 222, 190);
  p.rect(0, 0, 1000, 1000);

  // 顶部古埃及神圣彩绘饰带 (埃及蓝、朱红、绿松石与黄金几何回纹)
  p.fill(32, 115, 150); // 埃及蓝
  p.rect(0, 0, 1000, 42);
  p.fill(195, 48, 38);  // 埃及红
  p.rect(0, 42, 1000, 16);
  p.fill(218, 175, 45); // 黄金
  p.rect(0, 58, 1000, 12);
  p.fill(40, 150, 120); // 绿松石
  p.rect(0, 70, 1000, 8);

  // 2. 画师起草用的红赭色正投影 18 网格体系底稿 (古埃及正投影经典比例线)
  p.stroke(215, 85, 70, 40);
  p.strokeWeight(1.2);
  const gridSize = 42;
  for (let x = 0; x < 1000; x += gridSize) {
    p.line(x, 78, x, 780);
  }
  for (let y = 78; y < 780; y += gridSize) {
    p.line(0, y, 1000, y);
  }

  // 3. 神圣象形文字王名框 (Cartouche)：“鹈鹕测试”
  p.push();
  p.translate(120, 120);
  // 椭圆王名框外金框
  p.stroke(185, 135, 30);
  p.strokeWeight(6);
  p.fill(248, 240, 222, 230);
  p.rect(0, 0, 180, 260, 75);
  // 底座系结
  p.line(-12, 260, 192, 260);
  p.line(0, 268, 180, 268);

  // 内部圣书体象形文字 (朱砂红与埃及蓝刻线)
  p.stroke(165, 45, 30);
  p.strokeWeight(3.5);
  p.noFill();
  // 水波符号 (N)
  p.beginShape();
  for (let w = 40; w <= 140; w += 10) {
    p.vertex(w, 50 + ((w / 10) % 2 === 0 ? -6 : 6));
  }
  p.endShape();
  // 鹈鹕大嘴神圣鸟类符号
  p.ellipse(90, 115, 32, 22);
  p.line(100, 110, 142, 120);
  p.line(142, 120, 105, 135);
  // 荷鲁斯之眼 (Wedjat)
  p.ellipse(90, 175, 36, 18);
  p.line(108, 175, 128, 188);
  p.line(90, 184, 85, 202);
  // 双轮战车符号
  p.ellipse(68, 225, 22, 22);
  p.ellipse(112, 225, 22, 22);
  p.line(68, 225, 112, 225);
  p.pop();

  // 4. 古埃及书记官 (Scribe) 与法老侍臣在旁恭敬记录
  const drawEgyptianScribe = (sx, sy) => {
    p.push();
    p.translate(sx, sy);
    // 皮肤古埃及经典红赭陶色
    p.stroke(175, 75, 50);
    p.fill(175, 75, 50);
    p.ellipse(0, 0, 36, 44); // 侧面头部
    // 侧脸上的正面大眼与描黑眼线 (埃及画法核心！)
    p.fill(20, 20, 25);
    p.ellipse(10, -2, 14, 8);
    p.stroke(15, 15, 20);
    p.strokeWeight(2);
    p.line(4, -8, 25, -6);
    // 黑色浓厚假发披肩
    p.noStroke();
    p.fill(25, 25, 30);
    p.rect(-18, -18, 25, 55, 4);

    // 黄金与绿松石宽领项圈 (Usekh Collar)
    p.fill(218, 170, 40);
    p.arc(5, 25, 40, 25, 0, Math.PI);
    p.fill(30, 120, 140);
    p.arc(5, 25, 32, 18, 0, Math.PI);

    // 白色亚麻短褶裙 (Shendyt)
    p.fill(245, 245, 240);
    p.stroke(185, 145, 40);
    p.strokeWeight(2);
    p.triangle(0, 95, -35, 180, 35, 180);

    // 手持纸莎草卷轴记录
    p.stroke(175, 75, 50);
    p.strokeWeight(8);
    p.line(0, 35, 35, 65);
    p.line(0, 35, 25, 80);
    p.stroke(230, 215, 180);
    p.strokeWeight(6);
    p.line(20, 55, 45, 90); // 莎草卷轴
    p.pop();
  };

  drawEgyptianScribe(860, 520);

  // 5. 鹈鹕与自行车：在 2.0s ~ 3.6s 放慢定格，摆出壁画标志性正视荷鲁斯眼与侧身姿势！
  // 运动曲线：进场 -> 2.0s~3.6s 减速定格 -> 穿向下一画框
  let pelicanProgress = localT / 6.0;
  if (localT >= 2.0 && localT <= 3.6) {
    // 定格在画面黄金分割中央
    pelicanProgress = 2.0 / 6.0 + (localT - 2.0) * 0.03;
  } else if (localT > 3.6) {
    pelicanProgress = (2.0 / 6.0 + 1.6 * 0.03) + ((localT - 3.6) / 2.4) * (1 - (2.0 / 6.0 + 1.6 * 0.03));
  }

  const pelicanX = 220 + pelicanProgress * 560;
  const groundY = 705;

  const rig = computePelicanRig(localT, {
    x: pelicanX,
    y: groundY,
    scale: 1.05
  });

  // 埃及法老黄金战车配色的鹈鹕与自行车 (黄金、绿松石、青金石)
  drawDefaultPelican(p, rig, {
    bodyColor: [248, 244, 235], // 洁白朱鹮圣鸟身躯
    beakColor: [225, 175, 45],  // 法老黄金嘴
    pouchColor: [180, 60, 45],  // 朱砂喉囊
    frameColor: [35, 115, 145], // 埃及蓝战车骨架
    wheelColor: [215, 165, 40], // 黄金辐条车轮
    eyeColor: [20, 20, 25]
  });

  // 鹈鹕胸前的黄金圣甲虫项圈
  p.fill(218, 175, 45);
  p.noStroke();
  p.ellipse(rig.chest.x + 2, rig.chest.y - 2, 16, 12);
  p.fill(40, 140, 160);
  p.ellipse(rig.chest.x + 2, rig.chest.y - 2, 8, 6);

  p.pop();
}
