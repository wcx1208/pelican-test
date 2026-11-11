// audio/synth.js
// 鹈鹕测试全原创音频合成引擎与20时代乐器编排 (Web Audio API / OfflineAudioContext)

import {
  BPM, SECONDS_PER_BEAT, SECONDS_PER_BAR,
  INTRO_DURATION, SCENE_DURATION, TOTAL_SCENES, OUTRO_DURATION, TOTAL_DURATION
} from '../src/beat/beat.js';

// 原创贯穿全片的主旋律乐句音符序列 (以 C大调/A小调 映射频率)
// 音符基频表 (Hz)
const NOTE = {
  C3: 130.81, D3: 146.83, E3: 164.81, F3: 174.61, G3: 196.00, A3: 220.00, B3: 246.94,
  C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.00, A4: 440.00, B4: 493.88,
  C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99, A5: 880.00, B5: 987.77,
  C6: 1046.50
};

// 4小节核心主旋律动机 (每小节4拍，共16拍)
// 韵律：轻快、笃定、略带幽默的进行曲
const THEME_MOTIF = [
  // 小节 1: 主题呈示
  { beat: 0, note: NOTE.C4, dur: 0.8 },
  { beat: 1, note: NOTE.E4, dur: 0.8 },
  { beat: 2, note: NOTE.G4, dur: 0.8 },
  { beat: 3, note: NOTE.A4, dur: 0.8 },
  // 小节 2: 旋律跃升
  { beat: 4, note: NOTE.G4, dur: 0.8 },
  { beat: 5, note: NOTE.E4, dur: 0.8 },
  { beat: 6, note: NOTE.D4, dur: 0.8 },
  { beat: 7, note: NOTE.C4, dur: 0.8 },
  // 小节 3: 活泼回旋 (转入高音)
  { beat: 8, note: NOTE.E4, dur: 0.5 },
  { beat: 8.5, note: NOTE.G4, dur: 0.5 },
  { beat: 9, note: NOTE.C5, dur: 0.8 },
  { beat: 10, note: NOTE.B4, dur: 0.8 },
  { beat: 11, note: NOTE.A4, dur: 0.8 },
  // 小节 4: 笃定收束 (回到强拍)
  { beat: 12, note: NOTE.G4, dur: 1.2 },
  { beat: 14, note: NOTE.D4, dur: 0.8 },
  { beat: 15, note: NOTE.C4, dur: 1.0 }
];

// 自行车清脆铜车铃合成器 (贯穿全片打击乐)
export function scheduleBicycleBell(ctx, time, dest) {
  const osc1 = ctx.createOscillator();
  const osc2 = ctx.createOscillator();
  const gain = ctx.createGain();

  osc1.type = 'sine';
  osc2.type = 'sine';

  // 车铃双重泛音高频谐振
  osc1.frequency.setValueAtTime(2093.0, time); // C7
  osc2.frequency.setValueAtTime(2793.8, time); // F7

  gain.gain.setValueAtTime(0, time);
  gain.gain.linearRampToValueAtTime(0.35, time + 0.005);
  gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.65);

  osc1.connect(gain);
  osc2.connect(gain);
  gain.connect(dest);

  osc1.start(time);
  osc2.start(time);
  osc1.stop(time + 0.7);
  osc2.stop(time + 0.7);
}

// 拨弦乐器合成器 (竖琴、琵琶、古琴、西塔琴、三味线)
function schedulePluck(ctx, time, freq, dur, dest, type = 'triangle', decay = 0.8) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const filter = ctx.createBiquadFilter();

  osc.type = type;
  osc.frequency.setValueAtTime(freq, time);

  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(freq * 5, time);
  filter.frequency.exponentialRampToValueAtTime(freq * 1.2, time + dur * 0.7);

  gain.gain.setValueAtTime(0, time);
  gain.gain.linearRampToValueAtTime(0.4, time + 0.008);
  gain.gain.exponentialRampToValueAtTime(0.0001, time + dur * decay);

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(dest);

  osc.start(time);
  osc.stop(time + dur);
}

