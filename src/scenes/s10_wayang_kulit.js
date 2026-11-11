// src/scenes/s10_wayang_kulit.js
// 10. 爪哇皮影戏 Wayang Kulit (约1800)
// 镂空水牛皮雕花鹈鹕和自行车，修复颈部连接，带真实操纵竹签，动作一顿一顿

import { computePelicanRig } from '../rig/rig.js';
import { quantizeTime } from '../beat/beat.js';

export function render(p, localT, beat, camera) {
  p.push();

  // 1. 白布幕 (Kelir 暖黄油灯漫射光晕)
  p.noStroke();
  p.fill(242, 220, 160);
  p.rect(0, 0, 1000, 1000);

  // 椰子油灯中央强烈泛黄聚光 (Lampu Blencong)
  p.fill(255, 246, 205, 160);
  p.ellipse(500, 480, 800, 800);
  p.fill(255, 252, 230, 90);
  p.ellipse(500, 480, 520, 520);

  // 爪哇皮影戏两侧神圣的生命之树 (Gunungan / Kayon) 水牛皮雕花剪影
  const drawGunungan = (gx, gy, scale = 1.0) => {
    p.push();
    p.translate(gx, gy);
    p.scale(scale);
    p.fill(28, 20, 15);
    const ctx = p.drawingContext;
    ctx.save();
    ctx.fillStyle = 'rgb(28, 20, 15)';
    ctx.beginPath();
    ctx.moveTo(0, -220);
    ctx.bezierCurveTo(80, -140, 105, -30, 95, 120);
    ctx.lineTo(-95, 120);
    ctx.bezierCurveTo(-105, -30, -80, -140, 0, -220);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // 内部镂空花纹 (水牛皮镂空透光)
    p.fill(245, 225, 165);
    p.ellipse(0, -120, 18, 30);
    p.ellipse(0, -50, 40, 70);
    p.ellipse(0, 40, 50, 50);

    // 支撑底座竹杆
    p.stroke(80, 50, 25);
    p.strokeWeight(6);
    p.line(0, 100, 0, 300);
    p.pop();
  };

  drawGunungan(90, 500, 1.15);
  drawGunungan(910, 500, 1.15);

  // 2. 时间量化：每秒 10 帧更新，保留皮影动作纯正顿挫感
  const quantizedT = quantizeTime(localT, 10);
  const pelicanX = 220 + (localT / 6.0) * 560; // 镜头位移平滑
  const groundY = 705;

  const rig = computePelicanRig(quantizedT, {
    x: pelicanX,
    y: groundY,
    scale: 1.05
  });

  // 3. 操纵竹签 (Gapit 竹杆，真实连接头部、把手、脚踏)
  p.stroke(85, 55, 25);
  p.strokeWeight(3.5);
  // 连接头部操纵杆
  p.line(rig.head.x - 2, rig.head.y, rig.head.x - 45, 960);
  // 连接手把
  p.line(rig.handlebar.x, rig.handlebar.y, rig.handlebar.x - 30, 980);
  // 连接五通与鞍座
  p.line(rig.bb.x, rig.bb.y, rig.bb.x - 15, 990);
  p.line(rig.saddle.x, rig.saddle.y, rig.saddle.x - 35, 970);

  // 4. 水牛皮雕花镂空车轮
  const drawPuppetWheel = (hub) => {
    p.push();
    p.translate(hub.x, hub.y);
    p.fill(28, 20, 15);
    p.noStroke();
    p.ellipse(0, 0, rig.wheelRadius * 2, rig.wheelRadius * 2);

    // 镂空齿饰孔眼 (透光)
    p.fill(245, 222, 160);
    const holes = 10;
    for (let i = 0; i < holes; i++) {
      const a = rig.wheelAngle + (i * Math.PI * 2) / holes;
      p.ellipse(Math.cos(a) * (rig.wheelRadius * 0.65), Math.sin(a) * (rig.wheelRadius * 0.65), 12, 12);
      p.ellipse(Math.cos(a + Math.PI / holes) * (rig.wheelRadius * 0.35), Math.sin(a + Math.PI / holes) * (rig.wheelRadius * 0.35), 8, 8);
    }

    // 金箔花纹同心圆
    p.noFill();
    p.stroke(218, 165, 32);
    p.strokeWeight(2.5);
    p.ellipse(0, 0, rig.wheelRadius * 1.85, rig.wheelRadius * 1.85);
    p.ellipse(0, 0, rig.wheelRadius * 0.95, rig.wheelRadius * 0.95);
    p.pop();
  };

  drawPuppetWheel(rig.rearHub);
  drawPuppetWheel(rig.frontHub);

  // 5. 皮影车架 (黑色水牛皮加金箔描边)
  p.stroke(28, 20, 15);
  p.strokeWeight(7.5 * rig.scale);
  p.strokeCap(p.ROUND);
  p.line(rig.rearHub.x, rig.rearHub.y, rig.bb.x, rig.bb.y);
  p.line(rig.bb.x, rig.bb.y, rig.saddle.x, rig.saddle.y);
  p.line(rig.saddle.x, rig.saddle.y, rig.rearHub.x, rig.rearHub.y);
  p.line(rig.bb.x, rig.bb.y, rig.headset.x, rig.headset.y);
  p.line(rig.saddle.x, rig.saddle.y, rig.headset.x, rig.headset.y);
  p.line(rig.headset.x, rig.headset.y, rig.frontHub.x, rig.frontHub.y);
  p.line(rig.headset.x, rig.headset.y, rig.handlebar.x, rig.handlebar.y);

  // 车架金线
  p.stroke(218, 165, 32);
  p.strokeWeight(1.8 * rig.scale);
  p.line(rig.bb.x, rig.bb.y, rig.headset.x, rig.headset.y);
  p.line(rig.saddle.x, rig.saddle.y, rig.headset.x, rig.headset.y);

  // 铜铰接销钉
  p.fill(218, 165, 32);
  p.noStroke();
  p.ellipse(rig.bb.x, rig.bb.y, 11, 11);
  p.ellipse(rig.headset.x, rig.headset.y, 11, 11);
  p.ellipse(rig.rearHub.x, rig.rearHub.y, 9, 9);
  p.ellipse(rig.frontHub.x, rig.frontHub.y, 9, 9);

  // 6. 踏板与腿部铰链
  p.stroke(28, 20, 15);
  p.strokeWeight(7 * rig.scale);
  p.line(rig.hip.x, rig.hip.y, rig.legRight.jointX, rig.legRight.jointY);
  p.line(rig.legRight.jointX, rig.legRight.jointY, rig.pedalRight.x, rig.pedalRight.y);

  // 膝盖金色铜铰钉
  p.fill(218, 165, 32);
  p.noStroke();
  p.ellipse(rig.legRight.jointX, rig.legRight.jointY, 10, 10);
  p.ellipse(rig.pedalRight.x, rig.pedalRight.y, 8, 8);

  // 7. 水牛皮鹈鹕躯干
  const ctx = p.drawingContext;
  ctx.save();
  ctx.fillStyle = 'rgb(28, 20, 15)';
  ctx.beginPath();
  ctx.moveTo(rig.hip.x - 16 * rig.scale, rig.hip.y + 4 * rig.scale);
  ctx.bezierCurveTo(
    rig.hip.x - 24 * rig.scale, rig.hip.y - 30 * rig.scale,
    rig.chest.x - 10 * rig.scale, rig.chest.y - 42 * rig.scale,
    rig.chest.x + 8 * rig.scale, rig.chest.y
  );
  ctx.bezierCurveTo(
    rig.chest.x + 12 * rig.scale, rig.chest.y + 24 * rig.scale,
    rig.hip.x + 12 * rig.scale, rig.hip.y + 14 * rig.scale,
    rig.hip.x - 16 * rig.scale, rig.hip.y + 4 * rig.scale
  );
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // 8. 【重点修复】：优雅完整的皮影长颈 (彻底杜绝断头 Bug！)
  p.stroke(28, 20, 15);
  p.strokeWeight(16 * rig.scale);
  p.noFill();
  p.bezier(
    rig.neckBase.x, rig.neckBase.y,
    rig.neckMid.x - 14 * rig.scale, rig.neckMid.y,
    rig.neckMid.x + 10 * rig.scale, rig.neckMid.y - 12 * rig.scale,
    rig.head.x, rig.head.y
  );

  // 颈部金色卷草镂空花纹描边
  p.stroke(218, 165, 32);
  p.strokeWeight(2.5 * rig.scale);
  p.bezier(
    rig.neckBase.x - 4, rig.neckBase.y,
    rig.neckMid.x - 18 * rig.scale, rig.neckMid.y,
    rig.neckMid.x + 6 * rig.scale, rig.neckMid.y - 12 * rig.scale,
    rig.head.x - 4, rig.head.y
  );

  // 9. 皮影头部与爪哇神冠 (Makuta)
  p.noStroke();
  p.fill(28, 20, 15);
  p.ellipse(rig.head.x, rig.head.y, 30 * rig.scale, 26 * rig.scale);

  // 爪哇皮影传统尖翘神冠 (金色镂空)
  p.fill(218, 165, 32);
  p.triangle(
    rig.head.x - 8, rig.head.y - 10,
    rig.head.x + 10, rig.head.y - 10,
    rig.head.x - 2, rig.head.y - 42
  );
  p.fill(28, 20, 15);
  p.ellipse(rig.head.x - 1, rig.head.y - 25, 6, 6);

  // 10. 大嘴与透光喉囊
  p.fill(28, 20, 15);
  p.beginShape();
  p.vertex(rig.head.x + 8, rig.head.y - 4);
  p.vertex(rig.beakTip.x, rig.beakTip.y);
  p.vertex(rig.pouchBottom.x, rig.pouchBottom.y);
  p.vertex(rig.head.x + 12, rig.head.y + 10);
  p.endShape(p.CLOSE);

  // 喉囊内部精致镂雕 (透出幕后暖光)
  p.fill(245, 220, 160);
  p.ellipse(rig.head.x + 38 * rig.scale, rig.head.y + 22 * rig.scale, 16, 22);
  p.ellipse(rig.head.x + 56 * rig.scale, rig.head.y + 16 * rig.scale, 12, 16);

  // 金色轮廓与眼部雕花
  p.fill(218, 165, 32);
  p.ellipse(rig.head.x + 4, rig.head.y - 3, 8, 8);
  p.fill(28, 20, 15);
  p.ellipse(rig.head.x + 4, rig.head.y - 3, 4, 4);

  p.pop();
}
