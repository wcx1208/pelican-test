// src/rig/rig.js
// 鹈鹕与自行车参数化骨骼木偶系统 (脚踏一圈对应两拍 = 1.0s)

// 两段骨骼简单逆运动学 (IK) 解算
function solveIK2D(rootX, rootY, targetX, targetY, l1, l2, flipKnee = false) {
  const dx = targetX - rootX;
  const dy = targetY - rootY;
  const dist = Math.hypot(dx, dy);
  
  // 防止距离超出骨骼总长度
  const maxReach = (l1 + l2) * 0.999;
  const actualDist = Math.max(Math.abs(l1 - l2) * 1.001, Math.min(dist, maxReach));

  const baseAngle = Math.atan2(dy, dx);
  // 余弦定理求膝盖夹角
  const cosA = (l1 * l1 + actualDist * actualDist - l2 * l2) / (2 * l1 * actualDist);
  const clampedCosA = Math.max(-1, Math.min(1, cosA));
  const angleA = Math.acos(clampedCosA);

  const sign = flipKnee ? -1 : 1;
  const jointAngle = baseAngle + sign * angleA;

  const jointX = rootX + Math.cos(jointAngle) * l1;
  const jointY = rootY + Math.sin(jointAngle) * l1;

  return { jointX, jointY, endX: targetX, endY: targetY };
}

// 核心参数化骨骼解算器
export function computePelicanRig(t, options = {}) {
  const scale = options.scale || 1.0;
  const baseX = options.x || 0;
  const baseY = options.y || 0;

  // 120 BPM: 一拍0.5s，两拍1.0s正好转一圈 (2*PI rad/s)
  const crankPeriod = 1.0;
  const crankAngle = ((t % crankPeriod) / crankPeriod) * Math.PI * 2;

  // 自行车几何尺寸
  const wheelRadius = 75 * scale;
  const wheelBase = 220 * scale; // 前后轮轴距
  const rearHub = { x: baseX - wheelBase * 0.45, y: baseY };
  const frontHub = { x: baseX + wheelBase * 0.55, y: baseY };
  
  // 五通中心 (Bottom Bracket)
  const bb = { x: baseX - 15 * scale, y: baseY - 12 * scale };
  const crankR = 24 * scale;

  // 左右踏板坐标 (反相180度)
  const pedalRight = {
    x: bb.x + Math.cos(crankAngle) * crankR,
    y: bb.y + Math.sin(crankAngle) * crankR
  };
  const pedalLeft = {
    x: bb.x + Math.cos(crankAngle + Math.PI) * crankR,
    y: bb.y + Math.sin(crankAngle + Math.PI) * crankR
  };

  // 鞍座与车把
  // 踩踏时臀部随发力产生的微小颠簸 (频率为每拍一次 = 2Hz)
  const bobbing = Math.sin(t * Math.PI * 4) * (2.5 * scale);
  const saddle = { x: bb.x - 22 * scale, y: baseY - 110 * scale + bobbing };
  const headset = { x: frontHub.x - 35 * scale, y: baseY - 125 * scale };
  const handlebar = { x: headset.x + 8 * scale, y: headset.y - 18 * scale };

  // 鹈鹕臀部与骨盆 (坐在鞍座上)
  const hip = { x: saddle.x + 4 * scale, y: saddle.y - 8 * scale };

  // 鹈鹕腿部骨骼长 (大腿与小腿)
  const thighLen = 52 * scale;
  const shinLen = 56 * scale;

  // 解算左右腿 IK
  const legRight = solveIK2D(hip.x, hip.y, pedalRight.x, pedalRight.y, thighLen, shinLen, false);
  const legLeft = solveIK2D(hip.x, hip.y, pedalLeft.x, pedalLeft.y, thighLen, shinLen, false);

  // 鹈鹕躯干与胸部
  const chestTilt = Math.sin(t * Math.PI * 2) * 0.05; // 身体轻微前后晃
  const torsoVector = { x: 42 * scale, y: -26 * scale };
  const chest = {
    x: hip.x + torsoVector.x + chestTilt * 10 * scale,
    y: hip.y + torsoVector.y
  };

  // 鹈鹕翅膀与抓车把 (双翼搭在把手上)
  const shoulder = { x: chest.x - 6 * scale, y: chest.y + 4 * scale };
  const wingElbow = { x: shoulder.x + 22 * scale, y: shoulder.y + 12 * scale };

  // 鹈鹕长颈与头部
  const neckWave = Math.sin(t * Math.PI * 2) * (3.5 * scale);
  const neckBase = { x: chest.x + 10 * scale, y: chest.y - 12 * scale };
  const neckMid = { x: neckBase.x + 12 * scale + neckWave, y: neckBase.y - 36 * scale };
  const head = { x: neckMid.x + 16 * scale, y: neckMid.y - 28 * scale };

  // 鹈鹕标志性巨大长嘴与弹性喉囊 (Gular Pouch)
  const beakTip = { x: head.x + 88 * scale, y: head.y + 12 * scale };
  const pouchDroop = Math.sin(t * Math.PI * 2 + 0.8) * (5.0 * scale);
  const pouchBottom = { x: head.x + 42 * scale, y: head.y + 46 * scale + pouchDroop };

  // 车轮转动角 (速度与时间线性增长，带辐条)
  const wheelAngle = (t * 8) % (Math.PI * 2);

  return {
    scale,
    rearHub,
    frontHub,
    wheelRadius,
    wheelAngle,
    bb,
    saddle,
    headset,
    handlebar,
    pedalLeft,
    pedalRight,
    hip,
    legLeft,
    legRight,
    chest,
    shoulder,
    wingElbow,
    neckBase,
    neckMid,
    head,
    beakTip,
    pouchBottom
  };
}

