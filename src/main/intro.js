// src/main/intro.js
// 开场 Intro: 一本正经地胡说 (约5秒 = 2.5小节)
// 纸张质感背景，衬线字体，素描摹本插图，两句递进纪录片字幕

import { drawParchmentBackground } from '../kit/kit.js';
import { computePelicanRig, drawDefaultPelican } from '../rig/rig.js';

export function renderIntro(p, localT, beat) {
  p.push();

  // 1. 古典泛黄纪录片羊皮纸底色
  drawParchmentBackground(p, 1920, 1080, [244, 238, 224], 101);

  // 纸张四周古典装帧极细双边框
  p.noFill();
  p.stroke(90, 80, 70, 160);
  p.strokeWeight(2);
  p.rect(60, 60, 1800, 960);
  p.strokeWeight(1);
  p.rect(68, 68, 1784, 944);

  // 2. 画面右上角：素描插图与图注“图一鹈鹕骑行图（摹本）”
  p.push();
  p.translate(1320, 180);
  // 素描框
  p.fill(250, 248, 242);
  p.stroke(140, 130, 120);
  p.strokeWeight(1.5);
  p.rect(0, 0, 440, 360, 2);

  // 素描小画中的鹈鹕自行车
  const sketchRig = computePelicanRig(0.25, {
    x: 210,
    y: 260,
    scale: 0.65
  });

  drawDefaultPelican(p, sketchRig, {
    bodyColor: [240, 238, 230],
    beakColor: [180, 160, 140],
    pouchColor: [160, 140, 120],
    frameColor: [60, 55, 50],
    wheelColor: [70, 65, 60],
    eyeColor: [30, 30, 30]
  });

  // 图注
  p.fill(60, 50, 45);
  p.noStroke();
  p.textAlign(p.CENTER, p.TOP);
  p.textSize(16);
  p.textStyle(p.NORMAL);
  p.text('图一 鹈鹕骑行图（摹本）', 220, 325);
  p.pop();

  // 3. 两条字幕快速淡入与出处
  // 字幕一：0.8s 淡入
  const alpha1 = p.map(localT, 0.8, 1.8, 0, 255);
  const clampedAlpha1 = Math.max(0, Math.min(255, alpha1));

  p.fill(28, 24, 20, clampedAlpha1);
  p.noStroke();
  p.textAlign(p.LEFT, p.CENTER);
  p.textSize(46);
  p.textStyle(p.BOLD);
  p.text('「人类自古以来就痴迷于画鹈鹕骑自行车。」', 180, 440);

  // 字幕二：2.6s 淡入，精准落在第 2.5 小节强拍 (5.0s)
  const alpha2 = p.map(localT, 2.6, 3.6, 0, 255);
  const clampedAlpha2 = Math.max(0, Math.min(255, alpha2));

  p.fill(28, 24, 20, clampedAlpha2);
  p.textSize(46);
  p.text('「早在自行车被发明之前。」', 180, 530);

  // 小字出处：3.8s 淡入
  const alphaSource = p.map(localT, 3.8, 4.6, 0, 210);
  const clampedAlphaSource = Math.max(0, Math.min(210, alphaSource));

  p.fill(90, 80, 70, clampedAlphaSource);
  p.textSize(22);
  p.textStyle(p.NORMAL);
  p.text('——《鹈鹕骑行艺术通史》，卷一（虚构书名）', 520, 630);

  p.pop();
}