// 编钟 / 金属排钟 (双调频 FM 合成)
function scheduleBellTone(ctx, time, freq, dur, dest) {
  const carrier = ctx.createOscillator();
  const mod = ctx.createOscillator();
  const modGain = ctx.createGain();
  const mainGain = ctx.createGain();

  carrier.type = 'sine';
  mod.type = 'sine';

  carrier.frequency.setValueAtTime(freq, time);
  mod.frequency.setValueAtTime(freq * 2.76, time); // 经典金属编钟非谐波调制比

  modGain.gain.setValueAtTime(freq * 1.5, time);
  modGain.gain.exponentialRampToValueAtTime(1, time + dur);

  mainGain.gain.setValueAtTime(0, time);
  mainGain.gain.linearRampToValueAtTime(0.35, time + 0.01);
  mainGain.gain.exponentialRampToValueAtTime(0.0001, time + dur);

  mod.connect(carrier.frequency);
  carrier.connect(mainGain);
  mainGain.connect(dest);

  carrier.start(time);
  mod.start(time);
  carrier.stop(time + dur);
  mod.stop(time + dur);
}

// 吹奏乐器合成 (竹笛、箫、陶笛)
function scheduleFlute(ctx, time, freq, dur, dest) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(freq, time);
  // 轻微呼吸颤音 (Vibrato)
  osc.frequency.setTargetAtTime(freq * 1.01, time + 0.1, 0.2);

  gain.gain.setValueAtTime(0, time);
  gain.gain.linearRampToValueAtTime(0.3, time + 0.05);
  gain.gain.setValueAtTime(0.28, time + dur * 0.7);
  gain.gain.linearRampToValueAtTime(0.0001, time + dur);

  osc.connect(gain);
  gain.connect(dest);

  osc.start(time);
  osc.stop(time + dur);
}

// 8-bit 方波芯片合成器 (Chiptune)
function schedule8BitSquare(ctx, time, freq, dur, dest) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'square';
  osc.frequency.setValueAtTime(freq, time);

  gain.gain.setValueAtTime(0.2, time);
  gain.gain.setValueAtTime(0.18, time + dur * 0.8);
  gain.gain.linearRampToValueAtTime(0.0001, time + dur);

  osc.connect(gain);
  gain.connect(dest);

  osc.start(time);
  osc.stop(time + dur);
}

