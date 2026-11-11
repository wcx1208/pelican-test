// src/scenes/s16_pixel_game.js
// 16. 8-bit 像素游戏 (1980s，FC 红白机像素风格)
// 有限调色板，纯正网格像素块化绘制，像素鹈鹕骑车跳跃顶砖，吃到金币弹出绿色“1UP”

import { quantizeTime } from '../beat/beat.js';

export function render(p, localT, beat, camera) {
  p.push();

  // 1. FC 经典 8-bit 有限调色板 (NES Palette)
  const NES_SKY = [92, 148, 252];     // 经典马里奥蓝天
  const NES_BRICK = [200, 76, 12];    // 砖红色
  const NES_GROUND = [0, 168, 0];     // 草地翠绿
  const NES_COIN = [252, 188, 60];    // 耀眼金币黄
  const NES_WHITE = [255, 255, 255];
  const NES_BLACK = [0, 0, 0];
  const NES_GREEN_1UP = [0, 228, 0];

  // 2. 时间量化 (每秒 10 帧更新，保留原汁原味红白机顿挫)
  const qT = quantizeTime(localT, 10);

  // 基础背景
  p.noStroke();
  p.fill(NES_SKY[0], NES_SKY[1], NES_SKY[2]);
  p.rect(0, 0, 1000, 1000);

  // 像素块绘制辅助函数 (基于 8x8 像素网格)
  const P = 6; // 单个像素点大小 6x6
  const drawPixRect = (px, py, pw, ph, col) => {
    p.fill(col[0], col[1], col[2]);
    p.rect(Math.floor(px / P) * P, Math.floor(py / P) * P, pw * P, ph * P);
  };

  // 3. 经典 FC 像素云朵与山丘
  const drawPixelCloud = (cx, cy) => {
    p.fill(NES_WHITE[0], NES_WHITE[1], NES_WHITE[2]);
    drawPixRect(cx, cy, 14, 4, NES_WHITE);
    drawPixRect(cx + 4 * P, cy - 3 * P, 8, 3, NES_WHITE);
    drawPixRect(cx - 3 * P, cy + P, 20, 2, NES_WHITE);
  };

  drawPixelCloud(160, 240);
  drawPixelCloud(680, 200);

  // 4. 8-bit HUD 计分栏
  p.fill(NES_WHITE[0], NES_WHITE[1], NES_WHITE[2]);
  p.noStroke();
  p.textSize(22);
  p.textStyle(p.BOLD);
  p.textAlign(p.LEFT, p.TOP);
  p.text('PELICAN\n064820', 80, 40);
  p.text('COINS\n* 42', 380, 40);
  p.text('WORLD\n 1-1', 650, 40);
  p.text('TIME\n 240', 840, 40);

  // 5. 地面砖块与跳跃坑洞
  // 地面在 Y = 720
  // 中间 420 ~ 580 处有一个悬崖断层坑洞！
  const groundY = 720;
  for (let gx = 0; gx < 1000; gx += 32) {
    if (gx >= 420 && gx <= 560) continue; // 坑洞
    // 表面草皮绿砖
    drawPixRect(gx, groundY, 5, 2, NES_GROUND);
    // 泥土与砖石底衬
    drawPixRect(gx, groundY + 12, 5, 10, NES_BRICK);
    drawPixRect(gx, groundY + 72, 5, 28, [128, 48, 8]);
  }

  // 6. 问号箱与砖块 (位于 490, 450)
  const isHit = qT >= 2.4;
  const boxY = isHit ? 440 : 450;
  drawPixRect(480, boxY, 8, 8, isHit ? [160, 110, 60] : NES_COIN);
  drawPixRect(486, boxY + 6, 6, 6, isHit ? [120, 80, 40] : [216, 40, 0]);
  if (!isHit) {
    // 经典白色问号
    p.fill(NES_WHITE[0], NES_WHITE[1], NES_WHITE[2]);
    p.textSize(28);
    p.textAlign(p.CENTER, p.CENTER);
    p.text('?', 504, boxY + 24);
  } else {
    // 顶出旋转金币与“1UP”
    const coinY = Math.max(340, 440 - (qT - 2.4) * 160);
    drawPixRect(495, coinY, 5, 8, NES_COIN);
    // 绿色像素 1UP 弹出！
    p.fill(NES_GREEN_1UP[0], NES_GREEN_1UP[1], NES_GREEN_1UP[2]);
    p.textSize(32);
    p.textAlign(p.CENTER, p.BOTTOM);
    p.text('1UP', 504, coinY - 12);
  }

  // 7. 纯正 8-bit 像素鹈鹕与像素自行车！
  // 运动轨迹：2.0s ~ 3.5s 时大跳跃飞跃坑洞并顶砖！
  const pelicanX = 200 + (localT / 6.0) * 600;
  let jumpY = 0;
  if (localT >= 1.8 && localT <= 3.8) {
    const jumpProgress = (localT - 1.8) / 2.0;
    jumpY = -Math.sin(jumpProgress * Math.PI) * 140; // 腾空跃起 140px！
  }

  const px = Math.floor(pelicanX / P) * P;
  const py = Math.floor((groundY + jumpY) / P) * P;

  // 踏板角度 (量化旋转)
  const crankStep = Math.floor(qT * 8) % 4;
  const legDy = [0, 8, 16, 8][crankStep];

  p.push();
  p.translate(px, py);

  // (1) 纯像素车轮 (前后轮，像素十字圈)
  const drawPixWheel = (wx, wy) => {
    drawPixRect(wx - 24, wy - 30, 8, 10, NES_BLACK);
    drawPixRect(wx - 30, wy - 24, 10, 8, NES_BLACK);
    drawPixRect(wx - 18, wy - 18, 6, 6, NES_WHITE);
    drawPixRect(wx - 6, wy - 6, 2, 2, [216, 40, 0]);
  };
  drawPixWheel(-60, 0); // 后轮
  drawPixWheel(60, 0);  // 前轮

  // (2) 纯像素车架 (8-bit 经典红色管件，纯像素块拼接！)
  drawPixRect(-45, -12, 15, 2, [216, 40, 0]);
  drawPixRect(-12, -45, 2, 12, [216, 40, 0]);
  drawPixRect(-45, -12, 12, 12, [216, 40, 0]);
  drawPixRect(-12, -45, 12, 12, [216, 40, 0]);
  drawPixRect(35, -45, 3, 15, [216, 40, 0]);
  drawPixRect(32, -55, 6, 2, NES_BLACK); // 车把
  drawPixRect(-20, -50, 6, 2, NES_BLACK); // 车座

  // (3) 像素鹈鹕躯体 (白色方块堆叠)
  drawPixRect(-20, -75, 8, 8, NES_WHITE);
  drawPixRect(-8, -65, 4, 5, NES_WHITE);

  // 像素长颈
  drawPixRect(-4, -95, 3, 8, NES_WHITE);

  // 像素头部
  drawPixRect(0, -105, 5, 4, NES_WHITE);
  // 眼睛
  drawPixRect(2, -102, 2, 2, NES_BLACK);

  // 像素大嘴与喉囊 (亮黄与朱红)
  drawPixRect(10, -103, 9, 3, NES_COIN);
  drawPixRect(10, -97, 8, 4, [230, 110, 30]);

  // (4) 像素大腿与脚踏
  drawPixRect(-14, -50 + legDy, 3, 6, NES_COIN);
  drawPixRect(-14, -40 + legDy, 4, 2, NES_BLACK);

  p.pop();

  p.pop();
}
