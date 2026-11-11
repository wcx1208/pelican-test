// src/scenes/s14_nosferatu.js
// 14. 《诺斯费拉图》 Nosferatu (1922，德国表现主义默片)
// 哥特斜影阶梯，墙面上鹈鹕骑车的阴森影子缓缓爬升，过框强拍通电闪烁变绿

import { computePelicanRig } from '../rig/rig.js';
import { pseudoNoise } from '../kit/kit.js';

export function render(p, localT, beat, camera) {
  p.push();

  // 1. 默片黑白暗调底色 (深沉的石膏冷灰色与老胶片黑)
  p.noStroke();
  p.fill(28, 28, 30);
  p.rect(0, 0, 1000, 1000);

  // 表现主义强烈倾斜的哥特式尖拱窗光斑 (光影极致对比 chiaroscuro)
  p.fill(215, 210, 195, 230);
  p.beginShape();
  p.vertex(280, 0);
  p.vertex(820, 0);
  p.vertex(620, 1000);
  p.vertex(80, 1000);
  p.endShape(p.CLOSE);

  // 老胶片划痕与噪点颗粒 (1920s 胶卷跳动感)
  p.stroke(255, 255, 255, 40);
  p.strokeWeight(1.2);
  const scratchSeed = Math.floor(localT * 18);
  for (let s = 0; s < 4; s++) {
    const sx = pseudoNoise(scratchSeed + s * 13) * 1000;
    p.line(sx, 0, sx + 5, 1000);
  }

  // 2. 哥特式古堡斜向长阶梯 (左下至右上倾斜爬升)
  // 楼梯主梁
  p.stroke(35, 35, 38);
  p.strokeWeight(16);
  p.line(0, 850, 1000, 320);

  // 阶梯踏步锯齿阴影 (每一级台阶的垂直面与水平面)
  p.strokeWeight(4);
  p.stroke(20, 20, 22);
  for (let st = 0; st < 20; st++) {
    const x1 = st * 50;
    const y1 = 850 - st * 26.5;
    const x2 = (st + 1) * 50;
    const y2 = 850 - (st + 1) * 26.5;
    p.line(x1, y1, x2, y1); // 水平踏面
    p.line(x2, y1, x2, y2); // 垂直立面
  }

  // 铁艺铸铁阶梯栏杆与立柱
  p.stroke(45, 45, 50);
  p.strokeWeight(3.5);
  p.line(0, 770, 1000, 240); // 扶手
  for (let r = 0; r < 14; r++) {
    const rx = 40 + r * 70;
    const ry = 850 - (rx / 1000) * 530;
    p.line(rx, ry, rx, ry - 80);
  }

  // 3. 墙面投射的“诺斯费拉图”吸血鬼式鹈鹕与自行车幽灵黑影！
  // 随着时间推移，影子沿楼梯缓缓爬升 (从左下向右上攀登)
  const climbProgress = localT / 6.0;
  const shadowX = 180 + climbProgress * 580;
  const shadowY = 760 - climbProgress * 320;

  const rig = computePelicanRig(localT, {
    x: shadowX,
    y: shadowY,
    scale: 1.15
  });

  // 4. 特殊转场：在 5.0s ~ 6.0s，影子开始剧烈通电闪烁，边缘由纯黑激荡出翠绿示波器发光线条！
  const isElectrified = localT >= 5.0;
  let shadowFillColor = [18, 16, 20];
  let shadowStrokeColor = [22, 20, 25];
  let shadowGlowWeight = 2;

  if (isElectrified) {
    const flicker = Math.sin(localT * 48) > 0;
    if (flicker) {
      shadowFillColor = [10, 45, 20];
      shadowStrokeColor = [60, 255, 120];
      shadowGlowWeight = 5;
    }
  }

  p.push();
  // 表现主义斜向拉伸矩阵 (倾斜投影到墙壁上)
  p.translate(shadowX, shadowY);
  p.shearX(-0.35); // 剧烈斜切拉长，极富表现主义诡异感
  p.translate(-shadowX, -shadowY);

  p.fill(shadowFillColor[0], shadowFillColor[1], shadowFillColor[2]);
  p.stroke(shadowStrokeColor[0], shadowStrokeColor[1], shadowStrokeColor[2]);
  p.strokeWeight(shadowGlowWeight);

  // 幽灵车轮 (带辐条阴影)
  const drawShadowWheel = (hub) => {
    p.ellipse(hub.x, hub.y, rig.wheelRadius * 2, rig.wheelRadius * 2);
    for (let i = 0; i < 6; i++) {
      const a = rig.wheelAngle + (i * Math.PI) / 3;
      p.line(hub.x, hub.y, hub.x + Math.cos(a) * rig.wheelRadius, hub.y + Math.sin(a) * rig.wheelRadius);
    }
  };
  drawShadowWheel(rig.rearHub);
  drawShadowWheel(rig.frontHub);

  // 细瘦骨感的阴影车架
  p.strokeWeight(6 * rig.scale);
  p.line(rig.rearHub.x, rig.rearHub.y, rig.bb.x, rig.bb.y);
  p.line(rig.bb.x, rig.bb.y, rig.saddle.x, rig.saddle.y);
  p.line(rig.saddle.x, rig.saddle.y, rig.rearHub.x, rig.rearHub.y);
  p.line(rig.bb.x, rig.bb.y, rig.headset.x, rig.headset.y);
  p.line(rig.saddle.x, rig.saddle.y, rig.headset.x, rig.headset.y);
  p.line(rig.headset.x, rig.headset.y, rig.frontHub.x, rig.frontHub.y);
  p.line(rig.headset.x, rig.headset.y, rig.handlebar.x, rig.handlebar.y);

  // 细瘦阴森的骨骼腿部与长足
  p.line(rig.hip.x, rig.hip.y, rig.legRight.jointX, rig.legRight.jointY);
  p.line(rig.legRight.jointX, rig.legRight.jointY, rig.pedalRight.x, rig.pedalRight.y);

  // 驼背身躯
  p.ellipse(rig.chest.x - 12, rig.chest.y + 4, 80 * rig.scale, 52 * rig.scale);

  // 弯曲细长的幽灵颈部
  p.strokeWeight(15 * rig.scale);
  p.noFill();
  p.bezier(
    rig.neckBase.x, rig.neckBase.y,
    rig.neckMid.x - 18 * rig.scale, rig.neckMid.y,
    rig.neckMid.x + 8 * rig.scale, rig.neckMid.y - 15 * rig.scale,
    rig.head.x, rig.head.y
  );

  // 尖锐削瘦的头部与长喙
  p.fill(shadowFillColor[0], shadowFillColor[1], shadowFillColor[2]);
  p.ellipse(rig.head.x, rig.head.y, 30 * rig.scale, 24 * rig.scale);

  // 标志性诺斯费拉图式尖锐鹰爪长喙！
  p.beginShape();
  p.vertex(rig.head.x + 8, rig.head.y - 6);
  p.vertex(rig.beakTip.x + 20, rig.beakTip.y + 10);
  p.vertex(rig.pouchBottom.x, rig.pouchBottom.y);
  p.vertex(rig.head.x + 10, rig.head.y + 12);
  p.endShape(p.CLOSE);

  // 抓住车把的极度修长尖锐爪指 (经典吸血鬼伯爵爪子剪影！)
  p.strokeWeight(3.5);
  for (let cl = 0; cl < 3; cl++) {
    p.line(
      rig.handlebar.x - 10 + cl * 6, rig.handlebar.y - 12,
      rig.handlebar.x + cl * 6, rig.handlebar.y + 6
    );
  }

  p.pop();

  p.pop();
}