// 整体音轨生成与编排调度函数
export function buildPelicanSoundtrack(ctx, masterOut) {
  // 主输出增益与动态压缩限制器
  const masterGain = ctx.createGain();
  masterGain.gain.setValueAtTime(0.85, 0);

  const compressor = ctx.createDynamicsCompressor();
  compressor.threshold.setValueAtTime(-18, 0);
  compressor.knee.setValueAtTime(12, 0);
  compressor.ratio.setValueAtTime(4, 0);

  masterGain.connect(compressor);
  compressor.connect(masterOut);

  // 1. Intro 阶段 (0 ~ 5.0s)：低沉弦乐与大提琴泛音
  const introOsc = ctx.createOscillator();
  const introGain = ctx.createGain();
  introOsc.type = 'sawtooth';
  introOsc.frequency.setValueAtTime(NOTE.C3, 0);
  introOsc.frequency.exponentialRampToValueAtTime(NOTE.G3, 4.0);

  const introFilter = ctx.createBiquadFilter();
  introFilter.type = 'lowpass';
  introFilter.frequency.setValueAtTime(240, 0);

  introGain.gain.setValueAtTime(0, 0);
  introGain.gain.linearRampToValueAtTime(0.35, 1.5);
  introGain.gain.exponentialRampToValueAtTime(0.001, 4.9);

  introOsc.connect(introFilter);
  introFilter.connect(introGain);
  introGain.connect(masterGain);
  introOsc.start(0);
  introOsc.stop(5.0);

  // 5.0s 强拍落音车铃 (标志正片开始)
  scheduleBicycleBell(ctx, 5.0, masterGain);

  // 2. 正片 20 个时代版块调度 (5.0s ~ 125.0s)
  for (let s = 0; s < TOTAL_SCENES; s++) {
    const sceneStartTime = INTRO_DURATION + s * SCENE_DURATION;

    // 时代专属主旋律 (每个版块 3 小节 = 12 拍)
    // 遍历主旋律 12 拍乐符
    for (let m = 0; m < 12; m++) {
      const motifItem = THEME_MOTIF[m % THEME_MOTIF.length];
      const noteTime = sceneStartTime + m * SECONDS_PER_BEAT;
      const freq = motifItem.note;
      const dur = motifItem.dur * SECONDS_PER_BEAT;

      switch (s) {
        case 0: // 撒哈拉岩画 (陶管低鸣与人声)
          schedulePluck(ctx, noteTime, freq * 0.5, dur, masterGain, 'sine', 0.6);
          break;
        case 1: // 埃及壁画 (竖琴)
          schedulePluck(ctx, noteTime, freq, dur, masterGain, 'triangle', 0.9);
          break;
        case 2: // 汉画像石 (编钟)
          scheduleBellTone(ctx, noteTime, freq, dur * 1.5, masterGain);
          break;
        case 3: // 唐代白描 (琵琶)
          schedulePluck(ctx, noteTime, freq, dur * 0.7, masterGain, 'sawtooth', 0.5);
          break;
        case 4: // 宋代山水 (古琴)
          schedulePluck(ctx, noteTime, freq * 0.5, dur * 1.6, masterGain, 'sine', 1.2);
          break;
        case 5: // 清明上河图 (竹笛)
          scheduleFlute(ctx, noteTime, freq, dur, masterGain);
          break;
        case 6: // 玛雅抄本 (陶笛)
          scheduleFlute(ctx, noteTime, freq * 0.75, dur, masterGain);
          break;
        case 7: // 莫卧儿细密画 (西塔琴)
          schedulePluck(ctx, noteTime, freq, dur, masterGain, 'sawtooth', 0.8);
          break;
        case 8: // 八大山人 (洞箫)
          scheduleFlute(ctx, noteTime, freq * 0.5, dur * 1.2, masterGain);
          break;
        case 9: // 爪哇皮影戏 (甘美兰金属琴)
          scheduleBellTone(ctx, noteTime, freq * 1.2, dur, masterGain);
          break;
        case 10: // 浮世绘 (三味线)
          schedulePluck(ctx, noteTime, freq, dur * 0.5, masterGain, 'triangle', 0.4);
          break;
        case 11: // 梵高星月夜 (流动弦乐)
          schedulePluck(ctx, noteTime, freq, dur * 1.2, masterGain, 'sine', 1.0);
          break;
        case 12: // 蒙克呐喊 (弦乐走调：第2小节高频尖叫)
          if (m >= 4 && m <= 7) {
            schedulePluck(ctx, noteTime, freq * 1.414, dur * 1.5, masterGain, 'sawtooth', 1.2); // 三全音走调
          } else {
            schedulePluck(ctx, noteTime, freq, dur, masterGain, 'sawtooth', 0.8);
          }
          break;
        case 13: // 诺斯费拉图 (默片哥特风琴)
          schedulePluck(ctx, noteTime, freq * 0.5, dur * 1.5, masterGain, 'square', 1.2);
          break;
        case 14: // 示波器 (纯正弦蜂鸣与旋钮扭曲)
          schedulePluck(ctx, noteTime, freq * (m >= 4 && m <= 6 ? 2.3 : 1.0), dur, masterGain, 'sine', 0.7);
          break;
        case 15: // 8-bit像素游戏 (四声道Chiptune)
          schedule8BitSquare(ctx, noteTime, freq, dur, masterGain);
          break;
        case 16: // 早期聊天窗口 (MIDI铃声风格)
          schedulePluck(ctx, noteTime, freq * 1.5, dur * 0.6, masterGain, 'sine', 0.5);
          break;
        case 17: // 蒸汽波 (120BPM 磁带放慢大七和弦电钢琴)
          schedulePluck(ctx, noteTime, freq * 0.7937, dur * 1.8, masterGain, 'triangle', 1.5);
          break;
        case 18: // 竖屏短视频 (流行电子)
          schedulePluck(ctx, noteTime, freq, dur * 0.8, masterGain, 'square', 0.6);
          break;
        case 19: // 代码美学 (极简纯净钢琴晶莹音)
          schedulePluck(ctx, noteTime, freq * 2.0, dur * 1.2, masterGain, 'sine', 1.2);
          break;
      }
    }

    // 每个版块强拍车铃与过框提示
    scheduleBicycleBell(ctx, sceneStartTime, masterGain);
    scheduleBicycleBell(ctx, sceneStartTime + 3.0, masterGain);
  }

  // 3. Outro 新闻发布会阶段 (125.0s ~ 137.0s)
  // 所有乐器齐奏渐弱，135.5s 掠过时留最后一声悠扬车铃
  const outroStart = INTRO_DURATION + TOTAL_SCENES * SCENE_DURATION;
  for (let b = 0; b < 16; b++) {
    const motifItem = THEME_MOTIF[b % THEME_MOTIF.length];
    const nTime = outroStart + b * SECONDS_PER_BEAT;
    // 渐弱
    const outGain = ctx.createGain();
    const vol = Math.max(0.01, 0.45 * (1 - b / 16));
    outGain.gain.setValueAtTime(vol, nTime);
    outGain.connect(masterGain);

    schedulePluck(ctx, nTime, motifItem.note, 0.4, outGain, 'sine', 0.8);
    schedulePluck(ctx, nTime, motifItem.note * 0.5, 0.5, outGain, 'triangle', 1.0);
  }

  // 最后一拍 (135.5s)：鹈鹕掠过，空席位上空回荡最后一声清脆车铃！
  scheduleBicycleBell(ctx, 135.5, masterGain);
}

