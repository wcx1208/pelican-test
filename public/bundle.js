var PelicanBundle = (() => {
  // src/beat/beat.js
  var BPM = 120;
  var SECONDS_PER_BEAT = 60 / BPM;
  var SECONDS_PER_BAR = SECONDS_PER_BEAT * 4;
  var INTRO_DURATION = 5;
  var SCENE_DURATION = 6;
  var TOTAL_SCENES = 20;
  var OUTRO_DURATION = 12;
  var TOTAL_DURATION = INTRO_DURATION + TOTAL_SCENES * SCENE_DURATION + OUTRO_DURATION;
  var SCENE_CONFIGS = [
    { id: 1, key: "sahara", nameZh: "\u6492\u54C8\u62C9\u5CA9\u753B", nameEn: "Saharan Rock Art", period: "\u7EA6\u524D4000", style: "\u5854\u897F\u91CC\u98CE\u683C" },
    { id: 2, key: "egypt", nameZh: "\u57C3\u53CA\u58C1\u753B", nameEn: "Egyptian Tomb Painting", period: "\u7EA6\u524D1300", style: "\u65B0\u738B\u56FD\u65F6\u671F" },
    { id: 3, key: "han_rubbing", nameZh: "\u6C49\u753B\u50CF\u77F3\u62D3\u7247", nameEn: "Han Dynasty Stone Rubbing", period: "\u7EA6100", style: "\u9ED1\u767D\u6C34\u58A8\u62D3\u7247" },
    { id: 4, key: "tang_baimiao", nameZh: "\u5510\u4EE3\u767D\u63CF", nameEn: "Tang Dynasty Ink Line", period: "\u7EA6750", style: "\u5434\u5E26\u5F53\u98CE" },
    { id: 5, key: "song_landscape", nameZh: "\u5B8B\u4EE3\u5C71\u6C34", nameEn: "Song Monumental Landscape", period: "\u7EA61000", style: "\u6EAA\u5C71\u884C\u65C5" },
    { id: 6, key: "qingming", nameZh: "\u6E05\u660E\u4E0A\u6CB3\u56FE", nameEn: "Along the River at Qingming", period: "\u7EA61100", style: "\u754C\u753B\u6DE1\u5F69" },
    { id: 7, key: "maya_codex", nameZh: "\u739B\u96C5\u6284\u672C", nameEn: "Maya Codex", period: "\u7EA61200", style: "\u6298\u9875\u6811\u76AE\u7EB8" },
    { id: 8, key: "mughal_miniature", nameZh: "\u83AB\u5367\u513F\u7EC6\u5BC6\u753B", nameEn: "Mughal Miniature", period: "\u7EA61600", style: "\u5BAB\u5EF7\u5DE5\u7B14" },
    { id: 9, key: "bada_shanren", nameZh: "\u516B\u5927\u5C71\u4EBA\u5199\u610F", nameEn: "Bada Shanren Ink Sketch", period: "\u7EA61690", style: "\u5199\u610F\u767D\u773C" },
    { id: 10, key: "wayang_kulit", nameZh: "\u722A\u54C7\u76AE\u5F71\u620F", nameEn: "Wayang Kulit Shadow Puppet", period: "\u7EA61800", style: "\u6C34\u725B\u76AE\u9542\u96D5" },
    { id: 11, key: "ukiyo_e", nameZh: "\u6D6E\u4E16\u7ED8", nameEn: "Ukiyo-e Woodblock Print", period: "1830s", style: "\u5E7F\u91CD\u4E1C\u6D77\u9053" },
    { id: 12, key: "starry_night", nameZh: "\u68B5\u9AD8\u661F\u6708\u591C", nameEn: "Van Gogh The Starry Night", period: "1889", style: "\u540E\u5370\u8C61\u6D3E\u6F29\u6DA1" },
    { id: 13, key: "the_scream", nameZh: "\u8499\u514B\u5450\u558A", nameEn: "Munch The Scream", period: "1893", style: "\u8868\u73B0\u4E3B\u4E49\u6728\u6865" },
    { id: 14, key: "nosferatu", nameZh: "\u8BFA\u65AF\u8D39\u62C9\u56FE", nameEn: "Nosferatu German Expressionism", period: "1922", style: "\u9ED8\u7247\u9ED1\u767D\u6697\u5F71" },
    { id: 15, key: "oscilloscope", nameZh: "\u793A\u6CE2\u5668\u77E2\u91CF\u56FE", nameEn: "Oscilloscope Vector Graphics", period: "1950s", style: "\u7EFF\u8272\u8367\u5149\u4F59\u8F89" },
    { id: 16, key: "pixel_game", nameZh: "8-bit\u50CF\u7D20\u6E38\u620F", nameEn: "8-Bit Retro Arcade", period: "1980s", style: "\u6A2A\u7248FC\u5377\u8F74" },
    { id: 17, key: "chat_window", nameZh: "\u65E9\u671F\u804A\u5929\u7A97\u53E3", nameEn: "Early Instant Messenger", period: "2000s", style: "\u62DF\u771F\u6296\u52A8\u52A8\u56FE" },
    { id: 18, key: "vaporwave", nameZh: "\u84B8\u6C7D\u6CE2\u7F8E\u5B66", nameEn: "Vaporwave Aesthetic", period: "2010s", style: "\u7F51\u683C\u4E0E\u5927\u7406\u77F3" },
    { id: 19, key: "short_video", nameZh: "\u7AD6\u5C4F\u77ED\u89C6\u9891", nameEn: "Vertical Short Video", period: "2020s", style: "9:16\u79FB\u52A8\u6D41\u5A92\u4F53" },
    { id: 20, key: "code_aesthetic", nameZh: "\u4EE3\u7801\u7F8E\u5B66", nameEn: "Code & Procedural Vector", period: "2020s", style: "\u5927\u6A21\u578BIDE\u4E0ESVG" }
  ];
  function getTimelineInfo(t) {
    const clampedT = Math.max(0, Math.min(t, TOTAL_DURATION));
    const globalBeat = clampedT / SECONDS_PER_BEAT;
    const globalBar = clampedT / SECONDS_PER_BAR;
    if (clampedT < INTRO_DURATION) {
      return {
        phase: "intro",
        sceneIndex: -1,
        sceneConfig: null,
        localT: clampedT,
        progress: clampedT / INTRO_DURATION,
        globalT: clampedT,
        globalBeat,
        globalBar,
        crankAngle: clampedT * Math.PI * 2 / 1
      };
    }
    const sceneTime = clampedT - INTRO_DURATION;
    const maxSceneTotalTime = TOTAL_SCENES * SCENE_DURATION;
    if (sceneTime < maxSceneTotalTime) {
      const sceneIndex = Math.min(Math.floor(sceneTime / SCENE_DURATION), TOTAL_SCENES - 1);
      const localT = sceneTime - sceneIndex * SCENE_DURATION;
      const progress = localT / SCENE_DURATION;
      const sceneBar = localT / SECONDS_PER_BAR;
      const sceneBeat = localT / SECONDS_PER_BEAT;
      const subPhase = localT < 2 ? "entry" : localT < 4 ? "highlight" : "exit";
      return {
        phase: "scene",
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
        crankAngle: clampedT * Math.PI * 2 / 1
      };
    }
    const outroLocalT = clampedT - (INTRO_DURATION + maxSceneTotalTime);
    return {
      phase: "outro",
      sceneIndex: TOTAL_SCENES,
      sceneConfig: null,
      localT: outroLocalT,
      progress: outroLocalT / OUTRO_DURATION,
      globalT: clampedT,
      globalBeat,
      globalBar,
      crankAngle: clampedT * Math.PI * 2 / 1
    };
  }
  function quantizeTime(t, targetFps = 10) {
    const step = 1 / targetFps;
    return Math.floor(t / step) * step;
  }

  // src/rig/rig.js
  function solveIK2D(rootX, rootY, targetX, targetY, l1, l2, flipKnee = false) {
    const dx = targetX - rootX;
    const dy = targetY - rootY;
    const dist = Math.hypot(dx, dy);
    const maxReach = (l1 + l2) * 0.999;
    const actualDist = Math.max(Math.abs(l1 - l2) * 1.001, Math.min(dist, maxReach));
    const baseAngle = Math.atan2(dy, dx);
    const cosA = (l1 * l1 + actualDist * actualDist - l2 * l2) / (2 * l1 * actualDist);
    const clampedCosA = Math.max(-1, Math.min(1, cosA));
    const angleA = Math.acos(clampedCosA);
    const sign = flipKnee ? -1 : 1;
    const jointAngle = baseAngle + sign * angleA;
    const jointX = rootX + Math.cos(jointAngle) * l1;
    const jointY = rootY + Math.sin(jointAngle) * l1;
    return { jointX, jointY, endX: targetX, endY: targetY };
  }
  function computePelicanRig(t, options = {}) {
    const scale = options.scale || 1;
    const baseX = options.x || 0;
    const baseY = options.y || 0;
    const crankPeriod = 1;
    const crankAngle = t % crankPeriod / crankPeriod * Math.PI * 2;
    const wheelRadius = 75 * scale;
    const wheelBase = 220 * scale;
    const rearHub = { x: baseX - wheelBase * 0.45, y: baseY };
    const frontHub = { x: baseX + wheelBase * 0.55, y: baseY };
    const bb = { x: baseX - 15 * scale, y: baseY - 12 * scale };
    const crankR = 24 * scale;
    const pedalRight = {
      x: bb.x + Math.cos(crankAngle) * crankR,
      y: bb.y + Math.sin(crankAngle) * crankR
    };
    const pedalLeft = {
      x: bb.x + Math.cos(crankAngle + Math.PI) * crankR,
      y: bb.y + Math.sin(crankAngle + Math.PI) * crankR
    };
    const bobbing = Math.sin(t * Math.PI * 4) * (2.5 * scale);
    const saddle = { x: bb.x - 22 * scale, y: baseY - 110 * scale + bobbing };
    const headset = { x: frontHub.x - 35 * scale, y: baseY - 125 * scale };
    const handlebar = { x: headset.x + 8 * scale, y: headset.y - 18 * scale };
    const hip = { x: saddle.x + 4 * scale, y: saddle.y - 8 * scale };
    const thighLen = 52 * scale;
    const shinLen = 56 * scale;
    const legRight = solveIK2D(hip.x, hip.y, pedalRight.x, pedalRight.y, thighLen, shinLen, false);
    const legLeft = solveIK2D(hip.x, hip.y, pedalLeft.x, pedalLeft.y, thighLen, shinLen, false);
    const chestTilt = Math.sin(t * Math.PI * 2) * 0.05;
    const torsoVector = { x: 42 * scale, y: -26 * scale };
    const chest = {
      x: hip.x + torsoVector.x + chestTilt * 10 * scale,
      y: hip.y + torsoVector.y
    };
    const shoulder = { x: chest.x - 6 * scale, y: chest.y + 4 * scale };
    const wingElbow = { x: shoulder.x + 22 * scale, y: shoulder.y + 12 * scale };
    const neckWave = Math.sin(t * Math.PI * 2) * (3.5 * scale);
    const neckBase = { x: chest.x + 10 * scale, y: chest.y - 12 * scale };
    const neckMid = { x: neckBase.x + 12 * scale + neckWave, y: neckBase.y - 36 * scale };
    const head = { x: neckMid.x + 16 * scale, y: neckMid.y - 28 * scale };
    const beakTip = { x: head.x + 88 * scale, y: head.y + 12 * scale };
    const pouchDroop = Math.sin(t * Math.PI * 2 + 0.8) * (5 * scale);
    const pouchBottom = { x: head.x + 42 * scale, y: head.y + 46 * scale + pouchDroop };
    const wheelAngle = t * 8 % (Math.PI * 2);
    return {
      scale,
      rearHub,
      frontHub,
      wheelRadius,
      wheelAngle,
      bb,
      saddle,
      headset,
      handlebar,
      pedalLeft,
      pedalRight,
      hip,
      legLeft,
      legRight,
      chest,
      shoulder,
      wingElbow,
      neckBase,
      neckMid,
      head,
      beakTip,
      pouchBottom
    };
  }
  function drawDefaultPelican(p, rig, options = {}) {
    p.push();
    const colorPalette = {
      frame: options.frameColor || [40, 45, 55],
      wheel: options.wheelColor || [30, 30, 30],
      body: options.bodyColor || [245, 245, 250],
      beak: options.beakColor || [240, 160, 45],
      pouch: options.pouchColor || [235, 120, 60],
      eye: options.eyeColor || [20, 20, 20],
      shadow: options.shadow || false,
      wireframe: options.wireframe || false
    };
    const drawWheel = (hub) => {
      p.push();
      p.translate(hub.x, hub.y);
      p.noFill();
      p.stroke(colorPalette.wheel[0], colorPalette.wheel[1], colorPalette.wheel[2]);
      p.strokeWeight(6 * rig.scale);
      p.ellipse(0, 0, rig.wheelRadius * 2, rig.wheelRadius * 2);
      p.strokeWeight(1.5 * rig.scale);
      p.stroke(colorPalette.wheel[0] + 50, colorPalette.wheel[1] + 50, colorPalette.wheel[2] + 50);
      const spokes = 8;
      for (let i = 0; i < spokes; i++) {
        const a = rig.wheelAngle + i * Math.PI * 2 / spokes;
        p.line(0, 0, Math.cos(a) * rig.wheelRadius, Math.sin(a) * rig.wheelRadius);
      }
      p.fill(colorPalette.frame[0], colorPalette.frame[1], colorPalette.frame[2]);
      p.noStroke();
      p.ellipse(0, 0, 12 * rig.scale, 12 * rig.scale);
      p.pop();
    };
    drawWheel(rig.rearHub);
    p.stroke(Math.max(0, colorPalette.body[0] - 40), Math.max(0, colorPalette.body[1] - 40), Math.max(0, colorPalette.body[2] - 40));
    p.strokeWeight(5 * rig.scale);
    p.strokeCap(p.ROUND);
    p.strokeJoin(p.ROUND);
    p.line(rig.hip.x, rig.hip.y, rig.legLeft.jointX, rig.legLeft.jointY);
    p.line(rig.legLeft.jointX, rig.legLeft.jointY, rig.pedalLeft.x, rig.pedalLeft.y);
    p.stroke(colorPalette.frame[0], colorPalette.frame[1], colorPalette.frame[2]);
    p.strokeWeight(5.5 * rig.scale);
    p.strokeCap(p.ROUND);
    p.strokeJoin(p.ROUND);
    p.line(rig.rearHub.x, rig.rearHub.y, rig.bb.x, rig.bb.y);
    p.line(rig.bb.x, rig.bb.y, rig.saddle.x, rig.saddle.y);
    p.line(rig.saddle.x, rig.saddle.y, rig.rearHub.x, rig.rearHub.y);
    p.line(rig.bb.x, rig.bb.y, rig.headset.x, rig.headset.y);
    p.line(rig.saddle.x, rig.saddle.y, rig.headset.x, rig.headset.y);
    p.line(rig.headset.x, rig.headset.y, rig.frontHub.x, rig.frontHub.y);
    p.line(rig.headset.x, rig.headset.y, rig.handlebar.x, rig.handlebar.y);
    p.stroke(30, 30, 30);
    p.strokeWeight(8 * rig.scale);
    p.line(rig.saddle.x - 16 * rig.scale, rig.saddle.y, rig.saddle.x + 14 * rig.scale, rig.saddle.y - 2 * rig.scale);
    p.stroke(160, 165, 175);
    p.strokeWeight(3.5 * rig.scale);
    p.line(rig.bb.x, rig.bb.y, rig.pedalLeft.x, rig.pedalLeft.y);
    p.line(rig.bb.x, rig.bb.y, rig.pedalRight.x, rig.pedalRight.y);
    p.stroke(20, 20, 20);
    p.strokeWeight(6 * rig.scale);
    p.line(rig.pedalLeft.x - 6 * rig.scale, rig.pedalLeft.y, rig.pedalLeft.x + 6 * rig.scale, rig.pedalLeft.y);
    p.line(rig.pedalRight.x - 6 * rig.scale, rig.pedalRight.y, rig.pedalRight.x + 6 * rig.scale, rig.pedalRight.y);
    drawWheel(rig.frontHub);
    p.stroke(225, 145, 45);
    p.strokeWeight(6 * rig.scale);
    p.line(rig.hip.x, rig.hip.y, rig.legRight.jointX, rig.legRight.jointY);
    p.line(rig.legRight.jointX, rig.legRight.jointY, rig.pedalRight.x, rig.pedalRight.y);
    const ctx = p.drawingContext;
    ctx.save();
    ctx.fillStyle = `rgb(${colorPalette.body[0]}, ${colorPalette.body[1]}, ${colorPalette.body[2]})`;
    ctx.beginPath();
    ctx.moveTo(rig.hip.x - 16 * rig.scale, rig.hip.y + 4 * rig.scale);
    ctx.bezierCurveTo(
      rig.hip.x - 24 * rig.scale,
      rig.hip.y - 30 * rig.scale,
      rig.chest.x - 10 * rig.scale,
      rig.chest.y - 42 * rig.scale,
      rig.chest.x + 8 * rig.scale,
      rig.chest.y
    );
    ctx.bezierCurveTo(
      rig.chest.x + 12 * rig.scale,
      rig.chest.y + 24 * rig.scale,
      rig.hip.x + 12 * rig.scale,
      rig.hip.y + 14 * rig.scale,
      rig.hip.x - 16 * rig.scale,
      rig.hip.y + 4 * rig.scale
    );
    ctx.closePath();
    ctx.fill();
    ctx.restore();
    p.stroke(colorPalette.body[0], colorPalette.body[1], colorPalette.body[2]);
    p.strokeWeight(16 * rig.scale);
    p.noFill();
    p.bezier(
      rig.neckBase.x,
      rig.neckBase.y,
      rig.neckMid.x - 14 * rig.scale,
      rig.neckMid.y,
      rig.neckMid.x + 10 * rig.scale,
      rig.neckMid.y - 12 * rig.scale,
      rig.head.x,
      rig.head.y
    );
    p.noStroke();
    p.fill(colorPalette.body[0], colorPalette.body[1], colorPalette.body[2]);
    p.ellipse(rig.head.x, rig.head.y, 28 * rig.scale, 24 * rig.scale);
    ctx.save();
    ctx.fillStyle = `rgba(${colorPalette.pouch[0]}, ${colorPalette.pouch[1]}, ${colorPalette.pouch[2]}, 0.9)`;
    ctx.beginPath();
    ctx.moveTo(rig.head.x + 10 * rig.scale, rig.head.y + 4 * rig.scale);
    ctx.bezierCurveTo(
      rig.head.x + 22 * rig.scale,
      rig.pouchBottom.y,
      rig.pouchBottom.x,
      rig.pouchBottom.y + 6 * rig.scale,
      rig.beakTip.x - 12 * rig.scale,
      rig.beakTip.y
    );
    ctx.lineTo(rig.head.x + 12 * rig.scale, rig.head.y + 4 * rig.scale);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
    p.fill(colorPalette.beak[0], colorPalette.beak[1], colorPalette.beak[2]);
    p.stroke(180, 110, 20);
    p.strokeWeight(2 * rig.scale);
    p.beginShape();
    p.vertex(rig.head.x + 8 * rig.scale, rig.head.y - 4 * rig.scale);
    p.vertex(rig.beakTip.x, rig.beakTip.y);
    p.vertex(rig.beakTip.x - 12 * rig.scale, rig.beakTip.y + 6 * rig.scale);
    p.vertex(rig.head.x + 10 * rig.scale, rig.head.y + 6 * rig.scale);
    p.vertex(rig.head.x + 8 * rig.scale, rig.head.y - 4 * rig.scale);
    p.endShape();
    p.fill(160, 80, 20);
    p.triangle(
      rig.beakTip.x,
      rig.beakTip.y,
      rig.beakTip.x + 6 * rig.scale,
      rig.beakTip.y + 4 * rig.scale,
      rig.beakTip.x - 2 * rig.scale,
      rig.beakTip.y + 6 * rig.scale
    );
    p.noStroke();
    p.fill(colorPalette.eye[0], colorPalette.eye[1], colorPalette.eye[2]);
    p.ellipse(rig.head.x + 4 * rig.scale, rig.head.y - 2 * rig.scale, 5 * rig.scale, 5 * rig.scale);
    p.fill(255, 255, 255);
    p.ellipse(rig.head.x + 5 * rig.scale, rig.head.y - 3 * rig.scale, 1.8 * rig.scale, 1.8 * rig.scale);
    p.stroke(colorPalette.body[0] - 25, colorPalette.body[1] - 25, colorPalette.body[2] - 20);
    p.strokeWeight(8 * rig.scale);
    p.noFill();
    p.bezier(
      rig.shoulder.x,
      rig.shoulder.y,
      rig.wingElbow.x,
      rig.wingElbow.y,
      rig.handlebar.x - 10 * rig.scale,
      rig.handlebar.y + 12 * rig.scale,
      rig.handlebar.x,
      rig.handlebar.y
    );
    p.stroke(240, 155, 45);
    p.strokeWeight(6.5 * rig.scale);
    p.line(rig.hip.x, rig.hip.y, rig.legRight.jointX, rig.legRight.jointY);
    p.line(rig.legRight.jointX, rig.legRight.jointY, rig.pedalRight.x, rig.pedalRight.y);
    p.pop();
  }

  // src/kit/kit.js
  function computeLissajousPoint(t, a = 3, b = 4, delta = Math.PI / 2, size = 100) {
    const x = Math.sin(a * t + delta) * size;
    const y = Math.sin(b * t) * size;
    return { x, y };
  }
  function pseudoNoise(seed) {
    const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453123;
    return x - Math.floor(x);
  }
  function drawParchmentBackground(p, width, height, baseColor = [245, 238, 220], seed = 42) {
    p.push();
    p.noStroke();
    p.fill(baseColor[0], baseColor[1], baseColor[2]);
    p.rect(0, 0, width, height);
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
  function drawCRTScanlines(p, width, height, lineSpacing = 4, alpha = 35) {
    p.push();
    p.stroke(0, 0, 0, alpha);
    p.strokeWeight(1);
    for (let y = 0; y < height; y += lineSpacing) {
      p.line(0, y, width, y);
    }
    p.pop();
  }
  function drawFilmGrain(p, width, height, density = 0.04, t = 0) {
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
  function drawArtFrame(p, x, y, width, height, styleKey) {
    p.push();
    p.translate(x, y);
    switch (styleKey) {
      case "sahara":
        p.noFill();
        p.stroke(130, 70, 45);
        p.strokeWeight(24);
        p.rect(0, 0, width, height, 16);
        p.stroke(80, 40, 25);
        p.strokeWeight(8);
        p.rect(6, 6, width - 12, height - 12, 12);
        break;
      case "egypt":
        p.noFill();
        p.stroke(190, 150, 60);
        p.strokeWeight(22);
        p.rect(0, 0, width, height);
        p.stroke(40, 110, 130);
        p.strokeWeight(6);
        p.rect(8, 8, width - 16, height - 16);
        break;
      case "han_rubbing":
      case "tang_baimiao":
      case "song_landscape":
      case "qingming":
      case "bada_shanren":
        p.noFill();
        p.stroke(75, 65, 55);
        p.strokeWeight(20);
        p.rect(0, 0, width, height);
        p.stroke(210, 195, 170);
        p.strokeWeight(6);
        p.rect(7, 7, width - 14, height - 14);
        break;
      case "mughal_miniature":
        p.noFill();
        p.stroke(212, 175, 55);
        p.strokeWeight(26);
        p.rect(0, 0, width, height);
        p.stroke(15, 80, 60);
        p.strokeWeight(8);
        p.rect(10, 10, width - 20, height - 20);
        break;
      case "ukiyo_e":
        p.noFill();
        p.stroke(50, 35, 25);
        p.strokeWeight(22);
        p.rect(0, 0, width, height);
        p.stroke(230, 215, 190);
        p.strokeWeight(4);
        p.rect(8, 8, width - 16, height - 16);
        break;
      case "starry_night":
      case "the_scream":
        p.noFill();
        p.stroke(180, 140, 40);
        p.strokeWeight(26);
        p.rect(0, 0, width, height);
        p.stroke(90, 65, 20);
        p.strokeWeight(6);
        p.rect(10, 10, width - 20, height - 20);
        break;
      case "nosferatu":
        p.noFill();
        p.stroke(25, 25, 25);
        p.strokeWeight(30);
        p.rect(0, 0, width, height, 40);
        p.stroke(180, 180, 180);
        p.strokeWeight(4);
        p.rect(12, 12, width - 24, height - 24, 30);
        break;
      case "oscilloscope":
        p.noFill();
        p.stroke(40, 48, 45);
        p.strokeWeight(28);
        p.rect(0, 0, width, height, 60);
        p.stroke(0, 255, 120, 180);
        p.strokeWeight(4);
        p.rect(10, 10, width - 20, height - 20, 50);
        break;
      case "pixel_game":
        p.noFill();
        p.stroke(180, 30, 30);
        p.strokeWeight(20);
        p.rect(0, 0, width, height);
        p.stroke(230, 220, 200);
        p.strokeWeight(6);
        p.rect(8, 8, width - 16, height - 16);
        break;
      case "vaporwave":
        p.noFill();
        p.stroke(255, 113, 206);
        p.strokeWeight(18);
        p.rect(0, 0, width, height);
        p.stroke(1, 205, 254);
        p.strokeWeight(6);
        p.rect(8, 8, width - 16, height - 16);
        break;
      case "code_aesthetic":
        p.noFill();
        p.stroke(30, 30, 35);
        p.strokeWeight(18);
        p.rect(0, 0, width, height, 8);
        p.stroke(0, 122, 204);
        p.strokeWeight(4);
        p.rect(6, 6, width - 12, height - 12, 6);
        break;
      default:
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
  function drawSceneTitleCard(p, sceneConfig, x = 60, y = 60, alpha = 240) {
    if (!sceneConfig) return;
    p.push();
    p.translate(x, y);
    p.noStroke();
    p.fill(20, 22, 28, alpha * 0.78);
    p.rect(0, 0, 340, 96, 6);
    p.fill(220, 160, 40, alpha);
    p.rect(0, 0, 8, 96, 6, 0, 0, 6);
    p.fill(255, 255, 255, alpha);
    p.textAlign(p.LEFT, p.TOP);
    p.textSize(22);
    p.textStyle(p.BOLD);
    p.text(`${sceneConfig.id}. ${sceneConfig.nameZh}`, 22, 14);
    p.fill(210, 215, 225, alpha * 0.9);
    p.textSize(13);
    p.textStyle(p.NORMAL);
    p.text(sceneConfig.nameEn, 22, 44);
    p.fill(235, 185, 75, alpha);
    p.textSize(12);
    p.text(`${sceneConfig.period} \xB7 ${sceneConfig.style}`, 22, 68);
    p.pop();
  }

  // src/scenes/s01_sahara.js
  function render(p, localT, beat, camera) {
    p.push();
    p.noStroke();
    p.fill(168, 86, 48);
    p.rect(0, 0, 1e3, 1e3);
    p.fill(138, 62, 32, 120);
    for (let i = 0; i < 40; i++) {
      const rx = pseudoNoise(i * 17) * 1e3;
      const ry = pseudoNoise(i * 31) * 1e3;
      const rw = 40 + pseudoNoise(i * 11) * 160;
      const rh = 10 + pseudoNoise(i * 7) * 40;
      p.ellipse(rx, ry, rw, rh);
    }
    p.stroke(92, 38, 20);
    p.strokeWeight(8);
    p.noFill();
    p.beginShape();
    p.vertex(0, 720);
    p.vertex(300, 700);
    p.vertex(650, 730);
    p.vertex(1e3, 710);
    p.endShape();
    const drawCattle = (cx, cy, scale = 1, isSurprised = false) => {
      p.push();
      p.translate(cx, cy);
      p.scale(scale);
      p.noStroke();
      p.fill(210, 180, 140);
      p.ellipse(0, 0, 110, 60);
      p.stroke(110, 45, 25);
      p.strokeWeight(5);
      p.line(-35, 15, -40, 70);
      p.line(-15, 18, -12, 70);
      p.line(15, 18, 18, 70);
      p.line(35, 15, 38, 70);
      const headAngle = isSurprised ? -0.25 : 0.05;
      p.push();
      p.translate(-55, -15);
      p.rotate(headAngle);
      p.noStroke();
      p.fill(210, 180, 140);
      p.triangle(0, -10, -35, 8, 10, 15);
      p.noFill();
      p.stroke(80, 30, 15);
      p.strokeWeight(4.5);
      p.bezier(0, -5, -10, -55, 30, -75, 45, -85);
      p.bezier(-5, -5, -20, -50, 15, -70, 30, -80);
      p.pop();
      p.pop();
    };
    const drawHunter = (hx, hy, scale = 1) => {
      p.push();
      p.translate(hx, hy);
      p.scale(scale);
      p.stroke(80, 30, 15);
      p.strokeWeight(6);
      p.strokeCap(p.ROUND);
      p.line(0, 0, 0, 70);
      p.fill(80, 30, 15);
      p.noStroke();
      p.ellipse(0, -16, 20, 20);
      p.stroke(80, 30, 15);
      p.strokeWeight(3);
      p.line(0, -22, -8, -42);
      p.line(0, -22, 0, -45);
      p.line(0, -22, 8, -40);
      p.strokeWeight(5);
      p.line(0, 20, 28, 5);
      p.line(28, 5, 45, -10);
      p.line(0, 20, -25, 35);
      p.line(0, 70, -18, 130);
      p.line(0, 70, 22, 130);
      p.pop();
    };
    drawCattle(220, 580, 0.95, true);
    drawCattle(420, 595, 0.82, false);
    drawHunter(110, 540, 0.95);
    drawHunter(860, 550, 0.88);
    const pelicanX = 200 + localT / 6 * 600;
    const groundY = 705;
    const rig = computePelicanRig(localT, {
      x: pelicanX,
      y: groundY,
      scale: 1.05
    });
    drawDefaultPelican(p, rig, {
      bodyColor: [242, 230, 210],
      // 白垩土岩画质感
      beakColor: [215, 125, 45],
      // 赭黄矿物
      pouchColor: [185, 80, 40],
      // 深朱砂
      frameColor: [60, 25, 15],
      // 黑褐色矿石
      wheelColor: [75, 30, 18],
      eyeColor: [40, 15, 10]
    });
    p.noStroke();
    p.fill(225, 200, 175, 85);
    p.ellipse(820, 240, 45, 55);
    for (let f = 0; f < 5; f++) {
      p.rect(805 + f * 7, 195 - Math.abs(f - 2) * 5, 5, 25, 2);
    }
    p.pop();
  }

  // src/scenes/s02_egypt.js
  function render2(p, localT, beat, camera) {
    p.push();
    p.noStroke();
    p.fill(238, 222, 190);
    p.rect(0, 0, 1e3, 1e3);
    p.fill(32, 115, 150);
    p.rect(0, 0, 1e3, 42);
    p.fill(195, 48, 38);
    p.rect(0, 42, 1e3, 16);
    p.fill(218, 175, 45);
    p.rect(0, 58, 1e3, 12);
    p.fill(40, 150, 120);
    p.rect(0, 70, 1e3, 8);
    p.stroke(215, 85, 70, 40);
    p.strokeWeight(1.2);
    const gridSize = 42;
    for (let x = 0; x < 1e3; x += gridSize) {
      p.line(x, 78, x, 780);
    }
    for (let y = 78; y < 780; y += gridSize) {
      p.line(0, y, 1e3, y);
    }
    p.push();
    p.translate(120, 120);
    p.stroke(185, 135, 30);
    p.strokeWeight(6);
    p.fill(248, 240, 222, 230);
    p.rect(0, 0, 180, 260, 75);
    p.line(-12, 260, 192, 260);
    p.line(0, 268, 180, 268);
    p.stroke(165, 45, 30);
    p.strokeWeight(3.5);
    p.noFill();
    p.beginShape();
    for (let w = 40; w <= 140; w += 10) {
      p.vertex(w, 50 + (w / 10 % 2 === 0 ? -6 : 6));
    }
    p.endShape();
    p.ellipse(90, 115, 32, 22);
    p.line(100, 110, 142, 120);
    p.line(142, 120, 105, 135);
    p.ellipse(90, 175, 36, 18);
    p.line(108, 175, 128, 188);
    p.line(90, 184, 85, 202);
    p.ellipse(68, 225, 22, 22);
    p.ellipse(112, 225, 22, 22);
    p.line(68, 225, 112, 225);
    p.pop();
    const drawEgyptianScribe = (sx, sy) => {
      p.push();
      p.translate(sx, sy);
      p.stroke(175, 75, 50);
      p.fill(175, 75, 50);
      p.ellipse(0, 0, 36, 44);
      p.fill(20, 20, 25);
      p.ellipse(10, -2, 14, 8);
      p.stroke(15, 15, 20);
      p.strokeWeight(2);
      p.line(4, -8, 25, -6);
      p.noStroke();
      p.fill(25, 25, 30);
      p.rect(-18, -18, 25, 55, 4);
      p.fill(218, 170, 40);
      p.arc(5, 25, 40, 25, 0, Math.PI);
      p.fill(30, 120, 140);
      p.arc(5, 25, 32, 18, 0, Math.PI);
      p.fill(245, 245, 240);
      p.stroke(185, 145, 40);
      p.strokeWeight(2);
      p.triangle(0, 95, -35, 180, 35, 180);
      p.stroke(175, 75, 50);
      p.strokeWeight(8);
      p.line(0, 35, 35, 65);
      p.line(0, 35, 25, 80);
      p.stroke(230, 215, 180);
      p.strokeWeight(6);
      p.line(20, 55, 45, 90);
      p.pop();
    };
    drawEgyptianScribe(860, 520);
    let pelicanProgress = localT / 6;
    if (localT >= 2 && localT <= 3.6) {
      pelicanProgress = 2 / 6 + (localT - 2) * 0.03;
    } else if (localT > 3.6) {
      pelicanProgress = 2 / 6 + 1.6 * 0.03 + (localT - 3.6) / 2.4 * (1 - (2 / 6 + 1.6 * 0.03));
    }
    const pelicanX = 220 + pelicanProgress * 560;
    const groundY = 705;
    const rig = computePelicanRig(localT, {
      x: pelicanX,
      y: groundY,
      scale: 1.05
    });
    drawDefaultPelican(p, rig, {
      bodyColor: [248, 244, 235],
      // 洁白朱鹮圣鸟身躯
      beakColor: [225, 175, 45],
      // 法老黄金嘴
      pouchColor: [180, 60, 45],
      // 朱砂喉囊
      frameColor: [35, 115, 145],
      // 埃及蓝战车骨架
      wheelColor: [215, 165, 40],
      // 黄金辐条车轮
      eyeColor: [20, 20, 25]
    });
    p.fill(218, 175, 45);
    p.noStroke();
    p.ellipse(rig.chest.x + 2, rig.chest.y - 2, 16, 12);
    p.fill(40, 140, 160);
    p.ellipse(rig.chest.x + 2, rig.chest.y - 2, 8, 6);
    p.pop();
  }

  // src/scenes/s03_han_rubbing.js
  function render3(p, localT, beat, camera) {
    p.push();
    p.noStroke();
    p.fill(22, 22, 24);
    p.rect(0, 0, 1e3, 1e3);
    p.fill(240, 240, 235, 30);
    for (let i = 0; i < 350; i++) {
      const rx = pseudoNoise(i * 17) * 1e3;
      const ry = pseudoNoise(i * 31) * 1e3;
      const rs = 1 + pseudoNoise(i * 7) * 3.5;
      p.ellipse(rx, ry, rs, rs);
    }
    p.stroke(242, 242, 238, 200);
    p.strokeWeight(3);
    p.line(30, 80, 970, 80);
    p.line(30, 110, 970, 110);
    for (let x = 40; x <= 950; x += 30) {
      p.line(x, 110, x + 15, 80);
      p.line(x + 15, 80, x + 30, 110);
    }
    p.line(30, 880, 970, 880);
    p.line(30, 910, 970, 910);
    for (let x = 40; x <= 950; x += 30) {
      p.line(x, 880, x + 15, 910);
      p.line(x + 15, 910, x + 30, 880);
    }
    const drawHanChariot = (cx, cy, s = 1) => {
      p.push();
      p.translate(cx, cy);
      p.scale(s);
      p.stroke(245, 245, 240, 230);
      p.strokeWeight(3.5);
      p.fill(22, 22, 24);
      p.ellipse(0, 0, 95, 45);
      p.beginShape();
      p.vertex(-35, -5);
      p.vertex(-65, -50);
      p.vertex(-55, -75);
      p.vertex(-40, -50);
      p.vertex(-20, -15);
      p.endShape();
      for (let m = 0; m < 5; m++) {
        p.line(-55 + m * 7, -65 + m * 8, -70 + m * 7, -60 + m * 8);
      }
      p.line(-25, 20, -55, 65);
      p.line(-10, 20, -35, 75);
      p.line(25, 20, 55, 60);
      p.line(35, 18, 70, 50);
      p.noFill();
      p.bezier(45, -8, 85, -25, 110, 10, 95, 45);
      p.translate(140, -10);
      p.ellipse(0, 45, 70, 70);
      for (let sp = 0; sp < 8; sp++) {
        const a = sp * Math.PI / 4;
        p.line(0, 45, Math.cos(a) * 35, 45 + Math.sin(a) * 35);
      }
      p.rect(-30, 20, 55, 25);
      p.line(0, 20, 0, -60);
      p.arc(0, -60, 100, 35, Math.PI, 0);
      p.ellipse(-8, -10, 18, 22);
      p.rect(-16, -2, 4, 12);
      p.line(-10, 10, -5, 20);
      p.line(-8, 5, -195, -60);
      p.pop();
    };
    drawHanChariot(120, 600, 0.95);
    drawHanChariot(780, 590, 0.9);
    p.fill(245, 245, 240, 220);
    p.noStroke();
    p.textSize(26);
    p.textAlign(p.CENTER, p.TOP);
    p.text("\u8ECA\u99AC\u51FA\u884C \xB7 \u9D5C\u9D98\u96A8\u884C", 500, 140);
    const pelicanX = 220 + localT / 6 * 560;
    const groundY = 705;
    const rig = computePelicanRig(localT, {
      x: pelicanX,
      y: groundY,
      scale: 1.05
    });
    p.stroke(245, 245, 240);
    p.strokeWeight(4.5 * rig.scale);
    p.noFill();
    p.ellipse(rig.rearHub.x, rig.rearHub.y, rig.wheelRadius * 2, rig.wheelRadius * 2);
    p.ellipse(rig.frontHub.x, rig.frontHub.y, rig.wheelRadius * 2, rig.wheelRadius * 2);
    for (let i = 0; i < 8; i++) {
      const a = rig.wheelAngle + i * Math.PI / 4;
      p.line(rig.rearHub.x, rig.rearHub.y, rig.rearHub.x + Math.cos(a) * rig.wheelRadius, rig.rearHub.y + Math.sin(a) * rig.wheelRadius);
      p.line(rig.frontHub.x, rig.frontHub.y, rig.frontHub.x + Math.cos(a) * rig.wheelRadius, rig.frontHub.y + Math.sin(a) * rig.wheelRadius);
    }
    p.line(rig.rearHub.x, rig.rearHub.y, rig.bb.x, rig.bb.y);
    p.line(rig.bb.x, rig.bb.y, rig.saddle.x, rig.saddle.y);
    p.line(rig.saddle.x, rig.saddle.y, rig.rearHub.x, rig.rearHub.y);
    p.line(rig.bb.x, rig.bb.y, rig.headset.x, rig.headset.y);
    p.line(rig.saddle.x, rig.saddle.y, rig.headset.x, rig.headset.y);
    p.line(rig.headset.x, rig.headset.y, rig.frontHub.x, rig.frontHub.y);
    p.line(rig.headset.x, rig.headset.y, rig.handlebar.x, rig.handlebar.y);
    p.line(rig.hip.x, rig.hip.y, rig.legLeft.jointX, rig.legLeft.jointY);
    p.line(rig.legLeft.jointX, rig.legLeft.jointY, rig.pedalLeft.x, rig.pedalLeft.y);
    p.line(rig.hip.x, rig.hip.y, rig.legRight.jointX, rig.legRight.jointY);
    p.line(rig.legRight.jointX, rig.legRight.jointY, rig.pedalRight.x, rig.pedalRight.y);
    p.strokeWeight(5 * rig.scale);
    p.stroke(245, 245, 240);
    p.fill(22, 22, 24);
    p.ellipse(rig.chest.x - 10, rig.chest.y + 4, 75 * rig.scale, 50 * rig.scale);
    p.noFill();
    p.bezier(
      rig.neckBase.x,
      rig.neckBase.y,
      rig.neckMid.x - 14 * rig.scale,
      rig.neckMid.y,
      rig.neckMid.x + 10 * rig.scale,
      rig.neckMid.y - 12 * rig.scale,
      rig.head.x,
      rig.head.y
    );
    p.fill(22, 22, 24);
    p.ellipse(rig.head.x, rig.head.y, 28 * rig.scale, 24 * rig.scale);
    p.beginShape();
    p.vertex(rig.head.x + 8, rig.head.y - 4);
    p.vertex(rig.beakTip.x, rig.beakTip.y);
    p.vertex(rig.pouchBottom.x, rig.pouchBottom.y);
    p.vertex(rig.head.x + 12, rig.head.y + 8);
    p.endShape(p.CLOSE);
    p.fill(245, 245, 240);
    p.ellipse(rig.head.x + 4, rig.head.y - 2, 8, 8);
    p.fill(22, 22, 24);
    p.ellipse(rig.head.x + 4, rig.head.y - 2, 4, 4);
    p.pop();
  }

  // src/scenes/s04_tang_baimiao.js
  function render4(p, localT, beat, camera) {
    p.push();
    drawParchmentBackground(p, 1e3, 1e3, [246, 238, 222], 750);
    p.noFill();
    p.stroke(40, 38, 35, 140);
    p.strokeWeight(2.5);
    const drawCloud = (cx, cy, s = 1) => {
      p.push();
      p.translate(cx, cy);
      p.scale(s);
      const ctx = p.drawingContext;
      ctx.save();
      ctx.strokeStyle = "rgba(40, 38, 35, 0.55)";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(20, -25, 60, -25, 80, 0);
      ctx.bezierCurveTo(100, -35, 150, -20, 160, 15);
      ctx.bezierCurveTo(180, 35, 140, 70, 90, 50);
      ctx.bezierCurveTo(60, 65, 10, 50, 0, 0);
      ctx.stroke();
      ctx.restore();
      p.arc(60, 20, 30, 25, 0, Math.PI * 1.5);
      p.pop();
    };
    drawCloud(120, 220, 1.2);
    drawCloud(680, 180, 1);
    drawCloud(420, 310, 0.85);
    const pelicanX = 220 + localT / 6 * 560;
    const groundY = 705;
    const rig = computePelicanRig(localT, {
      x: pelicanX,
      y: groundY,
      scale: 1.05
    });
    drawDefaultPelican(p, rig, {
      bodyColor: [250, 245, 235],
      beakColor: [248, 240, 225],
      pouchColor: [245, 235, 220],
      frameColor: [32, 30, 28],
      wheelColor: [40, 38, 36],
      eyeColor: [20, 18, 16]
    });
    p.noFill();
    p.stroke(28, 25, 22);
    p.strokeWeight(3.5);
    const waveOffset = localT * 12;
    const ribbonX = rig.shoulder.x;
    const ribbonY = rig.shoulder.y;
    p.beginShape();
    p.vertex(ribbonX, ribbonY);
    for (let i = 1; i <= 8; i++) {
      const px = ribbonX - i * 45;
      const py = ribbonY - 20 + Math.sin(waveOffset + i * 0.9) * (18 + i * 4.5);
      p.vertex(px, py);
    }
    p.endShape();
    p.beginShape();
    p.vertex(ribbonX + 5, ribbonY + 8);
    for (let i = 1; i <= 8; i++) {
      const px = ribbonX - i * 48;
      const py = ribbonY + 15 + Math.cos(waveOffset + i * 0.9) * (20 + i * 5);
      p.vertex(px, py);
    }
    p.endShape();
    p.strokeWeight(2);
    for (let f = 0; f < 5; f++) {
      const fx = rig.hip.x - 22;
      const fy = rig.hip.y - 10 + f * 6;
      const flen = 40 + f * 8;
      const fAngle = Math.PI * 0.95 + Math.sin(waveOffset + f) * 0.35;
      p.line(fx, fy, fx + Math.cos(fAngle) * flen, fy + Math.sin(fAngle) * flen);
    }
    p.stroke(50, 45, 40, 160);
    p.strokeWeight(2.5);
    p.line(0, 785, 1e3, 785);
    p.pop();
  }

  // src/scenes/s05_song_landscape.js
  function render5(p, localT, beat, camera) {
    p.push();
    drawParchmentBackground(p, 1e3, 1e3, [218, 196, 160], 1e3);
    const pelicanX = 280 + localT / 6 * 480;
    const groundY = 745;
    p.push();
    if (localT >= 1.5 && localT <= 4) {
      const focusProgress = Math.sin((localT - 1.5) / 2.5 * Math.PI);
      const camZoom = 1 + focusProgress * 1.6;
      p.translate(pelicanX, groundY - 30);
      p.scale(camZoom);
      p.translate(-pelicanX, -(groundY - 30));
    }
    p.fill(68, 62, 54);
    p.noStroke();
    p.beginShape();
    p.vertex(140, 680);
    p.vertex(120, 260);
    p.vertex(180, 120);
    p.vertex(280, 60);
    p.vertex(520, 50);
    p.vertex(760, 80);
    p.vertex(860, 180);
    p.vertex(880, 680);
    p.endShape(p.CLOSE);
    p.fill(28, 25, 22);
    for (let t = 0; t < 90; t++) {
      const tx = 200 + pseudoNoise(t * 13) * 620;
      const ty = 50 + pseudoNoise(t * 19) * 90;
      const tw = 12 + pseudoNoise(t * 7) * 20;
      const th = 8 + pseudoNoise(t * 11) * 16;
      p.ellipse(tx, ty, tw, th);
    }
    p.fill(42, 38, 32, 160);
    for (let i = 0; i < 280; i++) {
      const qx = 160 + pseudoNoise(i * 23) * 700;
      const qy = 120 + pseudoNoise(i * 37) * 450;
      const qh = 4 + pseudoNoise(i * 5) * 14;
      p.rect(qx, qy, 3, qh, 1);
    }
    p.stroke(242, 235, 220, 210);
    p.strokeWeight(3.5);
    p.line(780, 120, 785, 340);
    p.strokeWeight(5);
    p.line(785, 340, 792, 540);
    p.noStroke();
    p.fill(218, 196, 160, 210);
    p.ellipse(450, 560, 650, 140);
    p.ellipse(750, 580, 400, 120);
    p.fill(52, 46, 40);
    p.beginShape();
    p.vertex(60, 850);
    p.vertex(80, 620);
    p.vertex(280, 560);
    p.vertex(440, 640);
    p.vertex(480, 850);
    p.endShape(p.CLOSE);
    const drawPineTree = (px, py, s = 1) => {
      p.push();
      p.translate(px, py);
      p.scale(s);
      p.stroke(24, 20, 18);
      p.strokeWeight(6);
      p.noFill();
      p.bezier(0, 0, 10, -50, -25, -90, -10, -140);
      p.bezier(-10, -140, 30, -160, 60, -140, 80, -120);
      p.fill(32, 28, 24);
      p.noStroke();
      p.ellipse(-20, -110, 55, 30);
      p.ellipse(10, -150, 65, 35);
      p.ellipse(75, -130, 50, 25);
      p.pop();
    };
    drawPineTree(240, 680, 1.1);
    drawPineTree(360, 720, 0.95);
    p.fill(40, 35, 30);
    p.beginShape();
    p.vertex(0, 780);
    p.vertex(350, 760);
    p.vertex(700, 770);
    p.vertex(1e3, 760);
    p.vertex(1e3, 1e3);
    p.vertex(0, 1e3);
    p.endShape(p.CLOSE);
    p.stroke(218, 196, 160, 120);
    p.strokeWeight(2);
    for (let r = 0; r < 8; r++) {
      p.line(80 + r * 100, 840 + r % 3 * 15, 160 + r * 100, 840 + r % 3 * 15);
    }
    const rig = computePelicanRig(localT, {
      x: pelicanX,
      y: groundY,
      scale: 0.38
      // 极小！仅相当于常规比例的 1/3，融入巨碑山水！
    });
    drawDefaultPelican(p, rig, {
      bodyColor: [248, 244, 235],
      beakColor: [180, 140, 90],
      pouchColor: [160, 110, 60],
      frameColor: [30, 25, 20],
      wheelColor: [45, 40, 35],
      eyeColor: [15, 15, 15]
    });
    if (localT >= 2 && localT <= 3.6) {
      p.push();
      p.translate(pelicanX, groundY - 70);
      p.fill(185, 45, 35, 220);
      p.noStroke();
      p.rect(-32, -26, 64, 24, 4);
      p.fill(255, 255, 255);
      p.textSize(14);
      p.textAlign(p.CENTER, p.CENTER);
      p.text("\u5728\u6B64", 0, -14);
      p.pop();
    }
    p.pop();
    p.pop();
  }

  // src/scenes/s06_qingming.js
  function render6(p, localT, beat, camera) {
    p.push();
    drawParchmentBackground(p, 1e3, 1e3, [238, 222, 192], 1100);
    p.noStroke();
    p.fill(210, 195, 168);
    p.rect(0, 480, 1e3, 80);
    const drawRiverWillow = (wx, wy) => {
      p.push();
      p.translate(wx, wy);
      p.stroke(65, 52, 42);
      p.strokeWeight(3.5);
      p.noFill();
      p.bezier(0, 0, -10, -40, 15, -70, 0, -110);
      p.strokeWeight(1.8);
      p.line(0, -110, -25, -140);
      p.line(0, -110, 20, -135);
      p.fill(120, 135, 100, 140);
      p.noStroke();
      p.ellipse(-20, -135, 30, 20);
      p.ellipse(15, -130, 35, 22);
      p.pop();
    };
    drawRiverWillow(80, 490);
    drawRiverWillow(220, 500);
    drawRiverWillow(780, 495);
    drawRiverWillow(910, 485);
    p.fill(168, 185, 172, 180);
    p.rect(0, 560, 1e3, 440);
    p.stroke(140, 160, 148, 150);
    p.strokeWeight(1.5);
    for (let r = 0; r < 20; r++) {
      const rx = pseudoNoise(r * 19) * 900;
      const ry = 620 + pseudoNoise(r * 29) * 320;
      p.line(rx, ry, rx + 60, ry);
    }
    p.push();
    p.translate(500, 760);
    p.fill(145, 110, 75);
    p.stroke(55, 40, 28);
    p.strokeWeight(2.5);
    p.beginShape();
    p.vertex(-120, 0);
    p.vertex(120, 0);
    p.vertex(90, 45);
    p.vertex(-90, 45);
    p.endShape(p.CLOSE);
    p.stroke(45, 30, 20);
    p.strokeWeight(4);
    p.line(-100, -5, 80, 15);
    p.strokeWeight(2.5);
    p.line(70, 0, 95, 60);
    p.fill(195, 85, 70);
    p.ellipse(65, -12, 10, 12);
    p.pop();
    p.noFill();
    p.stroke(85, 60, 40);
    p.strokeWeight(12);
    p.arc(500, 920, 960, 520, Math.PI * 1.05, Math.PI * 1.95);
    p.strokeWeight(6);
    p.arc(500, 905, 960, 520, Math.PI * 1.05, Math.PI * 1.95);
    p.strokeWeight(3.5);
    p.stroke(70, 50, 32);
    for (let b = -400; b <= 400; b += 45) {
      const bridgeY = 660 - Math.cos(b / 480 * (Math.PI / 2)) * 140;
      p.line(500 + b, bridgeY, 500 + b, bridgeY + 35);
    }
    p.stroke(60, 42, 28);
    p.strokeWeight(2.5);
    for (let pIdx = -420; pIdx <= 420; pIdx += 28) {
      const by = 650 - Math.cos(pIdx / 480 * (Math.PI / 2)) * 140;
      p.line(500 + pIdx, by, 500 + pIdx, by - 24);
      p.fill(70, 50, 35);
      p.ellipse(500 + pIdx, by - 25, 5, 5);
    }
    p.noFill();
    p.strokeWeight(3);
    p.arc(500, 895, 960, 520, Math.PI * 1.06, Math.PI * 1.94);
    p.push();
    p.translate(880, 560);
    p.stroke(50, 35, 25);
    p.strokeWeight(4);
    p.line(0, 0, -20, -90);
    p.fill(215, 175, 110);
    p.strokeWeight(1.5);
    p.rect(-70, -90, 50, 75, 2);
    p.fill(160, 40, 30);
    p.noStroke();
    p.textSize(18);
    p.textStyle(p.BOLD);
    p.textAlign(p.CENTER, p.CENTER);
    p.text("\u6B63\n\u5E97", -45, -52);
    p.pop();
    const drawCitizen = (px, py, color, isCarrying = false) => {
      p.push();
      p.translate(px, py);
      p.noStroke();
      p.fill(35, 28, 22);
      p.ellipse(0, -18, 10, 11);
      p.fill(color[0], color[1], color[2]);
      p.quad(-7, -10, 7, -10, 9, 12, -9, 12);
      p.stroke(35, 28, 22);
      p.strokeWeight(1.8);
      if (isCarrying) {
        p.line(-22, -15, 22, -15);
        p.fill(160, 120, 80);
        p.rect(-24, -12, 10, 12);
        p.rect(14, -12, 10, 12);
      } else {
        p.line(0, -6, -10, -2);
      }
      p.pop();
    };
    drawCitizen(260, 605, [180, 80, 65], true);
    drawCitizen(320, 565, [75, 110, 130]);
    drawCitizen(370, 545, [135, 105, 80]);
    drawCitizen(680, 540, [170, 130, 85]);
    drawCitizen(740, 560, [95, 125, 90], true);
    drawCitizen(800, 600, [155, 75, 70]);
    const pelicanX = 220 + localT / 6 * 560;
    const bridgeOffset = 500 - pelicanX;
    const bridgeCurveY = 650 - Math.cos(bridgeOffset / 480 * (Math.PI / 2)) * 140;
    const rig = computePelicanRig(localT, {
      x: pelicanX,
      y: bridgeCurveY - 15,
      scale: 0.95
    });
    drawDefaultPelican(p, rig, {
      bodyColor: [248, 245, 238],
      beakColor: [215, 150, 70],
      pouchColor: [185, 110, 50],
      frameColor: [65, 45, 30],
      wheelColor: [50, 35, 25],
      eyeColor: [20, 20, 20]
    });
    p.pop();
  }

  // src/scenes/s07_maya_codex.js
  function render7(p, localT, beat, camera) {
    p.push();
    drawParchmentBackground(p, 1e3, 1e3, [228, 205, 168], 1200);
    p.noStroke();
    p.fill(80, 60, 40, 35);
    p.rect(495, 0, 10, 1e3);
    p.stroke(185, 45, 30);
    p.strokeWeight(8);
    p.noFill();
    p.rect(60, 60, 880, 880);
    p.stroke(35, 30, 25);
    p.strokeWeight(2.5);
    p.rect(70, 70, 860, 860);
    p.noStroke();
    p.fill(60, 140, 160);
    p.rect(80, 80, 840, 40);
    const crankRounds = Math.min(6, Math.floor(localT));
    p.push();
    p.translate(720, 160);
    p.stroke(170, 50, 35);
    p.strokeWeight(4);
    p.fill(245, 230, 200, 230);
    p.rect(0, 0, 180, 260, 12);
    p.fill(40, 35, 30);
    p.noStroke();
    p.textAlign(p.CENTER, p.TOP);
    p.textSize(15);
    p.text("\u8E0F\u677F\u5468\u6570 (K'atun)", 90, 14);
    const drawMayaNumber = (val, x, y) => {
      p.push();
      p.translate(x, y);
      const bars = Math.floor(val / 5);
      const dots = val % 5;
      p.fill(180, 45, 30);
      p.noStroke();
      const dotSpacing = 16;
      const startX = -((dots - 1) * dotSpacing) / 2;
      for (let d = 0; d < dots; d++) {
        p.ellipse(startX + d * dotSpacing, 0, 10, 10);
      }
      p.stroke(40, 35, 30);
      p.strokeWeight(7);
      for (let b = 0; b < bars; b++) {
        p.line(-30, 18 + b * 12, 30, 18 + b * 12);
      }
      p.pop();
    };
    drawMayaNumber(crankRounds, 90, 85);
    p.fill(60, 130, 150);
    p.textSize(12);
    p.text(`\u5F53\u524D\u7D2F\u8BA1: ${crankRounds} \u5708`, 90, 215);
    p.pop();
    const drawMayaPriest = (px, py) => {
      p.push();
      p.translate(px, py);
      p.stroke(50, 160, 110);
      p.strokeWeight(5);
      p.noFill();
      for (let f = 0; f < 6; f++) {
        p.bezier(0, -60, 30, -90 - f * 10, 80, -80 - f * 5, 110, -50 - f * 5);
      }
      p.fill(195, 105, 60);
      p.stroke(40, 30, 25);
      p.strokeWeight(3);
      p.beginShape();
      p.vertex(-10, -30);
      p.vertex(15, -60);
      p.vertex(35, -25);
      p.vertex(18, -15);
      p.vertex(25, 0);
      p.vertex(-15, 0);
      p.endShape(p.CLOSE);
      p.fill(50, 180, 120);
      p.ellipse(-5, -15, 14, 14);
      p.fill(210, 80, 50);
      p.rect(-20, 0, 45, 90);
      p.pop();
    };
    drawMayaPriest(180, 460);
    const pelicanX = 220 + localT / 6 * 520;
    const groundY = 705;
    const rig = computePelicanRig(localT, {
      x: pelicanX,
      y: groundY,
      scale: 1.05
    });
    drawDefaultPelican(p, rig, {
      bodyColor: [245, 235, 215],
      beakColor: [215, 140, 45],
      pouchColor: [195, 65, 45],
      frameColor: [55, 120, 140],
      // 玛雅青蓝车架
      wheelColor: [60, 45, 35],
      eyeColor: [30, 20, 15]
    });
    p.stroke(170, 40, 30);
    p.strokeWeight(6);
    p.line(70, 785, 930, 785);
    p.pop();
  }

  // src/scenes/s08_mughal_miniature.js
  function render8(p, localT, beat, camera) {
    p.push();
    p.noStroke();
    p.fill(245, 240, 228);
    p.rect(0, 0, 1e3, 1e3);
    p.fill(218, 165, 32);
    p.rect(0, 0, 1e3, 45);
    p.rect(0, 955, 1e3, 45);
    p.rect(0, 0, 45, 1e3);
    p.rect(955, 0, 45, 1e3);
    p.fill(45, 110, 75);
    p.rect(50, 180, 900, 520);
    p.fill(40, 150, 185);
    p.rect(50, 410, 900, 60);
    p.rect(470, 180, 60, 520);
    p.push();
    p.translate(500, 440);
    p.fill(235, 235, 230);
    p.stroke(218, 165, 32);
    p.strokeWeight(4);
    p.beginShape();
    for (let a = 0; a < 8; a++) {
      const angle = a * Math.PI / 4;
      p.vertex(Math.cos(angle) * 75, Math.sin(angle) * 75);
    }
    p.endShape(p.CLOSE);
    p.fill(30, 160, 195);
    p.ellipse(0, 0, 80, 80);
    p.pop();
    const drawCypress = (cx, cy) => {
      p.push();
      p.translate(cx, cy);
      p.noStroke();
      p.fill(20, 60, 40);
      const ctx = p.drawingContext;
      ctx.save();
      ctx.fillStyle = "rgb(20, 60, 40)";
      ctx.beginPath();
      ctx.moveTo(0, -110);
      ctx.bezierCurveTo(22, -60, 18, 10, 0, 20);
      ctx.bezierCurveTo(-18, 10, -22, -60, 0, -110);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
      p.fill(90, 60, 30);
      p.rect(-3, 20, 6, 25);
      p.pop();
    };
    drawCypress(120, 300);
    drawCypress(240, 300);
    drawCypress(760, 300);
    drawCypress(880, 300);
    const drawMughalCourtier = (mx, my, lookLeft = false, robes = [190, 40, 40]) => {
      p.push();
      p.translate(mx, my);
      if (lookLeft) p.scale(-1, 1);
      p.noStroke();
      p.fill(230, 185, 45);
      p.ellipse(0, -32, 26, 22);
      p.fill(robes[0], robes[1], robes[2]);
      p.ellipse(8, -36, 12, 10);
      p.stroke(218, 165, 32);
      p.strokeWeight(2);
      p.line(0, -42, 6, -55);
      p.fill(225, 185, 150);
      p.noStroke();
      p.ellipse(0, -18, 18, 20);
      p.fill(30, 25, 20);
      p.ellipse(4, -18, 4, 3);
      p.rect(2, -12, 8, 3);
      p.fill(robes[0], robes[1], robes[2]);
      p.triangle(0, -8, -16, 65, 16, 65);
      p.fill(220, 175, 40);
      p.rect(-14, 18, 28, 8);
      p.pop();
    };
    drawMughalCourtier(180, 520, false, [185, 45, 45]);
    drawMughalCourtier(320, 510, false, [65, 95, 160]);
    drawMughalCourtier(720, 515, true, [205, 135, 45]);
    drawMughalCourtier(850, 525, true, [140, 60, 120]);
    const pelicanX = 220 + localT / 6 * 560;
    const groundY = 715;
    const rig = computePelicanRig(localT, {
      x: pelicanX,
      y: groundY,
      scale: 1.05
    });
    drawDefaultPelican(p, rig, {
      bodyColor: [255, 255, 255],
      beakColor: [225, 175, 35],
      pouchColor: [210, 65, 55],
      frameColor: [20, 65, 130],
      // 皇家青金石蓝车架
      wheelColor: [210, 165, 35],
      // 镀金轮辐
      eyeColor: [20, 20, 25]
    });
    p.stroke(218, 165, 32);
    p.strokeWeight(8);
    p.line(50, 795, 950, 795);
    p.pop();
  }

  // src/scenes/s09_bada_shanren.js
  function render9(p, localT, beat, camera) {
    p.push();
    drawParchmentBackground(p, 1e3, 1e3, [248, 246, 240], 1690);
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
    p.stroke(25, 23, 22);
    p.strokeWeight(6);
    p.noFill();
    p.beginShape();
    p.vertex(180, 420);
    p.vertex(270, 390);
    p.vertex(320, 420);
    p.vertex(390, 380);
    p.endShape();
    p.strokeWeight(2);
    p.ellipse(395, 378, 12, 12);
    const pelicanX = 240 + localT / 6 * 520;
    const groundY = 705;
    const rig = computePelicanRig(localT, {
      x: pelicanX,
      y: groundY,
      scale: 1.05
    });
    p.stroke(25, 25, 25);
    p.strokeWeight(4.5 * rig.scale);
    p.noFill();
    p.ellipse(rig.rearHub.x, rig.rearHub.y, rig.wheelRadius * 2, rig.wheelRadius * 2);
    p.ellipse(rig.frontHub.x, rig.frontHub.y, rig.wheelRadius * 2, rig.wheelRadius * 2);
    p.line(rig.rearHub.x, rig.rearHub.y, rig.bb.x, rig.bb.y);
    p.line(rig.bb.x, rig.bb.y, rig.saddle.x, rig.saddle.y);
    p.line(rig.saddle.x, rig.saddle.y, rig.rearHub.x, rig.rearHub.y);
    p.line(rig.bb.x, rig.bb.y, rig.headset.x, rig.headset.y);
    p.line(rig.saddle.x, rig.saddle.y, rig.headset.x, rig.headset.y);
    p.line(rig.headset.x, rig.headset.y, rig.frontHub.x, rig.frontHub.y);
    p.line(rig.headset.x, rig.headset.y, rig.handlebar.x, rig.handlebar.y);
    p.line(rig.hip.x, rig.hip.y, rig.legLeft.jointX, rig.legLeft.jointY);
    p.line(rig.legLeft.jointX, rig.legLeft.jointY, rig.pedalLeft.x, rig.pedalLeft.y);
    p.line(rig.hip.x, rig.hip.y, rig.legRight.jointX, rig.legRight.jointY);
    p.line(rig.legRight.jointX, rig.legRight.jointY, rig.pedalRight.x, rig.pedalRight.y);
    p.noStroke();
    p.fill(40, 38, 35, 230);
    p.ellipse(rig.chest.x - 15, rig.chest.y + 5, 80 * rig.scale, 55 * rig.scale);
    p.stroke(40, 38, 35);
    p.strokeWeight(15 * rig.scale);
    p.line(rig.neckBase.x, rig.neckBase.y, rig.head.x, rig.head.y);
    p.strokeWeight(3.5 * rig.scale);
    p.noFill();
    p.line(rig.head.x + 8, rig.head.y, rig.beakTip.x, rig.beakTip.y);
    p.line(rig.head.x + 8, rig.head.y + 12, rig.beakTip.x, rig.beakTip.y);
    p.fill(255, 255, 255);
    p.stroke(20, 20, 20);
    p.strokeWeight(2);
    p.ellipse(rig.head.x + 2, rig.head.y - 4, 18 * rig.scale, 16 * rig.scale);
    p.fill(20, 20, 20);
    p.noStroke();
    p.ellipse(rig.head.x + 2, rig.head.y - 9, 4.5 * rig.scale, 4.5 * rig.scale);
    p.fill(30, 30, 30);
    p.textAlign(p.CENTER, p.TOP);
    p.textSize(24);
    p.textStyle(p.BOLD);
    p.text("\u516B\n\u5927\n\u5C71\n\u4EBA", 880, 200);
    p.fill(180, 45, 35);
    p.noStroke();
    p.rect(865, 340, 30, 30, 2);
    p.fill(255, 255, 255);
    p.textSize(10);
    p.text("\u767D\n\u773C", 880, 345);
    p.pop();
  }

  // src/scenes/s10_wayang_kulit.js
  function render10(p, localT, beat, camera) {
    p.push();
    p.noStroke();
    p.fill(242, 220, 160);
    p.rect(0, 0, 1e3, 1e3);
    p.fill(255, 246, 205, 160);
    p.ellipse(500, 480, 800, 800);
    p.fill(255, 252, 230, 90);
    p.ellipse(500, 480, 520, 520);
    const drawGunungan = (gx, gy, scale = 1) => {
      p.push();
      p.translate(gx, gy);
      p.scale(scale);
      p.fill(28, 20, 15);
      const ctx2 = p.drawingContext;
      ctx2.save();
      ctx2.fillStyle = "rgb(28, 20, 15)";
      ctx2.beginPath();
      ctx2.moveTo(0, -220);
      ctx2.bezierCurveTo(80, -140, 105, -30, 95, 120);
      ctx2.lineTo(-95, 120);
      ctx2.bezierCurveTo(-105, -30, -80, -140, 0, -220);
      ctx2.closePath();
      ctx2.fill();
      ctx2.restore();
      p.fill(245, 225, 165);
      p.ellipse(0, -120, 18, 30);
      p.ellipse(0, -50, 40, 70);
      p.ellipse(0, 40, 50, 50);
      p.stroke(80, 50, 25);
      p.strokeWeight(6);
      p.line(0, 100, 0, 300);
      p.pop();
    };
    drawGunungan(90, 500, 1.15);
    drawGunungan(910, 500, 1.15);
    const quantizedT = quantizeTime(localT, 10);
    const pelicanX = 220 + localT / 6 * 560;
    const groundY = 705;
    const rig = computePelicanRig(quantizedT, {
      x: pelicanX,
      y: groundY,
      scale: 1.05
    });
    p.stroke(85, 55, 25);
    p.strokeWeight(3.5);
    p.line(rig.head.x - 2, rig.head.y, rig.head.x - 45, 960);
    p.line(rig.handlebar.x, rig.handlebar.y, rig.handlebar.x - 30, 980);
    p.line(rig.bb.x, rig.bb.y, rig.bb.x - 15, 990);
    p.line(rig.saddle.x, rig.saddle.y, rig.saddle.x - 35, 970);
    const drawPuppetWheel = (hub) => {
      p.push();
      p.translate(hub.x, hub.y);
      p.fill(28, 20, 15);
      p.noStroke();
      p.ellipse(0, 0, rig.wheelRadius * 2, rig.wheelRadius * 2);
      p.fill(245, 222, 160);
      const holes = 10;
      for (let i = 0; i < holes; i++) {
        const a = rig.wheelAngle + i * Math.PI * 2 / holes;
        p.ellipse(Math.cos(a) * (rig.wheelRadius * 0.65), Math.sin(a) * (rig.wheelRadius * 0.65), 12, 12);
        p.ellipse(Math.cos(a + Math.PI / holes) * (rig.wheelRadius * 0.35), Math.sin(a + Math.PI / holes) * (rig.wheelRadius * 0.35), 8, 8);
      }
      p.noFill();
      p.stroke(218, 165, 32);
      p.strokeWeight(2.5);
      p.ellipse(0, 0, rig.wheelRadius * 1.85, rig.wheelRadius * 1.85);
      p.ellipse(0, 0, rig.wheelRadius * 0.95, rig.wheelRadius * 0.95);
      p.pop();
    };
    drawPuppetWheel(rig.rearHub);
    drawPuppetWheel(rig.frontHub);
    p.stroke(28, 20, 15);
    p.strokeWeight(7.5 * rig.scale);
    p.strokeCap(p.ROUND);
    p.line(rig.rearHub.x, rig.rearHub.y, rig.bb.x, rig.bb.y);
    p.line(rig.bb.x, rig.bb.y, rig.saddle.x, rig.saddle.y);
    p.line(rig.saddle.x, rig.saddle.y, rig.rearHub.x, rig.rearHub.y);
    p.line(rig.bb.x, rig.bb.y, rig.headset.x, rig.headset.y);
    p.line(rig.saddle.x, rig.saddle.y, rig.headset.x, rig.headset.y);
    p.line(rig.headset.x, rig.headset.y, rig.frontHub.x, rig.frontHub.y);
    p.line(rig.headset.x, rig.headset.y, rig.handlebar.x, rig.handlebar.y);
    p.stroke(218, 165, 32);
    p.strokeWeight(1.8 * rig.scale);
    p.line(rig.bb.x, rig.bb.y, rig.headset.x, rig.headset.y);
    p.line(rig.saddle.x, rig.saddle.y, rig.headset.x, rig.headset.y);
    p.fill(218, 165, 32);
    p.noStroke();
    p.ellipse(rig.bb.x, rig.bb.y, 11, 11);
    p.ellipse(rig.headset.x, rig.headset.y, 11, 11);
    p.ellipse(rig.rearHub.x, rig.rearHub.y, 9, 9);
    p.ellipse(rig.frontHub.x, rig.frontHub.y, 9, 9);
    p.stroke(28, 20, 15);
    p.strokeWeight(7 * rig.scale);
    p.line(rig.hip.x, rig.hip.y, rig.legRight.jointX, rig.legRight.jointY);
    p.line(rig.legRight.jointX, rig.legRight.jointY, rig.pedalRight.x, rig.pedalRight.y);
    p.fill(218, 165, 32);
    p.noStroke();
    p.ellipse(rig.legRight.jointX, rig.legRight.jointY, 10, 10);
    p.ellipse(rig.pedalRight.x, rig.pedalRight.y, 8, 8);
    const ctx = p.drawingContext;
    ctx.save();
    ctx.fillStyle = "rgb(28, 20, 15)";
    ctx.beginPath();
    ctx.moveTo(rig.hip.x - 16 * rig.scale, rig.hip.y + 4 * rig.scale);
    ctx.bezierCurveTo(
      rig.hip.x - 24 * rig.scale,
      rig.hip.y - 30 * rig.scale,
      rig.chest.x - 10 * rig.scale,
      rig.chest.y - 42 * rig.scale,
      rig.chest.x + 8 * rig.scale,
      rig.chest.y
    );
    ctx.bezierCurveTo(
      rig.chest.x + 12 * rig.scale,
      rig.chest.y + 24 * rig.scale,
      rig.hip.x + 12 * rig.scale,
      rig.hip.y + 14 * rig.scale,
      rig.hip.x - 16 * rig.scale,
      rig.hip.y + 4 * rig.scale
    );
    ctx.closePath();
    ctx.fill();
    ctx.restore();
    p.stroke(28, 20, 15);
    p.strokeWeight(16 * rig.scale);
    p.noFill();
    p.bezier(
      rig.neckBase.x,
      rig.neckBase.y,
      rig.neckMid.x - 14 * rig.scale,
      rig.neckMid.y,
      rig.neckMid.x + 10 * rig.scale,
      rig.neckMid.y - 12 * rig.scale,
      rig.head.x,
      rig.head.y
    );
    p.stroke(218, 165, 32);
    p.strokeWeight(2.5 * rig.scale);
    p.bezier(
      rig.neckBase.x - 4,
      rig.neckBase.y,
      rig.neckMid.x - 18 * rig.scale,
      rig.neckMid.y,
      rig.neckMid.x + 6 * rig.scale,
      rig.neckMid.y - 12 * rig.scale,
      rig.head.x - 4,
      rig.head.y
    );
    p.noStroke();
    p.fill(28, 20, 15);
    p.ellipse(rig.head.x, rig.head.y, 30 * rig.scale, 26 * rig.scale);
    p.fill(218, 165, 32);
    p.triangle(
      rig.head.x - 8,
      rig.head.y - 10,
      rig.head.x + 10,
      rig.head.y - 10,
      rig.head.x - 2,
      rig.head.y - 42
    );
    p.fill(28, 20, 15);
    p.ellipse(rig.head.x - 1, rig.head.y - 25, 6, 6);
    p.fill(28, 20, 15);
    p.beginShape();
    p.vertex(rig.head.x + 8, rig.head.y - 4);
    p.vertex(rig.beakTip.x, rig.beakTip.y);
    p.vertex(rig.pouchBottom.x, rig.pouchBottom.y);
    p.vertex(rig.head.x + 12, rig.head.y + 10);
    p.endShape(p.CLOSE);
    p.fill(245, 220, 160);
    p.ellipse(rig.head.x + 38 * rig.scale, rig.head.y + 22 * rig.scale, 16, 22);
    p.ellipse(rig.head.x + 56 * rig.scale, rig.head.y + 16 * rig.scale, 12, 16);
    p.fill(218, 165, 32);
    p.ellipse(rig.head.x + 4, rig.head.y - 3, 8, 8);
    p.fill(28, 20, 15);
    p.ellipse(rig.head.x + 4, rig.head.y - 3, 4, 4);
    p.pop();
  }

  // src/scenes/s11_ukiyo_e.js
  function render11(p, localT, beat, camera) {
    p.push();
    drawParchmentBackground(p, 1e3, 1e3, [246, 238, 220], 1830);
    p.noStroke();
    p.fill(35, 75, 130);
    p.rect(0, 0, 1e3, 140);
    p.fill(70, 115, 170, 180);
    p.rect(0, 140, 1e3, 100);
    p.fill(245, 245, 250);
    p.beginShape();
    p.vertex(650, 220);
    p.vertex(720, 290);
    p.vertex(580, 290);
    p.endShape(p.CLOSE);
    p.fill(40, 65, 110);
    p.beginShape();
    p.vertex(650, 220);
    p.vertex(840, 520);
    p.vertex(460, 520);
    p.endShape(p.CLOSE);
    const drawUkiyoPine = (px, py, s = 1) => {
      p.push();
      p.translate(px, py);
      p.scale(s);
      p.stroke(40, 30, 25);
      p.strokeWeight(16);
      p.noFill();
      p.bezier(0, 200, 20, 120, -40, 60, -20, 0);
      p.bezier(-20, 0, 0, -50, 80, -70, 120, -90);
      p.noStroke();
      p.fill(35, 85, 65);
      p.ellipse(120, -90, 140, 45);
      p.ellipse(60, -60, 110, 35);
      p.ellipse(-20, -10, 90, 30);
      p.pop();
    };
    drawUkiyoPine(140, 500, 0.95);
    drawUkiyoPine(880, 520, 0.85);
    const drawTraveler = (tx, ty) => {
      p.push();
      p.translate(tx, ty);
      p.fill(215, 185, 120);
      p.stroke(60, 45, 30);
      p.strokeWeight(2);
      p.triangle(-30, -35, 30, -35, 0, -55);
      p.fill(50, 90, 140);
      p.noStroke();
      p.triangle(0, -30, -18, 60, 18, 60);
      p.stroke(60, 45, 30);
      p.strokeWeight(4);
      p.line(-8, 60, -8, 85);
      p.line(8, 60, 8, 85);
      p.pop();
    };
    drawTraveler(240, 610);
    const pelicanX = 220 + localT / 6 * 560;
    const groundY = 705;
    const rig = computePelicanRig(localT, {
      x: pelicanX,
      y: groundY,
      scale: 1.05
    });
    drawDefaultPelican(p, rig, {
      bodyColor: [250, 248, 242],
      beakColor: [230, 155, 45],
      pouchColor: [215, 95, 60],
      frameColor: [35, 55, 85],
      // 普鲁士蓝车架
      wheelColor: [45, 35, 30],
      eyeColor: [20, 20, 20]
    });
    p.push();
    p.translate(rig.head.x, rig.head.y - 12);
    p.fill(215, 185, 120);
    p.stroke(60, 45, 30);
    p.strokeWeight(2);
    p.triangle(-20, 0, 20, 0, 0, -16);
    p.stroke(180, 50, 40);
    p.line(0, 0, 4, 16);
    p.pop();
    p.stroke(150, 110, 75);
    p.strokeWeight(12);
    p.line(0, 785, 1e3, 785);
    p.fill(205, 50, 40);
    p.noStroke();
    p.rect(880, 80, 36, 120, 4);
    p.fill(255, 255, 255);
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(16);
    p.text("\u6771\n\u6D77\n\u9053", 898, 140);
    p.pop();
  }

  // src/scenes/s12_starry_night.js
  function render12(p, localT, beat, camera) {
    p.push();
    p.noStroke();
    p.fill(20, 32, 68);
    p.rect(0, 0, 1e3, 1e3);
    const swirlAngle = localT * Math.PI * 2;
    const drawSwirlStroke = (cx, cy, radius, startA, color, len = 25) => {
      p.push();
      p.translate(cx, cy);
      p.rotate(swirlAngle * 0.5);
      p.stroke(color[0], color[1], color[2]);
      p.strokeWeight(7);
      p.strokeCap(p.ROUND);
      for (let a = startA; a < startA + Math.PI * 1.5; a += 0.18) {
        const r = radius + a * 18;
        const x = Math.cos(a) * r;
        const y = Math.sin(a) * r * 0.7;
        p.line(x, y, x + Math.cos(a + 0.3) * len, y + Math.sin(a + 0.3) * len);
      }
      p.pop();
    };
    for (let ring = 40; ring < 200; ring += 35) {
      drawSwirlStroke(520, 320, ring, 0, [245, 215, 60], 18);
      drawSwirlStroke(520, 320, ring + 15, 0.4, [65, 140, 205], 22);
      drawSwirlStroke(520, 320, ring + 25, 0.8, [230, 240, 255], 16);
    }
    p.push();
    p.translate(850, 180);
    p.strokeWeight(6);
    for (let r = 20; r <= 80; r += 14) {
      for (let a = 0; a < Math.PI * 2; a += 0.35) {
        const col = r > 40 ? [240, 180, 40] : [255, 240, 120];
        p.stroke(col[0], col[1], col[2]);
        p.line(Math.cos(a) * r, Math.sin(a) * r, Math.cos(a + 0.15) * (r + 8), Math.sin(a + 0.15) * (r + 8));
      }
    }
    p.pop();
    p.push();
    p.translate(140, 680);
    p.stroke(18, 30, 24);
    p.strokeWeight(12);
    for (let i = 0; i < 45; i++) {
      const tx = Math.sin(i * 13) * 35 * (1 - i / 45);
      const ty = -i * 12;
      p.line(tx, ty, tx + Math.cos(i) * 15, ty - 18);
    }
    p.pop();
    p.stroke(25, 45, 95);
    p.strokeWeight(10);
    for (let x = 0; x < 1e3; x += 30) {
      const hillY = 620 + Math.sin(x * 8e-3) * 60;
      p.line(x, hillY, x + 20, hillY + 5);
    }
    const pelicanX = 220 + localT / 6 * 560;
    const groundY = 710;
    const rig = computePelicanRig(localT, {
      x: pelicanX,
      y: groundY,
      scale: 1.05
    });
    drawDefaultPelican(p, rig, {
      bodyColor: [245, 248, 255],
      beakColor: [255, 195, 30],
      pouchColor: [230, 105, 35],
      frameColor: [245, 200, 45],
      // 梵高向日葵黄车架
      wheelColor: [30, 45, 100],
      // 群青轮圈
      eyeColor: [15, 20, 40]
    });
    p.stroke(210, 160, 45);
    p.strokeWeight(8);
    for (let x = 0; x < 1e3; x += 25) {
      p.line(x, 790, x + 18, 790);
    }
    p.pop();
  }

  // src/scenes/s13_the_scream.js
  function render13(p, localT, beat, camera) {
    p.push();
    p.noStroke();
    p.fill(215, 65, 35);
    p.rect(0, 0, 1e3, 360);
    p.noFill();
    p.strokeWeight(18);
    for (let i = 0; i < 6; i++) {
      const col = i % 2 === 0 ? [240, 140, 30] : [190, 45, 25];
      p.stroke(col[0], col[1], col[2]);
      p.beginShape();
      p.vertex(0, 60 + i * 45);
      p.vertex(300, 40 + i * 45 + Math.sin(localT * 3 + i) * 12);
      p.vertex(650, 90 + i * 45 + Math.cos(localT * 3 + i) * 12);
      p.vertex(1e3, 50 + i * 45);
      p.endShape();
    }
    p.fill(25, 45, 65);
    p.noStroke();
    p.rect(0, 360, 1e3, 240);
    p.fill(130, 75, 45);
    p.beginShape();
    p.vertex(0, 520);
    p.vertex(1e3, 780);
    p.vertex(1e3, 1e3);
    p.vertex(0, 1e3);
    p.endShape(p.CLOSE);
    p.stroke(65, 35, 20);
    p.strokeWeight(12);
    p.line(0, 480, 1e3, 740);
    p.line(0, 520, 1e3, 780);
    p.strokeWeight(6);
    for (let x = 80; x < 1e3; x += 110) {
      const ry = 480 + x / 1e3 * 260;
      p.line(x, ry, x, ry + 70);
    }
    p.fill(30, 30, 35);
    p.noStroke();
    p.rect(140, 420, 18, 55, 4);
    p.rect(170, 430, 16, 50, 4);
    const screamShake = localT >= 2 && localT <= 4 ? Math.sin(localT * 40) * 4 : 0;
    p.push();
    p.translate(780 + screamShake, 660);
    const ctx = p.drawingContext;
    ctx.save();
    ctx.fillStyle = "rgb(215, 210, 165)";
    ctx.strokeStyle = "rgb(40, 35, 30)";
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.moveTo(-22, -60);
    ctx.bezierCurveTo(-38, -40, -32, 10, -18, 25);
    ctx.bezierCurveTo(-8, 32, 8, 32, 18, 25);
    ctx.bezierCurveTo(32, 10, 38, -40, 22, -60);
    ctx.bezierCurveTo(12, -75, -12, -75, -22, -60);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
    p.fill(30, 25, 20);
    p.ellipse(-10, -30, 8, 12);
    p.ellipse(10, -30, 8, 12);
    p.ellipse(0, 2, 16, 26);
    p.stroke(215, 210, 165);
    p.strokeWeight(12);
    p.noFill();
    p.line(-36, 15, -28, -25);
    p.line(36, 15, 28, -25);
    p.stroke(35, 45, 60);
    p.strokeWeight(28);
    p.line(0, 35, 10, 200);
    p.pop();
    const bridgeProgress = localT / 6;
    const pelicanX = 180 + bridgeProgress * 540;
    const bridgeY = 620 + pelicanX / 1e3 * 140;
    const rig = computePelicanRig(localT, {
      x: pelicanX,
      y: bridgeY,
      scale: 0.98
    });
    drawDefaultPelican(p, rig, {
      bodyColor: [245, 240, 230],
      beakColor: [230, 140, 40],
      pouchColor: [200, 60, 40],
      frameColor: [45, 30, 25],
      wheelColor: [35, 25, 20],
      eyeColor: [20, 15, 15]
    });
    if (localT >= 1.8 && localT <= 4.2) {
      p.push();
      p.translate(rig.handlebar.x, rig.handlebar.y);
      p.noFill();
      p.stroke(255, 240, 80, 200);
      p.strokeWeight(2.5);
      const ringRadius = localT * 8 % 2 * 20 + 8;
      p.arc(0, 0, ringRadius, ringRadius, -Math.PI * 0.8, Math.PI * 0.2);
      p.arc(0, 0, ringRadius + 12, ringRadius + 12, -Math.PI * 0.8, Math.PI * 0.2);
      p.pop();
    }
    p.pop();
  }

  // src/scenes/s14_nosferatu.js
  function render14(p, localT, beat, camera) {
    p.push();
    p.noStroke();
    p.fill(28, 28, 30);
    p.rect(0, 0, 1e3, 1e3);
    p.fill(215, 210, 195, 230);
    p.beginShape();
    p.vertex(280, 0);
    p.vertex(820, 0);
    p.vertex(620, 1e3);
    p.vertex(80, 1e3);
    p.endShape(p.CLOSE);
    p.stroke(255, 255, 255, 40);
    p.strokeWeight(1.2);
    const scratchSeed = Math.floor(localT * 18);
    for (let s = 0; s < 4; s++) {
      const sx = pseudoNoise(scratchSeed + s * 13) * 1e3;
      p.line(sx, 0, sx + 5, 1e3);
    }
    p.stroke(35, 35, 38);
    p.strokeWeight(16);
    p.line(0, 850, 1e3, 320);
    p.strokeWeight(4);
    p.stroke(20, 20, 22);
    for (let st = 0; st < 20; st++) {
      const x1 = st * 50;
      const y1 = 850 - st * 26.5;
      const x2 = (st + 1) * 50;
      const y2 = 850 - (st + 1) * 26.5;
      p.line(x1, y1, x2, y1);
      p.line(x2, y1, x2, y2);
    }
    p.stroke(45, 45, 50);
    p.strokeWeight(3.5);
    p.line(0, 770, 1e3, 240);
    for (let r = 0; r < 14; r++) {
      const rx = 40 + r * 70;
      const ry = 850 - rx / 1e3 * 530;
      p.line(rx, ry, rx, ry - 80);
    }
    const climbProgress = localT / 6;
    const shadowX = 180 + climbProgress * 580;
    const shadowY = 760 - climbProgress * 320;
    const rig = computePelicanRig(localT, {
      x: shadowX,
      y: shadowY,
      scale: 1.15
    });
    const isElectrified = localT >= 5;
    let shadowFillColor = [18, 16, 20];
    let shadowStrokeColor = [22, 20, 25];
    let shadowGlowWeight = 2;
    if (isElectrified) {
      const flicker = Math.sin(localT * 48) > 0;
      if (flicker) {
        shadowFillColor = [10, 45, 20];
        shadowStrokeColor = [60, 255, 120];
        shadowGlowWeight = 5;
      }
    }
    p.push();
    p.translate(shadowX, shadowY);
    p.shearX(-0.35);
    p.translate(-shadowX, -shadowY);
    p.fill(shadowFillColor[0], shadowFillColor[1], shadowFillColor[2]);
    p.stroke(shadowStrokeColor[0], shadowStrokeColor[1], shadowStrokeColor[2]);
    p.strokeWeight(shadowGlowWeight);
    const drawShadowWheel = (hub) => {
      p.ellipse(hub.x, hub.y, rig.wheelRadius * 2, rig.wheelRadius * 2);
      for (let i = 0; i < 6; i++) {
        const a = rig.wheelAngle + i * Math.PI / 3;
        p.line(hub.x, hub.y, hub.x + Math.cos(a) * rig.wheelRadius, hub.y + Math.sin(a) * rig.wheelRadius);
      }
    };
    drawShadowWheel(rig.rearHub);
    drawShadowWheel(rig.frontHub);
    p.strokeWeight(6 * rig.scale);
    p.line(rig.rearHub.x, rig.rearHub.y, rig.bb.x, rig.bb.y);
    p.line(rig.bb.x, rig.bb.y, rig.saddle.x, rig.saddle.y);
    p.line(rig.saddle.x, rig.saddle.y, rig.rearHub.x, rig.rearHub.y);
    p.line(rig.bb.x, rig.bb.y, rig.headset.x, rig.headset.y);
    p.line(rig.saddle.x, rig.saddle.y, rig.headset.x, rig.headset.y);
    p.line(rig.headset.x, rig.headset.y, rig.frontHub.x, rig.frontHub.y);
    p.line(rig.headset.x, rig.headset.y, rig.handlebar.x, rig.handlebar.y);
    p.line(rig.hip.x, rig.hip.y, rig.legRight.jointX, rig.legRight.jointY);
    p.line(rig.legRight.jointX, rig.legRight.jointY, rig.pedalRight.x, rig.pedalRight.y);
    p.ellipse(rig.chest.x - 12, rig.chest.y + 4, 80 * rig.scale, 52 * rig.scale);
    p.strokeWeight(15 * rig.scale);
    p.noFill();
    p.bezier(
      rig.neckBase.x,
      rig.neckBase.y,
      rig.neckMid.x - 18 * rig.scale,
      rig.neckMid.y,
      rig.neckMid.x + 8 * rig.scale,
      rig.neckMid.y - 15 * rig.scale,
      rig.head.x,
      rig.head.y
    );
    p.fill(shadowFillColor[0], shadowFillColor[1], shadowFillColor[2]);
    p.ellipse(rig.head.x, rig.head.y, 30 * rig.scale, 24 * rig.scale);
    p.beginShape();
    p.vertex(rig.head.x + 8, rig.head.y - 6);
    p.vertex(rig.beakTip.x + 20, rig.beakTip.y + 10);
    p.vertex(rig.pouchBottom.x, rig.pouchBottom.y);
    p.vertex(rig.head.x + 10, rig.head.y + 12);
    p.endShape(p.CLOSE);
    p.strokeWeight(3.5);
    for (let cl = 0; cl < 3; cl++) {
      p.line(
        rig.handlebar.x - 10 + cl * 6,
        rig.handlebar.y - 12,
        rig.handlebar.x + cl * 6,
        rig.handlebar.y + 6
      );
    }
    p.pop();
    p.pop();
  }

  // src/scenes/s15_oscilloscope.js
  function render15(p, localT, beat, camera) {
    p.push();
    p.noStroke();
    p.fill(12, 16, 14);
    p.rect(0, 0, 1e3, 1e3);
    p.fill(18, 38, 26);
    p.stroke(35, 60, 45);
    p.strokeWeight(12);
    p.ellipse(500, 500, 880, 880);
    p.stroke(0, 255, 100, 35);
    p.strokeWeight(1.2);
    for (let x = 120; x <= 880; x += 55) {
      p.line(x, 100, x, 900);
    }
    for (let y = 120; y <= 880; y += 55) {
      p.line(100, y, 900, y);
    }
    p.stroke(0, 255, 100, 70);
    p.line(500, 100, 500, 900);
    p.line(100, 500, 900, 500);
    const isGlitching = localT >= 2.2 && localT <= 3.4;
    const glitchProgress = isGlitching ? (localT - 2.2) / 1.2 : 0;
    const jitterX = (Math.random() - 0.5) * 2.5;
    const jitterY = (Math.random() - 0.5) * 2.5;
    const pelicanX = 220 + localT / 6 * 560;
    const groundY = 690;
    const rig = computePelicanRig(localT, {
      x: pelicanX,
      y: groundY,
      scale: 1.05
    });
    p.push();
    p.translate(jitterX, jitterY);
    if (isGlitching) {
      p.noFill();
      p.stroke(0, 255, 120);
      p.strokeWeight(4);
      const lissajousCenter = { x: pelicanX, y: groundY - 120 };
      const warpFreqA = 3 + Math.sin(glitchProgress * Math.PI) * 4;
      const warpFreqB = 4 + Math.cos(glitchProgress * Math.PI) * 3;
      p.beginShape();
      for (let t = 0; t <= Math.PI * 4; t += 0.08) {
        const pt = computeLissajousPoint(t + localT * 12, warpFreqA, warpFreqB, Math.PI / 2, 180);
        p.vertex(lissajousCenter.x + pt.x, lissajousCenter.y + pt.y);
      }
      p.endShape();
      p.stroke(180, 255, 210, 160);
      p.strokeWeight(2);
      p.beginShape();
      for (let t = 0; t <= Math.PI * 4; t += 0.08) {
        const pt = computeLissajousPoint(t + localT * 12, warpFreqA, warpFreqB, Math.PI / 2, 178);
        p.vertex(lissajousCenter.x + pt.x, lissajousCenter.y + pt.y);
      }
      p.endShape();
      p.noStroke();
      p.fill(0, 255, 120, 230);
      p.textAlign(p.CENTER, p.CENTER);
      p.textSize(16);
      p.text("CH1 FREQ OVERLOAD: LISSAJOUS PHASE ERROR", 500, 840);
    } else {
      const drawScopeLine = (x1, y1, x2, y2) => {
        p.stroke(0, 255, 100, 80);
        p.strokeWeight(8 * rig.scale);
        p.line(x1, y1, x2, y2);
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
      drawScopeCircle(rig.rearHub.x, rig.rearHub.y, rig.wheelRadius);
      drawScopeCircle(rig.frontHub.x, rig.frontHub.y, rig.wheelRadius);
      drawScopeLine(rig.rearHub.x, rig.rearHub.y, rig.bb.x, rig.bb.y);
      drawScopeLine(rig.bb.x, rig.bb.y, rig.saddle.x, rig.saddle.y);
      drawScopeLine(rig.saddle.x, rig.saddle.y, rig.rearHub.x, rig.rearHub.y);
      drawScopeLine(rig.bb.x, rig.bb.y, rig.headset.x, rig.headset.y);
      drawScopeLine(rig.saddle.x, rig.saddle.y, rig.headset.x, rig.headset.y);
      drawScopeLine(rig.headset.x, rig.headset.y, rig.frontHub.x, rig.frontHub.y);
      drawScopeLine(rig.headset.x, rig.headset.y, rig.handlebar.x, rig.handlebar.y);
      drawScopeLine(rig.hip.x, rig.hip.y, rig.legRight.jointX, rig.legRight.jointY);
      drawScopeLine(rig.legRight.jointX, rig.legRight.jointY, rig.pedalRight.x, rig.pedalRight.y);
      drawScopeLine(rig.neckBase.x, rig.neckBase.y, rig.head.x, rig.head.y);
      drawScopeLine(rig.head.x, rig.head.y, rig.beakTip.x, rig.beakTip.y);
      drawScopeLine(rig.beakTip.x, rig.beakTip.y, rig.pouchBottom.x, rig.pouchBottom.y);
      drawScopeLine(rig.pouchBottom.x, rig.pouchBottom.y, rig.head.x + 8, rig.head.y + 6);
      drawScopeLine(rig.head.x, rig.head.y, rig.shoulder.x, rig.shoulder.y);
      drawScopeLine(rig.shoulder.x, rig.shoulder.y, rig.hip.x, rig.hip.y);
      drawScopeLine(rig.shoulder.x, rig.shoulder.y, rig.handlebar.x, rig.handlebar.y);
      drawScopeLine(100, 770, 900, 770);
    }
    p.pop();
    p.fill(40, 48, 44);
    p.stroke(20, 25, 22);
    p.strokeWeight(3);
    p.rect(840, 840, 140, 140, 10);
    p.fill(25, 30, 28);
    p.ellipse(910, 910, 50, 50);
    p.stroke(200, 200, 200);
    p.strokeWeight(3);
    const knobAngle = isGlitching ? Math.sin(glitchProgress * Math.PI) * 2.8 : 0;
    p.line(910, 910, 910 + Math.cos(knobAngle - 1.5) * 22, 910 + Math.sin(knobAngle - 1.5) * 22);
    drawCRTScanlines(p, 1e3, 1e3, 5, 25);
    p.pop();
  }

  // src/scenes/s16_pixel_game.js
  function render16(p, localT, beat, camera) {
    p.push();
    const NES_SKY = [92, 148, 252];
    const NES_BRICK = [200, 76, 12];
    const NES_GROUND = [0, 168, 0];
    const NES_COIN = [252, 188, 60];
    const NES_WHITE = [255, 255, 255];
    const NES_BLACK = [0, 0, 0];
    const NES_GREEN_1UP = [0, 228, 0];
    const qT = quantizeTime(localT, 10);
    p.noStroke();
    p.fill(NES_SKY[0], NES_SKY[1], NES_SKY[2]);
    p.rect(0, 0, 1e3, 1e3);
    const P = 6;
    const drawPixRect = (px2, py2, pw, ph, col) => {
      p.fill(col[0], col[1], col[2]);
      p.rect(Math.floor(px2 / P) * P, Math.floor(py2 / P) * P, pw * P, ph * P);
    };
    const drawPixelCloud = (cx, cy) => {
      p.fill(NES_WHITE[0], NES_WHITE[1], NES_WHITE[2]);
      drawPixRect(cx, cy, 14, 4, NES_WHITE);
      drawPixRect(cx + 4 * P, cy - 3 * P, 8, 3, NES_WHITE);
      drawPixRect(cx - 3 * P, cy + P, 20, 2, NES_WHITE);
    };
    drawPixelCloud(160, 240);
    drawPixelCloud(680, 200);
    p.fill(NES_WHITE[0], NES_WHITE[1], NES_WHITE[2]);
    p.noStroke();
    p.textSize(22);
    p.textStyle(p.BOLD);
    p.textAlign(p.LEFT, p.TOP);
    p.text("PELICAN\n064820", 80, 40);
    p.text("COINS\n* 42", 380, 40);
    p.text("WORLD\n 1-1", 650, 40);
    p.text("TIME\n 240", 840, 40);
    const groundY = 720;
    for (let gx = 0; gx < 1e3; gx += 32) {
      if (gx >= 420 && gx <= 560) continue;
      drawPixRect(gx, groundY, 5, 2, NES_GROUND);
      drawPixRect(gx, groundY + 12, 5, 10, NES_BRICK);
      drawPixRect(gx, groundY + 72, 5, 28, [128, 48, 8]);
    }
    const isHit = qT >= 2.4;
    const boxY = isHit ? 440 : 450;
    drawPixRect(480, boxY, 8, 8, isHit ? [160, 110, 60] : NES_COIN);
    drawPixRect(486, boxY + 6, 6, 6, isHit ? [120, 80, 40] : [216, 40, 0]);
    if (!isHit) {
      p.fill(NES_WHITE[0], NES_WHITE[1], NES_WHITE[2]);
      p.textSize(28);
      p.textAlign(p.CENTER, p.CENTER);
      p.text("?", 504, boxY + 24);
    } else {
      const coinY = Math.max(340, 440 - (qT - 2.4) * 160);
      drawPixRect(495, coinY, 5, 8, NES_COIN);
      p.fill(NES_GREEN_1UP[0], NES_GREEN_1UP[1], NES_GREEN_1UP[2]);
      p.textSize(32);
      p.textAlign(p.CENTER, p.BOTTOM);
      p.text("1UP", 504, coinY - 12);
    }
    const pelicanX = 200 + localT / 6 * 600;
    let jumpY = 0;
    if (localT >= 1.8 && localT <= 3.8) {
      const jumpProgress = (localT - 1.8) / 2;
      jumpY = -Math.sin(jumpProgress * Math.PI) * 140;
    }
    const px = Math.floor(pelicanX / P) * P;
    const py = Math.floor((groundY + jumpY) / P) * P;
    const crankStep = Math.floor(qT * 8) % 4;
    const legDy = [0, 8, 16, 8][crankStep];
    p.push();
    p.translate(px, py);
    const drawPixWheel = (wx, wy) => {
      drawPixRect(wx - 24, wy - 30, 8, 10, NES_BLACK);
      drawPixRect(wx - 30, wy - 24, 10, 8, NES_BLACK);
      drawPixRect(wx - 18, wy - 18, 6, 6, NES_WHITE);
      drawPixRect(wx - 6, wy - 6, 2, 2, [216, 40, 0]);
    };
    drawPixWheel(-60, 0);
    drawPixWheel(60, 0);
    drawPixRect(-45, -12, 15, 2, [216, 40, 0]);
    drawPixRect(-12, -45, 2, 12, [216, 40, 0]);
    drawPixRect(-45, -12, 12, 12, [216, 40, 0]);
    drawPixRect(-12, -45, 12, 12, [216, 40, 0]);
    drawPixRect(35, -45, 3, 15, [216, 40, 0]);
    drawPixRect(32, -55, 6, 2, NES_BLACK);
    drawPixRect(-20, -50, 6, 2, NES_BLACK);
    drawPixRect(-20, -75, 8, 8, NES_WHITE);
    drawPixRect(-8, -65, 4, 5, NES_WHITE);
    drawPixRect(-4, -95, 3, 8, NES_WHITE);
    drawPixRect(0, -105, 5, 4, NES_WHITE);
    drawPixRect(2, -102, 2, 2, NES_BLACK);
    drawPixRect(10, -103, 9, 3, NES_COIN);
    drawPixRect(10, -97, 8, 4, [230, 110, 30]);
    drawPixRect(-14, -50 + legDy, 3, 6, NES_COIN);
    drawPixRect(-14, -40 + legDy, 4, 2, NES_BLACK);
    p.pop();
    p.pop();
  }

  // src/scenes/s17_chat_window.js
  function render17(p, localT, beat, camera) {
    p.push();
    p.noStroke();
    p.fill(0, 78, 152);
    p.rect(0, 0, 1e3, 1e3);
    let nudgeX = 0;
    let nudgeY = 0;
    if (localT >= 2 && localT <= 2.6) {
      nudgeX = Math.sin(localT * 85) * 14;
      nudgeY = Math.cos(localT * 75) * 12;
    }
    p.push();
    p.translate(nudgeX, nudgeY);
    const winX = 80;
    const winY = 60;
    const winW = 840;
    const winH = 880;
    p.fill(0, 0, 0, 80);
    p.rect(winX + 10, winY + 10, winW, winH, 8);
    p.fill(236, 233, 216);
    p.stroke(0, 85, 225);
    p.strokeWeight(3);
    p.rect(winX, winY, winW, winH, 6);
    p.fill(0, 85, 225);
    p.noStroke();
    p.rect(winX + 3, winY + 3, winW - 6, 38, 4, 4, 0, 0);
    p.fill(255, 255, 255);
    p.textAlign(p.LEFT, p.CENTER);
    p.textSize(16);
    p.textStyle(p.BOLD);
    p.text("PelicanMessenger 2003 - [Pelican_Rider] (\u5728\u7EBF)", winX + 16, winY + 22);
    p.fill(225, 80, 70);
    p.rect(winX + winW - 38, winY + 8, 28, 24, 3);
    p.fill(255, 255, 255);
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(14);
    p.text("\xD7", winX + winW - 24, winY + 19);
    const chatBoxX = winX + 18;
    const chatBoxY = winY + 52;
    const chatBoxW = winW - 36;
    const chatBoxH = winH - 240;
    p.fill(255, 255, 255);
    p.stroke(120, 120, 120);
    p.strokeWeight(1.5);
    p.rect(chatBoxX, chatBoxY, chatBoxW, chatBoxH);
    p.fill(80, 80, 80);
    p.noStroke();
    p.textAlign(p.LEFT, p.TOP);
    p.textSize(13);
    p.textStyle(p.ITALIC);
    const dots = ".".repeat(1 + Math.floor(localT * 4) % 3);
    p.text(`\u5BF9\u65B9\u6B63\u5728\u8F93\u5165${dots}`, chatBoxX + 16, chatBoxY + 12);
    p.fill(240, 244, 250);
    p.stroke(180, 200, 230);
    p.strokeWeight(1);
    p.rect(chatBoxX + 16, chatBoxY + 36, chatBoxW - 32, chatBoxH - 56, 6);
    p.fill(50, 70, 120);
    p.noStroke();
    p.textStyle(p.NORMAL);
    p.textSize(12);
    p.text("pelican_bike_loop.gif [\u5DF2\u63A5\u6536\u5B8C\u6210 - \u70B9\u51FB\u67E5\u770B\u539F\u56FE]", chatBoxX + 32, chatBoxY + 48);
    p.push();
    const gifAreaX = chatBoxX + 32;
    const gifAreaY = chatBoxY + 75;
    const gifAreaW = chatBoxW - 64;
    const gifAreaH = chatBoxH - 110;
    p.fill(210, 218, 226);
    p.stroke(160, 170, 185);
    p.strokeWeight(2);
    p.rect(gifAreaX, gifAreaY, gifAreaW, gifAreaH);
    p.stroke(100, 110, 125);
    p.strokeWeight(4);
    p.line(gifAreaX, gifAreaY + gifAreaH - 40, gifAreaX + gifAreaW, gifAreaY + gifAreaH - 40);
    const quantizedT = quantizeTime(localT, 10);
    const pelicanX = gifAreaX + 60 + localT / 6 * (gifAreaW - 120);
    const groundY = gifAreaY + gifAreaH - 45;
    const rig = computePelicanRig(quantizedT, {
      x: pelicanX,
      y: groundY,
      scale: 0.82
    });
    drawDefaultPelican(p, rig, {
      bodyColor: [240, 245, 255],
      beakColor: [245, 170, 50],
      pouchColor: [220, 100, 50],
      frameColor: [0, 85, 200],
      // 经典 IM 蓝
      wheelColor: [40, 40, 45],
      eyeColor: [15, 15, 20]
    });
    drawFilmGrain(p, 1e3, 1e3, 0.03, quantizedT);
    p.pop();
    const inputY = winY + winH - 170;
    p.fill(255, 255, 255);
    p.stroke(140, 140, 140);
    p.strokeWeight(1);
    p.rect(winX + 18, inputY, winW - 36, 105);
    p.fill(235, 235, 235);
    p.rect(winX + winW - 110, inputY + 68, 80, 28, 3);
    p.fill(40, 40, 40);
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(13);
    p.text("\u53D1\u9001(S)", winX + winW - 70, inputY + 82);
    p.pop();
    p.pop();
  }

  // src/scenes/s18_vaporwave.js
  function render18(p, localT, beat, camera) {
    p.push();
    const ctx = p.drawingContext;
    const skyGrad = ctx.createLinearGradient(0, 0, 0, 650);
    skyGrad.addColorStop(0, "#531b75");
    skyGrad.addColorStop(0.35, "#a6247c");
    skyGrad.addColorStop(0.7, "#e04f7c");
    skyGrad.addColorStop(1, "#2c0e3a");
    ctx.save();
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, 1e3, 650);
    ctx.restore();
    p.push();
    p.translate(500, 320);
    const sunGrad = ctx.createLinearGradient(0, -180, 0, 180);
    sunGrad.addColorStop(0, "#ffee55");
    sunGrad.addColorStop(1, "#ff2288");
    ctx.save();
    ctx.fillStyle = sunGrad;
    ctx.beginPath();
    ctx.arc(0, 0, 160, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    p.fill(44, 14, 58);
    p.noStroke();
    for (let s = 0; s < 7; s++) {
      const sy = 10 + s * 22;
      const sh = 4 + s * 3.5;
      p.rect(-170, sy, 340, sh);
    }
    p.pop();
    p.fill(255, 255, 255, 210);
    p.noStroke();
    p.textSize(26);
    p.textStyle(p.BOLD);
    p.textAlign(p.CENTER, p.TOP);
    p.text("\u30DA\u30EA\u30AB\u30F3 1984 \xB7 \u4EEE\u60F3\u306E\u8857", 500, 80);
    p.fill(16, 8, 28);
    p.rect(0, 620, 1e3, 380);
    p.stroke(0, 240, 255, 180);
    p.strokeWeight(2);
    for (let x = -600; x <= 1600; x += 90) {
      p.line(500, 620, x, 1e3);
    }
    p.stroke(255, 60, 180, 160);
    const gridOffset = localT * 120 % 60;
    for (let y = 620; y <= 1e3; y += 15) {
      const curY = y + gridOffset;
      if (curY <= 1e3) {
        const alpha = p.map(curY, 620, 1e3, 40, 240);
        p.stroke(255, 60, 180, alpha);
        p.line(0, curY, 1e3, curY);
      }
    }
    const drawPalm = (px, py, s = 1) => {
      p.push();
      p.translate(px, py);
      p.scale(s);
      p.stroke(0, 240, 255);
      p.strokeWeight(8);
      p.noFill();
      p.bezier(0, 0, 25, -120, -15, -240, 40, -360);
      p.translate(40, -360);
      p.stroke(255, 60, 180);
      p.strokeWeight(4);
      const leaves = [-1.8, -1.2, -0.6, 0, 0.6, 1.2, 1.8];
      for (const ang of leaves) {
        p.push();
        p.rotate(ang);
        p.bezier(0, 0, 40, -30, 90, -15, 120, 35);
        p.pop();
      }
      p.pop();
    };
    drawPalm(140, 720, 0.95);
    const drawApolloStatue = (ax, ay, s = 1) => {
      p.push();
      p.translate(ax, ay);
      p.scale(s);
      p.fill(235, 235, 245);
      p.stroke(140, 130, 160);
      p.strokeWeight(2);
      p.beginShape();
      p.vertex(-70, 160);
      p.vertex(70, 160);
      p.vertex(60, 60);
      p.vertex(25, 40);
      p.vertex(25, -10);
      p.vertex(-25, -10);
      p.vertex(-25, 40);
      p.vertex(-60, 60);
      p.endShape(p.CLOSE);
      p.ellipse(0, -60, 68, 90);
      p.fill(160, 150, 180);
      p.noStroke();
      p.ellipse(-25, -95, 25, 25);
      p.ellipse(0, -105, 30, 25);
      p.ellipse(25, -95, 25, 25);
      p.ellipse(-34, -75, 18, 30);
      p.ellipse(34, -75, 18, 30);
      p.stroke(120, 110, 140);
      p.strokeWeight(2);
      p.line(0, -75, 0, -45);
      p.line(-4, -45, 4, -45);
      p.line(-6, -30, 6, -30);
      p.fill(15, 10, 25);
      p.stroke(0, 240, 255);
      p.strokeWeight(2.5);
      p.rect(-34, -74, 30, 16, 2);
      p.rect(4, -74, 30, 16, 2);
      p.line(-4, -68, 4, -68);
      p.stroke(255, 60, 180);
      p.line(-28, -66, -10, -66);
      p.line(10, -66, 28, -66);
      p.pop();
    };
    drawApolloStatue(860, 610, 1.1);
    const pelicanX = 220 + localT / 6 * 560;
    const groundY = 710;
    const rig = computePelicanRig(localT, {
      x: pelicanX,
      y: groundY,
      scale: 1.05
    });
    drawDefaultPelican(p, rig, {
      bodyColor: [255, 240, 250],
      // 亮白带粉紫高光
      beakColor: [255, 80, 160],
      // 霓虹热粉
      pouchColor: [180, 30, 140],
      // 深品红
      frameColor: [0, 240, 255],
      // 荧光青 (Cyan)
      wheelColor: [255, 40, 160],
      // 荧光品红
      eyeColor: [10, 240, 255]
    });
    p.pop();
  }

  // src/scenes/s19_short_video.js
  function render19(p, localT, beat, camera) {
    p.push();
    p.noStroke();
    p.fill(10, 10, 12);
    p.rect(0, 0, 1e3, 1e3);
    const phoneW = 560;
    const phoneX = (1e3 - phoneW) / 2;
    const phoneY = 0;
    const phoneH = 1e3;
    p.fill(24, 28, 36);
    p.rect(phoneX, phoneY, phoneW, phoneH);
    p.fill(0, 0, 0, 245);
    p.rect(0, 0, phoneX, 1e3);
    p.rect(phoneX + phoneW, 0, phoneX, 1e3);
    p.stroke(60, 65, 75);
    p.strokeWeight(6);
    p.line(phoneX, 740, phoneX + phoneW, 740);
    const progress = localT / 6;
    const pelicanX = phoneX + 80 + progress * (phoneW - 160);
    const groundY = 735;
    const rig = computePelicanRig(localT, {
      x: pelicanX,
      y: groundY,
      scale: 0.95
    });
    drawDefaultPelican(p, rig, {
      bodyColor: [250, 250, 255],
      beakColor: [255, 170, 45],
      pouchColor: [240, 95, 60],
      frameColor: [30, 30, 35],
      wheelColor: [45, 45, 50],
      eyeColor: [10, 10, 10]
    });
    const uiRightX = phoneX + phoneW - 48;
    const heartScale = 1 + Math.sin(localT * 12) * 0.15;
    p.push();
    p.translate(uiRightX, 480);
    p.scale(heartScale);
    p.fill(254, 44, 85);
    p.noStroke();
    p.ellipse(-7, -5, 16, 16);
    p.ellipse(7, -5, 16, 16);
    p.triangle(-15, -2, 15, -2, 0, 15);
    p.pop();
    p.fill(255, 255, 255);
    p.textAlign(p.CENTER, p.TOP);
    p.textSize(12);
    p.textStyle(p.BOLD);
    p.text("99.8w", uiRightX, 502);
    p.fill(255, 255, 255, 220);
    p.ellipse(uiRightX, 550, 28, 24);
    p.triangle(uiRightX - 6, 560, uiRightX - 16, 570, uiRightX, 562);
    p.fill(255, 255, 255);
    p.text("1.4w", uiRightX, 570);
    p.fill(255, 215, 0);
    p.ellipse(uiRightX, 615, 22, 22);
    p.fill(255, 255, 255);
    p.text("4.2w", uiRightX, 632);
    p.push();
    p.translate(uiRightX, 710);
    p.rotate(localT * 4);
    p.fill(30, 30, 30);
    p.ellipse(0, 0, 38, 38);
    p.fill(254, 44, 85);
    p.ellipse(0, 0, 16, 16);
    p.pop();
    for (let h = 0; h < 6; h++) {
      const heartT = (localT * 1.5 + h * 0.4) % 2.5;
      const hy = 700 - heartT * 220;
      const hx = uiRightX - 25 + Math.sin(heartT * 5 + h) * 18;
      const hAlpha = p.map(heartT, 0, 2.5, 240, 0);
      p.fill(254, 44, 85, hAlpha);
      p.ellipse(hx - 4, hy, 10, 10);
      p.ellipse(hx + 4, hy, 10, 10);
      p.triangle(hx - 8, hy + 2, hx + 8, hy + 2, hx, hy + 12);
    }
    const danmakuList = [
      "\u8FD9\u53EA\u9E1F\u9A91\u5F97\u6BD4\u6211\u5BA4\u53CB\u90FD\u7A33...",
      "\u4E25\u67E5\uFF01\u9E48\u9E55\u662F\u4E0D\u662F\u8003\u8FC7\u79D1\u76EE\u4E8C",
      "\u4ECE\u516C\u5143\u524D4000\u5E74\u9A91\u52302026\u5E74",
      "\u8C01\u7ED9\u5927\u5634\u9E1F\u4E70\u7684\u516C\u8DEF\u8F66\uFF1F\uFF1F"
    ];
    p.textAlign(p.LEFT, p.CENTER);
    p.textSize(13);
    p.textStyle(p.NORMAL);
    for (let d = 0; d < danmakuList.length; d++) {
      const dy = 810 - d * 26;
      p.fill(0, 0, 0, 140);
      p.rect(phoneX + 20, dy - 11, 230, 22, 11);
      p.fill(255, 255, 255, 230);
      p.text(`@\u7F51\u53CB${d + 1}: ${danmakuList[d]}`, phoneX + 30, dy);
    }
    p.fill(255, 255, 255);
    p.textStyle(p.BOLD);
    p.textSize(16);
    p.text("@\u9E48\u9E55\u672C\u9E1F", phoneX + 24, 875);
    p.textStyle(p.NORMAL);
    p.textSize(13);
    p.text("\u4EBA\u7C7B\u81EA\u53E4\u4EE5\u6765\u5C31\u75F4\u8FF7\u4E8E\u753B\u6211\u9A91\u8F66 #\u9E48\u9E55\u6D4B\u8BD5 #\u5168\u7F51\u65E0\u4EE3\u9910", phoneX + 24, 898);
    p.fill(120, 120, 120, 120);
    p.rect(phoneX, 992, phoneW, 4);
    p.fill(255, 255, 255);
    p.rect(phoneX, 992, phoneW * progress, 4);
    p.pop();
  }

  // src/scenes/s20_code_aesthetic.js
  function render20(p, localT, beat, camera) {
    p.push();
    p.noStroke();
    p.fill(24, 26, 32);
    p.rect(0, 0, 1e3, 1e3);
    p.fill(33, 37, 46);
    p.rect(0, 0, 1e3, 48);
    p.fill(24, 26, 32);
    p.rect(180, 8, 260, 40, 4, 4, 0, 0);
    p.fill(245, 150, 40);
    p.ellipse(205, 28, 12, 12);
    p.fill(220, 225, 235);
    p.textSize(15);
    p.textStyle(p.NORMAL);
    p.textAlign(p.LEFT, p.CENTER);
    p.text("pelican_masterpiece.svg", 225, 28);
    p.fill(18, 20, 24);
    p.rect(0, 48, 180, 952);
    p.fill(110, 120, 140);
    p.textSize(12);
    p.textStyle(p.BOLD);
    p.text("EXPLORER: PELICAN", 20, 72);
    p.textStyle(p.NORMAL);
    p.textSize(13);
    p.fill(150, 160, 180);
    p.text("\u25BE src", 20, 105);
    p.text("    pelican.svg", 20, 132);
    p.text("    beat.ts", 20, 158);
    p.text("    physics.rs", 20, 184);
    p.text("    neural_rig.py", 20, 210);
    p.fill(28, 32, 40);
    p.rect(180, 48, 340, 952);
    const svgLines = [
      { num: "01", tag: '<svg viewBox="0 0 1000 1000">', col: [86, 156, 214] },
      { num: "02", tag: "  <!-- Gemini 3.8 Procedural Rig -->", col: [106, 153, 85] },
      { num: "03", tag: "  <defs>", col: [86, 156, 214] },
      { num: "04", tag: '    <linearGradient id="feather">', col: [156, 220, 254] },
      { num: "05", tag: '      <stop color="#ffffff"/>', col: [206, 145, 120] },
      { num: "06", tag: "    </linearGradient>", col: [156, 220, 254] },
      { num: "07", tag: "  </defs>", col: [86, 156, 214] },
      { num: "08", tag: '  <g id="bicycle" stroke="#00d2ff">', col: [78, 201, 176] },
      { num: "09", tag: '    <circle cx="rHub" r="75"/>', col: [156, 220, 254] },
      { num: "10", tag: '    <circle cx="fHub" r="75"/>', col: [156, 220, 254] },
      { num: "11", tag: '    <path d="M bb L saddle L hub"/>', col: [220, 220, 170] },
      { num: "12", tag: "  </g>", col: [78, 201, 176] },
      { num: "13", tag: '  <path id="pelican_body"', col: [86, 156, 214] },
      { num: "14", tag: '    d="M hip C chest neck head"/>', col: [206, 145, 120] },
      { num: "15", tag: '  <path id="gular_pouch"', col: [86, 156, 214] },
      { num: "16", tag: '    d="M head Q tip pouchBottom"/>', col: [206, 145, 120] },
      { num: "17", tag: "</svg>", col: [86, 156, 214] }
    ];
    const activeLineIdx = Math.min(svgLines.length - 1, Math.floor(localT / 6 * svgLines.length));
    p.textSize(12);
    p.textAlign(p.LEFT, p.CENTER);
    for (let l = 0; l < svgLines.length; l++) {
      const ly = 80 + l * 28;
      p.fill(90, 100, 120);
      p.text(svgLines[l].num, 195, ly);
      if (l === activeLineIdx) {
        p.fill(40, 48, 64);
        p.rect(220, ly - 12, 290, 24, 2);
      }
      if (l <= activeLineIdx) {
        p.fill(svgLines[l].col[0], svgLines[l].col[1], svgLines[l].col[2]);
        p.text(svgLines[l].tag, 230, ly);
      }
    }
    p.stroke(38, 42, 54);
    p.strokeWeight(1);
    for (let gx = 520; gx < 1e3; gx += 40) {
      p.line(gx, 48, gx, 1e3);
    }
    for (let gy = 48; gy < 1e3; gy += 40) {
      p.line(520, gy, 1e3, gy);
    }
    const pelicanX = 580 + localT / 6 * 320;
    const groundY = 705;
    const rig = computePelicanRig(localT, {
      x: pelicanX,
      y: groundY,
      scale: 1.05
    });
    drawDefaultPelican(p, rig, {
      bodyColor: [255, 255, 255],
      beakColor: [255, 175, 40],
      pouchColor: [230, 85, 45],
      frameColor: [0, 180, 255],
      wheelColor: [60, 70, 90],
      eyeColor: [10, 15, 25]
    });
    p.stroke(0, 220, 255, 200);
    p.strokeWeight(1.5);
    p.noFill();
    p.line(rig.neckBase.x, rig.neckBase.y, rig.neckMid.x - 14 * rig.scale, rig.neckMid.y);
    p.line(rig.head.x, rig.head.y, rig.neckMid.x + 10 * rig.scale, rig.neckMid.y - 12 * rig.scale);
    const drawAnchor = (ax, ay, col = [0, 220, 255]) => {
      p.fill(col[0], col[1], col[2]);
      p.stroke(255, 255, 255);
      p.strokeWeight(1.5);
      p.rect(ax - 4, ay - 4, 8, 8);
    };
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
    p.noStroke();
    p.fill(0, 122, 204);
    p.rect(0, 975, 1e3, 25);
    p.fill(255, 255, 255);
    p.textSize(11);
    p.textAlign(p.LEFT, p.CENTER);
    p.text("  Ln " + (activeLineIdx + 1) + ", Col 1 | UTF-8 | XML/SVG | Prettier | Pelican Rig: OK (120 BPM synced)", 10, 987);
    p.pop();
  }

  // src/scenes/index.js
  var SCENE_RENDERERS = [
    render,
    render2,
    render3,
    render4,
    render5,
    render6,
    render7,
    render8,
    render9,
    render10,
    render11,
    render12,
    render13,
    render14,
    render15,
    render16,
    render17,
    render18,
    render19,
    render20
  ];

  // src/main/intro.js
  function renderIntro(p, localT, beat) {
    p.push();
    drawParchmentBackground(p, 1920, 1080, [244, 238, 224], 101);
    p.noFill();
    p.stroke(90, 80, 70, 160);
    p.strokeWeight(2);
    p.rect(60, 60, 1800, 960);
    p.strokeWeight(1);
    p.rect(68, 68, 1784, 944);
    p.push();
    p.translate(1320, 180);
    p.fill(250, 248, 242);
    p.stroke(140, 130, 120);
    p.strokeWeight(1.5);
    p.rect(0, 0, 440, 360, 2);
    const sketchRig = computePelicanRig(0.25, {
      x: 210,
      y: 260,
      scale: 0.65
    });
    drawDefaultPelican(p, sketchRig, {
      bodyColor: [240, 238, 230],
      beakColor: [180, 160, 140],
      pouchColor: [160, 140, 120],
      frameColor: [60, 55, 50],
      wheelColor: [70, 65, 60],
      eyeColor: [30, 30, 30]
    });
    p.fill(60, 50, 45);
    p.noStroke();
    p.textAlign(p.CENTER, p.TOP);
    p.textSize(16);
    p.textStyle(p.NORMAL);
    p.text("\u56FE\u4E00 \u9E48\u9E55\u9A91\u884C\u56FE\uFF08\u6479\u672C\uFF09", 220, 325);
    p.pop();
    const alpha1 = p.map(localT, 0.8, 1.8, 0, 255);
    const clampedAlpha1 = Math.max(0, Math.min(255, alpha1));
    p.fill(28, 24, 20, clampedAlpha1);
    p.noStroke();
    p.textAlign(p.LEFT, p.CENTER);
    p.textSize(46);
    p.textStyle(p.BOLD);
    p.text("\u300C\u4EBA\u7C7B\u81EA\u53E4\u4EE5\u6765\u5C31\u75F4\u8FF7\u4E8E\u753B\u9E48\u9E55\u9A91\u81EA\u884C\u8F66\u3002\u300D", 180, 440);
    const alpha2 = p.map(localT, 2.6, 3.6, 0, 255);
    const clampedAlpha2 = Math.max(0, Math.min(255, alpha2));
    p.fill(28, 24, 20, clampedAlpha2);
    p.textSize(46);
    p.text("\u300C\u65E9\u5728\u81EA\u884C\u8F66\u88AB\u53D1\u660E\u4E4B\u524D\u3002\u300D", 180, 530);
    const alphaSource = p.map(localT, 3.8, 4.6, 0, 210);
    const clampedAlphaSource = Math.max(0, Math.min(210, alphaSource));
    p.fill(90, 80, 70, clampedAlphaSource);
    p.textSize(22);
    p.textStyle(p.NORMAL);
    p.text("\u2014\u2014\u300A\u9E48\u9E55\u9A91\u884C\u827A\u672F\u901A\u53F2\u300B\uFF0C\u5377\u4E00\uFF08\u865A\u6784\u4E66\u540D\uFF09", 520, 630);
    p.pop();
  }

  // src/main/outro.js
  function renderOutro(p, localT, beat) {
    p.push();
    p.noStroke();
    p.fill(18, 20, 24);
    p.rect(0, 0, 1920, 1080);
    let zoom = 1;
    let targetX = 960;
    let targetY = 460;
    const cellW = 230;
    const cellH = 230;
    const gap = 16;
    const wallStartX = 96 + 12;
    const wallStartY = 60;
    const cell21CenterX = wallStartX + 6 * (cellW + gap) + cellW / 2;
    const cell21CenterY = wallStartY + 2 * (cellH + gap) + cellH / 2;
    if (localT > 3.8 && localT <= 8.5) {
      const pushProg = Math.min(1, (localT - 3.8) / 4.2);
      const easePush = pushProg * pushProg * (3 - 2 * pushProg);
      zoom = p.lerp(1, 3.4, easePush);
      targetX = p.lerp(960, cell21CenterX, easePush);
      targetY = p.lerp(460, cell21CenterY, easePush);
    } else if (localT > 8.5) {
      zoom = 3.4;
      targetX = cell21CenterX;
      targetY = cell21CenterY;
    }
    p.translate(960, 460);
    p.scale(zoom);
    p.translate(-targetX, -targetY);
    for (let idx = 0; idx < 21; idx++) {
      const col = idx % 7;
      const row = Math.floor(idx / 7);
      const cx = wallStartX + col * (cellW + gap);
      const cy = wallStartY + row * (cellH + gap);
      p.push();
      p.translate(cx, cy);
      if (idx < 20) {
        p.stroke(60, 65, 75);
        p.strokeWeight(3);
        p.fill(28, 30, 36);
        p.rect(0, 0, cellW, cellH, 4);
        p.push();
        p.scale(cellW / 1e3);
        try {
          SCENE_RENDERERS[idx](p, 3, beat, null);
        } catch (e) {
          p.fill(100, 100, 100);
          p.rect(0, 0, 1e3, 1e3);
        }
        p.pop();
        p.fill(240, 240, 240, 200);
        p.noStroke();
        p.textAlign(p.LEFT, p.BOTTOM);
        p.textSize(10);
        p.text(`${SCENE_CONFIGS[idx].period}`, 6, cellH - 4);
      } else {
        p.stroke(218, 165, 32);
        p.strokeWeight(4);
        p.fill(38, 42, 52);
        p.rect(0, 0, cellW, cellH, 4);
        p.fill(20, 50, 95);
        p.noStroke();
        p.rect(4, 4, cellW - 8, cellH - 8);
        p.fill(25, 25, 28);
        p.rect(cellW / 2 - 30, 60, 60, 85, 8);
        p.fill(40, 40, 45);
        p.rect(cellW / 2 - 25, 65, 50, 75, 4);
        if (localT >= 10.2 && localT <= 11.8) {
          const flyT = (localT - 10.2) / 1.6;
          const flyPelicanX = p.lerp(-80, cellW + 120, flyT);
          const fastRig = computePelicanRig(localT * 3, {
            x: flyPelicanX,
            y: 125,
            scale: 0.38
          });
          drawDefaultPelican(p, fastRig, {
            bodyColor: [255, 255, 255],
            beakColor: [255, 175, 40],
            pouchColor: [255, 95, 65],
            frameColor: [30, 30, 35],
            wheelColor: [50, 50, 50]
          });
        }
        p.fill(168, 42, 35);
        p.rect(15, 135, cellW - 30, 85, 2);
        p.stroke(20, 20, 22);
        p.strokeWeight(2.5);
        for (let m = 0; m < 5; m++) {
          const mx = 45 + m * 35;
          p.line(mx, 142, mx + (m - 2) * 2, 115);
          p.fill(40, 40, 40);
          p.noStroke();
          p.ellipse(mx + (m - 2) * 2, 113, 8, 8);
        }
        p.fill(245, 245, 245);
        p.stroke(180, 140, 40);
        p.strokeWeight(1);
        p.rect(cellW / 2 - 45, 155, 90, 30, 2);
        p.fill(20, 20, 20);
        p.noStroke();
        p.textAlign(p.CENTER, p.CENTER);
        p.textSize(12);
        p.textStyle(p.BOLD);
        p.text("\u9E48\u9E55 (\u672C\u4EBA)", cellW / 2, 170);
        for (let flashTime of [4.5, 5.5, 6.5, 7.5]) {
          if (localT >= flashTime && localT <= flashTime + 0.18) {
            p.fill(255, 255, 255, 210);
            p.rect(0, 0, cellW, cellH);
          }
        }
      }
      p.pop();
    }
    p.pop();
    p.push();
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(36);
    p.textStyle(p.BOLD);
    if (localT < 4) {
      p.fill(255, 255, 255, 240);
      p.text("\u300C\u622A\u81F3\u76EE\u524D\uFF0C\u4EBA\u7C7B\u5171\u63D0\u4EA4\u4E8620\u4EFD\u7B54\u5377\u3002\u300D", 960, 980);
    } else if (localT >= 7.8 && localT < 10.4) {
      p.fill(255, 255, 255, 240);
      p.text("\u300C\u9E48\u9E55\u672C\u4EBA\u5BF9\u6B64\u5C1A\u672A\u53D1\u8868\u8BC4\u8BBA\u3002\u300D", 960, 980);
    } else if (localT >= 10.4) {
      p.fill(255, 215, 80, 250);
      p.text("\uFF08\u94C3\u58F0\u6E10\u8FDC\uFF0C\u672A\u4F5C\u56DE\u5E94\uFF09", 960, 980);
    }
    p.pop();
    p.pop();
  }

  // src/main/main.js
  function renderAt(t, p) {
    const info = getTimelineInfo(t);
    if (info.phase === "intro") {
      renderIntro(p, info.localT, info.globalBeat);
      return;
    }
    if (info.phase === "outro") {
      renderOutro(p, info.localT, info.globalBeat);
      return;
    }
    const sceneIdx = info.sceneIndex;
    const config = info.sceneConfig;
    const renderer = SCENE_RENDERERS[sceneIdx];
    p.push();
    p.background(15, 17, 22);
    let frameZoom = 1;
    if (info.localT < 0.6) {
      const punch = Math.sin(info.localT / 0.6 * Math.PI);
      frameZoom = 1 + punch * 0.04;
    } else if (info.localT > 5.4) {
      const punch = Math.sin((info.localT - 5.4) / 0.6 * Math.PI);
      frameZoom = 1 + punch * 0.04;
    }
    p.translate(1920 / 2, 1080 / 2);
    p.scale(frameZoom);
    p.translate(-1920 / 2, -1080 / 2);
    const sceneOffsetX = (1920 - 1e3) / 2;
    const sceneOffsetY = (1080 - 1e3) / 2;
    p.push();
    p.translate(sceneOffsetX, sceneOffsetY);
    if (renderer) {
      renderer(p, info.localT, info.globalBeat, null);
    }
    drawArtFrame(p, 0, 0, 1e3, 1e3, config.key);
    p.pop();
    p.stroke(40, 42, 48);
    p.strokeWeight(8);
    p.line(0, sceneOffsetY + 785, sceneOffsetX, sceneOffsetY + 785);
    p.line(sceneOffsetX + 1e3, sceneOffsetY + 785, 1920, sceneOffsetY + 785);
    let titleAlpha = 240;
    if (info.localT < 0.5) {
      titleAlpha = p.map(info.localT, 0, 0.5, 0, 240);
    } else if (info.localT > 5.2) {
      titleAlpha = p.map(info.localT, 5.2, 6, 240, 0);
    }
    drawSceneTitleCard(p, config, 60, 60, titleAlpha);
    p.pop();
  }

  // audio/synth.js
  var NOTE = {
    C3: 130.81,
    D3: 146.83,
    E3: 164.81,
    F3: 174.61,
    G3: 196,
    A3: 220,
    B3: 246.94,
    C4: 261.63,
    D4: 293.66,
    E4: 329.63,
    F4: 349.23,
    G4: 392,
    A4: 440,
    B4: 493.88,
    C5: 523.25,
    D5: 587.33,
    E5: 659.25,
    F5: 698.46,
    G5: 783.99,
    A5: 880,
    B5: 987.77,
    C6: 1046.5
  };
  var THEME_MOTIF = [
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
    { beat: 15, note: NOTE.C4, dur: 1 }
  ];
  function scheduleBicycleBell(ctx, time, dest) {
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();
    osc1.type = "sine";
    osc2.type = "sine";
    osc1.frequency.setValueAtTime(2093, time);
    osc2.frequency.setValueAtTime(2793.8, time);
    gain.gain.setValueAtTime(0, time);
    gain.gain.linearRampToValueAtTime(0.35, time + 5e-3);
    gain.gain.exponentialRampToValueAtTime(1e-4, time + 0.65);
    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(dest);
    osc1.start(time);
    osc2.start(time);
    osc1.stop(time + 0.7);
    osc2.stop(time + 0.7);
  }
  function schedulePluck(ctx, time, freq, dur, dest, type = "triangle", decay = 0.8) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, time);
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(freq * 5, time);
    filter.frequency.exponentialRampToValueAtTime(freq * 1.2, time + dur * 0.7);
    gain.gain.setValueAtTime(0, time);
    gain.gain.linearRampToValueAtTime(0.4, time + 8e-3);
    gain.gain.exponentialRampToValueAtTime(1e-4, time + dur * decay);
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(dest);
    osc.start(time);
    osc.stop(time + dur);
  }
  function scheduleBellTone(ctx, time, freq, dur, dest) {
    const carrier = ctx.createOscillator();
    const mod = ctx.createOscillator();
    const modGain = ctx.createGain();
    const mainGain = ctx.createGain();
    carrier.type = "sine";
    mod.type = "sine";
    carrier.frequency.setValueAtTime(freq, time);
    mod.frequency.setValueAtTime(freq * 2.76, time);
    modGain.gain.setValueAtTime(freq * 1.5, time);
    modGain.gain.exponentialRampToValueAtTime(1, time + dur);
    mainGain.gain.setValueAtTime(0, time);
    mainGain.gain.linearRampToValueAtTime(0.35, time + 0.01);
    mainGain.gain.exponentialRampToValueAtTime(1e-4, time + dur);
    mod.connect(carrier.frequency);
    carrier.connect(mainGain);
    mainGain.connect(dest);
    carrier.start(time);
    mod.start(time);
    carrier.stop(time + dur);
    mod.stop(time + dur);
  }
  function scheduleFlute(ctx, time, freq, dur, dest) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, time);
    osc.frequency.setTargetAtTime(freq * 1.01, time + 0.1, 0.2);
    gain.gain.setValueAtTime(0, time);
    gain.gain.linearRampToValueAtTime(0.3, time + 0.05);
    gain.gain.setValueAtTime(0.28, time + dur * 0.7);
    gain.gain.linearRampToValueAtTime(1e-4, time + dur);
    osc.connect(gain);
    gain.connect(dest);
    osc.start(time);
    osc.stop(time + dur);
  }
  function schedule8BitSquare(ctx, time, freq, dur, dest) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "square";
    osc.frequency.setValueAtTime(freq, time);
    gain.gain.setValueAtTime(0.2, time);
    gain.gain.setValueAtTime(0.18, time + dur * 0.8);
    gain.gain.linearRampToValueAtTime(1e-4, time + dur);
    osc.connect(gain);
    gain.connect(dest);
    osc.start(time);
    osc.stop(time + dur);
  }
  function buildPelicanSoundtrack(ctx, masterOut) {
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.85, 0);
    const compressor = ctx.createDynamicsCompressor();
    compressor.threshold.setValueAtTime(-18, 0);
    compressor.knee.setValueAtTime(12, 0);
    compressor.ratio.setValueAtTime(4, 0);
    masterGain.connect(compressor);
    compressor.connect(masterOut);
    const introOsc = ctx.createOscillator();
    const introGain = ctx.createGain();
    introOsc.type = "sawtooth";
    introOsc.frequency.setValueAtTime(NOTE.C3, 0);
    introOsc.frequency.exponentialRampToValueAtTime(NOTE.G3, 4);
    const introFilter = ctx.createBiquadFilter();
    introFilter.type = "lowpass";
    introFilter.frequency.setValueAtTime(240, 0);
    introGain.gain.setValueAtTime(0, 0);
    introGain.gain.linearRampToValueAtTime(0.35, 1.5);
    introGain.gain.exponentialRampToValueAtTime(1e-3, 4.9);
    introOsc.connect(introFilter);
    introFilter.connect(introGain);
    introGain.connect(masterGain);
    introOsc.start(0);
    introOsc.stop(5);
    scheduleBicycleBell(ctx, 5, masterGain);
    for (let s = 0; s < TOTAL_SCENES; s++) {
      const sceneStartTime = INTRO_DURATION + s * SCENE_DURATION;
      for (let m = 0; m < 12; m++) {
        const motifItem = THEME_MOTIF[m % THEME_MOTIF.length];
        const noteTime = sceneStartTime + m * SECONDS_PER_BEAT;
        const freq = motifItem.note;
        const dur = motifItem.dur * SECONDS_PER_BEAT;
        switch (s) {
          case 0:
            schedulePluck(ctx, noteTime, freq * 0.5, dur, masterGain, "sine", 0.6);
            break;
          case 1:
            schedulePluck(ctx, noteTime, freq, dur, masterGain, "triangle", 0.9);
            break;
          case 2:
            scheduleBellTone(ctx, noteTime, freq, dur * 1.5, masterGain);
            break;
          case 3:
            schedulePluck(ctx, noteTime, freq, dur * 0.7, masterGain, "sawtooth", 0.5);
            break;
          case 4:
            schedulePluck(ctx, noteTime, freq * 0.5, dur * 1.6, masterGain, "sine", 1.2);
            break;
          case 5:
            scheduleFlute(ctx, noteTime, freq, dur, masterGain);
            break;
          case 6:
            scheduleFlute(ctx, noteTime, freq * 0.75, dur, masterGain);
            break;
          case 7:
            schedulePluck(ctx, noteTime, freq, dur, masterGain, "sawtooth", 0.8);
            break;
          case 8:
            scheduleFlute(ctx, noteTime, freq * 0.5, dur * 1.2, masterGain);
            break;
          case 9:
            scheduleBellTone(ctx, noteTime, freq * 1.2, dur, masterGain);
            break;
          case 10:
            schedulePluck(ctx, noteTime, freq, dur * 0.5, masterGain, "triangle", 0.4);
            break;
          case 11:
            schedulePluck(ctx, noteTime, freq, dur * 1.2, masterGain, "sine", 1);
            break;
          case 12:
            if (m >= 4 && m <= 7) {
              schedulePluck(ctx, noteTime, freq * 1.414, dur * 1.5, masterGain, "sawtooth", 1.2);
            } else {
              schedulePluck(ctx, noteTime, freq, dur, masterGain, "sawtooth", 0.8);
            }
            break;
          case 13:
            schedulePluck(ctx, noteTime, freq * 0.5, dur * 1.5, masterGain, "square", 1.2);
            break;
          case 14:
            schedulePluck(ctx, noteTime, freq * (m >= 4 && m <= 6 ? 2.3 : 1), dur, masterGain, "sine", 0.7);
            break;
          case 15:
            schedule8BitSquare(ctx, noteTime, freq, dur, masterGain);
            break;
          case 16:
            schedulePluck(ctx, noteTime, freq * 1.5, dur * 0.6, masterGain, "sine", 0.5);
            break;
          case 17:
            schedulePluck(ctx, noteTime, freq * 0.7937, dur * 1.8, masterGain, "triangle", 1.5);
            break;
          case 18:
            schedulePluck(ctx, noteTime, freq, dur * 0.8, masterGain, "square", 0.6);
            break;
          case 19:
            schedulePluck(ctx, noteTime, freq * 2, dur * 1.2, masterGain, "sine", 1.2);
            break;
        }
      }
      scheduleBicycleBell(ctx, sceneStartTime, masterGain);
      scheduleBicycleBell(ctx, sceneStartTime + 3, masterGain);
    }
    const outroStart = INTRO_DURATION + TOTAL_SCENES * SCENE_DURATION;
    for (let b = 0; b < 16; b++) {
      const motifItem = THEME_MOTIF[b % THEME_MOTIF.length];
      const nTime = outroStart + b * SECONDS_PER_BEAT;
      const outGain = ctx.createGain();
      const vol = Math.max(0.01, 0.45 * (1 - b / 16));
      outGain.gain.setValueAtTime(vol, nTime);
      outGain.connect(masterGain);
      schedulePluck(ctx, nTime, motifItem.note, 0.4, outGain, "sine", 0.8);
      schedulePluck(ctx, nTime, motifItem.note * 0.5, 0.5, outGain, "triangle", 1);
    }
    scheduleBicycleBell(ctx, 135.5, masterGain);
  }
  async function renderOfflineAudioBuffer() {
    const sampleRate = 44100;
    const totalLength = Math.ceil(TOTAL_DURATION * sampleRate);
    const offlineCtx = new OfflineAudioContext(2, totalLength, sampleRate);
    buildPelicanSoundtrack(offlineCtx, offlineCtx.destination);
    const renderedBuffer = await offlineCtx.startRendering();
    return renderedBuffer;
  }
  function audioBufferToWav(buffer) {
    const numChannels = buffer.numberOfChannels;
    const sampleRate = buffer.sampleRate;
    const format = 1;
    const bitDepth = 16;
    const bytesPerSample = bitDepth / 8;
    const blockAlign = numChannels * bytesPerSample;
    const numSamples = buffer.length;
    const dataSize = numSamples * blockAlign;
    const headerSize = 44;
    const totalSize = headerSize + dataSize;
    const arrayBuffer = new ArrayBuffer(totalSize);
    const dataView = new DataView(arrayBuffer);
    function writeString(offset2, str) {
      for (let i = 0; i < str.length; i++) {
        dataView.setUint8(offset2 + i, str.charCodeAt(i));
      }
    }
    writeString(0, "RIFF");
    dataView.setUint32(4, totalSize - 8, true);
    writeString(8, "WAVE");
    writeString(12, "fmt ");
    dataView.setUint32(16, 16, true);
    dataView.setUint16(20, format, true);
    dataView.setUint16(22, numChannels, true);
    dataView.setUint32(24, sampleRate, true);
    dataView.setUint32(28, sampleRate * blockAlign, true);
    dataView.setUint16(32, blockAlign, true);
    dataView.setUint16(34, bitDepth, true);
    writeString(36, "data");
    dataView.setUint32(40, dataSize, true);
    const channelData = [];
    for (let ch = 0; ch < numChannels; ch++) {
      channelData.push(buffer.getChannelData(ch));
    }
    let offset = 44;
    for (let i = 0; i < numSamples; i++) {
      for (let ch = 0; ch < numChannels; ch++) {
        let sample = channelData[ch][i];
        sample = Math.max(-1, Math.min(1, sample));
        const intSample = sample < 0 ? sample * 32768 : sample * 32767;
        dataView.setInt16(offset, intSample, true);
        offset += 2;
      }
    }
    return new Uint8Array(arrayBuffer);
  }

  // src/bundle_entry.js
  var currentT = 0;
  var isPlaying = false;
  var lastAnimTime = performance.now();
  var audioCtx = null;
  var isMuted = false;
  var p5Instance = null;
  window.initPelicanApp = function() {
    const sceneSelect = document.getElementById("scene-select");
    if (sceneSelect && sceneSelect.children.length <= 1) {
      SCENE_CONFIGS.forEach((sc, i) => {
        const opt = document.createElement("option");
        const startT = INTRO_DURATION + i * SCENE_DURATION;
        opt.value = startT;
        opt.textContent = `${sc.id}. ${sc.nameZh} (${startT}s)`;
        sceneSelect.appendChild(opt);
      });
      const outroOpt = document.createElement("option");
      outroOpt.value = 125;
      outroOpt.textContent = "21. \u5C3E\u58F0 \u65B0\u95FB\u53D1\u5E03\u4F1A (125s)";
      sceneSelect.appendChild(outroOpt);
    }
    const sketch = (p) => {
      p.setup = () => {
        const renderer = p.createCanvas(1920, 1080);
        renderer.parent("stage-container");
        p.frameRate(60);
        window.__p5 = p;
        window.__ready = true;
      };
      p.draw = () => {
        if (isPlaying) {
          const now = performance.now();
          const dt = (now - lastAnimTime) / 1e3;
          lastAnimTime = now;
          currentT += dt;
          if (currentT >= TOTAL_DURATION) {
            currentT = 0;
            isPlaying = false;
            const btnPlay2 = document.getElementById("btn-play");
            if (btnPlay2) btnPlay2.textContent = "\u25B6 \u64AD\u653E";
          }
          updateUI();
        }
        renderAt(currentT, p);
      };
    };
    if (window.p5) {
      p5Instance = new window.p5(sketch);
    }
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
    const btnPlay = document.getElementById("btn-play");
    const slider = document.getElementById("progress-slider");
    const timeDisplay = document.getElementById("time-display");
    function updateUI() {
      if (slider) slider.value = currentT;
      const mins = Math.floor(currentT / 60).toString().padStart(2, "0");
      const secs = (currentT % 60).toFixed(1).padStart(4, "0");
      const info = getTimelineInfo(currentT);
      let label = "Intro";
      if (info.phase === "scene") {
        label = `${info.sceneConfig.id}. ${info.sceneConfig.nameZh}`;
      } else if (info.phase === "outro") {
        label = "\u53D1\u5E03\u4F1A\u5C3E\u58F0";
      }
      if (timeDisplay) timeDisplay.textContent = `${mins}:${secs} | ${label}`;
    }
    if (btnPlay) {
      btnPlay.addEventListener("click", () => {
        isPlaying = !isPlaying;
        btnPlay.textContent = isPlaying ? "\u23F8 \u6682\u505C" : "\u25B6 \u64AD\u653E";
        lastAnimTime = performance.now();
        if (isPlaying && !audioCtx) {
          audioCtx = new (window.AudioContext || window.webkitAudioContext)();
          buildPelicanSoundtrack(audioCtx, audioCtx.destination);
        }
      });
    }
    if (slider) {
      slider.addEventListener("input", (e) => {
        currentT = parseFloat(e.target.value);
        updateUI();
      });
    }
    if (sceneSelect) {
      sceneSelect.addEventListener("change", (e) => {
        currentT = parseFloat(e.target.value);
        updateUI();
      });
    }
    const btnPrev = document.getElementById("btn-prev");
    if (btnPrev) {
      btnPrev.addEventListener("click", () => {
        currentT = Math.max(0, currentT - 0.5);
        updateUI();
      });
    }
    const btnNext = document.getElementById("btn-next");
    if (btnNext) {
      btnNext.addEventListener("click", () => {
        currentT = Math.min(TOTAL_DURATION, currentT + 0.5);
        updateUI();
      });
    }
    const btnAudio = document.getElementById("btn-audio");
    if (btnAudio) {
      btnAudio.addEventListener("click", () => {
        isMuted = !isMuted;
        btnAudio.textContent = isMuted ? "\u{1F507} \u9759\u97F3" : "\u{1F50A} \u58F0\u97F3";
        if (audioCtx) {
          if (isMuted) audioCtx.suspend();
          else audioCtx.resume();
        }
      });
    }
  };
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", window.initPelicanApp);
  } else {
    window.initPelicanApp();
  }
})();
