// src/beat/beat.js
// 鹈鹕测试时间轴与节拍系统 (120 BPM, 1拍=0.5s, 1小节=2.0s)

export const BPM = 120;
export const SECONDS_PER_BEAT = 60 / BPM; // 0.5s
export const SECONDS_PER_BAR = SECONDS_PER_BEAT * 4; // 2.0s

export const INTRO_DURATION = 5.0; // 2.5 小节 (5 拍)
export const SCENE_DURATION = 6.0; // 3 小节 (12 拍)
export const TOTAL_SCENES = 20;
export const OUTRO_DURATION = 12.0; // 6 小节 (24 拍)

export const TOTAL_DURATION = INTRO_DURATION + (TOTAL_SCENES * SCENE_DURATION) + OUTRO_DURATION; // 137.0s

export const SCENE_CONFIGS = [
  { id: 1, key: 'sahara', nameZh: '撒哈拉岩画', nameEn: 'Saharan Rock Art', period: '约前4000', style: '塔西里风格' },
  { id: 2, key: 'egypt', nameZh: '埃及壁画', nameEn: 'Egyptian Tomb Painting', period: '约前1300', style: '新王国时期' },
  { id: 3, key: 'han_rubbing', nameZh: '汉画像石拓片', nameEn: 'Han Dynasty Stone Rubbing', period: '约100', style: '黑白水墨拓片' },
  { id: 4, key: 'tang_baimiao', nameZh: '唐代白描', nameEn: 'Tang Dynasty Ink Line', period: '约750', style: '吴带当风' },
  { id: 5, key: 'song_landscape', nameZh: '宋代山水', nameEn: 'Song Monumental Landscape', period: '约1000', style: '溪山行旅' },
  { id: 6, key: 'qingming', nameZh: '清明上河图', nameEn: 'Along the River at Qingming', period: '约1100', style: '界画淡彩' },
  { id: 7, key: 'maya_codex', nameZh: '玛雅抄本', nameEn: 'Maya Codex', period: '约1200', style: '折页树皮纸' },
  { id: 8, key: 'mughal_miniature', nameZh: '莫卧儿细密画', nameEn: 'Mughal Miniature', period: '约1600', style: '宫廷工笔' },
  { id: 9, key: 'bada_shanren', nameZh: '八大山人写意', nameEn: 'Bada Shanren Ink Sketch', period: '约1690', style: '写意白眼' },
  { id: 10, key: 'wayang_kulit', nameZh: '爪哇皮影戏', nameEn: 'Wayang Kulit Shadow Puppet', period: '约1800', style: '水牛皮镂雕' },
  { id: 11, key: 'ukiyo_e', nameZh: '浮世绘', nameEn: 'Ukiyo-e Woodblock Print', period: '1830s', style: '广重东海道' },
  { id: 12, key: 'starry_night', nameZh: '梵高星月夜', nameEn: 'Van Gogh The Starry Night', period: '1889', style: '后印象派漩涡' },
  { id: 13, key: 'the_scream', nameZh: '蒙克呐喊', nameEn: 'Munch The Scream', period: '1893', style: '表现主义木桥' },
  { id: 14, key: 'nosferatu', nameZh: '诺斯费拉图', nameEn: 'Nosferatu German Expressionism', period: '1922', style: '默片黑白暗影' },
  { id: 15, key: 'oscilloscope', nameZh: '示波器矢量图', nameEn: 'Oscilloscope Vector Graphics', period: '1950s', style: '绿色荧光余辉' },
  { id: 16, key: 'pixel_game', nameZh: '8-bit像素游戏', nameEn: '8-Bit Retro Arcade', period: '1980s', style: '横版FC卷轴' },
  { id: 17, key: 'chat_window', nameZh: '早期聊天窗口', nameEn: 'Early Instant Messenger', period: '2000s', style: '拟真抖动动图' },
  { id: 18, key: 'vaporwave', nameZh: '蒸汽波美学', nameEn: 'Vaporwave Aesthetic', period: '2010s', style: '网格与大理石' },
  { id: 19, key: 'short_video', nameZh: '竖屏短视频', nameEn: 'Vertical Short Video', period: '2020s', style: '9:16移动流媒体' },
  { id: 20, key: 'code_aesthetic', nameZh: '代码美学', nameEn: 'Code & Procedural Vector', period: '2020s', style: '大模型IDE与SVG' }
];

export function getTimelineInfo(t) {
  const clampedT = Math.max(0, Math.min(t, TOTAL_DURATION));
  const globalBeat = clampedT / SECONDS_PER_BEAT;
  const globalBar = clampedT / SECONDS_PER_BAR;

  // 1. Intro 阶段
  if (clampedT < INTRO_DURATION) {
    return {
      phase: 'intro',
      sceneIndex: -1,
      sceneConfig: null,
      localT: clampedT,
      progress: clampedT / INTRO_DURATION,
      globalT: clampedT,
      globalBeat,
      globalBar,
      crankAngle: (clampedT * Math.PI * 2) / 1.0
    };
  }

  // 2. 正片 20 个时代版块
  const sceneTime = clampedT - INTRO_DURATION;
  const maxSceneTotalTime = TOTAL_SCENES * SCENE_DURATION;

  if (sceneTime < maxSceneTotalTime) {
    const sceneIndex = Math.min(Math.floor(sceneTime / SCENE_DURATION), TOTAL_SCENES - 1);
    const localT = sceneTime - sceneIndex * SCENE_DURATION;
    const progress = localT / SCENE_DURATION;
    const sceneBar = localT / SECONDS_PER_BAR; // 0 ~ 3.0 小节
    const sceneBeat = localT / SECONDS_PER_BEAT; // 0 ~ 12.0 拍

    // 每一个版块内部包含三个小节:
    // bar 0~1 (0~2s): 进场
    // bar 1~2 (2~4s): 高光/小梗
    // bar 2~3 (4~6s): 冲向画框
    const subPhase = localT < 2.0 ? 'entry' : (localT < 4.0 ? 'highlight' : 'exit');

    return {
      phase: 'scene',
      sceneIndex,
      sceneConfig: SCENE_CONFIGS[sceneIndex],
      localT,
      progress,
      sceneBar,
      sceneBeat,
      subPhase,
      globalT: clampedT,
      globalBeat,
      globalBar,
      crankAngle: (clampedT * Math.PI * 2) / 1.0
    };
  }

  // 3. Outro 新闻发布会阶段
  const outroLocalT = clampedT - (INTRO_DURATION + maxSceneTotalTime);
  return {
    phase: 'outro',
    sceneIndex: TOTAL_SCENES,
    sceneConfig: null,
    localT: outroLocalT,
    progress: outroLocalT / OUTRO_DURATION,
    globalT: clampedT,
    globalBeat,
    globalBar,
    crankAngle: (clampedT * Math.PI * 2) / 1.0
  };
}

// 帧率量化辅助函数 (用于皮影戏、像素游戏、老聊天软件的顿挫感)
export function quantizeTime(t, targetFps = 10) {
  const step = 1 / targetFps;
  return Math.floor(t / step) * step;
}

// 平滑缓动函数
export function easeInOutCubic(x) {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

export function easeOutQuad(x) {
  return 1 - (1 - x) * (1 - x);
}
