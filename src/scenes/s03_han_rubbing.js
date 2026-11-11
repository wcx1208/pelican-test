// src/scenes/s03_han_rubbing.js
// 3. 汉画像石拓片 (约100，水墨)
// 黑底白线的石刻拓片质感，车马出行队列里混进一辆纯正汉画像石线刻的鹈鹕自行车

import { computePelicanRig } from '../rig/rig.js';
import { pseudoNoise } from '../kit/kit.js';

export function render(p, localT, beat, camera) {
  p.push();

  // 1. 汉代古墓青石墨拓底色 (深黑带焦墨斑驳与石灰石肌理)
  p.noStroke();
  p.fill(22, 22, 24);
  p.rect(0, 0, 1000, 1000);

  // 拓包扑墨的飞白与石花斑点 (石板凹凸不平形成的白麻点)
  p.fill(240, 240, 235, 30);
  for (let i = 0; i < 350; i++) {
    const rx = pseudoNoise(i * 17) * 1000;
    const ry = pseudoNoise(i * 31) * 1000;
    const rs = 1 + pseudoNoise(i * 7) * 3.5;
    p.ellipse(rx, ry, rs, rs);
  }

  // 汉画像石经典上下分栏装饰边框 (三角齿纹与双线回纹)
  p.stroke(242, 242, 238, 200);
  p.strokeWeight(3);
  p.line(30, 80, 970, 80);
  p.line(30, 110, 970, 110);
  // 连绵三角锯齿纹
  for (let x = 40; x <= 950; x += 30) {
    p.line(x, 110, x + 15, 80);
    p.line(x + 15, 80, x + 30, 110);
  }
  // 下边框
  p.line(30, 880, 970, 880);
  p.line(30, 910, 970, 910);
  for (let x = 40; x <= 950; x += 30) {
    p.line(x, 880, x + 15, 910);
    p.line(x + 15, 910, x + 30, 880);
  }

  // 2. 汉代经典“车马出行”轺车与神驹 (纯白线刻、飞剪影剪影)
  const drawHanChariot = (cx, cy, s = 1.0) => {
    p.push();
    p.translate(cx, cy);
    p.scale(s);
    p.stroke(245, 245, 240, 230);
    p.strokeWeight(3.5);
    p.fill(22, 22, 24); // 阴线剔地刻法

    // (1) 神骏奔马 (西汉天马：细长劲颈、昂首长啸、四蹄凌空)
    // 躯干与臀部
    p.ellipse(0, 0, 95, 45);
    // 昂首长颈与头
    p.beginShape();
    p.vertex(-35, -5);
    p.vertex(-65, -50);
    p.vertex(-55, -75);
    p.vertex(-40, -50);
    p.vertex(-20, -15);
    p.endShape();
    // 飞扬马鬃 (锯齿排线)
    for (let m = 0; m < 5; m++) {
      p.line(-55 + m * 7, -65 + m * 8, -70 + m * 7, -60 + m * 8);
    }
    // 飞驰的四蹄 (前蹄跃空，后蹄后蹬)
    p.line(-25, 20, -55, 65);
    p.line(-10, 20, -35, 75);
    p.line(25, 20, 55, 60);
    p.line(35, 18, 70, 50);

    // 飘逸马尾
    p.noFill();
    p.bezier(45, -8, 85, -25, 110, 10, 95, 45);

    // (2) 轺车与华盖 (单辀、圆盖、立伞)
    p.translate(140, -10);
    // 大车轮 (汉代多辐木轮)
    p.ellipse(0, 45, 70, 70);
    for (let sp = 0; sp < 8; sp++) {
      const a = (sp * Math.PI) / 4;
      p.line(0, 45, Math.cos(a) * 35, 45 + Math.sin(a) * 35);
    }
    // 车舆与车厢
    p.rect(-30, 20, 55, 25);
    // 华盖立柱与圆伞盖
    p.line(0, 20, 0, -60);
    p.arc(0, -60, 100, 35, Math.PI, 0);

    // 汉代乘车驭手 (戴进贤冠，手执长辔)
    p.ellipse(-8, -10, 18, 22); // 头戴冠
    p.rect(-16, -2, 4, 12);
    p.line(-10, 10, -5, 20); // 身躯
    // 牵拉至马嘴的长缰绳
    p.line(-8, 5, -195, -60);
    p.pop();
  };

  // 画面左右的车马队列
  drawHanChariot(120, 600, 0.95);
  drawHanChariot(780, 590, 0.9);

  // 3. 汉碑刻石隶书题榜：“車馬出行·鵜鶘隨行”
  p.fill(245, 245, 240, 220);
  p.noStroke();
  p.textSize(26);
  p.textAlign(p.CENTER, p.TOP);
  p.text('車馬出行 · 鵜鶘隨行', 500, 140);

  // 4. 纯白阴线刻拓片风格的鹈鹕与自行车！
  const pelicanX = 220 + (localT / 6.0) * 560;
  const groundY = 705;

  const rig = computePelicanRig(localT, {
    x: pelicanX,
    y: groundY,
    scale: 1.05
  });

  // 全车架与车轮使用纯正汉画像石“剔地白线”绘制！
  p.stroke(245, 245, 240);
  p.strokeWeight(4.5 * rig.scale);
  p.noFill();

  // 车轮与辐条
  p.ellipse(rig.rearHub.x, rig.rearHub.y, rig.wheelRadius * 2, rig.wheelRadius * 2);
  p.ellipse(rig.frontHub.x, rig.frontHub.y, rig.wheelRadius * 2, rig.wheelRadius * 2);
  for (let i = 0; i < 8; i++) {
    const a = rig.wheelAngle + (i * Math.PI) / 4;
    p.line(rig.rearHub.x, rig.rearHub.y, rig.rearHub.x + Math.cos(a) * rig.wheelRadius, rig.rearHub.y + Math.sin(a) * rig.wheelRadius);
    p.line(rig.frontHub.x, rig.frontHub.y, rig.frontHub.x + Math.cos(a) * rig.wheelRadius, rig.frontHub.y + Math.sin(a) * rig.wheelRadius);
  }

  // 车架石刻线
  p.line(rig.rearHub.x, rig.rearHub.y, rig.bb.x, rig.bb.y);
  p.line(rig.bb.x, rig.bb.y, rig.saddle.x, rig.saddle.y);
  p.line(rig.saddle.x, rig.saddle.y, rig.rearHub.x, rig.rearHub.y);
  p.line(rig.bb.x, rig.bb.y, rig.headset.x, rig.headset.y);
  p.line(rig.saddle.x, rig.saddle.y, rig.headset.x, rig.headset.y);
  p.line(rig.headset.x, rig.headset.y, rig.frontHub.x, rig.frontHub.y);
  p.line(rig.headset.x, rig.headset.y, rig.handlebar.x, rig.handlebar.y);

  // 双腿与踏板
  p.line(rig.hip.x, rig.hip.y, rig.legLeft.jointX, rig.legLeft.jointY);
  p.line(rig.legLeft.jointX, rig.legLeft.jointY, rig.pedalLeft.x, rig.pedalLeft.y);
  p.line(rig.hip.x, rig.hip.y, rig.legRight.jointX, rig.legRight.jointY);
  p.line(rig.legRight.jointX, rig.legRight.jointY, rig.pedalRight.x, rig.pedalRight.y);

  // 汉代朱雀玄鸟风范的白线雕刻鹈鹕身躯
  p.strokeWeight(5 * rig.scale);
  p.stroke(245, 245, 240);
  p.fill(22, 22, 24); // 内部剔空
  p.ellipse(rig.chest.x - 10, rig.chest.y + 4, 75 * rig.scale, 50 * rig.scale);

  // 颈部
  p.noFill();
  p.bezier(
    rig.neckBase.x, rig.neckBase.y,
    rig.neckMid.x - 14 * rig.scale, rig.neckMid.y,
    rig.neckMid.x + 10 * rig.scale, rig.neckMid.y - 12 * rig.scale,
    rig.head.x, rig.head.y
  );

  // 头部与鸟喙
  p.fill(22, 22, 24);
  p.ellipse(rig.head.x, rig.head.y, 28 * rig.scale, 24 * rig.scale);
  // 大嘴
  p.beginShape();
  p.vertex(rig.head.x + 8, rig.head.y - 4);
  p.vertex(rig.beakTip.x, rig.beakTip.y);
  p.vertex(rig.pouchBottom.x, rig.pouchBottom.y);
  p.vertex(rig.head.x + 12, rig.head.y + 8);
  p.endShape(p.CLOSE);

  // 汉代神鸟同心圆目
  p.fill(245, 245, 240);
  p.ellipse(rig.head.x + 4, rig.head.y - 2, 8, 8);
  p.fill(22, 22, 24);
  p.ellipse(rig.head.x + 4, rig.head.y - 2, 4, 4);

  p.pop();
}
