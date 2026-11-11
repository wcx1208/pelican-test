// src/scenes/s17_chat_window.js
// 17. 早期聊天窗口 (2000s，复古即时通讯软件)
// 虚构聊天窗，发来一张低帧256色动图；强拍“窗口抖动”踩点，顶部显示“对方正在输入...”

import { computePelicanRig, drawDefaultPelican } from '../rig/rig.js';
import { quantizeTime } from '../beat/beat.js';
import { drawFilmGrain } from '../kit/kit.js';

export function render(p, localT, beat, camera) {
  p.push();

  // 1. 2000年代桌面壁纸 (Windows 经典渐变深青蓝)
  p.noStroke();
  p.fill(0, 78, 152);
  p.rect(0, 0, 1000, 1000);

  // 2. 强拍窗口抖动 (Nudge 震屏效果，2.0s ~ 2.6s)
  let nudgeX = 0;
  let nudgeY = 0;
  if (localT >= 2.0 && localT <= 2.6) {
    nudgeX = (Math.sin(localT * 85) * 14);
    nudgeY = (Math.cos(localT * 75) * 12);
  }

  p.push();
  p.translate(nudgeX, nudgeY);

  // 3. 复古聊天窗口外框 (Luna / 经典浅灰立体边框)
  const winX = 80;
  const winY = 60;
  const winW = 840;
  const winH = 880;

  // 窗口深灰立体阴影
  p.fill(0, 0, 0, 80);
  p.rect(winX + 10, winY + 10, winW, winH, 8);

  // 窗口主体面板
  p.fill(236, 233, 216); // 经典 Windows 经典灰
  p.stroke(0, 85, 225);
  p.strokeWeight(3);
  p.rect(winX, winY, winW, winH, 6);

  // 蓝色标题栏 (渐变至浅蓝)
  p.fill(0, 85, 225);
  p.noStroke();
  p.rect(winX + 3, winY + 3, winW - 6, 38, 4, 4, 0, 0);

  // 标题栏文字与状态
  p.fill(255, 255, 255);
  p.textAlign(p.LEFT, p.CENTER);
  p.textSize(16);
  p.textStyle(p.BOLD);
  p.text('PelicanMessenger 2003 - [Pelican_Rider] (在线)', winX + 16, winY + 22);

  // 右上角经典关闭三按钮
  p.fill(225, 80, 70);
  p.rect(winX + winW - 38, winY + 8, 28, 24, 3);
  p.fill(255, 255, 255);
  p.textAlign(p.CENTER, p.CENTER);
  p.textSize(14);
  p.text('×', winX + winW - 24, winY + 19);

  // 聊天消息记录区域 (纯白底色)
  const chatBoxX = winX + 18;
  const chatBoxY = winY + 52;
  const chatBoxW = winW - 36;
  const chatBoxH = winH - 240;

  p.fill(255, 255, 255);
  p.stroke(120, 120, 120);
  p.strokeWeight(1.5);
  p.rect(chatBoxX, chatBoxY, chatBoxW, chatBoxH);

  // 顶部“对方正在输入...”提示条
  p.fill(80, 80, 80);
  p.noStroke();
  p.textAlign(p.LEFT, p.TOP);
  p.textSize(13);
  p.textStyle(p.ITALIC);
  const dots = '.'.repeat(1 + (Math.floor(localT * 4) % 3));
  p.text(`对方正在输入${dots}`, chatBoxX + 16, chatBoxY + 12);

  // 聊天气泡：发来一张动图
  p.fill(240, 244, 250);
  p.stroke(180, 200, 230);
  p.strokeWeight(1);
  p.rect(chatBoxX + 16, chatBoxY + 36, chatBoxW - 32, chatBoxH - 56, 6);

  // 动图上方标签：“pelican_bike_loop.gif (256色, 12fps)”
  p.fill(50, 70, 120);
  p.noStroke();
  p.textStyle(p.NORMAL);
  p.textSize(12);
  p.text('pelican_bike_loop.gif [已接收完成 - 点击查看原图]', chatBoxX + 32, chatBoxY + 48);

  // 4. 气泡内嵌的 256色低帧率鹈鹕骑车动图 (时间量化至 10fps，画面带抖动色块)
  p.push();
  const gifAreaX = chatBoxX + 32;
  const gifAreaY = chatBoxY + 75;
  const gifAreaW = chatBoxW - 64;
  const gifAreaH = chatBoxH - 110;

  // 动图背景 (古早网页网格灰)
  p.fill(210, 218, 226);
  p.stroke(160, 170, 185);
  p.strokeWeight(2);
  p.rect(gifAreaX, gifAreaY, gifAreaW, gifAreaH);

  // 动图内部的地面
  p.stroke(100, 110, 125);
  p.strokeWeight(4);
  p.line(gifAreaX, gifAreaY + gifAreaH - 40, gifAreaX + gifAreaW, gifAreaY + gifAreaH - 40);

  // 量化时间 (10fps 顿挫感)
  const quantizedT = quantizeTime(localT, 10);
  const pelicanX = gifAreaX + 60 + (localT / 6.0) * (gifAreaW - 120);
  const groundY = gifAreaY + gifAreaH - 45;

  const rig = computePelicanRig(quantizedT, {
    x: pelicanX,
    y: groundY,
    scale: 0.82
  });

  drawDefaultPelican(p, rig, {
    bodyColor: [240, 245, 255],
    beakColor: [245, 170, 50],
    pouchColor: [220, 100, 50],
    frameColor: [0, 85, 200],  // 经典 IM 蓝
    wheelColor: [40, 40, 45],
    eyeColor: [15, 15, 20]
  });

  // 256 色抖动噪点颗粒 (Dithering)
  drawFilmGrain(p, 1000, 1000, 0.03, quantizedT);

  p.pop();

  // 底部输入框与工具栏
  const inputY = winY + winH - 170;
  p.fill(255, 255, 255);
  p.stroke(140, 140, 140);
  p.strokeWeight(1);
  p.rect(winX + 18, inputY, winW - 36, 105);

  // 发送按钮
  p.fill(235, 235, 235);
  p.rect(winX + winW - 110, inputY + 68, 80, 28, 3);
  p.fill(40, 40, 40);
  p.textAlign(p.CENTER, p.CENTER);
  p.textSize(13);
  p.text('发送(S)', winX + winW - 70, inputY + 82);

  p.pop(); // pop 抖动

  p.pop();
}
