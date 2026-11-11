# 《鹈鹕测试》——人类自古以来就痴迷于画鹈鹕骑自行车

一只鹈鹕骑着自行车，沿一条贯穿全片的路，依次穿过20个不同时代、不同地域、不同艺术风格的版块，每过一道画框就换一种画风。
全片137.0秒（2:17），120BPM，纯代码参数化生成，零外部图片与音频素材。

## 核心架构设计

1. 纯函数时间轴驱动：画面严格作为绝对时间t的纯函数`renderAt(t)`，支持任意时间点拖拽、精确定格与确定性逐帧重现。
2. 骨骼与动力学绑定：`src/rig/rig.js`实现参数化骨骼木偶系统。双腿逆向运动学（IK）解算，曲柄踏板转速精准绑定两拍一圈（1.0秒一圈），大嘴囊弹性晃动、颈部波浪与车轮转速严格对齐。
3. 20个独立场景纯函数：`src/scenes/s01`至`s20`各自负责一个时代，互不干扰，包含专属画框、地貌构图、路人互动与冷幽默小梗。
4. 全原创程序化配乐：`audio/synth.js`通过Web Audio API物理合成全片配乐，同一段原创主旋律贯穿全片，各时代切换为该时代/地域专属乐器（撒哈拉手鼓、埃及竖琴、汉代编钟、唐代琵琶、宋代古琴、清明上河图笛子锣鼓、玛雅陶笛、莫卧儿西塔琴、八大山人箫、皮影戏甘美兰、浮世绘三味线、星月夜与呐喊弦乐、诺斯费拉图管风琴、示波器正弦蜂鸣、8-bit方波芯片、聊天窗MIDI音、蒸汽波151.2BPM磁带降速至0.7937倍跳针混响、短视频流行节拍、代码美学极简钢琴等），车铃作为贯穿打击乐。
5. 双轨交付验证：
- 浏览器实时交互预览页：内置控制面板、进度拖动、时代跳转、小节指示与实时Web Audio。
- 自动化质检工具链：支持单帧截图（`tools/shot.mjs`）、22格全片接触表（`tools/sheet.mjs`）、离线高保真WAV渲染（`tools/render_audio.mjs`）与ffmpeg合流编码（`tools/encode.mjs`）。

## 目录结构

- public/
  - index.html (交互式播放器与预览控制台)
  - vendor/ (p5.min.js, p5.brush.js 开源库)
- src/
  - beat/beat.js (120BPM节拍、小节计算与复古帧率量化)
  - kit/kit.js (水墨飞白、宣纸做旧、画框、标题卡与滤镜)
  - rig/rig.js (鹈鹕与自行车参数化IK骨骼木偶)
  - scenes/ (s01至s20全量时代独立渲染文件)
  - main/ (调度器、Intro、Outro与运镜系统)
- audio/synth.js (全程序化乐器编排与离线WAV渲染器)
- briefs/ART_BRIEFS.md (20个时代完整美术设定简报)
- tools/
  - shot.mjs (单帧截图质检)
  - sheet.mjs (4x6接触表拼装大图)
  - render_audio.mjs (离线WAV导出)
  - encode.mjs (ffmpeg合成MP4)
  - render.mjs (多进程全量逐帧导出)
- out/ (已生成的高清接触表、成片MP4、音频WAV与样片截图)

## 快速使用指令

1. 启动浏览器交互预览：
直接在浏览器中打开 public/index.html 或使用本地HTTP服务启动。

2. 生成单帧质检图：
node tools/shot.mjs out/shot.png 14.0

3. 生成全片22节点高清接触表：
node tools/sheet.mjs

4. 离线导出高保真全片音频：
node tools/render_audio.mjs

5. 封装成片MP4：
node tools/encode.mjs
