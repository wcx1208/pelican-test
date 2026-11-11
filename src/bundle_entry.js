// src/bundle_entry.js
// 鹈鹕测试独立全功能打包入口 (双击本地 index.html 也能零配置无缝运行)

import { renderAt } from './main/main.js';
import { getTimelineInfo, TOTAL_DURATION, SCENE_CONFIGS, INTRO_DURATION, SCENE_DURATION } from './beat/beat.js';
import { buildPelicanSoundtrack, renderOfflineAudioBuffer, audioBufferToWav } from '../audio/synth.js';

let currentT = 0;
let isPlaying = false;
let lastAnimTime = performance.now();
let audioCtx = null;
let isMuted = false;
let p5Instance = null;

// 初始化页面控制逻辑
window.initPelicanApp = function () {
  const sceneSelect = document.getElementById('scene-select');
  if (sceneSelect && sceneSelect.children.length <= 1) {
    SCENE_CONFIGS.forEach((sc, i) => {
      const opt = document.createElement('option');
      const startT = INTRO_DURATION + i * SCENE_DURATION;
      opt.value = startT;
      opt.textContent = `${sc.id}. ${sc.nameZh} (${startT}s)`;
      sceneSelect.appendChild(opt);
    });
    const outroOpt = document.createElement('option');
    outroOpt.value = 125.0;
    outroOpt.textContent = '21. 尾声 新闻发布会 (125s)';
    sceneSelect.appendChild(outroOpt);
  }

  // p5.js 画布实例
  const sketch = (p) => {
    p.setup = () => {
      const renderer = p.createCanvas(1920, 1080);
      renderer.parent('stage-container');
      p.frameRate(60);
      window.__p5 = p;
      window.__ready = true;
    };

    p.draw = () => {
      if (isPlaying) {
        const now = performance.now();
        const dt = (now - lastAnimTime) / 1000;
        lastAnimTime = now;
        currentT += dt;
        if (currentT >= TOTAL_DURATION) {
          currentT = 0;
          isPlaying = false;
          const btnPlay = document.getElementById('btn-play');
          if (btnPlay) btnPlay.textContent = '▶ 播放';
        }
        updateUI();
      }

      renderAt(currentT, p);
    };
  };

  if (window.p5) {
    p5Instance = new window.p5(sketch);
  }

  // 暴露供外部调用的纯函数
  window.renderAt = (t) => {
    currentT = t;
    if (window.__p5) {
      renderAt(t, window.__p5);
    }
  };

  window.renderOfflineAudioWav = async () => {
    const buffer = await renderOfflineAudioBuffer();
    const wavBytes = audioBufferToWav(buffer);
    return Array.from(wavBytes);
  };

  const btnPlay = document.getElementById('btn-play');
  const slider = document.getElementById('progress-slider');
  const timeDisplay = document.getElementById('time-display');

  function updateUI() {
    if (slider) slider.value = currentT;
    const mins = Math.floor(currentT / 60).toString().padStart(2, '0');
    const secs = (currentT % 60).toFixed(1).padStart(4, '0');
    const info = getTimelineInfo(currentT);
    let label = 'Intro';
    if (info.phase === 'scene') {
      label = `${info.sceneConfig.id}. ${info.sceneConfig.nameZh}`;
    } else if (info.phase === 'outro') {
      label = '发布会尾声';
    }
    if (timeDisplay) timeDisplay.textContent = `${mins}:${secs} | ${label}`;
  }

  if (btnPlay) {
    btnPlay.addEventListener('click', () => {
      isPlaying = !isPlaying;
      btnPlay.textContent = isPlaying ? '⏸ 暂停' : '▶ 播放';
      lastAnimTime = performance.now();

      if (isPlaying && !audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        buildPelicanSoundtrack(audioCtx, audioCtx.destination);
      }
    });
  }

  if (slider) {
    slider.addEventListener('input', (e) => {
      currentT = parseFloat(e.target.value);
      updateUI();
    });
  }

  if (sceneSelect) {
    sceneSelect.addEventListener('change', (e) => {
      currentT = parseFloat(e.target.value);
      updateUI();
    });
  }

  const btnPrev = document.getElementById('btn-prev');
  if (btnPrev) {
    btnPrev.addEventListener('click', () => {
      currentT = Math.max(0, currentT - 0.5);
      updateUI();
    });
  }

  const btnNext = document.getElementById('btn-next');
  if (btnNext) {
    btnNext.addEventListener('click', () => {
      currentT = Math.min(TOTAL_DURATION, currentT + 0.5);
      updateUI();
    });
  }

  const btnAudio = document.getElementById('btn-audio');
  if (btnAudio) {
    btnAudio.addEventListener('click', () => {
      isMuted = !isMuted;
      btnAudio.textContent = isMuted ? '🔇 静音' : '🔊 声音';
      if (audioCtx) {
        if (isMuted) audioCtx.suspend();
        else audioCtx.resume();
      }
    });
  }
};

// 自动初始化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', window.initPelicanApp);
} else {
  window.initPelicanApp();
}