// 默认通用鹈鹕骑车绘制器 (各风格可覆写或借用)
export function drawDefaultPelican(p, rig, options = {}) {
  p.push();

  const colorPalette = {
    frame: options.frameColor || [40, 45, 55],
    wheel: options.wheelColor || [30, 30, 30],
    body: options.bodyColor || [245, 245, 250],
    beak: options.beakColor || [240, 160, 45],
    pouch: options.pouchColor || [235, 120, 60],
    eye: options.eyeColor || [20, 20, 20],
    shadow: options.shadow || false,
    wireframe: options.wireframe || false
  };

  // 1. 车轮绘制
  const drawWheel = (hub) => {
    p.push();
    p.translate(hub.x, hub.y);
    // 外胎
    p.noFill();
    p.stroke(colorPalette.wheel[0], colorPalette.wheel[1], colorPalette.wheel[2]);
    p.strokeWeight(6 * rig.scale);
    p.ellipse(0, 0, rig.wheelRadius * 2, rig.wheelRadius * 2);

    // 轮圈与辐条
    p.strokeWeight(1.5 * rig.scale);
    p.stroke(colorPalette.wheel[0] + 50, colorPalette.wheel[1] + 50, colorPalette.wheel[2] + 50);
    const spokes = 8;
    for (let i = 0; i < spokes; i++) {
      const a = rig.wheelAngle + (i * Math.PI * 2) / spokes;
      p.line(0, 0, Math.cos(a) * rig.wheelRadius, Math.sin(a) * rig.wheelRadius);
    }
    // 轴心
    p.fill(colorPalette.frame[0], colorPalette.frame[1], colorPalette.frame[2]);
    p.noStroke();
    p.ellipse(0, 0, 12 * rig.scale, 12 * rig.scale);
    p.pop();
  };

  // 1. 远景后轮与左腿
  drawWheel(rig.rearHub);

  // 远景左腿 (带关节微暗层)
  p.stroke(Math.max(0, colorPalette.body[0] - 40), Math.max(0, colorPalette.body[1] - 40), Math.max(0, colorPalette.body[2] - 40));
  p.strokeWeight(5 * rig.scale);
  p.strokeCap(p.ROUND);
  p.strokeJoin(p.ROUND);
  p.line(rig.hip.x, rig.hip.y, rig.legLeft.jointX, rig.legLeft.jointY);
  p.line(rig.legLeft.jointX, rig.legLeft.jointY, rig.pedalLeft.x, rig.pedalLeft.y);

  // 2. 自行车车架管件
  p.stroke(colorPalette.frame[0], colorPalette.frame[1], colorPalette.frame[2]);
  p.strokeWeight(5.5 * rig.scale);
  p.strokeCap(p.ROUND);
  p.strokeJoin(p.ROUND);

  // 后三角 (Rear hub -> BB -> Saddle -> Rear hub)
  p.line(rig.rearHub.x, rig.rearHub.y, rig.bb.x, rig.bb.y);
  p.line(rig.bb.x, rig.bb.y, rig.saddle.x, rig.saddle.y);
  p.line(rig.saddle.x, rig.saddle.y, rig.rearHub.x, rig.rearHub.y);

  // 前主梁 (BB -> Headset, Saddle -> Headset)
  p.line(rig.bb.x, rig.bb.y, rig.headset.x, rig.headset.y);
  p.line(rig.saddle.x, rig.saddle.y, rig.headset.x, rig.headset.y);

  // 前叉与车把 (Headset -> Front Hub, Headset -> Handlebar)
  p.line(rig.headset.x, rig.headset.y, rig.frontHub.x, rig.frontHub.y);
  p.line(rig.headset.x, rig.headset.y, rig.handlebar.x, rig.handlebar.y);

  // 鞍座坐垫
  p.stroke(30, 30, 30);
  p.strokeWeight(8 * rig.scale);
  p.line(rig.saddle.x - 16 * rig.scale, rig.saddle.y, rig.saddle.x + 14 * rig.scale, rig.saddle.y - 2 * rig.scale);

  // 牙盘曲柄
  p.stroke(160, 165, 175);
  p.strokeWeight(3.5 * rig.scale);
  p.line(rig.bb.x, rig.bb.y, rig.pedalLeft.x, rig.pedalLeft.y);
  p.line(rig.bb.x, rig.bb.y, rig.pedalRight.x, rig.pedalRight.y);

  // 踏板
  p.stroke(20, 20, 20);
  p.strokeWeight(6 * rig.scale);
  p.line(rig.pedalLeft.x - 6 * rig.scale, rig.pedalLeft.y, rig.pedalLeft.x + 6 * rig.scale, rig.pedalLeft.y);
  p.line(rig.pedalRight.x - 6 * rig.scale, rig.pedalRight.y, rig.pedalRight.x + 6 * rig.scale, rig.pedalRight.y);

  // 3. 前轮绘制
  drawWheel(rig.frontHub);

  // 4. 近景右腿
  p.stroke(225, 145, 45);
  p.strokeWeight(6 * rig.scale);
  p.line(rig.hip.x, rig.hip.y, rig.legRight.jointX, rig.legRight.jointY);
  p.line(rig.legRight.jointX, rig.legRight.jointY, rig.pedalRight.x, rig.pedalRight.y);

  // 5. 鹈鹕躯体绘制
  // 身体羽毛块面
  const ctx = p.drawingContext;
  ctx.save();
  ctx.fillStyle = `rgb(${colorPalette.body[0]}, ${colorPalette.body[1]}, ${colorPalette.body[2]})`;
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

  // 优雅 S 型颈部
  p.stroke(colorPalette.body[0], colorPalette.body[1], colorPalette.body[2]);
  p.strokeWeight(16 * rig.scale);
  p.noFill();
  p.bezier(
    rig.neckBase.x, rig.neckBase.y,
    rig.neckMid.x - 14 * rig.scale, rig.neckMid.y,
    rig.neckMid.x + 10 * rig.scale, rig.neckMid.y - 12 * rig.scale,
    rig.head.x, rig.head.y
  );

  // 头部圆润结构
  p.noStroke();
  p.fill(colorPalette.body[0], colorPalette.body[1], colorPalette.body[2]);
  p.ellipse(rig.head.x, rig.head.y, 28 * rig.scale, 24 * rig.scale);

  // 巨大喉囊 (Gular Pouch 原生 2D Path)
  ctx.save();
  ctx.fillStyle = `rgba(${colorPalette.pouch[0]}, ${colorPalette.pouch[1]}, ${colorPalette.pouch[2]}, 0.9)`;
  ctx.beginPath();
  ctx.moveTo(rig.head.x + 10 * rig.scale, rig.head.y + 4 * rig.scale);
  ctx.bezierCurveTo(
    rig.head.x + 22 * rig.scale, rig.pouchBottom.y,
    rig.pouchBottom.x, rig.pouchBottom.y + 6 * rig.scale,
    rig.beakTip.x - 12 * rig.scale, rig.beakTip.y
  );
  ctx.lineTo(rig.head.x + 12 * rig.scale, rig.head.y + 4 * rig.scale);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // 坚挺的长上喙
  p.fill(colorPalette.beak[0], colorPalette.beak[1], colorPalette.beak[2]);
  p.stroke(180, 110, 20);
  p.strokeWeight(2 * rig.scale);
  p.beginShape();
  p.vertex(rig.head.x + 8 * rig.scale, rig.head.y - 4 * rig.scale);
  p.vertex(rig.beakTip.x, rig.beakTip.y);
  p.vertex(rig.beakTip.x - 12 * rig.scale, rig.beakTip.y + 6 * rig.scale);
  p.vertex(rig.head.x + 10 * rig.scale, rig.head.y + 6 * rig.scale);
  p.vertex(rig.head.x + 8 * rig.scale, rig.head.y - 4 * rig.scale);
  p.endShape();

  // 喙尖的小倒钩
  p.fill(160, 80, 20);
  p.triangle(
    rig.beakTip.x, rig.beakTip.y,
    rig.beakTip.x + 6 * rig.scale, rig.beakTip.y + 4 * rig.scale,
    rig.beakTip.x - 2 * rig.scale, rig.beakTip.y + 6 * rig.scale
  );

  // 眼睛 (黑眼珠与高光)
  p.noStroke();
  p.fill(colorPalette.eye[0], colorPalette.eye[1], colorPalette.eye[2]);
  p.ellipse(rig.head.x + 4 * rig.scale, rig.head.y - 2 * rig.scale, 5 * rig.scale, 5 * rig.scale);
  p.fill(255, 255, 255);
  p.ellipse(rig.head.x + 5 * rig.scale, rig.head.y - 3 * rig.scale, 1.8 * rig.scale, 1.8 * rig.scale);

  // 翅膀搭在车把上 (手臂/翼羽)
  p.stroke(colorPalette.body[0] - 25, colorPalette.body[1] - 25, colorPalette.body[2] - 20);
  p.strokeWeight(8 * rig.scale);
  p.noFill();
  p.bezier(
    rig.shoulder.x, rig.shoulder.y,
    rig.wingElbow.x, rig.wingElbow.y,
    rig.handlebar.x - 10 * rig.scale, rig.handlebar.y + 12 * rig.scale,
    rig.handlebar.x, rig.handlebar.y
  );

  // 5. 前景右腿 (近景层)
  p.stroke(240, 155, 45);
  p.strokeWeight(6.5 * rig.scale);
  p.line(rig.hip.x, rig.hip.y, rig.legRight.jointX, rig.legRight.jointY);
  p.line(rig.legRight.jointX, rig.legRight.jointY, rig.pedalRight.x, rig.pedalRight.y);

  p.pop();
}
