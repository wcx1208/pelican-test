// src/main/outro.js
// 尾声 Outro: 新闻发布会 (12秒 = 6小节)
// 7x3展墙阵列，前20格定格各年代，第21格空席位，闪光灯，最后一拍鹈鹕掠过留铃声

import { SCENE_CONFIGS } from '../beat/beat.js';
import { SCENE_RENDERERS } from '../scenes/index.js';
import { computePelicanRig, drawDefaultPelican } from '../rig/rig.js';

export function renderOutro(p, localT, beat) {
  p.push();

  // 1. 展厅冷色高雅灰调背景
  p.noStroke();
  p.fill(18, 20, 24);
  p.rect(0, 0, 1920, 1080);

  // 2. 镜头运镜计算 (4.0s ~ 8.0s 缓缓推向第21格)
  let zoom = 1.0;
  let targetX = 960;
  let targetY = 460;

  // 第21格 (row 2, col 6，即第3行第7列) 在7x3全景中的中心坐标
  // 7x3 展墙范围：宽 1728 (90% of 1920)，起始 X = 96, 起始 Y = 60
  // 每格宽约 230，高约 230，间距 16
  const cellW = 230;
  const cellH = 230;
  const gap = 16;
  const wallStartX = 96 + 12;
  const wallStartY = 60;

  const cell21CenterX = wallStartX + 6 * (cellW + gap) + cellW / 2; // col 6
  const cell21CenterY = wallStartY + 2 * (cellH + gap) + cellH / 2; // row 2

  if (localT > 3.8 && localT <= 8.5) {
    const pushProg = Math.min(1.0, (localT - 3.8) / 4.2);
    const easePush = pushProg * pushProg * (3 - 2 * pushProg);
    zoom = p.lerp(1.0, 3.4, easePush);
    targetX = p.lerp(960, cell21CenterX, easePush);
    targetY = p.lerp(460, cell21CenterY, easePush);
  } else if (localT > 8.5) {
    zoom = 3.4;
    targetX = cell21CenterX;
    targetY = cell21CenterY;
  }

  p.translate(960, 460);
  p.scale(zoom);
  p.translate(-targetX, -targetY);

  // 3. 绘制 7x3 展墙 (共21格)
  for (let idx = 0; idx < 21; idx++) {
    const col = idx % 7;
    const row = Math.floor(idx / 7);
    const cx = wallStartX + col * (cellW + gap);
    const cy = wallStartY + row * (cellH + gap);

    p.push();
    p.translate(cx, cy);

    if (idx < 20) {
      // 前 20 格：定格各时代的鹈鹕
      p.stroke(60, 65, 75);
      p.strokeWeight(3);
      p.fill(28, 30, 36);
      p.rect(0, 0, cellW, cellH, 4);

      // 缩放绘制各时代场景定格 (调用对应场景在 localT=3.0s 的定格画面)
      p.push();
      // 裁剪到格内
      p.scale(cellW / 1000);
      try {
        SCENE_RENDERERS[idx](p, 3.0, beat, null);
      } catch (e) {
        // 回退绘制
        p.fill(100, 100, 100);
        p.rect(0, 0, 1000, 1000);
      }
      p.pop();

      // 年代小字
      p.fill(240, 240, 240, 200);
      p.noStroke();
      p.textAlign(p.LEFT, p.BOTTOM);
      p.textSize(10);
      p.text(`${SCENE_CONFIGS[idx].period}`, 6, cellH - 4);
    } else {
      // 第 21 格：空的新闻发布会席位！
      p.stroke(218, 165, 32); // 尊贵金边
      p.strokeWeight(4);
      p.fill(38, 42, 52);
      p.rect(0, 0, cellW, cellH, 4);

      // 发布会蓝色背景幕布
      p.fill(20, 50, 95);
      p.noStroke();
      p.rect(4, 4, cellW - 8, cellH - 8);

      // 席位后方的一把空皮椅 (深黑靠背)
      p.fill(25, 25, 28);
      p.rect(cellW / 2 - 30, 60, 60, 85, 8);
      p.fill(40, 40, 45);
      p.rect(cellW / 2 - 25, 65, 50, 75, 4);

      // 最后一拍 (10.4s ~ 11.6s)：鹈鹕骑车从席位后方一闪而过！
      if (localT >= 10.2 && localT <= 11.8) {
        const flyT = (localT - 10.2) / 1.6;
        const flyPelicanX = p.lerp(-80, cellW + 120, flyT);
        const fastRig = computePelicanRig(localT * 3, {
          x: flyPelicanX,
          y: 125,
          scale: 0.38
        });
        drawDefaultPelican(p, fastRig, {
          bodyColor: [255, 255, 255],
          beakColor: [255, 175, 40],
          pouchColor: [255, 95, 65],
          frameColor: [30, 30, 35],
          wheelColor: [50, 50, 50]
        });
      }

      // 发布会主席台长桌 (铺红色桌布)
      p.fill(168, 42, 35);
      p.rect(15, 135, cellW - 30, 85, 2);

      // 一排黑色专业麦克风 (不带任何真实媒体标志)
      p.stroke(20, 20, 22);
      p.strokeWeight(2.5);
      for (let m = 0; m < 5; m++) {
        const mx = 45 + m * 35;
        p.line(mx, 142, mx + (m - 2) * 2, 115);
        p.fill(40, 40, 40);
        p.noStroke();
        p.ellipse(mx + (m - 2) * 2, 113, 8, 8);
      }

      // 红色台签席卡：“鹈鹕（本人）”
      p.fill(245, 245, 245);
      p.stroke(180, 140, 40);
      p.strokeWeight(1);
      p.rect(cellW / 2 - 45, 155, 90, 30, 2);
      p.fill(20, 20, 20);
      p.noStroke();
      p.textAlign(p.CENTER, p.CENTER);
      p.textSize(12);
      p.textStyle(p.BOLD);
      p.text('鹈鹕 (本人)', cellW / 2, 170);

      // 闪光灯特效 (4.5s, 5.5s, 6.5s, 7.5s 强拍上咔嚓几下照亮空椅)
      for (let flashTime of [4.5, 5.5, 6.5, 7.5]) {
        if (localT >= flashTime && localT <= flashTime + 0.18) {
          p.fill(255, 255, 255, 210);
          p.rect(0, 0, cellW, cellH);
        }
      }
    }

    p.pop();
  }

  p.pop(); // 恢复相机

  // 4. 底部字幕 (居中清晰大字)
  p.push();
  p.textAlign(p.CENTER, p.CENTER);
  p.textSize(36);
  p.textStyle(p.BOLD);

  if (localT < 4.0) {
    // 阶段1全景
    p.fill(255, 255, 255, 240);
    p.text('「截至目前，人类共提交了20份答卷。」', 960, 980);
  } else if (localT >= 7.8 && localT < 10.4) {
    // 阶段3定格
    p.fill(255, 255, 255, 240);
    p.text('「鹈鹕本人对此尚未发表评论。」', 960, 980);
  } else if (localT >= 10.4) {
    // 阶段4飞驰而过留铃声
    p.fill(255, 215, 80, 250);
    p.text('（铃声渐远，未作回应）', 960, 980);
  }
  p.pop();

  p.pop();
}
