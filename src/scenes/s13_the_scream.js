// src/scenes/s13_the_scream.js
// 13. 蒙克《呐喊》 (1893，表现主义)
// 骑过倾斜木桥，著名的“呐喊者”变成被鹈鹕车铃吓到的路人

import { computePelicanRig, drawDefaultPelican } from '../rig/rig.js';

export function render(p, localT, beat, camera) {
  p.push();

  // 1. 蒙克标志性血橙色与腥红色波浪起伏天空
  p.noStroke();
  p.fill(215, 65, 35); // 猩红
  p.rect(0, 0, 1000, 360);

  // 扭曲流动的橙黄血色云层波浪
  p.noFill();
  p.strokeWeight(18);
  for (let i = 0; i < 6; i++) {
    const col = (i % 2 === 0) ? [240, 140, 30] : [190, 45, 25];
    p.stroke(col[0], col[1], col[2]);
    p.beginShape();
    p.vertex(0, 60 + i * 45);
    p.vertex(300, 40 + i * 45 + Math.sin(localT * 3 + i) * 12);
    p.vertex(650, 90 + i * 45 + Math.cos(localT * 3 + i) * 12);
    p.vertex(1000, 50 + i * 45);
    p.endShape();
  }

  // 峡湾暗蓝黑海水与远山
  p.fill(25, 45, 65);
  p.noStroke();
  p.rect(0, 360, 1000, 240);

  // 2. 强烈透视斜向延伸的红褐木栈桥
  p.fill(130, 75, 45);
  p.beginShape();
  p.vertex(0, 520);
  p.vertex(1000, 780);
  p.vertex(1000, 1000);
  p.vertex(0, 1000);
  p.endShape(p.CLOSE);

  // 桥栏杆实木斜线
  p.stroke(65, 35, 20);
  p.strokeWeight(12);
  p.line(0, 480, 1000, 740);
  p.line(0, 520, 1000, 780);
  p.strokeWeight(6);
  for (let x = 80; x < 1000; x += 110) {
    const ry = 480 + (x / 1000) * 260;
    p.line(x, ry, x, ry + 70);
  }

  // 远景走开的两个戴高帽黑色路人
  p.fill(30, 30, 35);
  p.noStroke();
  p.rect(140, 420, 18, 55, 4);
  p.rect(170, 430, 16, 50, 4);

  // 3. 核心笑点：前景被车铃吓到的“呐喊者” (捂双耳大张O型嘴)
  // 当鹈鹕在 2~4s 经过身边时，呐喊者惊恐战栗
  const screamShake = (localT >= 2.0 && localT <= 4.0) ? Math.sin(localT * 40) * 4 : 0;

  p.push();
  p.translate(780 + screamShake, 660);
  // 骷髅形苍白面庞
  const ctx = p.drawingContext;
  ctx.save();
  ctx.fillStyle = 'rgb(215, 210, 165)';
  ctx.strokeStyle = 'rgb(40, 35, 30)';
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  ctx.moveTo(-22, -60);
  ctx.bezierCurveTo(-38, -40, -32, 10, -18, 25);
  ctx.bezierCurveTo(-8, 32, 8, 32, 18, 25);
  ctx.bezierCurveTo(32, 10, 38, -40, 22, -60);
  ctx.bezierCurveTo(12, -75, -12, -75, -22, -60);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.restore();

  // 惊恐圆眼眶与黑洞洞嘴巴
  p.fill(30, 25, 20);
  p.ellipse(-10, -30, 8, 12);
  p.ellipse(10, -30, 8, 12);
  // 标志性深渊大张口
  p.ellipse(0, 2, 16, 26);

  // 经典动作：双手紧紧贴捂住脸颊两侧
  p.stroke(215, 210, 165);
  p.strokeWeight(12);
  p.noFill();
  p.line(-36, 15, -28, -25);
  p.line(36, 15, 28, -25);

  // 瘦削如波浪般扭曲的深褐深蓝身躯
  p.stroke(35, 45, 60);
  p.strokeWeight(28);
  p.line(0, 35, 10, 200);
  p.pop();

  // 4. 鹈鹕与自行车
  // 沿倾斜桥面骑行
  const bridgeProgress = localT / 6.0;
  const pelicanX = 180 + bridgeProgress * 540;
  // 桥面倾斜 Y 轴对应
  const bridgeY = 620 + (pelicanX / 1000) * 140;

  const rig = computePelicanRig(localT, {
    x: pelicanX,
    y: bridgeY,
    scale: 0.98
  });

  // 表现主义流线色调
  drawDefaultPelican(p, rig, {
    bodyColor: [245, 240, 230],
    beakColor: [230, 140, 40],
    pouchColor: [200, 60, 40],
    frameColor: [45, 30, 25],
    wheelColor: [35, 25, 20],
    eyeColor: [20, 15, 15]
  });

  // 自行车车把上的小车铃发出声波振动圈！
  if (localT >= 1.8 && localT <= 4.2) {
    p.push();
    p.translate(rig.handlebar.x, rig.handlebar.y);
    p.noFill();
    p.stroke(255, 240, 80, 200);
    p.strokeWeight(2.5);
    const ringRadius = ((localT * 8) % 2) * 20 + 8;
    p.arc(0, 0, ringRadius, ringRadius, -Math.PI * 0.8, Math.PI * 0.2);
    p.arc(0, 0, ringRadius + 12, ringRadius + 12, -Math.PI * 0.8, Math.PI * 0.2);
    p.pop();
  }

  p.pop();
}
