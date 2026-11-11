// src/scenes/s01_sahara.js
// 1. 撒哈拉岩画 (约前4000，塔西里风格)
// 赭石颜料画在岩壁上，牧人和牛群停下来围观

import { computePelicanRig, drawDefaultPelican } from '../rig/rig.js';
import { pseudoNoise } from '../kit/kit.js';

export function render(p, localT, beat, camera) {
  p.push();

  // 1. 岩石壁画底材 (深红赭石、砂岩斑驳纹理)
  p.noStroke();
  p.fill(168, 86, 48); // 赭石主底色
  p.rect(0, 0, 1000, 1000);

  // 粗糙岩壁颗粒与风蚀裂痕
  p.fill(138, 62, 32, 120);
  for (let i = 0; i < 40; i++) {
    const rx = pseudoNoise(i * 17) * 1000;
    const ry = pseudoNoise(i * 31) * 1000;
    const rw = 40 + pseudoNoise(i * 11) * 160;
    const rh = 10 + pseudoNoise(i * 7) * 40;
    p.ellipse(rx, ry, rw, rh);
  }

  // 地面起伏岩脊线
  p.stroke(92, 38, 20);
  p.strokeWeight(8);
  p.noFill();
  p.beginShape();
  p.vertex(0, 720);
  p.vertex(300, 700);
  p.vertex(650, 730);
  p.vertex(1000, 710);
  p.endShape();

  // 2. 围观的长角牛群 (塔西里岩画典型双弧牛角与红白陶色块)
  const drawCattle = (cx, cy, scale = 1.0, isSurprised = false) => {
    p.push();
    p.translate(cx, cy);
    p.scale(scale);

    // 身体
    p.noStroke();
    p.fill(210, 180, 140); // 白赭色涂料
    p.ellipse(0, 0, 110, 60);

    // 四肢 (纤细线条，停止行走驻足围观)
    p.stroke(110, 45, 25);
    p.strokeWeight(5);
    p.line(-35, 15, -40, 70);
    p.line(-15, 18, -12, 70);
    p.line(15, 18, 18, 70);
    p.line(35, 15, 38, 70);

    // 头部转过来紧盯着路中间
    const headAngle = isSurprised ? -0.25 : 0.05;
    p.push();
    p.translate(-55, -15);
    p.rotate(headAngle);
    p.noStroke();
    p.fill(210, 180, 140);
    p.triangle(0, -10, -35, 8, 10, 15);

    // 标志性巨大抛物线牛角
    p.noFill();
    p.stroke(80, 30, 15);
    p.strokeWeight(4.5);
    p.bezier(0, -5, -10, -55, 30, -75, 45, -85);
    p.bezier(-5, -5, -20, -50, 15, -70, 30, -80);
    p.pop();

    p.pop();
  };

  // 3. 停下脚步揉眼睛围观的撒哈拉牧人 (火柴人动态与羽毛头饰)
  const drawHunter = (hx, hy, scale = 1.0) => {
    p.push();
    p.translate(hx, hy);
    p.scale(scale);
    p.stroke(80, 30, 15);
    p.strokeWeight(6);
    p.strokeCap(p.ROUND);

    // 躯干与头部
    p.line(0, 0, 0, 70);
    p.fill(80, 30, 15);
    p.noStroke();
    p.ellipse(0, -16, 20, 20); // 头

    // 头顶插着的三根原始羽毛
    p.stroke(80, 30, 15);
    p.strokeWeight(3);
    p.line(0, -22, -8, -42);
    p.line(0, -22, 0, -45);
    p.line(0, -22, 8, -40);

    // 手持弓箭并目瞪口呆举手指向鹈鹕
    p.strokeWeight(5);
    p.line(0, 20, 28, 5);
    p.line(28, 5, 45, -10); // 手指着自行车
    p.line(0, 20, -25, 35); // 另一只手握弓

    // 双腿停立
    p.line(0, 70, -18, 130);
    p.line(0, 70, 22, 130);
    p.pop();
  };

  // 背景牛群与牧人排列
  drawCattle(220, 580, 0.95, true);
  drawCattle(420, 595, 0.82, false);
  drawHunter(110, 540, 0.95);
  drawHunter(860, 550, 0.88);

  // 4. 鹈鹕与自行车 (塔西里岩画风格：白陶泥与深红赭石矿物颜料纯手绘线条)
  // localT: 0~2s 进场, 2~4s 牧人看呆, 4~6s 穿向下一画框
  const pelicanX = 200 + (localT / 6.0) * 600;
  const groundY = 705;

  const rig = computePelicanRig(localT, {
    x: pelicanX,
    y: groundY,
    scale: 1.05
  });

  drawDefaultPelican(p, rig, {
    bodyColor: [242, 230, 210], // 白垩土岩画质感
    beakColor: [215, 125, 45],  // 赭黄矿物
    pouchColor: [185, 80, 40],  // 深朱砂
    frameColor: [60, 25, 15],   // 黑褐色矿石
    wheelColor: [75, 30, 18],
    eyeColor: [40, 15, 10]
  });

  // 岩壁上的早期手印签名 (岩画喷印 Stencil Hand)
  p.noStroke();
  p.fill(225, 200, 175, 85);
  p.ellipse(820, 240, 45, 55);
  for (let f = 0; f < 5; f++) {
    p.rect(805 + f * 7, 195 - Math.abs(f - 2) * 5, 5, 25, 2);
  }

  p.pop();
}
