// src/scenes/s15_oscilloscope.js
// 15. 示波器矢量图 (1950s，绿色荧光矢量扫描)
// 圆形荧光屏，绿线余辉拖尾；梗：转错旋钮扭成李萨如图形，下一拍弹回原形

import { computePelicanRig } from '../rig/rig.js';
import { computeLissajousPoint, drawCRTScanlines } from '../kit/kit.js';

export function render(p, localT, beat, camera) {
  p.push();

  // 1. 示波器黑底与圆形阴极射线管 (CRT) 荧光屏
  p.noStroke();
  p.fill(12, 16, 14); // 仪器面板深黑
  p.rect(0, 0, 1000, 1000);

  // 圆形荧光屏玻璃内胆 (微绿底色)
  p.fill(18, 38, 26);
  p.stroke(35, 60, 45);
  p.strokeWeight(12);
  p.ellipse(500, 500, 880, 880);

  // 示波器刻度网格 (格线 1cm x 1cm 极细微弱绿色)
  p.stroke(0, 255, 100, 35);
  p.strokeWeight(1.2);
  for (let x = 120; x <= 880; x += 55) {
    p.line(x, 100, x, 900);
  }
  for (let y = 120; y <= 880; y += 55) {
    p.line(100, y, 900, y);
  }
  // 十字中心轴加粗带微点刻度
  p.stroke(0, 255, 100, 70);
  p.line(500, 100, 500, 900);
  p.line(100, 500, 900, 500);

  // 2. 核心笑点判断：2.2s ~ 3.4s 期间转错旋钮，瞬间扭曲为李萨如图形！
  const isGlitching = localT >= 2.2 && localT <= 3.4;
  const glitchProgress = isGlitching ? (localT - 2.2) / 1.2 : 0;

  // 电子束扫描抖动 (Jitter)
  const jitterX = (Math.random() - 0.5) * 2.5;
  const jitterY = (Math.random() - 0.5) * 2.5;

  const pelicanX = 220 + (localT / 6.0) * 560;
  const groundY = 690;

  const rig = computePelicanRig(localT, {
    x: pelicanX,
    y: groundY,
    scale: 1.05
  });

  p.push();
  p.translate(jitterX, jitterY);

  if (isGlitching) {
    // 扭曲成疯狂交织的李萨如波形
    p.noFill();
    p.stroke(0, 255, 120);
    p.strokeWeight(4);

    const lissajousCenter = { x: pelicanX, y: groundY - 120 };
    const warpFreqA = 3 + Math.sin(glitchProgress * Math.PI) * 4;
    const warpFreqB = 4 + Math.cos(glitchProgress * Math.PI) * 3;

    // 绘制主扭曲光带
    p.beginShape();
    for (let t = 0; t <= Math.PI * 4; t += 0.08) {
      const pt = computeLissajousPoint(t + localT * 12, warpFreqA, warpFreqB, Math.PI / 2, 180);
      p.vertex(lissajousCenter.x + pt.x, lissajousCenter.y + pt.y);
    }
    p.endShape();

    // 强绿色光晕覆层
    p.stroke(180, 255, 210, 160);
    p.strokeWeight(2);
    p.beginShape();
    for (let t = 0; t <= Math.PI * 4; t += 0.08) {
      const pt = computeLissajousPoint(t + localT * 12, warpFreqA, warpFreqB, Math.PI / 2, 178);
      p.vertex(lissajousCenter.x + pt.x, lissajousCenter.y + pt.y);
    }
    p.endShape();

    // 示波器屏幕下方警告与调谐指示
    p.noStroke();
    p.fill(0, 255, 120, 230);
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(16);
    p.text('CH1 FREQ OVERLOAD: LISSAJOUS PHASE ERROR', 500, 840);
  } else {
    // 正常发光绿色电子束线条 (双层绘制：外层宽透明发光，内层高亮细线)
    const drawScopeLine = (x1, y1, x2, y2) => {
      // 绿光余辉拖尾层
      p.stroke(0, 255, 100, 80);
      p.strokeWeight(8 * rig.scale);
      p.line(x1, y1, x2, y2);
      // 核心高能电子束
      p.stroke(180, 255, 200, 255);
      p.strokeWeight(2.5 * rig.scale);
      p.line(x1, y1, x2, y2);
    };

    const drawScopeCircle = (x, y, r) => {
      p.stroke(0, 255, 100, 80);
      p.strokeWeight(8 * rig.scale);
      p.ellipse(x, y, r * 2, r * 2);
      p.stroke(180, 255, 200, 255);
      p.strokeWeight(2.5 * rig.scale);
      p.ellipse(x, y, r * 2, r * 2);
    };

    p.noFill();
    // 车轮
    drawScopeCircle(rig.rearHub.x, rig.rearHub.y, rig.wheelRadius);
    drawScopeCircle(rig.frontHub.x, rig.frontHub.y, rig.wheelRadius);

    // 车架
    drawScopeLine(rig.rearHub.x, rig.rearHub.y, rig.bb.x, rig.bb.y);
    drawScopeLine(rig.bb.x, rig.bb.y, rig.saddle.x, rig.saddle.y);
    drawScopeLine(rig.saddle.x, rig.saddle.y, rig.rearHub.x, rig.rearHub.y);
    drawScopeLine(rig.bb.x, rig.bb.y, rig.headset.x, rig.headset.y);
    drawScopeLine(rig.saddle.x, rig.saddle.y, rig.headset.x, rig.headset.y);
    drawScopeLine(rig.headset.x, rig.headset.y, rig.frontHub.x, rig.frontHub.y);
    drawScopeLine(rig.headset.x, rig.headset.y, rig.handlebar.x, rig.handlebar.y);

    // 踩踏双腿
    drawScopeLine(rig.hip.x, rig.hip.y, rig.legRight.jointX, rig.legRight.jointY);
    drawScopeLine(rig.legRight.jointX, rig.legRight.jointY, rig.pedalRight.x, rig.pedalRight.y);

    // 鹈鹕轮廓矢量线
    drawScopeLine(rig.neckBase.x, rig.neckBase.y, rig.head.x, rig.head.y);
    drawScopeLine(rig.head.x, rig.head.y, rig.beakTip.x, rig.beakTip.y);
    drawScopeLine(rig.beakTip.x, rig.beakTip.y, rig.pouchBottom.x, rig.pouchBottom.y);
    drawScopeLine(rig.pouchBottom.x, rig.pouchBottom.y, rig.head.x + 8, rig.head.y + 6);
    drawScopeLine(rig.head.x, rig.head.y, rig.shoulder.x, rig.shoulder.y);
    drawScopeLine(rig.shoulder.x, rig.shoulder.y, rig.hip.x, rig.hip.y);
    drawScopeLine(rig.shoulder.x, rig.shoulder.y, rig.handlebar.x, rig.handlebar.y);

    // 地平扫描基准线
    drawScopeLine(100, 770, 900, 770);
  }

  p.pop();

  // 3. 示波器金属外壳旋钮 (画面右下角控制台)
  p.fill(40, 48, 44);
  p.stroke(20, 25, 22);
  p.strokeWeight(3);
  p.rect(840, 840, 140, 140, 10);
  // 旋钮 (当故障时旋钮旋转)
  p.fill(25, 30, 28);
  p.ellipse(910, 910, 50, 50);
  p.stroke(200, 200, 200);
  p.strokeWeight(3);
  const knobAngle = isGlitching ? Math.sin(glitchProgress * Math.PI) * 2.8 : 0;
  p.line(910, 910, 910 + Math.cos(knobAngle - 1.5) * 22, 910 + Math.sin(knobAngle - 1.5) * 22);

  // CRT 扫描细线
  drawCRTScanlines(p, 1000, 1000, 5, 25);

  p.pop();
}
