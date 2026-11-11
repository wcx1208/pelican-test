// src/scenes/index.js
// 聚合导出 20 个时代的独立场景渲染纯函数

import { render as render01 } from './s01_sahara.js';
import { render as render02 } from './s02_egypt.js';
import { render as render03 } from './s03_han_rubbing.js';
import { render as render04 } from './s04_tang_baimiao.js';
import { render as render05 } from './s05_song_landscape.js';
import { render as render06 } from './s06_qingming.js';
import { render as render07 } from './s07_maya_codex.js';
import { render as render08 } from './s08_mughal_miniature.js';
import { render as render09 } from './s09_bada_shanren.js';
import { render as render10 } from './s10_wayang_kulit.js';
import { render as render11 } from './s11_ukiyo_e.js';
import { render as render12 } from './s12_starry_night.js';
import { render as render13 } from './s13_the_scream.js';
import { render as render14 } from './s14_nosferatu.js';
import { render as render15 } from './s15_oscilloscope.js';
import { render as render16 } from './s16_pixel_game.js';
import { render as render17 } from './s17_chat_window.js';
import { render as render18 } from './s18_vaporwave.js';
import { render as render19 } from './s19_short_video.js';
import { render as render20 } from './s20_code_aesthetic.js';

export const SCENE_RENDERERS = [
  render01, render02, render03, render04, render05,
  render06, render07, render08, render09, render10,
  render11, render12, render13, render14, render15,
  render16, render17, render18, render19, render20
];
