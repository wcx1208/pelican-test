// src/scenes/s20_code_aesthetic.js
// 20. 代码美学 Code & Procedural Vector (2020s，大模型时代)
// 干净深色现代化代码编辑器，SVG代码逐行敲出，贝塞尔控制点与锚点一笔笔连线勾勒，全片最精致的答卷

import { computePelicanRig, drawDefaultPelican } from '../rig/rig.js';

export function render(p, localT, beat, camera) {
  p.push();

  // 1. 现代化深色代码编辑器窗口背景 (VS Code / Dark+ 风格)
  p.noStroke();
  p.fill(24, 26, 32); // 主工作区深灰底色
  p.rect(0, 0, 1000, 1000);

  // 顶部活动栏与标签页 (Tab Bar)
  p.fill(33, 37, 46);
  p.rect(0, 0, 1000, 48);

  // 激活的文件标签页: pelican_masterpiece.svg
  p.fill(24, 26, 32);
  p.rect(180, 8, 260, 40, 4, 4, 0, 0);
  // SVG 图标 (橙色小圆)
  p.fill(245, 150, 40);
  p.ellipse(205, 28, 12, 12);
  p.fill(220, 225, 235);
  p.textSize(15);
  p.textStyle(p.NORMAL);
  p.textAlign(p.LEFT, p.CENTER);
  p.text('pelican_masterpiece.svg', 225, 28);

  // 左侧文件树侧边栏 (File Explorer, 宽 180px)
  p.fill(18, 20, 24);
  p.rect(0, 48, 180, 952);
  p.fill(110, 120, 140);
  p.textSize(12);
  p.textStyle(p.BOLD);
  p.text('EXPLORER: PELICAN', 20, 72);

  p.textStyle(p.NORMAL);
  p.textSize(13);
  p.fill(150, 160, 180);
  p.text('▾ src', 20, 105);
  p.text('    pelican.svg', 20, 132);
  p.text('    beat.ts', 20, 158);
  p.text('    physics.rs', 20, 184);
  p.text('    neural_rig.py', 20, 210);

  // 代码编辑区 (行号槽 Gutter + 逐行打字代码)
  p.fill(28, 32, 40);
  p.rect(180, 48, 340, 952); // 代码面板

  // 行号与语法高亮代码内容
  const svgLines = [
    { num: '01', tag: '<svg viewBox="0 0 1000 1000">', col: [86, 156, 214] },
    { num: '02', tag: '  <!-- Gemini 3.8 Procedural Rig -->', col: [106, 153, 85] },
    { num: '03', tag: '  <defs>', col: [86, 156, 214] },
    { num: '04', tag: '    <linearGradient id="feather">', col: [156, 220, 254] },
    { num: '05', tag: '      <stop color="#ffffff"/>', col: [206, 145, 120] },
    { num: '06', tag: '    </linearGradient>', col: [156, 220, 254] },
    { num: '07', tag: '  </defs>', col: [86, 156, 214] },
    { num: '08', tag: '  <g id="bicycle" stroke="#00d2ff">', col: [78, 201, 176] },
    { num: '09', tag: '    <circle cx="rHub" r="75"/>', col: [156, 220, 254] },
    { num: '10', tag: '    <circle cx="fHub" r="75"/>', col: [156, 220, 254] },
    { num: '11', tag: '    <path d="M bb L saddle L hub"/>', col: [220, 220, 170] },
    { num: '12', tag: '  </g>', col: [78, 201, 176] },
    { num: '13', tag: '  <path id="pelican_body"', col: [86, 156, 214] },
    { num: '14', tag: '    d="M hip C chest neck head"/>', col: [206, 145, 120] },
    { num: '15', tag: '  <path id="gular_pouch"', col: [86, 156, 214] },
    { num: '16', tag: '    d="M head Q tip pouchBottom"/>', col: [206, 145, 120] },
    { num: '17', tag: '</svg>', col: [86, 156, 214] }
  ];

  // 随时间逐行高亮输入
  const activeLineIdx = Math.min(svgLines.length - 1, Math.floor((localT / 6.0) * svgLines.length));

  p.textSize(12);
  p.textAlign(p.LEFT, p.CENTER);
  for (let l = 0; l < svgLines.length; l++) {
    const ly = 80 + l * 28;
    // 行号
    p.fill(90, 100, 120);
    p.text(svgLines[l].num, 195, ly);

    // 正在输入的当前行背景高亮
    if (l === activeLineIdx) {
      p.fill(40, 48, 64);
      p.rect(220, ly - 12, 290, 24, 2);
    }

    // 代码文本
    if (l <= activeLineIdx) {
      p.fill(svgLines[l].col[0], svgLines[l].col[1], svgLines[l].col[2]);
      p.text(svgLines[l].tag, 230, ly);
    }
  }

  // 2. 右侧画布区域 (Preview Area, 520 ~ 1000)
  // 矢量刻度网格 (Sub-pixel Vector Grid)
  p.stroke(38, 42, 54);
  p.strokeWeight(1);
  for (let gx = 520; gx < 1000; gx += 40) {
    p.line(gx, 48, gx, 1000);
  }
  for (let gy = 48; gy < 1000; gy += 40) {
    p.line(520, gy, 1000, gy);
  }

  // 3. 动态解算当前帧的矢量骨骼
  const pelicanX = 580 + (localT / 6.0) * 320;
  const groundY = 705;

  const rig = computePelicanRig(localT, {
    x: pelicanX,
    y: groundY,
    scale: 1.05
  });

  // 4. 极致精致的矢量黄金鹈鹕与未来概念轻量车架！
  // 绘制主体
  drawDefaultPelican(p, rig, {
    bodyColor: [255, 255, 255],
    beakColor: [255, 175, 40],
    pouchColor: [230, 85, 45],
    frameColor: [0, 180, 255],
    wheelColor: [60, 70, 90],
    eyeColor: [10, 15, 25]
  });

  // 5. 核心艺术答卷亮点：实时渲染贝塞尔曲线控制点、手柄切线与锚点 (Anchor Points & Handles)！
  // 展现“纯代码与矢量几何正在一笔笔构建生命”的大模型时代最高美学！
  p.stroke(0, 220, 255, 200);
  p.strokeWeight(1.5);
  p.noFill();

  // 颈部贝塞尔曲线切线控制柄
  p.line(rig.neckBase.x, rig.neckBase.y, rig.neckMid.x - 14 * rig.scale, rig.neckMid.y);
  p.line(rig.head.x, rig.head.y, rig.neckMid.x + 10 * rig.scale, rig.neckMid.y - 12 * rig.scale);

  // 方形锚点 (Illustrator / Figma 矢量节点)
  const drawAnchor = (ax, ay, col = [0, 220, 255]) => {
    p.fill(col[0], col[1], col[2]);
    p.stroke(255, 255, 255);
    p.strokeWeight(1.5);
    p.rect(ax - 4, ay - 4, 8, 8);
  };

  // 圆形手柄端点
  const drawHandle = (hx, hy) => {
    p.fill(255, 255, 255);
    p.stroke(0, 220, 255);
    p.strokeWeight(1.5);
    p.ellipse(hx, hy, 6, 6);
  };

  drawAnchor(rig.bb.x, rig.bb.y);
  drawAnchor(rig.saddle.x, rig.saddle.y);
  drawAnchor(rig.headset.x, rig.headset.y);
  drawAnchor(rig.handlebar.x, rig.handlebar.y);
  drawAnchor(rig.rearHub.x, rig.rearHub.y);
  drawAnchor(rig.frontHub.x, rig.frontHub.y);

  drawAnchor(rig.neckBase.x, rig.neckBase.y, [255, 175, 40]);
  drawAnchor(rig.head.x, rig.head.y, [255, 175, 40]);
  drawAnchor(rig.beakTip.x, rig.beakTip.y, [255, 60, 60]);

  drawHandle(rig.neckMid.x - 14 * rig.scale, rig.neckMid.y);
  drawHandle(rig.neckMid.x + 10 * rig.scale, rig.neckMid.y - 12 * rig.scale);

  // 底部编辑器状态栏 (Status Bar)
  p.noStroke();
  p.fill(0, 122, 204); // VS Code 蓝
  p.rect(0, 975, 1000, 25);
  p.fill(255, 255, 255);
  p.textSize(11);
  p.textAlign(p.LEFT, p.CENTER);
  p.text('  Ln ' + (activeLineIdx + 1) + ', Col 1 | UTF-8 | XML/SVG | Prettier | Pelican Rig: OK (120 BPM synced)', 10, 987);

  p.pop();
}
