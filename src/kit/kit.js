// src/kit/kit.js
// 鹈鹕测试专用绘图工具箱与艺术材质引擎

// 1. 李萨如图形计算器 (用于示波器旋钮故障与弹回)
export function computeLissajousPoint(t, a = 3, b = 4, delta = Math.PI / 2, size = 100) {
  const x = Math.sin(a * t + delta) * size;
  const y = Math.sin(b * t) * size;
  return { x, y };
}

// 2. 伪随机数发生器 (确定性噪声，确保帧纯函数自洽)
export function pseudoNoise(seed) {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453123;
  return x - Math.floor(x);
}

// 3. 宣纸与羊皮纸做旧底色生成
export function drawParchmentBackground(p, width, height, baseColor = [245, 238, 220], seed = 42) {
  p.push();
  p.noStroke();
  p.fill(baseColor[0], baseColor[1], baseColor[2]);
  p.rect(0, 0, width, height);

  // 柔和暗角与微小纤维
  p.fill(baseColor[0] - 25, baseColor[1] - 30, baseColor[2] - 40, 25);
  for (let i = 0; i < 120; i++) {
    const rx = pseudoNoise(seed + i * 3) * width;
    const ry = pseudoNoise(seed + i * 3 + 1) * height;
    const rw = 2 + pseudoNoise(seed + i * 3 + 2) * 60;
    const rh = 1 + pseudoNoise(seed + i * 3 + 3) * 3;
    const rot = pseudoNoise(seed + i * 7) * Math.PI;
    p.push();
    p.translate(rx, ry);
    p.rotate(rot);
    p.rect(-rw / 2, -rh / 2, rw, rh);
    p.pop();
  }
  p.pop();
}

// 4. 水墨枯笔飞白与浓淡笔法 (模拟中国水墨与白描)
export function drawInkStroke(p, x1, y1, x2, y2, thickness = 4, inkDensity = 0.85, dryBrush = true) {
  p.push();
  const d = Math.hypot(x2 - x1, y2 - y1);
  const steps = Math.max(8, Math.floor(d / 3));
  p.noStroke();
  
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const x = x1 + (x2 - x1) * t;
    const y = y1 + (y2 - y1) * t;
    const jitter = (pseudoNoise(x * 0.1 + y * 0.1) - 0.5) * (thickness * 0.25);
    const curThick = thickness * (0.8 + 0.4 * Math.sin(t * Math.PI));
    
    // 飞白断笔
    if (dryBrush && pseudoNoise(x * 0.5 + y * 0.5) > 0.82) {
      continue;
    }
    
    const alpha = (inkDensity * 255) * (0.7 + 0.3 * pseudoNoise(x + y));
    p.fill(20, 20, 22, alpha);
    p.ellipse(x + jitter, y + jitter, curThick, curThick * 0.8);
  }
  p.pop();
}

// 5. CRT 扫描线与荧光发光层 (用于示波器、像素游戏与早期聊天窗)
export function drawCRTScanlines(p, width, height, lineSpacing = 4, alpha = 35) {
  p.push();
  p.stroke(0, 0, 0, alpha);
  p.strokeWeight(1);
  for (let y = 0; y < height; y += lineSpacing) {
    p.line(0, y, width, y);
  }
  p.pop();
}

// 6. 胶片噪点覆层
export function drawFilmGrain(p, width, height, density = 0.04, t = 0) {
  p.push();
  p.noStroke();
  const step = 8;
  for (let x = 0; x < width; x += step) {
    for (let y = 0; y < height; y += step) {
      const n = pseudoNoise(x * 0.05 + y * 0.05 + Math.floor(t * 12));
      if (n > 1 - density) {
        p.fill(255, 255, 255, 28);
        p.rect(x, y, step * 0.8, step * 0.8);
      } else if (n < density * 0.5) {
        p.fill(0, 0, 0, 28);
        p.rect(x, y, step * 0.8, step * 0.8);
      }
    }
  }
  p.pop();
}

