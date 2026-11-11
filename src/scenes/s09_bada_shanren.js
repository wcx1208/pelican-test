// src/scenes/s09_bada_shanren.js
// 9. 八大山人写意 (约1690，水墨写意)
// 寥寥几笔，大片留白，鹈鹕翻着标志性的八大山人白眼

import { computePelicanRig } from '../rig/rig.js';
import { drawParchmentBackground } from '../kit/kit.js';

export function render(p, localT, beat, camera) {
  p.push();

  // 1. 生宣纸底色 (大片大片的极简留白)
  drawParchmentBackground(p, 1000, 1000, [248, 246, 240], 1690);

  // 2. 八大山人经典构图：画面左侧一拳兀立怪石 (头重脚轻、上大下小、焦墨枯擦)
  p.noStroke();
  p.fill(32, 30, 28);
  p.beginShape();
  p.vertex(80, 850);
  p.vertex(60, 520);
  p.vertex(110, 360);
  p.vertex(190, 380);
  p.vertex(230, 480);
  p.vertex(160, 680);
  p.vertex(130, 850);
  p.endShape(p.CLOSE);

  // 石顶横生出的一枝残枯梅枝 (折芦描，冷硬如铁)
  p.stroke(25, 23, 22);
  p.strokeWeight(6);
  p.noFill();
  p.beginShape();
  p.vertex(180, 420);
  p.vertex(270, 390);
  p.vertex(320, 420);
  p.vertex(390, 380);
  p.endShape();

  // 枝头仅有一朵清冷墨梅
  p.strokeWeight(2);
  p.ellipse(395, 378, 12, 12);

  // 3. 鹈鹕与自行车
  const pelicanX = 240 + (localT / 6.0) * 520;
  const groundY = 705;

  const rig = computePelicanRig(localT, {
    x: pelicanX,
    y: groundY,
    scale: 1.05
  });

  // 4. 八大山人泼墨写意鹈鹕定制绘制 (不使用常规填色，纯用浓淡水墨泼染)
  // (1) 水墨车架与车轮
  p.stroke(25, 25, 25);
  p.strokeWeight(4.5 * rig.scale);
  // 后轮与前轮 (写意圆圈，带笔锋飞白)
  p.noFill();
  p.ellipse(rig.rearHub.x, rig.rearHub.y, rig.wheelRadius * 2, rig.wheelRadius * 2);
  p.ellipse(rig.frontHub.x, rig.frontHub.y, rig.wheelRadius * 2, rig.wheelRadius * 2);
  // 车架墨线
  p.line(rig.rearHub.x, rig.rearHub.y, rig.bb.x, rig.bb.y);
  p.line(rig.bb.x, rig.bb.y, rig.saddle.x, rig.saddle.y);
  p.line(rig.saddle.x, rig.saddle.y, rig.rearHub.x, rig.rearHub.y);
  p.line(rig.bb.x, rig.bb.y, rig.headset.x, rig.headset.y);
  p.line(rig.saddle.x, rig.saddle.y, rig.headset.x, rig.headset.y);
  p.line(rig.headset.x, rig.headset.y, rig.frontHub.x, rig.frontHub.y);
  p.line(rig.headset.x, rig.headset.y, rig.handlebar.x, rig.handlebar.y);

  // 腿与踏板
  p.line(rig.hip.x, rig.hip.y, rig.legLeft.jointX, rig.legLeft.jointY);
  p.line(rig.legLeft.jointX, rig.legLeft.jointY, rig.pedalLeft.x, rig.pedalLeft.y);
  p.line(rig.hip.x, rig.hip.y, rig.legRight.jointX, rig.legRight.jointY);
  p.line(rig.legRight.jointX, rig.legRight.jointY, rig.pedalRight.x, rig.pedalRight.y);

  // (2) 鹈鹕躯体 (浓淡大写意墨团泼墨)
  p.noStroke();
  p.fill(40, 38, 35, 230); // 焦墨浓泼
  p.ellipse(rig.chest.x - 15, rig.chest.y + 5, 80 * rig.scale, 55 * rig.scale);

  // 头部与长颈 (几笔淡墨擦出)
  p.stroke(40, 38, 35);
  p.strokeWeight(15 * rig.scale);
  p.line(rig.neckBase.x, rig.neckBase.y, rig.head.x, rig.head.y);

  // 标志性大嘴 (焦墨勾勒两笔)
  p.strokeWeight(3.5 * rig.scale);
  p.noFill();
  p.line(rig.head.x + 8, rig.head.y, rig.beakTip.x, rig.beakTip.y);
  p.line(rig.head.x + 8, rig.head.y + 12, rig.beakTip.x, rig.beakTip.y);

  // (3) 核心神髓：八大山人标志性死鱼眼 / 白眼！
  // 椭圆大眼眶全白，只有一颗极小的黑墨豆眼珠死死顶在上方翻白眼
  p.fill(255, 255, 255);
  p.stroke(20, 20, 20);
  p.strokeWeight(2);
  p.ellipse(rig.head.x + 2, rig.head.y - 4, 18 * rig.scale, 16 * rig.scale);

  // 黑眼珠顶在最高处 (向天翻白眼)
  p.fill(20, 20, 20);
  p.noStroke();
  p.ellipse(rig.head.x + 2, rig.head.y - 9, 4.5 * rig.scale, 4.5 * rig.scale);

  // 5. 右上角八大山人经典签名“八大山人 / 哭之笑之”花押与朱红闲章
  p.fill(30, 30, 30);
  p.textAlign(p.CENTER, p.TOP);
  p.textSize(24);
  p.textStyle(p.BOLD);
  p.text('八\n大\n山\n人', 880, 200);

  // 闲章朱红印泥 (方印)
  p.fill(180, 45, 35);
  p.noStroke();
  p.rect(865, 340, 30, 30, 2);
  p.fill(255, 255, 255);
  p.textSize(10);
  p.text('白\n眼', 880, 345);

  p.pop();
}
