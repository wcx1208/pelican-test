// src/main/main.js
// 鹈鹕测试主调度器、画框系统、连续长卷路面与镜头控制器

import { getTimelineInfo, SCENE_CONFIGS, TOTAL_DURATION } from '../beat/beat.js';
import { SCENE_RENDERERS } from '../scenes/index.js';
import { renderIntro } from './intro.js';
import { renderOutro } from './outro.js';
import { drawArtFrame, drawSceneTitleCard } from '../kit/kit.js';

export function renderAt(t, p) {
  const info = getTimelineInfo(t);

  // 1. Intro 开场阶段 (0 ~ 5.0s)
  if (info.phase === 'intro') {
    renderIntro(p, info.localT, info.globalBeat);
    return;
  }

  // 2. Outro 尾声阶段 (125.0s ~ 137.0s)
  if (info.phase === 'outro') {
    renderOutro(p, info.localT, info.globalBeat);
    return;
  }

  // 3. 正片 20 个时代版块 (5.0s ~ 125.0s)
  const sceneIdx = info.sceneIndex;
  const config = info.sceneConfig;
  const renderer = SCENE_RENDERERS[sceneIdx];

  p.push();

  // 1920x1080 居中适配与镜头控制
  // 基础底色
  p.background(15, 17, 22);

  // 镜头微推效果 (过画框强拍轻微推近)
  // 每个版块开始前0.5s以及结束后0.5s有轻微过框推近感
  let frameZoom = 1.0;
  if (info.localT < 0.6) {
    const punch = Math.sin((info.localT / 0.6) * Math.PI);
    frameZoom = 1.0 + punch * 0.04;
  } else if (info.localT > 5.4) {
    const punch = Math.sin(((info.localT - 5.4) / 0.6) * Math.PI);
    frameZoom = 1.0 + punch * 0.04;
  }

  // 画布居中平移并施加镜头缩放
  p.translate(1920 / 2, 1080 / 2);
  p.scale(frameZoom);
  p.translate(-1920 / 2, -1080 / 2);

  // 绘制 1000x1000 单位作画空间 (等比适配至中央 1000x1000)
  const sceneOffsetX = (1920 - 1000) / 2; // 460
  const sceneOffsetY = (1080 - 1000) / 2; // 40

  p.push();
  p.translate(sceneOffsetX, sceneOffsetY);

  // 渲染当前时代的主体纯函数画面
  if (renderer) {
    renderer(p, info.localT, info.globalBeat, null);
  }

  // 绘制穿透当前时代的专属艺术画框
  drawArtFrame(p, 0, 0, 1000, 1000, config.key);

  p.pop();

  // 4. 贯穿全片的地面基准延展路面 (连接画布左右边缘)
  p.stroke(40, 42, 48);
  p.strokeWeight(8);
  p.line(0, sceneOffsetY + 785, sceneOffsetX, sceneOffsetY + 785);
  p.line(sceneOffsetX + 1000, sceneOffsetY + 785, 1920, sceneOffsetY + 785);

  // 5. 时代标题卡显示 (在1080p下左上角清晰可读，淡入淡出)
  let titleAlpha = 240;
  if (info.localT < 0.5) {
    titleAlpha = p.map(info.localT, 0, 0.5, 0, 240);
  } else if (info.localT > 5.2) {
    titleAlpha = p.map(info.localT, 5.2, 6.0, 240, 0);
  }
  drawSceneTitleCard(p, config, 60, 60, titleAlpha);

  p.pop();
}