// 7. 时代画框发生器 (每过一道画框就换一种画风)
export function drawArtFrame(p, x, y, width, height, styleKey) {
  p.push();
  p.translate(x, y);

  switch (styleKey) {
    case 'sahara':
      // 撒哈拉原始粗砺岩石框
      p.noFill();
      p.stroke(130, 70, 45);
      p.strokeWeight(24);
      p.rect(0, 0, width, height, 16);
      p.stroke(80, 40, 25);
      p.strokeWeight(8);
      p.rect(6, 6, width - 12, height - 12, 12);
      break;

    case 'egypt':
      // 埃及泥板与黄金象形滚边
      p.noFill();
      p.stroke(190, 150, 60);
      p.strokeWeight(22);
      p.rect(0, 0, width, height);
      p.stroke(40, 110, 130);
      p.strokeWeight(6);
      p.rect(8, 8, width - 16, height - 16);
      break;

    case 'han_rubbing':
    case 'tang_baimiao':
    case 'song_landscape':
    case 'qingming':
    case 'bada_shanren':
      // 东方传统绫绢立轴装裱装帧边框
      p.noFill();
      p.stroke(75, 65, 55);
      p.strokeWeight(20);
      p.rect(0, 0, width, height);
      p.stroke(210, 195, 170);
      p.strokeWeight(6);
      p.rect(7, 7, width - 14, height - 14);
      break;

    case 'mughal_miniature':
      // 莫卧儿宫廷奢华金色复杂缠枝纹框
      p.noFill();
      p.stroke(212, 175, 55);
      p.strokeWeight(26);
      p.rect(0, 0, width, height);
      p.stroke(15, 80, 60);
      p.strokeWeight(8);
      p.rect(10, 10, width - 20, height - 20);
      break;

    case 'ukiyo_e':
      // 浮世绘木刻深色木框
      p.noFill();
      p.stroke(50, 35, 25);
      p.strokeWeight(22);
      p.rect(0, 0, width, height);
      p.stroke(230, 215, 190);
      p.strokeWeight(4);
      p.rect(8, 8, width - 16, height - 16);
      break;

    case 'starry_night':
    case 'the_scream':
      // 欧洲古典厚重雕花金框
      p.noFill();
      p.stroke(180, 140, 40);
      p.strokeWeight(26);
      p.rect(0, 0, width, height);
      p.stroke(90, 65, 20);
      p.strokeWeight(6);
      p.rect(10, 10, width - 20, height - 20);
      break;

    case 'nosferatu':
      // 1920年代默片黑白暗角圆角框
      p.noFill();
      p.stroke(25, 25, 25);
      p.strokeWeight(30);
      p.rect(0, 0, width, height, 40);
      p.stroke(180, 180, 180);
      p.strokeWeight(4);
      p.rect(12, 12, width - 24, height - 24, 30);
      break;

    case 'oscilloscope':
      // 示波器金属仪表外壳与弧形面板
      p.noFill();
      p.stroke(40, 48, 45);
      p.strokeWeight(28);
      p.rect(0, 0, width, height, 60);
      p.stroke(0, 255, 120, 180);
      p.strokeWeight(4);
      p.rect(10, 10, width - 20, height - 20, 50);
      break;

    case 'pixel_game':
      // 复古红白机塑料外壳卡带边框
      p.noFill();
      p.stroke(180, 30, 30);
      p.strokeWeight(20);
      p.rect(0, 0, width, height);
      p.stroke(230, 220, 200);
      p.strokeWeight(6);
      p.rect(8, 8, width - 16, height - 16);
      break;

    case 'vaporwave':
      // 蒸汽波粉青发光渐变框
      p.noFill();
      p.stroke(255, 113, 206);
      p.strokeWeight(18);
      p.rect(0, 0, width, height);
      p.stroke(1, 205, 254);
      p.strokeWeight(6);
      p.rect(8, 8, width - 16, height - 16);
      break;

    case 'code_aesthetic':
      // 现代深色 IDE 极简边框
      p.noFill();
      p.stroke(30, 30, 35);
      p.strokeWeight(18);
      p.rect(0, 0, width, height, 8);
      p.stroke(0, 122, 204);
      p.strokeWeight(4);
      p.rect(6, 6, width - 12, height - 12, 6);
      break;

    default:
      // 通用典雅画框
      p.noFill();
      p.stroke(80, 70, 60);
      p.strokeWeight(20);
      p.rect(0, 0, width, height);
      p.stroke(200, 190, 180);
      p.strokeWeight(4);
      p.rect(8, 8, width - 16, height - 16);
      break;
  }

  p.pop();
}

// 8. 时代风格标题卡绘制器 (1080p下清晰可读，中文名+英文名+年代)
export function drawSceneTitleCard(p, sceneConfig, x = 60, y = 60, alpha = 240) {
  if (!sceneConfig) return;
  p.push();
  p.translate(x, y);

  // 背景半透明底色卡片
  p.noStroke();
  p.fill(20, 22, 28, alpha * 0.78);
  p.rect(0, 0, 340, 96, 6);

  // 左侧时代风格色条
  p.fill(220, 160, 40, alpha);
  p.rect(0, 0, 8, 96, 6, 0, 0, 6);

  // 中文名与编号
  p.fill(255, 255, 255, alpha);
  p.textAlign(p.LEFT, p.TOP);
  p.textSize(22);
  p.textStyle(p.BOLD);
  p.text(`${sceneConfig.id}. ${sceneConfig.nameZh}`, 22, 14);

  // 英文名
  p.fill(210, 215, 225, alpha * 0.9);
  p.textSize(13);
  p.textStyle(p.NORMAL);
  p.text(sceneConfig.nameEn, 22, 44);

  // 年代与风格标签
  p.fill(235, 185, 75, alpha);
  p.textSize(12);
  p.text(`${sceneConfig.period} · ${sceneConfig.style}`, 22, 68);

  p.pop();
}
