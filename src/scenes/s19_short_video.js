// src/scenes/s19_short_video.js
// 19. 竖屏短视频 (2020s，9:16移动流媒体界面)
// 画面突然收窄成9:16竖屏，两侧黑边，虚构App界面，点赞和弹幕往上飘，进度条走完正好过框

import { computePelicanRig, drawDefaultPelican } from '../rig/rig.js';

export function render(p, localT, beat, camera) {
  p.push();

  // 1. 全屏黑色暗底 (两侧黑边)
  p.noStroke();
  p.fill(10, 10, 12);
  p.rect(0, 0, 1000, 1000);

  // 2. 9:16 竖屏居中视口 (宽度 562.5，高度 1000，居中 X 在 218.75)
  const phoneW = 560;
  const phoneX = (1000 - phoneW) / 2; // 220
  const phoneY = 0;
  const phoneH = 1000;

  // 视口背景 (深暗灰都市街道色)
  p.fill(24, 28, 36);
  p.rect(phoneX, phoneY, phoneW, phoneH);

  // 两侧暗黑遮罩加强反差
  p.fill(0, 0, 0, 245);
  p.rect(0, 0, phoneX, 1000);
  p.rect(phoneX + phoneW, 0, phoneX, 1000);

  // 3. 竖屏视口内的街景地面
  p.stroke(60, 65, 75);
  p.strokeWeight(6);
  p.line(phoneX, 740, phoneX + phoneW, 740);

  // 4. 鹈鹕与自行车 (在 9:16 视口内骑行)
  const progress = localT / 6.0;
  const pelicanX = phoneX + 80 + progress * (phoneW - 160);
  const groundY = 735;

  const rig = computePelicanRig(localT, {
    x: pelicanX,
    y: groundY,
    scale: 0.95
  });

  drawDefaultPelican(p, rig, {
    bodyColor: [250, 250, 255],
    beakColor: [255, 170, 45],
    pouchColor: [240, 95, 60],
    frameColor: [30, 30, 35],
    wheelColor: [45, 45, 50],
    eyeColor: [10, 10, 10]
  });

  // 5. 虚构短视频 App 界面浮层 (UI Overlays)
  // (1) 右侧悬浮交互图标列 (Like, Comment, Favorite, Share, Disc)
  const uiRightX = phoneX + phoneW - 48;

  // 点赞红心 (加心动缩放动画)
  const heartScale = 1.0 + Math.sin(localT * 12) * 0.15;
  p.push();
  p.translate(uiRightX, 480);
  p.scale(heartScale);
  p.fill(254, 44, 85); // 经典短视频点赞红
  p.noStroke();
  p.ellipse(-7, -5, 16, 16);
  p.ellipse(7, -5, 16, 16);
  p.triangle(-15, -2, 15, -2, 0, 15);
  p.pop();

  p.fill(255, 255, 255);
  p.textAlign(p.CENTER, p.TOP);
  p.textSize(12);
  p.textStyle(p.BOLD);
  p.text('99.8w', uiRightX, 502);

  // 评论气泡
  p.fill(255, 255, 255, 220);
  p.ellipse(uiRightX, 550, 28, 24);
  p.triangle(uiRightX - 6, 560, uiRightX - 16, 570, uiRightX, 562);
  p.fill(255, 255, 255);
  p.text('1.4w', uiRightX, 570);

  // 收藏与转发
  p.fill(255, 215, 0); // 黄金星
  p.ellipse(uiRightX, 615, 22, 22);
  p.fill(255, 255, 255);
  p.text('4.2w', uiRightX, 632);

  // 旋转音乐黑胶唱片
  p.push();
  p.translate(uiRightX, 710);
  p.rotate(localT * 4);
  p.fill(30, 30, 30);
  p.ellipse(0, 0, 38, 38);
  p.fill(254, 44, 85);
  p.ellipse(0, 0, 16, 16);
  p.pop();

  // (2) 向上升腾飘散的点赞小红心
  for (let h = 0; h < 6; h++) {
    const heartT = (localT * 1.5 + h * 0.4) % 2.5;
    const hy = 700 - heartT * 220;
    const hx = uiRightX - 25 + Math.sin(heartT * 5 + h) * 18;
    const hAlpha = p.map(heartT, 0, 2.5, 240, 0);
    p.fill(254, 44, 85, hAlpha);
    p.ellipse(hx - 4, hy, 10, 10);
    p.ellipse(hx + 4, hy, 10, 10);
    p.triangle(hx - 8, hy + 2, hx + 8, hy + 2, hx, hy + 12);
  }

  // (3) 弹幕评论向上漂移 (幽默弹幕)
  const danmakuList = [
    '这只鸟骑得比我室友都稳...',
    '严查！鹈鹕是不是考过科目二',
    '从公元前4000年骑到2026年',
    '谁给大嘴鸟买的公路车？？'
  ];
  p.textAlign(p.LEFT, p.CENTER);
  p.textSize(13);
  p.textStyle(p.NORMAL);
  for (let d = 0; d < danmakuList.length; d++) {
    const dy = 810 - d * 26;
    p.fill(0, 0, 0, 140);
    p.rect(phoneX + 20, dy - 11, 230, 22, 11);
    p.fill(255, 255, 255, 230);
    p.text(`@网友${d + 1}: ${danmakuList[d]}`, phoneX + 30, dy);
  }

  // (4) 底部作者文案与 BGM 音乐滚动条
  p.fill(255, 255, 255);
  p.textStyle(p.BOLD);
  p.textSize(16);
  p.text('@鹈鹕本鸟', phoneX + 24, 875);
  p.textStyle(p.NORMAL);
  p.textSize(13);
  p.text('人类自古以来就痴迷于画我骑车 #鹈鹕测试 #全网无代餐', phoneX + 24, 898);

  // (5) 底部播放进度条 (走完时正好过画框)
  p.fill(120, 120, 120, 120);
  p.rect(phoneX, 992, phoneW, 4);
  p.fill(255, 255, 255);
  p.rect(phoneX, 992, phoneW * progress, 4); // 严格随 localT 进度走满

  p.pop();
}
