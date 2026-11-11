// src/scenes/s11_ukiyo_e.js
// 11. 浮世绘 (1830s，歌川广重东海道五十三次风格)
// 木版水印套色，骑行在东海道驿道上，富士山与路边松林

import { computePelicanRig, drawDefaultPelican } from '../rig/rig.js';
import { drawParchmentBackground } from '../kit/kit.js';

export function render(p, localT, beat, camera) {
  p.push();

  // 1. 和纸木刻版画底色 (Washi 淡淡木质米黄)
  drawParchmentBackground(p, 1000, 1000, [246, 238, 220], 1830);

  // 浮世绘经典渐变天空 (Bokashi 一文字天晕染，靛蓝向白过渡)
  p.noStroke();
  p.fill(35, 75, 130);
  p.rect(0, 0, 1000, 140);
  p.fill(70, 115, 170, 180);
  p.rect(0, 140, 1000, 100);

  // 2. 远景神圣富士山 (木版套印深红赭石赤富士或雪峰)
  p.fill(245, 245, 250); // 白雪峰顶
  p.beginShape();
  p.vertex(650, 220);
  p.vertex(720, 290);
  p.vertex(580, 290);
  p.endShape(p.CLOSE);

  p.fill(40, 65, 110); // 富士山靛青山体
  p.beginShape();
  p.vertex(650, 220);
  p.vertex(840, 520);
  p.vertex(460, 520);
  p.endShape(p.CLOSE);

  // 3. 东海道沿途扭曲黑松 (广重标志性横向伸展平顶松树)
  const drawUkiyoPine = (px, py, s = 1.0) => {
    p.push();
    p.translate(px, py);
    p.scale(s);
    p.stroke(40, 30, 25);
    p.strokeWeight(16);
    p.noFill();
    p.bezier(0, 200, 20, 120, -40, 60, -20, 0);
    p.bezier(-20, 0, 0, -50, 80, -70, 120, -90);

    // 扁平层状翠绿松云
    p.noStroke();
    p.fill(35, 85, 65);
    p.ellipse(120, -90, 140, 45);
    p.ellipse(60, -60, 110, 35);
    p.ellipse(-20, -10, 90, 30);
    p.pop();
  };

  drawUkiyoPine(140, 500, 0.95);
  drawUkiyoPine(880, 520, 0.85);

  // 4. 东海道驿站戴大斗笠的行脚僧与挑夫 (停下惊叹围观)
  const drawTraveler = (tx, ty) => {
    p.push();
    p.translate(tx, ty);
    // 大竹笠
    p.fill(215, 185, 120);
    p.stroke(60, 45, 30);
    p.strokeWeight(2);
    p.triangle(-30, -35, 30, -35, 0, -55);
    // 和服长袍
    p.fill(50, 90, 140); // 普鲁士蓝
    p.noStroke();
    p.triangle(0, -30, -18, 60, 18, 60);
    // 草鞋腿
    p.stroke(60, 45, 30);
    p.strokeWeight(4);
    p.line(-8, 60, -8, 85);
    p.line(8, 60, 8, 85);
    p.pop();
  };

  drawTraveler(240, 610);

  // 5. 鹈鹕与自行车 (浮世绘木版套色线描)
  const pelicanX = 220 + (localT / 6.0) * 560;
  const groundY = 705;

  const rig = computePelicanRig(localT, {
    x: pelicanX,
    y: groundY,
    scale: 1.05
  });

  // 戴着一顶小巧玲珑日式竹斗笠的鹈鹕！
  drawDefaultPelican(p, rig, {
    bodyColor: [250, 248, 242],
    beakColor: [230, 155, 45],
    pouchColor: [215, 95, 60],
    frameColor: [35, 55, 85],   // 普鲁士蓝车架
    wheelColor: [45, 35, 30],
    eyeColor: [20, 20, 20]
  });

  // 鹈鹕头上系着草绳小竹斗笠
  p.push();
  p.translate(rig.head.x, rig.head.y - 12);
  p.fill(215, 185, 120);
  p.stroke(60, 45, 30);
  p.strokeWeight(2);
  p.triangle(-20, 0, 20, 0, 0, -16);
  // 系绳
  p.stroke(180, 50, 40);
  p.line(0, 0, 4, 16);
  p.pop();

  // 驿道土路地平线
  p.stroke(150, 110, 75);
  p.strokeWeight(12);
  p.line(0, 785, 1000, 785);

  // 右侧竖向浮世绘红白题签落款：“東海道 鵜鶘道中”
  p.fill(205, 50, 40);
  p.noStroke();
  p.rect(880, 80, 36, 120, 4);
  p.fill(255, 255, 255);
  p.textAlign(p.CENTER, p.CENTER);
  p.textSize(16);
  p.text('東\n海\n道', 898, 140);

  p.pop();
}
