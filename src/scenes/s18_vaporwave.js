// src/scenes/s18_vaporwave.js
// 18. 蒸汽波美学 Vaporwave Aesthetic (2010s)
// 粉紫青渐变天空、百叶窗落日、低多边形椰林、古典阿波罗大理石胸像旁观、发光透视网格

import { computePelicanRig, drawDefaultPelican } from '../rig/rig.js';

export function render(p, localT, beat, camera) {
  p.push();

  // 1. 梦幻蒸汽波渐变天空 (紫红 Magenta -> 紫罗兰 Violet -> 靛蓝 Indigo)
  const ctx = p.drawingContext;
  const skyGrad = ctx.createLinearGradient(0, 0, 0, 650);
  skyGrad.addColorStop(0, '#531b75');
  skyGrad.addColorStop(0.35, '#a6247c');
  skyGrad.addColorStop(0.7, '#e04f7c');
  skyGrad.addColorStop(1, '#2c0e3a');
  ctx.save();
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, 1000, 650);
  ctx.restore();

  // 2. 80 年代复古数码百叶窗落日 (黄橙霓虹渐变 + 逐渐变宽的水平遮罩黑条)
  p.push();
  p.translate(500, 320);
  const sunGrad = ctx.createLinearGradient(0, -180, 0, 180);
  sunGrad.addColorStop(0, '#ffee55');
  sunGrad.addColorStop(1, '#ff2288');
  ctx.save();
  ctx.fillStyle = sunGrad;
  ctx.beginPath();
  ctx.arc(0, 0, 160, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // 百叶窗水平遮罩割裂纹 (越往下割裂缝隙越宽)
  p.fill(44, 14, 58);
  p.noStroke();
  for (let s = 0; s < 7; s++) {
    const sy = 10 + s * 22;
    const sh = 4 + s * 3.5;
    p.rect(-170, sy, 340, sh);
  }
  p.pop();

  // 3. 复古日文全角标语 (ペリカン 1984 · 夢の高速道路)
  p.fill(255, 255, 255, 210);
  p.noStroke();
  p.textSize(26);
  p.textStyle(p.BOLD);
  p.textAlign(p.CENTER, p.TOP);
  p.text('ペリカン 1984 · 仮想の街', 500, 80);

  // 4. 地面 3D 纵深透视网格 (置于底层，绝对不穿透人物！)
  p.fill(16, 8, 28);
  p.rect(0, 620, 1000, 380);

  // 发光霓虹青色透视网格线 (地平线 Y = 620，透视消失点在 500, 620)
  p.stroke(0, 240, 255, 180);
  p.strokeWeight(2);
  // 辐射透视线
  for (let x = -600; x <= 1600; x += 90) {
    p.line(500, 620, x, 1000);
  }
  // 水平距离加速线 (由密到疏，随时间向前滚动)
  p.stroke(255, 60, 180, 160);
  const gridOffset = (localT * 120) % 60;
  for (let y = 620; y <= 1000; y += 15) {
    const curY = y + gridOffset;
    if (curY <= 1000) {
      const alpha = p.map(curY, 620, 1000, 40, 240);
      p.stroke(255, 60, 180, alpha);
      p.line(0, curY, 1000, curY);
    }
  }

  // 5. 左侧低多边形 3D 椰林 (荧光青与洋红叶片)
  const drawPalm = (px, py, s = 1.0) => {
    p.push();
    p.translate(px, py);
    p.scale(s);
    // 弯曲树干
    p.stroke(0, 240, 255);
    p.strokeWeight(8);
    p.noFill();
    p.bezier(0, 0, 25, -120, -15, -240, 40, -360);
    // 顶端发散椰树叶
    p.translate(40, -360);
    p.stroke(255, 60, 180);
    p.strokeWeight(4);
    const leaves = [-1.8, -1.2, -0.6, 0, 0.6, 1.2, 1.8];
    for (const ang of leaves) {
      p.push();
      p.rotate(ang);
      p.bezier(0, 0, 40, -30, 90, -15, 120, 35);
      p.pop();
    }
    p.pop();
  };

  drawPalm(140, 720, 0.95);

  // 6. 右侧驻足旁观的大理石阿波罗雕像 (雕塑排线光影 + 荧光墨镜)
  const drawApolloStatue = (ax, ay, s = 1.0) => {
    p.push();
    p.translate(ax, ay);
    p.scale(s);

    // 白色大理石底座与胸像
    p.fill(235, 235, 245);
    p.stroke(140, 130, 160);
    p.strokeWeight(2);

    // 胸肩轮廓
    p.beginShape();
    p.vertex(-70, 160);
    p.vertex(70, 160);
    p.vertex(60, 60);
    p.vertex(25, 40);
    p.vertex(25, -10); // 颈部
    p.vertex(-25, -10);
    p.vertex(-25, 40);
    p.vertex(-60, 60);
    p.endShape(p.CLOSE);

    // 大理石头部
    p.ellipse(0, -60, 68, 90);

    // 希腊卷发阴影 (深色雕塑排线)
    p.fill(160, 150, 180);
    p.noStroke();
    p.ellipse(-25, -95, 25, 25);
    p.ellipse(0, -105, 30, 25);
    p.ellipse(25, -95, 25, 25);
    p.ellipse(-34, -75, 18, 30);
    p.ellipse(34, -75, 18, 30);

    // 大理石挺拔鼻梁与唇线
    p.stroke(120, 110, 140);
    p.strokeWeight(2);
    p.line(0, -75, 0, -45);
    p.line(-4, -45, 4, -45);
    p.line(-6, -30, 6, -30);

    // 标志性 80s 极度前卫的窄边霓虹太阳镜！
    p.fill(15, 10, 25);
    p.stroke(0, 240, 255);
    p.strokeWeight(2.5);
    p.rect(-34, -74, 30, 16, 2);
    p.rect(4, -74, 30, 16, 2);
    p.line(-4, -68, 4, -68);
    // 镜片反光紫粉高光
    p.stroke(255, 60, 180);
    p.line(-28, -66, -10, -66);
    p.line(10, -66, 28, -66);

    p.pop();
  };

  drawApolloStatue(860, 610, 1.1);

  // 7. 骑车穿行的蒸汽波霓虹双色调鹈鹕与自行车
  const pelicanX = 220 + (localT / 6.0) * 560;
  const groundY = 710;

  const rig = computePelicanRig(localT, {
    x: pelicanX,
    y: groundY,
    scale: 1.05
  });

  drawDefaultPelican(p, rig, {
    bodyColor: [255, 240, 250],   // 亮白带粉紫高光
    beakColor: [255, 80, 160],    // 霓虹热粉
    pouchColor: [180, 30, 140],   // 深品红
    frameColor: [0, 240, 255],    // 荧光青 (Cyan)
    wheelColor: [255, 40, 160],   // 荧光品红
    eyeColor: [10, 240, 255]
  });

  p.pop();
}