// 离线高保真音频渲染函数 (导出全片 137 秒 WAV 缓冲区)
export async function renderOfflineAudioBuffer() {
  const sampleRate = 44100;
  const totalLength = Math.ceil(TOTAL_DURATION * sampleRate);
  const offlineCtx = new OfflineAudioContext(2, totalLength, sampleRate);

  buildPelicanSoundtrack(offlineCtx, offlineCtx.destination);
  const renderedBuffer = await offlineCtx.startRendering();
  return renderedBuffer;
}

// 将 AudioBuffer 转为标准的 16-bit PCM WAV 二进制格式 (Uint8Array)
export function audioBufferToWav(buffer) {
  const numChannels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const format = 1; // PCM
  const bitDepth = 16;

  const bytesPerSample = bitDepth / 8;
  const blockAlign = numChannels * bytesPerSample;
  const numSamples = buffer.length;
  const dataSize = numSamples * blockAlign;
  const headerSize = 44;
  const totalSize = headerSize + dataSize;

  const arrayBuffer = new ArrayBuffer(totalSize);
  const dataView = new DataView(arrayBuffer);

  function writeString(offset, str) {
    for (let i = 0; i < str.length; i++) {
      dataView.setUint8(offset + i, str.charCodeAt(i));
    }
  }

  // RIFF Chunk
  writeString(0, 'RIFF');
  dataView.setUint32(4, totalSize - 8, true);
  writeString(8, 'WAVE');

  // fmt Subchunk
  writeString(12, 'fmt ');
  dataView.setUint32(16, 16, true);
  dataView.setUint16(20, format, true);
  dataView.setUint16(22, numChannels, true);
  dataView.setUint32(24, sampleRate, true);
  dataView.setUint32(28, sampleRate * blockAlign, true);
  dataView.setUint16(32, blockAlign, true);
  dataView.setUint16(34, bitDepth, true);

  // data Subchunk
  writeString(36, 'data');
  dataView.setUint32(40, dataSize, true);

  // 交叉写入立体声 PCM 采样
  const channelData = [];
  for (let ch = 0; ch < numChannels; ch++) {
    channelData.push(buffer.getChannelData(ch));
  }

  let offset = 44;
  for (let i = 0; i < numSamples; i++) {
    for (let ch = 0; ch < numChannels; ch++) {
      let sample = channelData[ch][i];
      sample = Math.max(-1, Math.min(1, sample));
      // 16-bit 线性 PCM
      const intSample = sample < 0 ? sample * 32768 : sample * 32767;
      dataView.setInt16(offset, intSample, true);
      offset += 2;
    }
  }

  return new Uint8Array(arrayBuffer);
}
