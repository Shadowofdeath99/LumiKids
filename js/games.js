const LumiGames = {
  currentGameId: null,
  currentLevel: 1,
  consecutiveErrors: 0,
  questionStartTime: 0,
  coOpMode: false,
  activeSession: null,

  start(gameId, coOp = false) {
    if (window.LumiApp && typeof LumiApp.showView === 'function') {
      LumiApp.showView('game-view');
    } else {
      document.querySelectorAll('.view-section, section[id$="-view"]').forEach(s => s.style.display = 'none');
      const gv = document.getElementById('game-view');
      if (gv) { gv.classList.add('active'); gv.style.display = 'block'; }
    }
    try { this.endCurrentSession(); } catch (e) {}
    this.currentGameId = gameId;
    this.coOpMode = coOp;
    this.consecutiveErrors = 0;
    const state = LumiStorage.getState();
    this.currentLevel = (state.progress[gameId] && state.progress[gameId].level) || 1;
    const gMeta = LumiDictionary.games.find(g => g.id === gameId);
    this.activeSession = {
      gameId,
      gameName: gMeta ? `${gMeta.icon} ${gMeta.nameEg}` : gameId,
      startTime: Date.now(),
      startLevel: this.currentLevel,
      correct: 0,
      wrong: 0
    };

    const inst = LumiDictionary.gameInstructions.find(i => i.gameId === gameId);
    if (inst && !coOp) {
      LumiAudio.speak(inst.id, inst.eg, inst.fr);
    }

    this.renderGameScreen();
  },

  endCurrentSession() {
    if (!this.activeSession) return;
    const durationSec = Math.round((Date.now() - this.activeSession.startTime) / 1000);
    if (durationSec >= 3 || this.activeSession.correct > 0 || this.activeSession.wrong > 0) {
      const now = new Date();
      LumiStorage.logSession({
        gameName: this.activeSession.gameName,
        dateStr: now.toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric' }),
        timeStr: now.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
        durationSec,
        level: this.currentLevel,
        correct: this.activeSession.correct,
        wrong: this.activeSession.wrong
      });
    }
    this.activeSession = null;
  },

  speakCurrentInstruction() {
    const inst = LumiDictionary.gameInstructions.find(i => i.gameId === this.currentGameId);
    if (inst) LumiAudio.speak(inst.id, inst.eg, inst.fr);
  },

  renderGameScreen() {
    const gameMeta = LumiDictionary.games.find(g => g.id === this.currentGameId);
    const stage = document.getElementById('game-stage');
    document.getElementById('game-title').innerHTML = `${gameMeta.icon} ${gameMeta.nameEg} <small>(${gameMeta.nameFr})</small>`;
    document.getElementById('game-level-badge').innerText = `المستوى ${this.currentLevel} / 10`;

    const coOpBtn = document.getElementById('coop-toggle-btn');
    if (['memory', 'odd_one'].includes(this.currentGameId)) {
      coOpBtn.style.display = 'inline-flex';
      coOpBtn.innerText = this.coOpMode ? '👤 لعب فردي' : '👨‍👧 تحدي مع بابا/ماما';
    } else {
      coOpBtn.style.display = 'none';
    }

    this.questionStartTime = Date.now();
    stage.innerHTML = '';

    if (this.coOpMode && (this.currentGameId === 'memory' || this.currentGameId === 'odd_one')) {
      this.renderCoOpDuel(stage);
      return;
    }

    const builders = {
      memory: () => this.buildMemory(stage),
      shadows: () => this.buildShadows(stage),
      numbers: () => this.buildNumbers(stage),
      coloring: () => this.buildColoring(stage),
      alphabet: () => this.buildAlphabet(stage),
      dictionary: () => this.buildDictionary(stage),
      patterns: () => this.buildPatterns(stage),
      odd_one: () => this.buildOddOne(stage),
      puzzle: () => this.buildPuzzle(stage),
      sorting: () => this.buildSorting(stage),
      word_hunt: () => this.buildWordHunt(stage),
      piano: () => this.buildPiano(stage),
      emotions: () => this.buildEmotions(stage),
      routine: () => this.buildRoutine(stage),
      robot: () => this.buildRobot(stage),
      chef: () => this.buildChef(stage),
      maze: () => this.buildMaze(stage),
      balance: () => this.buildBalance(stage),
      symmetry: () => this.buildSymmetry(stage),
      director: () => this.buildDirector(stage)
    };
    if (builders[this.currentGameId]) builders[this.currentGameId]();
  },

  handleAnswer(isCorrect, itemKey = null, onCompleteRound = null) {
    const gameMeta = LumiDictionary.games.find(g => g.id === this.currentGameId);
    const elapsed = Date.now() - this.questionStartTime;
    LumiStorage.recordAttempt(this.currentGameId, gameMeta.domain, isCorrect, elapsed, itemKey);
    if (isCorrect) LumiStorage.markAdventureStationDone(this.currentGameId);
    if (this.activeSession) { isCorrect ? this.activeSession.correct++ : this.activeSession.wrong++; }
    LumiApp.updateTopStats();

    if (isCorrect) {
      this.consecutiveErrors = 0;
      LumiAudio.sfxSuccess();
      const praiseId = `praise_${Math.floor(Math.random() * 3) + 1}`;
      const pObj = LumiDictionary.psychology.find(p => p.id === praiseId);
      LumiAudio.speak(praiseId, pObj.eg, pObj.fr);
      LumiApp.triggerConfetti();

      if (onCompleteRound) {
        setTimeout(() => {
          const state = LumiStorage.getState();
          const prog = state.progress[this.currentGameId];
          prog.completed = (prog.completed || 0) + 1;
          let unlockedSticker = null;
          if (prog.completed % 2 === 0 && prog.level < 10) {
            prog.level++;
            this.currentLevel = prog.level;
            LumiStorage.saveState(state);
            unlockedSticker = LumiStorage.unlockRandomSticker();
            const lvlObj = LumiDictionary.psychology.find(p => p.id === 'level_up');
            setTimeout(() => LumiAudio.speak('level_up', lvlObj.eg, lvlObj.fr), 1200);
          } else {
            LumiStorage.saveState(state);
          }
          if (unlockedSticker) {
            LumiApp.showStickerUnlockModal(unlockedSticker, () => this.renderGameScreen());
          } else {
            this.renderGameScreen();
          }
        }, 1300);
      }
    } else {
      this.consecutiveErrors++;
      LumiAudio.sfxError();
      const comfortId = `comfort_${Math.floor(Math.random() * 3) + 1}`;
      const cObj = LumiDictionary.psychology.find(p => p.id === comfortId);
      LumiAudio.speak(comfortId, cObj.eg, cObj.fr);

      if (this.consecutiveErrors >= 3) {
        const hintObj = LumiDictionary.psychology.find(p => p.id === 'hint_shield');
        setTimeout(() => LumiAudio.speak('hint_shield', hintObj.eg, hintObj.fr), 1500);
        const correctEl = document.querySelector('[data-correct="true"]');
        if (correctEl) correctEl.classList.add('shield-glow');
      }
    }
  },

  // 1. تطابق البطاقات
  buildMemory(stage) {
    const pairsCount = Math.min(8, 2 + Math.floor(this.currentLevel * 0.6));
    const pool = [...LumiDictionary.words].sort(() => Math.random() - 0.5).slice(0, pairsCount);
    const cards = [...pool, ...pool].sort(() => Math.random() - 0.5);
    let flipped = [], matched = 0;

    const grid = document.createElement('div');
    grid.className = 'memory-grid';
    grid.style.gridTemplateColumns = `repeat(${pairsCount <= 3 ? pairsCount : 4}, 1fr)`;

    cards.forEach((item) => {
      const card = document.createElement('button');
      card.className = 'mem-card';
      card.innerHTML = '❓';
      card.onclick = () => {
        if (flipped.length === 2 || card.classList.contains('open')) return;
        LumiAudio.sfxClick();
        card.classList.add('open');
        card.innerHTML = `<span class="big-emoji">${item.icon}</span><small>${item.fr}</small>`;
        flipped.push({ card, item });

        if (flipped.length === 2) {
          if (flipped[0].item.id === flipped[1].item.id) {
            LumiAudio.speak(item.id, item.eg, item.fr);
            flipped = [];
            matched++;
            if (matched === pairsCount) this.handleAnswer(true, item.id, true);
          } else {
            this.handleAnswer(false, item.id, false);
            setTimeout(() => {
              flipped.forEach(f => { f.card.classList.remove('open'); f.card.innerHTML = '❓'; });
              flipped = [];
            }, 900);
          }
        }
      };
      grid.appendChild(card);
    });
    stage.appendChild(grid);
  },

  // 2. لغز الظلال
  buildShadows(stage) {
    const count = Math.min(5, 2 + Math.floor(this.currentLevel / 3));
    const items = [...LumiDictionary.words].sort(() => Math.random() - 0.5).slice(0, count);
    const target = items[0];
    setTimeout(() => LumiAudio.speak(target.id, `فين ظل ${target.eg}؟`, `Où est l'ombre : ${target.fr} ?`), 1800);

    stage.innerHTML = `
      <div class="prompt-banner">
        <button class="speak-btn" onclick="LumiAudio.speak('${target.id}', '${target.eg}', '${target.fr}')">🔊</button>
        <span>اختاري ظل: <b>${target.eg}</b> (${target.fr})</span>
      </div>
      <div class="target-preview">${target.icon}</div>
      <div class="options-row" id="shadow-opts"></div>
    `;
    const row = stage.querySelector('#shadow-opts');
    [...items].sort(() => Math.random() - 0.5).forEach(it => {
      const btn = document.createElement('button');
      btn.className = 'option-card shadow-card';
      btn.dataset.correct = (it.id === target.id);
      btn.innerHTML = `<span class="shadow-silhouette">${it.icon}</span>`;
      btn.onclick = () => {
        if (it.id === target.id) {
          btn.querySelector('span').classList.remove('shadow-silhouette');
          this.handleAnswer(true, target.id, true);
        } else {
          btn.classList.add('shake');
          this.handleAnswer(false, target.id, false);
        }
      };
      row.appendChild(btn);
    });
  },

  // 3. مزرعة الأرقام
  buildNumbers(stage) {
    const maxNum = Math.min(10, this.currentLevel + 2);
    const targetNum = Math.floor(Math.random() * maxNum) + 1;
    let fed = 0;

    stage.innerHTML = `
      <div class="prompt-banner">
        <span>أطعمي الأرنب <b>${targetNum}</b> جزرات! 🥕</span>
        <div style="font-size:2rem; font-weight:900; color:#FF6B6B;">${targetNum}</div>
      </div>
      <div class="farm-area">
        <div class="bunny-box">🐰 <div id="fed-counter">0 / ${targetNum}</div></div>
        <button class="carrot-tap-btn" id="give-carrot">🥕 اضغطي لإعطاء جزرة</button>
      </div>
    `;
    const numObj = LumiDictionary.numbers.find(n => n.val === targetNum);
    if (numObj) setTimeout(() => LumiAudio.speak(numObj.id, `عايزين ${numObj.eg} جزرات`, numObj.fr), 1800);

    stage.querySelector('#give-carrot').onclick = () => {
      if (fed >= targetNum) return;
      fed++;
      LumiAudio.sfxClick();
      const nStep = LumiDictionary.numbers.find(n => n.val === fed);
      if (nStep) LumiAudio.speak(nStep.id, nStep.eg, nStep.fr);
      stage.querySelector('#fed-counter').innerText = `${fed} / ${targetNum}`;
      if (fed === targetNum) this.handleAnswer(true, `num_${targetNum}`, true);
    };
  },

  // 4. مرسم الألوان
  buildColoring(stage) {
    let selectedColor = LumiDictionary.colors[0];
    const drawings = [
      `<circle class="paintable" cx="100" cy="100" r="85" fill="#FFF" stroke="#333" stroke-width="4"/>
       <circle class="paintable" cx="70" cy="80" r="18" fill="#FFF" stroke="#333" stroke-width="3"/>
       <circle class="paintable" cx="130" cy="80" r="18" fill="#FFF" stroke="#333" stroke-width="3"/>
       <path class="paintable" d="M 65 130 Q 100 165 135 130 Z" fill="#FFF" stroke="#333" stroke-width="3"/>`,
      `<polygon class="paintable" points="100,20 20,90 180,90" fill="#FFF" stroke="#333" stroke-width="4"/>
       <rect class="paintable" x="35" y="90" width="130" height="95" fill="#FFF" stroke="#333" stroke-width="4"/>
       <rect class="paintable" x="82" y="130" width="36" height="55" fill="#FFF" stroke="#333" stroke-width="3"/>`,
      `<circle class="paintable" cx="100" cy="55" r="28" fill="#FFF" stroke="#333" stroke-width="3"/>
       <circle class="paintable" cx="145" cy="100" r="28" fill="#FFF" stroke="#333" stroke-width="3"/>
       <circle class="paintable" cx="100" cy="145" r="28" fill="#FFF" stroke="#333" stroke-width="3"/>
       <circle class="paintable" cx="55" cy="100" r="28" fill="#FFF" stroke="#333" stroke-width="3"/>
       <circle class="paintable" cx="100" cy="100" r="30" fill="#FFF" stroke="#333" stroke-width="4"/>`,
      `<polygon class="paintable" points="100,15 65,70 135,70" fill="#FFF" stroke="#333" stroke-width="4"/>
       <rect class="paintable" x="65" y="70" width="70" height="90" fill="#FFF" stroke="#333" stroke-width="4"/>
       <polygon class="paintable" points="65,120 35,160 65,160" fill="#FFF" stroke="#333" stroke-width="3"/>
       <polygon class="paintable" points="135,120 165,160 135,160" fill="#FFF" stroke="#333" stroke-width="3"/>
       <circle class="paintable" cx="100" cy="105" r="18" fill="#FFF" stroke="#333" stroke-width="3"/>`
    ];
    const svgContent = drawings[(this.currentLevel - 1) % drawings.length];

    stage.innerHTML = `
      <div class="prompt-banner"><span>اختاري اللون ولمسي أجزاء الرسمة! 🎨</span></div>
      <div class="coloring-workspace">
        <svg id="paint-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="230" height="230" style="background:white; border-radius:20px; padding:10px; box-shadow:var(--shadow);">${svgContent}</svg>
        <div class="palette-row" id="palette"></div>
        <div style="display:flex; gap:10px; justify-content:center; flex-wrap:wrap;">
          <button class="primary-btn" id="finish-art">✨ خلصت التلوين!</button>
          <button class="speak-btn" style="margin-top:16px; background:#3B82F6;" id="save-art">💾 حفظ رسمتي</button>
        </div>
      </div>
    `;
    const palette = stage.querySelector('#palette');
    LumiDictionary.colors.forEach(col => {
      const swatch = document.createElement('button');
      swatch.className = 'color-swatch';
      swatch.style.background = col.hex;
      swatch.onclick = () => { selectedColor = col; LumiAudio.speak(col.id, col.eg, col.fr); };
      palette.appendChild(swatch);
    });
    stage.querySelectorAll('.paintable').forEach(el => {
      el.style.cursor = 'pointer';
      el.onclick = () => { el.setAttribute('fill', selectedColor.hex); LumiAudio.sfxClick(); };
    });
    stage.querySelector('#save-art').onclick = () => {
      const svgData = new XMLSerializer().serializeToString(stage.querySelector('#paint-svg'));
      const blob = new Blob([svgData], { type: 'image/svg+xml' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `LumiKids_Art_${Date.now()}.svg`;
      a.click();
    };
    stage.querySelector('#finish-art').onclick = () => this.handleAnswer(true, 'art', true);
  },

  // 5. قطار الحروف الفرنسية
  buildAlphabet(stage) {
    const maxIdx = Math.min(26, 4 + this.currentLevel * 2);
    const subset = LumiDictionary.alphabet.slice(0, maxIdx);
    const target = subset[Math.floor(Math.random() * subset.length)];
    const options = [target, ...subset.filter(x => x.id !== target.id).sort(() => Math.random() - 0.5).slice(0, 2)].sort(() => Math.random() - 0.5);

    setTimeout(() => LumiAudio.speak(target.id, `فين حرف ${target.letter} زي ${target.wordEg}؟`, `${target.letter} comme ${target.wordFr}`), 1800);

    stage.innerHTML = `
      <div class="prompt-banner">
        <button class="speak-btn" onclick="LumiAudio.speak('${target.id}', '${target.wordEg}', '${target.letter} comme ${target.wordFr}')">🔊</button>
        <span>اختاري الحرف: <b>${target.letter}</b> (${target.wordFr})</span>
        <button class="mic-btn" id="mic-test-btn">🎤 انطقيها بالفرنساوي</button>
      </div>
      <div class="options-row" id="alpha-opts"></div>
    `;

    stage.querySelector('#mic-test-btn').onclick = (e) => {
      const btn = e.target;
      btn.innerText = "👂 جاري الاستماع...";
      const pMic = LumiDictionary.psychology.find(p => p.id === 'mic_prompt');
      LumiAudio.speak('mic_prompt', pMic.eg, pMic.fr);
      setTimeout(() => {
        LumiAudio.listenFrenchWord(target.wordFr, (matched) => {
          btn.innerText = "🎤 انطقيها بالفرنساوي";
          if (matched) {
            const pWin = LumiDictionary.psychology.find(p => p.id === 'mic_success');
            LumiAudio.speak('mic_success', pWin.eg, pWin.fr);
            LumiApp.triggerConfetti();
          } else {
            LumiAudio.speak(target.id, `حاولي تاني قولي: ${target.wordFr}`, target.wordFr);
          }
        });
      }, 1800);
    };

    const row = stage.querySelector('#alpha-opts');
    options.forEach(opt => {
      const btn = document.createElement('button');
      btn.className = 'option-card letter-card';
      btn.dataset.correct = (opt.id === target.id);
      btn.innerHTML = `<div class="big-letter">${opt.letter}</div><div>${opt.icon} ${opt.wordFr}</div>`;
      btn.onclick = () => {
        if (opt.id === target.id) this.handleAnswer(true, target.id, true);
        else { btn.classList.add('shake'); this.handleAnswer(false, target.id, false); }
      };
      row.appendChild(btn);
    });
  },

  // 6. قاموس الأشياء
  buildDictionary(stage) {
    const items = [...LumiDictionary.words].sort(() => Math.random() - 0.5).slice(0, 4);
    const target = items[0];
    setTimeout(() => LumiAudio.speak(target.id, `فين ${target.eg}؟`, `Où est ${target.fr} ?`), 1800);

    stage.innerHTML = `
      <div class="prompt-banner">
        <button class="speak-btn" onclick="LumiAudio.speak('${target.id}', '${target.eg}', '${target.fr}')">🔊</button>
        <span>اضغطي على: <b>${target.fr}</b> (${target.eg})</span>
      </div>
      <div class="options-row" id="dict-opts"></div>
    `;
    const row = stage.querySelector('#dict-opts');
    [...items].sort(() => Math.random() - 0.5).forEach(it => {
      const btn = document.createElement('button');
      btn.className = 'option-card';
      btn.dataset.correct = (it.id === target.id);
      btn.innerHTML = `<span class="big-emoji">${it.icon}</span><small>${it.fr}</small>`;
      btn.onclick = () => {
        if (it.id === target.id) this.handleAnswer(true, target.id, true);
        else { btn.classList.add('shake'); this.handleAnswer(false, target.id, false); }
      };
      row.appendChild(btn);
    });
  },

  // 7. أكمل النمط
  buildPatterns(stage) {
    const symbols = ['🍎', '🍌', '⭐', '🌸', '🚗', '🦋'];
    const a = symbols[Math.floor(Math.random() * symbols.length)];
    let b = symbols[Math.floor(Math.random() * symbols.length)];
    while (b === a) b = symbols[Math.floor(Math.random() * symbols.length)];
    const seq = this.currentLevel <= 5 ? [a, b, a, b, a, '❓'] : [a, a, b, a, a, '❓'];
    const answer = b;

    stage.innerHTML = `
      <div class="prompt-banner"><span>إيه الشكل اللي عليه الدور؟ 🧩</span></div>
      <div class="pattern-strip">${seq.map(s => `<span class="pat-item">${s}</span>`).join('')}</div>
      <div class="options-row" id="pat-opts"></div>
    `;
    const row = stage.querySelector('#pat-opts');
    [a, b, symbols.find(x => x !== a && x !== b)].sort(() => Math.random() - 0.5).forEach(sym => {
      const btn = document.createElement('button');
      btn.className = 'option-card';
      btn.dataset.correct = (sym === answer);
      btn.innerHTML = `<span class="big-emoji">${sym}</span>`;
      btn.onclick = () => {
        if (sym === answer) this.handleAnswer(true, 'pattern', true);
        else { btn.classList.add('shake'); this.handleAnswer(false, 'pattern', false); }
      };
      row.appendChild(btn);
    });
  },

  // 8. اكتشف المختلف
  buildOddOne(stage) {
    const fruits = LumiDictionary.words.filter(w => w.cat === 'فواكه');
    const animals = LumiDictionary.words.filter(w => w.cat === 'حيوانات');
    const three = [...fruits].sort(() => Math.random() - 0.5).slice(0, 3);
    const odd = animals[Math.floor(Math.random() * animals.length)];
    const all = [...three, odd].sort(() => Math.random() - 0.5);

    stage.innerHTML = `<div class="prompt-banner"><span>فين الحاجة المختلفة بينهم؟ 🔍</span></div><div class="options-row" id="odd-opts"></div>`;
    const row = stage.querySelector('#odd-opts');
    all.forEach(it => {
      const btn = document.createElement('button');
      btn.className = 'option-card';
      btn.dataset.correct = (it.id === odd.id);
      btn.innerHTML = `<span class="big-emoji">${it.icon}</span>`;
      btn.onclick = () => {
        if (it.id === odd.id) this.handleAnswer(true, 'odd_one', true);
        else { btn.classList.add('shake'); this.handleAnswer(false, 'odd_one', false); }
      };
      row.appendChild(btn);
    });
  },

  // 9. بازل الصور
  buildPuzzle(stage) {
    const scenes = [
      { title: 'قصر الأميرة', tiles: ['🏰', '🌈', '👸', '🦄'] },
      { title: 'حديقة الحيوانات', tiles: ['🦒', '🦁', '🐘', '🌴'] },
      { title: 'رحلة الفضاء', tiles: ['🚀', '🪐', '🌙', '⭐'] }
    ];
    const chosen = scenes[(this.currentLevel - 1) % scenes.length];
    const shuffled = chosen.tiles.map((t, idx) => ({ icon: t, correctIdx: idx })).sort(() => Math.random() - 0.5);
    let placedCount = 0;

    stage.innerHTML = `
      <div class="prompt-banner"><span>ركبي صورة <b>${chosen.title}</b>: اضغطي على كل قطعة لمكانها! 🖼️</span></div>
      <div style="display:grid; grid-template-columns:repeat(2, 95px); gap:8px; background:#E2E8F0; padding:12px; border-radius:20px; margin-bottom:18px;">
        ${chosen.tiles.map((t, i) => `<div id="slot-${i}" style="height:95px; background:white; border-radius:14px; display:flex; align-items:center; justify-content:center; font-size:3rem; opacity:0.35; border:2px dashed #94A3B8;">${t}</div>`).join('')}
      </div>
      <div class="options-row" id="puz-pieces"></div>
    `;
    const row = stage.querySelector('#puz-pieces');
    shuffled.forEach(piece => {
      const btn = document.createElement('button');
      btn.className = 'option-card';
      btn.innerHTML = `<span class="big-emoji">${piece.icon}</span>`;
      btn.onclick = () => {
        LumiAudio.sfxClick();
        const slot = stage.querySelector(`#slot-${piece.correctIdx}`);
        slot.style.opacity = '1';
        slot.style.border = '3px solid #22C55E';
        btn.style.visibility = 'hidden';
        placedCount++;
        if (placedCount === 4) this.handleAnswer(true, 'puzzle', true);
      };
      row.appendChild(btn);
    });
  },

  // 10. فرز الألوان والأحجام
  buildSorting(stage) {
    const mode = this.currentLevel % 2 === 0 ? 'size' : 'category';
    if (mode === 'size') {
      const isBig = Math.random() > 0.5;
      stage.innerHTML = `
        <div class="prompt-banner"><span>الدبدوب ده <b>${isBig ? 'كبير (Grand)' : 'صغير (Petit)'}</b>! حطيه في الصندوق المناسب 🧺</span></div>
        <div style="font-size:${isBig ? '6.5rem' : '2.8rem'}; margin:16px 0;">🧸</div>
        <div class="options-row">
          <button class="basket-btn" data-correct="${isBig}" id="b-big">📦 صندوق الكبير (Grand)</button>
          <button class="basket-btn" data-correct="${!isBig}" id="b-small">📦 صندوق الصغير (Petit)</button>
        </div>
      `;
      stage.querySelector('#b-big').onclick = () => this.handleAnswer(isBig, 'sorting_size', isBig);
      stage.querySelector('#b-small').onclick = () => this.handleAnswer(!isBig, 'sorting_size', !isBig);
    } else {
      const targetCat = Math.random() > 0.5 ? 'فواكه' : 'مواصلات';
      const pool = LumiDictionary.words.filter(w => w.cat === targetCat);
      const item = pool[Math.floor(Math.random() * pool.length)];
      stage.innerHTML = `
        <div class="prompt-banner"><span>حطي <b>${item.eg}</b> (${item.fr}) في السلة الصح!</span></div>
        <div class="target-preview">${item.icon}</div>
        <div class="options-row">
          <button class="basket-btn" data-correct="${targetCat === 'فواكه'}" id="b-fruit">🧺 سلة الفواكه</button>
          <button class="basket-btn" data-correct="${targetCat === 'مواصلات'}" id="b-trans">🧺 سلة المواصلات</button>
        </div>
      `;
      stage.querySelector('#b-fruit').onclick = () => this.handleAnswer(targetCat === 'فواكه', 'sorting', targetCat === 'فواكه');
      stage.querySelector('#b-trans').onclick = () => this.handleAnswer(targetCat === 'مواصلات', 'sorting', targetCat === 'مواصلات');
    }
  },

  // 11. صيد الكلمات
  buildWordHunt(stage) {
    const items = [...LumiDictionary.words].sort(() => Math.random() - 0.5).slice(0, 3);
    const target = items[0];
    setTimeout(() => LumiAudio.speak(target.id, target.eg, target.fr), 1800);

    stage.innerHTML = `
      <div class="prompt-banner"><span>اختاري الكلمة الفرنساوي للصورة دي:</span></div>
      <div class="target-preview">${target.icon}</div>
      <div class="options-row" id="wh-opts"></div>
    `;
    const row = stage.querySelector('#wh-opts');
    [...items].sort(() => Math.random() - 0.5).forEach(it => {
      const btn = document.createElement('button');
      btn.className = 'option-card word-pill';
      btn.dataset.correct = (it.id === target.id);
      btn.innerText = it.fr;
      btn.onclick = () => {
        if (it.id === target.id) this.handleAnswer(true, target.id, true);
        else { btn.classList.add('shake'); this.handleAnswer(false, target.id, false); }
      };
      row.appendChild(btn);
    });
  },

  // 12. البيانو الذكي
  buildPiano(stage) {
    const notes = [
      { id: 0, name: 'Do', freq: 261.63, color: '#FF595E' },
      { id: 1, name: 'Re', freq: 293.66, color: '#FFCA3A' },
      { id: 2, name: 'Mi', freq: 329.63, color: '#8AC926' },
      { id: 3, name: 'Fa', freq: 349.23, color: '#1982C4' }
    ];
    const seqLen = Math.min(6, 2 + Math.floor(this.currentLevel / 2));
    const sequence = Array.from({ length: seqLen }, () => Math.floor(Math.random() * 4));
    let userSeq = [];

    stage.innerHTML = `
      <div class="prompt-banner">
        <span>اسمعي النغمة وقلديها على البيانو! 🎹</span>
        <button class="primary-btn" style="margin:0;" id="replay-seq">▶️ اسمعي النغمة</button>
      </div>
      <div class="piano-keys" id="piano-box"></div>
    `;

    const playSeq = () => {
      sequence.forEach((noteIdx, i) => {
        setTimeout(() => {
          const keyEl = stage.querySelector(`[data-note="${noteIdx}"]`);
          if (keyEl) {
            keyEl.classList.add('active-key');
            LumiAudio.playTone(notes[noteIdx].freq, 'triangle', 0.35);
            setTimeout(() => keyEl.classList.remove('active-key'), 300);
          }
        }, i * 550);
      });
    };

    const box = stage.querySelector('#piano-box');
    notes.forEach(n => {
      const k = document.createElement('button');
      k.className = 'piano-key';
      k.dataset.note = n.id;
      k.style.background = n.color;
      k.innerText = n.name;
      k.onclick = () => {
        LumiAudio.playTone(n.freq, 'triangle', 0.3);
        userSeq.push(n.id);
        const curIdx = userSeq.length - 1;
        if (userSeq[curIdx] !== sequence[curIdx]) {
          userSeq = [];
          this.handleAnswer(false, 'piano', false);
        } else if (userSeq.length === sequence.length) {
          this.handleAnswer(true, 'piano', true);
        }
      };
      box.appendChild(k);
    });

    stage.querySelector('#replay-seq').onclick = playSeq;
    setTimeout(playSeq, 1800);
  },

  // 13. مرآة المشاعر
  buildEmotions(stage) {
    const emos = LumiDictionary.words.filter(w => w.cat === 'مشاعر');
    const target = emos[Math.floor(Math.random() * emos.length)];
    setTimeout(() => LumiAudio.speak(target.id, `فين الوجه اللي شكله ${target.eg}؟`, `Qui est ${target.fr} ?`), 1800);

    stage.innerHTML = `
      <div class="prompt-banner"><span>اختاري الشعور: <b>${target.eg}</b> (${target.fr}) 🎭</span></div>
      <div class="options-row" id="emo-opts"></div>
    `;
    const row = stage.querySelector('#emo-opts');
    emos.forEach(e => {
      const btn = document.createElement('button');
      btn.className = 'option-card';
      btn.dataset.correct = (e.id === target.id);
      btn.innerHTML = `<span class="big-emoji">${e.icon}</span><small>${e.fr}</small>`;
      btn.onclick = () => {
        if (e.id === target.id) this.handleAnswer(true, target.id, true);
        else { btn.classList.add('shake'); this.handleAnswer(false, target.id, false); }
      };
      row.appendChild(btn);
    });
  },

  // 14. روتيني اليومي
  buildRoutine(stage) {
    const tasks = [
      { id: 'r1', icon: '🪥', eg: 'غسل الأسنان الصبح', fr: 'Se brosser les dents' },
      { id: 'r2', icon: '🥣', eg: 'أكل الفطور الصحي', fr: 'Prendre le petit-déjeuner' },
      { id: 'r3', icon: '😴', eg: 'النوم بدري بالليل', fr: 'Aller dormir' }
    ];
    const target = tasks[Math.floor(Math.random() * tasks.length)];
    stage.innerHTML = `
      <div class="prompt-banner"><span>فين صورة: <b>${target.eg}</b> (${target.fr})؟ ⏰</span></div>
      <div class="options-row" id="rout-opts"></div>
    `;
    const row = stage.querySelector('#rout-opts');
    tasks.forEach(t => {
      const btn = document.createElement('button');
      btn.className = 'option-card';
      btn.dataset.correct = (t.id === target.id);
      btn.innerHTML = `<span class="big-emoji">${t.icon}</span>`;
      btn.onclick = () => {
        if (t.id === target.id) this.handleAnswer(true, 'routine', true);
        else { btn.classList.add('shake'); this.handleAnswer(false, 'routine', false); }
      };
      row.appendChild(btn);
    });
  },

  // 15. المبرمجة الصغيرة (الروبوت الذكي)
  buildRobot(stage) {
    const size = this.currentLevel <= 4 ? 3 : 4;
    let rPos = { x: 0, y: size - 1 };
    const target = { x: size - 1, y: 0 };
    const obstacle = size === 4 ? { x: 1, y: 1 } : null;
    let commands = [];

    const renderGrid = () => {
      let cells = '';
      for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
          let content = '';
          if (x === rPos.x && y === rPos.y) content = '🤖';
          else if (x === target.x && y === target.y) content = '⭐';
          else if (obstacle && x === obstacle.x && y === obstacle.y) content = '🪨';
          cells += `<div style="width:68px; height:68px; background:white; border-radius:14px; display:flex; align-items:center; justify-content:center; font-size:2.4rem; border:2px solid #CBD5E1;">${content}</div>`;
        }
      }
      stage.querySelector('#robot-board').innerHTML = cells;
      stage.querySelector('#cmd-strip').innerText = commands.map(c => c.icon).join(' ') || 'اضغطي على الأسهم تحت...';
    };

    stage.innerHTML = `
      <div class="prompt-banner"><span>برمجي الروبوت 🤖 للوصول للنجمة ⭐!</span></div>
      <div id="robot-board" style="display:grid; grid-template-columns:repeat(${size}, 68px); gap:8px; background:#E2E8F0; padding:12px; border-radius:20px;"></div>
      <div id="cmd-strip" style="margin:14px 0; padding:10px 20px; background:var(--bg); border-radius:14px; font-size:1.6rem; min-height:50px;"></div>
      <div class="options-row">
        <button class="speak-btn" id="btn-up">⬆️ قدام</button>
        <button class="speak-btn" id="btn-right">➡️ يمين</button>
        <button class="speak-btn" id="btn-left">⬅️ شمال</button>
        <button class="speak-btn" id="btn-down">⬇️ تحت</button>
      </div>
      <div style="display:flex; gap:12px; margin-top:14px;">
        <button class="primary-btn" style="margin:0; background:#22C55E;" id="run-robot">▶️ انطلق!</button>
        <button class="back-btn" id="clear-robot">🔄 مسح الأسهم</button>
      </div>
    `;

    const addCmd = (dx, dy, icon, frWord) => {
      LumiAudio.sfxClick();
      LumiAudio.speak(null, '', frWord);
      commands.push({ dx, dy, icon });
      renderGrid();
    };

    stage.querySelector('#btn-up').onclick = () => addCmd(0, -1, '⬆️', 'En haut');
    stage.querySelector('#btn-down').onclick = () => addCmd(0, 1, '⬇️', 'En bas');
    stage.querySelector('#btn-right').onclick = () => addCmd(1, 0, '➡️', 'À droite');
    stage.querySelector('#btn-left').onclick = () => addCmd(-1, 0, '⬅️', 'À gauche');
    stage.querySelector('#clear-robot').onclick = () => { commands = []; rPos = { x: 0, y: size - 1 }; renderGrid(); };

    stage.querySelector('#run-robot').onclick = () => {
      if (commands.length === 0) return;
      let step = 0;
      const timer = setInterval(() => {
        if (step >= commands.length) {
          clearInterval(timer);
          if (rPos.x === target.x && rPos.y === target.y) {
            this.handleAnswer(true, 'robot', true);
          } else {
            this.handleAnswer(false, 'robot', false);
            commands = []; rPos = { x: 0, y: size - 1 }; renderGrid();
          }
          return;
        }
        const c = commands[step++];
        const nx = rPos.x + c.dx, ny = rPos.y + c.dy;
        if (nx >= 0 && nx < size && ny >= 0 && ny < size && (!obstacle || nx !== obstacle.x || ny !== obstacle.y)) {
          rPos = { x: nx, y: ny };
          LumiAudio.sfxClick();
          renderGrid();
        }
      }, 450);
    };
    renderGrid();
  },

  // 16. مطبخ الشيف الصغير
  buildChef(stage) {
    const ingredients = LumiDictionary.words.filter(w => ['فواكه', 'خضروات'].includes(w.cat));
    const recipeCount = Math.min(4, 2 + Math.floor(this.currentLevel / 4));
    const recipe = [...ingredients].sort(() => Math.random() - 0.5).slice(0, recipeCount);
    let chosen = [];

    stage.innerHTML = `
      <div class="prompt-banner"><span>احفظي مكونات الوصفة بسرعة يا شيف! 👩‍🍳</span></div>
      <div id="recipe-card" style="background:#FEF3C7; padding:20px 30px; border-radius:24px; border:3px dashed #F59E0B; margin-bottom:16px;">
        <div style="font-size:3.5rem; letter-spacing:12px;">${recipe.map(r => r.icon).join(' ')}</div>
        <div style="font-weight:bold; margin-top:8px; color:#92400E;">${recipe.map(r => `${r.eg} (${r.fr})`).join(' + ')}</div>
      </div>
      <div id="blender-pot" style="font-size:2.8rem; min-height:60px; margin-bottom:12px;">🥣 الحلة فاضية</div>
      <div class="options-row" id="chef-opts"></div>
    `;

    const row = stage.querySelector('#chef-opts');
    ingredients.forEach(ing => {
      const btn = document.createElement('button');
      btn.className = 'option-card';
      btn.innerHTML = `<span class="big-emoji">${ing.icon}</span><small>${ing.fr}</small>`;
      btn.onclick = () => {
        LumiAudio.speak(ing.id, ing.eg, ing.fr);
        if (recipe.some(r => r.id === ing.id) && !chosen.includes(ing.id)) {
          chosen.push(ing.id);
          btn.style.borderColor = '#22C55E';
          stage.querySelector('#blender-pot').innerText = '🥣 ' + chosen.map(id => ingredients.find(x => x.id === id).icon).join(' ');
          if (chosen.length === recipe.length) this.handleAnswer(true, 'chef', true);
        } else if (!recipe.some(r => r.id === ing.id)) {
          btn.classList.add('shake');
          this.handleAnswer(false, 'chef', false);
        }
      };
      row.appendChild(btn);
    });

    setTimeout(() => {
      const card = stage.querySelector('#recipe-card');
      if (card) card.innerHTML = '<b>🤫 الوصفة استخبت! افتكري المكونات وحطيها في الحلة!</b>';
    }, 4200);
  },

  // 17. متاهة التركيز
  buildMaze(stage) {
    const pathWidth = Math.max(36, 68 - (this.currentLevel * 3));
    stage.innerHTML = `
      <div class="prompt-banner"><span>اسحبي الفراشة 🦋 جوه الطريق الأخضر لحد الوردة 🌸!</span></div>
      <div style="position:relative; width:340px; height:280px; background:#FEE2E2; border-radius:24px; overflow:hidden; border:4px solid #10B981; touch-action:none;" id="maze-box">
        <svg viewBox="0 0 340 280" width="340" height="280">
          <path d="M 40 50 L 270 50 L 270 140 L 70 140 L 70 230 L 290 230" fill="none" stroke="#A7F3D0" stroke-width="${pathWidth}" stroke-linecap="round" stroke-linejoin="round"/>
          <text x="275" y="242" font-size="34">🌸</text>
        </svg>
        <div id="butterfly-player" style="position:absolute; left:22px; top:28px; font-size:2.4rem; cursor:grab;">🦋</div>
      </div>
    `;

    const box = stage.querySelector('#maze-box');
    const player = stage.querySelector('#butterfly-player');
    let dragging = false;

    const moveHandler = (clientX, clientY) => {
      if (!dragging) return;
      const rect = box.getBoundingClientRect();
      const x = clientX - rect.left - 20;
      const y = clientY - rect.top - 20;
      player.style.left = Math.max(0, Math.min(300, x)) + 'px';
      player.style.top = Math.max(0, Math.min(240, y)) + 'px';

      if (x > 250 && y > 195) {
        dragging = false;
        this.handleAnswer(true, 'maze', true);
      }
    };

    player.onmousedown = () => dragging = true;
    player.ontouchstart = () => dragging = true;
    window.onmouseup = () => dragging = false;
    window.ontouchend = () => dragging = false;
    box.onmousemove = (e) => moveHandler(e.clientX, e.clientY);
    box.ontouchmove = (e) => { e.preventDefault(); moveHandler(e.touches[0].clientX, e.touches[0].clientY); };
  },

  // 18. ميزان الأوزان والمنطق
  buildBalance(stage) {
    const targetWeight = Math.min(10, this.currentLevel + 2);
    let currentWeight = 0;

    stage.innerHTML = `
      <div class="prompt-banner"><span>الفيل وزنه <b>${targetWeight}</b> 🐘! حطي أرانب (وزن 1) لحد ما الميزان يتساوى ⚖️</span></div>
      <div style="display:flex; justify-content:space-around; align-items:flex-end; width:100%; max-width:500px; height:170px; background:var(--bg); border-radius:24px; padding:20px; border-bottom:8px solid #475569; margin:16px 0;">
        <div style="text-align:center;">
          <div style="font-size:4rem;">🐘</div>
          <b>الوزن: ${targetWeight}</b>
        </div>
        <div style="font-size:3rem;">⚖️</div>
        <div style="text-align:center;">
          <div id="rabbits-pan" style="font-size:2rem; min-height:60px;">⬜</div>
          <b id="right-weight">الوزن: 0</b>
        </div>
      </div>
      <div style="display:flex; gap:14px;">
        <button class="primary-btn" style="margin:0;" id="add-rabbit">➕ حطي أرنب 🐰</button>
        <button class="back-btn" id="remove-rabbit">➖ شيلي أرنب</button>
      </div>
    `;

    const updatePan = () => {
      stage.querySelector('#rabbits-pan').innerText = currentWeight > 0 ? '🐰'.repeat(currentWeight) : '⬜';
      stage.querySelector('#right-weight').innerText = `الوزن: ${currentWeight}`;
      if (currentWeight === targetWeight) {
        this.handleAnswer(true, 'balance', true);
      } else if (currentWeight > targetWeight) {
        this.handleAnswer(false, 'balance', false);
      }
    };

    stage.querySelector('#add-rabbit').onclick = () => { LumiAudio.sfxClick(); currentWeight++; updatePan(); };
    stage.querySelector('#remove-rabbit').onclick = () => { if (currentWeight > 0) { LumiAudio.sfxClick(); currentWeight--; updatePan(); } };
  },

  // 19. مرآة الرسم المتماثل
  buildSymmetry(stage) {
    let color = '#FF6B6B';
    stage.innerHTML = `
      <div class="prompt-banner"><span>ارسمي في أي ناحية وشوفي المرآة السحرية بترسم زيك! ✨</span></div>
      <canvas id="sym-canvas" width="360" height="240" style="background:white; border-radius:20px; border:3px solid #EC4899; touch-action:none; cursor:crosshair;"></canvas>
      <div class="palette-row" id="sym-palette"></div>
      <div style="display:flex; gap:12px; margin-top:14px;">
        <button class="primary-btn" style="margin:0;" id="sym-done">🌟 خلصت لوحتي!</button>
        <button class="back-btn" id="sym-clear">🧹 مسح اللوحة</button>
      </div>
    `;

    const canvas = stage.querySelector('#sym-canvas');
    const ctx = canvas.getContext('2d');
    const drawCenterLine = () => {
      ctx.save();
      ctx.strokeStyle = '#CBD5E1';
      ctx.setLineDash([6, 6]);
      ctx.beginPath(); ctx.moveTo(180, 0); ctx.lineTo(180, 240); ctx.stroke();
      ctx.restore();
    };
    drawCenterLine();

    LumiDictionary.colors.forEach(c => {
      const b = document.createElement('button');
      b.className = 'color-swatch';
      b.style.background = c.hex;
      b.onclick = () => { color = c.hex; LumiAudio.speak(c.id, c.eg, c.fr); };
      stage.querySelector('#sym-palette').appendChild(b);
    });

    let drawing = false;
    const paintSym = (clientX, clientY) => {
      if (!drawing) return;
      const r = canvas.getBoundingClientRect();
      const x = clientX - r.left;
      const y = clientY - r.top;
      const mirrorX = 360 - x;
      ctx.fillStyle = color;
      ctx.beginPath(); ctx.arc(x, y, 6, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(mirrorX, y, 6, 0, Math.PI * 2); ctx.fill();
    };

    canvas.onmousedown = () => drawing = true;
    canvas.ontouchstart = () => drawing = true;
    window.addEventListener('mouseup', () => drawing = false);
    window.addEventListener('touchend', () => drawing = false);
    canvas.onmousemove = (e) => paintSym(e.clientX, e.clientY);
    canvas.ontouchmove = (e) => { e.preventDefault(); paintSym(e.touches[0].clientX, e.touches[0].clientY); };

    stage.querySelector('#sym-clear').onclick = () => { ctx.clearRect(0, 0, 360, 240); drawCenterLine(); };
    stage.querySelector('#sym-done').onclick = () => this.handleAnswer(true, 'symmetry', true);
  },

  // 20. مخرجة الحكايات
  buildDirector(stage) {
    const bgs = ['🌲 الغابة السحرية', '🏰 قصر الأميرات', '🚀 كوكب الفضاء', '🌊 شاطئ البحر'];
    const chars = ['👸', '🐰', '🦄', '🐉', '🚀', '🧚‍♀️'];
    let selectedBg = bgs[0];
    let stageChars = ['👸', '🦄'];
    let storyBlob = null;

    stage.innerHTML = `
      <div class="prompt-banner"><span>اختاري المكان والشخصيات واحكي قصتك بصوتك! 🎬</span></div>
      <div style="display:flex; gap:8px; flex-wrap:wrap; justify-content:center; margin-bottom:12px;" id="dir-bgs"></div>
      <div style="width:100%; max-width:460px; height:150px; background:linear-gradient(135deg,#6A4C93,#1982C4); color:white; border-radius:24px; display:flex; flex-direction:column; align-items:center; justify-content:center; margin-bottom:12px;">
        <div id="bg-label" style="font-weight:bold; margin-bottom:8px;">${selectedBg}</div>
        <div id="stage-cast" style="font-size:3.5rem; letter-spacing:14px;">${stageChars.join(' ')}</div>
      </div>
      <div style="display:flex; gap:8px; flex-wrap:wrap; justify-content:center; margin-bottom:14px;" id="dir-chars"></div>
      <div style="display:flex; gap:10px; flex-wrap:wrap; justify-content:center;">
        <button class="rec-btn" id="dir-rec">🎙️ ابدئي تسجيل حكايتك</button>
        <button class="play-btn" id="dir-play" style="display:none;">▶️ اسمعي فيلمك!</button>
        <button class="primary-btn" style="margin:0;" id="dir-finish">🏆 حفظ الحكاية</button>
      </div>
    `;

    bgs.forEach(bg => {
      const b = document.createElement('button');
      b.className = 'who-btn';
      b.innerText = bg;
      b.onclick = () => { selectedBg = bg; stage.querySelector('#bg-label').innerText = bg; };
      stage.querySelector('#dir-bgs').appendChild(b);
    });

    chars.forEach(ch => {
      const b = document.createElement('button');
      b.className = 'coop-btn';
      b.innerText = ch;
      b.onclick = () => {
        if (stageChars.includes(ch)) stageChars = stageChars.filter(x => x !== ch);
        else stageChars.push(ch);
        stage.querySelector('#stage-cast').innerText = stageChars.join(' ') || '✨';
      };
      stage.querySelector('#dir-chars').appendChild(b);
    });

    let isRec = false;
    const recBtn = stage.querySelector('#dir-rec');
    const playBtn = stage.querySelector('#dir-play');

    recBtn.onclick = async () => {
      if (!isRec) {
        try {
          await LumiAudio.startRecording();
          isRec = true;
          recBtn.innerText = '⏹️ خلصت الحكاية';
          recBtn.classList.add('recording-pulse');
        } catch (e) { alert('يرجى السماح بالمايك لتسجيل القصة!'); }
      } else {
        storyBlob = await LumiAudio.stopRecording();
        isRec = false;
        recBtn.innerText = '🎙️ تسجيل مرة أخرى';
        recBtn.classList.remove('recording-pulse');
        if (storyBlob) playBtn.style.display = 'inline-block';
      }
    };

    playBtn.onclick = () => {
      if (storyBlob) {
        LumiAudio.sfxWin();
        new Audio(URL.createObjectURL(storyBlob)).play();
      }
    };

    stage.querySelector('#dir-finish').onclick = () => this.handleAnswer(true, 'director', true);
  },

  // وضع التحدي التعاوني
  renderCoOpDuel(stage) {
    const items = [...LumiDictionary.words].sort(() => Math.random() - 0.5).slice(0, 6);
    const target = items[0];
    const childOpts = [target, items[1], items[2]].sort(() => Math.random() - 0.5);
    const parentOpts = [...items].sort(() => Math.random() - 0.5);

    stage.innerHTML = `
      <div class="coop-arena">
        <div class="coop-half parent-half">
          <h4>👨‍👩‍👧 دور بابا / ماما (ابحث عن: ${target.fr})</h4>
          <div class="coop-row" id="parent-coop-row"></div>
        </div>
        <div class="coop-divider">⚡ سباق السرعة والتركيز ⚡</div>
        <div class="coop-half child-half">
          <h4>👧 دورك يا بطلة (فين ${target.eg} ${target.icon}؟)</h4>
          <div class="coop-row" id="child-coop-row"></div>
        </div>
      </div>
    `;
    parentOpts.forEach(it => {
      const b = document.createElement('button');
      b.className = 'coop-btn';
      b.innerText = it.icon;
      b.onclick = () => { if (it.id === target.id) { alert("بابا/ماما كسب الجولة دي! يلا جولة تانية!"); this.renderGameScreen(); } };
      stage.querySelector('#parent-coop-row').appendChild(b);
    });
    childOpts.forEach(it => {
      const b = document.createElement('button');
      b.className = 'coop-btn child-big';
      b.innerText = it.icon;
      b.onclick = () => {
        if (it.id === target.id) {
          const wObj = LumiDictionary.psychology.find(p => p.id === 'coop_win');
          LumiAudio.speak('coop_win', wObj.eg, wObj.fr);
          this.handleAnswer(true, 'coop', true);
        }
      };
      stage.querySelector('#child-coop-row').appendChild(b);
    });
  }
};

window.LumiGames = LumiGames;
