(function() {
  if (typeof LumiDictionary === 'undefined' || typeof LumiGames === 'undefined') return;

  const NEW_GAMES_BATCH_2 = [
    { id: 'human_body_quest', icon: '🫀', nameEg: 'أسرار جسم الإنسان', nameFr: 'Le Corps Humain', domain: 'sciences', minAge: 6 },
    { id: 'spelling_bee_pro', icon: '🔤', nameEg: 'بطلة التهجئة والحروف', nameFr: 'Orthographe Magique', domain: 'lang', minAge: 6 },
    { id: 'number_duel_compare', icon: '⚖️', nameEg: 'ميزان الأعداد والكسور', nameFr: 'Comparer les Nombres', domain: 'math', minAge: 6 },
    { id: 'helen_music_instruments', icon: '🎵', nameEg: 'أوركسترا هيلن الموسيقية', nameFr: 'Instruments de Musique', domain: 'music', minAge: 3 },
    { id: 'helen_weather_seasons', icon: '🌦️', nameEg: 'الطقس والفصول الأربعة', nameFr: 'Météo et Saisons', domain: 'discovery', minAge: 3 }
  ];

  LumiDictionary.games = LumiDictionary.games || [];
  LumiDictionary.gameInstructions = LumiDictionary.gameInstructions || [];

  NEW_GAMES_BATCH_2.forEach(g => {
    if (!LumiDictionary.games.some(x => x.id === g.id)) {
      LumiDictionary.games.push(g);
    }
  });

  const BATCH_2_INSTRUCTIONS = [
    { id: 'inst_body', gameId: 'human_body_quest', eg: 'اكتشفي أسرار جسم الإنسان واختاري الإجابة الصحيحة!', fr: 'Découvre les secrets du corps humain !' },
    { id: 'inst_spell', gameId: 'spelling_bee_pro', eg: 'أكملي الحرف الناقص لتكتمل الكلمة الصحيحة!', fr: 'Complète la lettre manquante du mot !' },
    { id: 'inst_compare', gameId: 'number_duel_compare', eg: 'قارني بين الرقمين واختاري العلامة الصحيحة: أكبر أم أصغر أم يساوي؟', fr: 'Compare les deux nombres et choisis le bon signe !' },
    { id: 'inst_helen_music', gameId: 'helen_music_instruments', eg: 'يا هيلن، اختاري الآلة الموسيقية المطلوبة واسمعي صوتها!', fr: 'Choisis le bon instrument de musique !' },
    { id: 'inst_helen_weather', gameId: 'helen_weather_seasons', eg: 'يا هيلن، اختاري حالة الطقس المطلوبة!', fr: 'Choisis la bonne météo !' }
  ];

  BATCH_2_INSTRUCTIONS.forEach(ins => {
    if (!LumiDictionary.gameInstructions.some(x => x.gameId === ins.gameId)) {
      LumiDictionary.gameInstructions.push(ins);
    }
  });

  const BODY_QS = [
    { q: 'ما هو العضو الذي يضخ الدم إلى جميع أجزاء الجسم؟', fr: 'Quel organe pompe le sang dans le corps ?', icon: '🫀', opts: ['القلب (Le Cœur)', 'المعدة (L’Estomac)', 'الأذن (L’Oreille)'], ans: 'القلب (Le Cœur)' },
    { q: 'بأي عضو نتنفس الهواء النقي؟', fr: 'Avec quel organe respirons-nous ?', icon: '🫁', opts: ['الرئتان (Les Poumons)', 'العين (L’Œil)', 'الأسنان (Les Dents)'], ans: 'الرئتان (Les Poumons)' },
    { q: 'ما هو مركز التفكير والذاكرة في جسم الإنسان؟', fr: 'Quel est le centre de la pensée ?', icon: '🧠', opts: ['المخ (Le Cerveau)', 'القلب (Le Cœur)', 'اليد (La Main)'], ans: 'المخ (Le Cerveau)' },
    { q: 'كم عدد الحواس الخمس لدى الإنسان؟', fr: 'Combien avons-nous de sens ?', icon: '👀', opts: ['5 حواس', '3 حواس', '8 حواس'], ans: '5 حواس' },
    { q: 'ما وظيفة الهيكل العظمي في أجسامنا؟', fr: 'Quel est le rôle du squelette ?', icon: '🦴', opts: ['يدعم الجسم ويحميه', 'يهضم الطعام', 'ينقي الدم'], ans: 'يدعم الجسم ويحميه' }
  ];

  const SPELLING_QS = [
    { word: 'É_OLE', full: 'ÉCOLE', hint: 'مدرسة (فرنسي)', icon: '🏫', opts: ['C', 'K', 'S'], ans: 'C' },
    { word: 'MA_SON', full: 'MAISON', hint: 'منزل (فرنسي)', icon: '🏠', opts: ['I', 'E', 'O'], ans: 'I' },
    { word: 'SOL_IL', full: 'SOLEIL', hint: 'شمس (فرنسي)', icon: '☀️', opts: ['E', 'A', 'U'], ans: 'E' },
    { word: 'EL_PHANT', full: 'ELEPHANT', hint: 'فيل (إنجليزي)', icon: '🐘', opts: ['E', 'A', 'I'], ans: 'E' },
    { word: 'B_TTERFLY', full: 'BUTTERFLY', hint: 'فراشة (إنجليزي)', icon: '🦋', opts: ['U', 'O', 'A'], ans: 'U' },
    { word: 'B_BLIOTHÈQUE', full: 'BIBLIOTHÈQUE', hint: 'مكتبة (فرنسي)', icon: '📚', opts: ['I', 'E', 'Y'], ans: 'I' }
  ];

  const INSTRUMENTS = [
    { name: 'البيانو (Le Piano)', icon: '🎹', freq: 523.25 },
    { name: 'الجيتار (La Guitare)', icon: '🎸', freq: 329.63 },
    { name: 'الطبلة (Le Tambour)', icon: '🥁', freq: 196.00 },
    { name: 'الكمان (Le Violon)', icon: '🎻', freq: 659.25 },
    { name: 'البوق (La Trompette)', icon: '🎺', freq: 440.00 }
  ];

  const WEATHER_ITEMS = [
    { name: 'شمس مشرقة (Soleil)', icon: '☀️' },
    { name: 'مطر وغيوم (Pluie)', icon: '🌧️' },
    { name: 'ثلج أبيض (Neige)', icon: '❄️' },
    { name: 'قوس قزح (Arc-en-ciel)', icon: '🌈' },
    { name: 'هلال ونجوم (Nuit étoilée)', icon: '🌙' }
  ];

  function playNote(freq) {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.value = freq || 440;
      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.45);
    } catch (e) {}
  }

  function speakNow(txt) {
    if (window.LumiQuestionVoice && typeof LumiQuestionVoice.speak === 'function') {
      LumiQuestionVoice.speak(txt);
    } else if (window.LumiAudio && typeof LumiAudio.speak === 'function') {
      LumiAudio.speak('q_custom2', txt, '');
    }
  }

  function renderBatch2UI(stage, badge, icon, questionText, subText, options, correctAns, extraAction) {
    stage.innerHTML = `
      <div style="background:linear-gradient(135deg,#fffbeb,#fef3c7);border:2px solid #fcd34d;border-radius:20px;padding:18px;text-align:center;max-width:650px;margin:0 auto;">
        <div style="display:inline-block;background:#d97706;color:#fff;padding:4px 14px;border-radius:999px;font-size:0.85rem;font-weight:700;margin-bottom:10px;">${badge}</div>
        <div style="font-size:3.6rem;margin:6px 0;">${icon}</div>
        <h3 style="font-size:1.3rem;color:#78350f;margin:8px 0;line-height:1.5;">${questionText}</h3>
        ${subText ? `<p style="color:#b45309;font-size:1.05rem;font-weight:700;margin:4px 0 12px;">${subText}</p>` : ''}
        <button type="button" id="b2-listen-btn" style="background:linear-gradient(135deg,#0ea5e9,#2563eb);color:#fff;border:none;border-radius:12px;padding:8px 18px;font-size:1rem;font-weight:700;cursor:pointer;margin-bottom:16px;">🔊 استمع للسؤال</button>
        <div id="b2-opts" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:12px;"></div>
      </div>
    `;

    stage.querySelector('#b2-listen-btn').onclick = () => {
      if (extraAction) extraAction();
      speakNow(questionText);
    };
    setTimeout(() => {
      if (extraAction) extraAction();
      speakNow(questionText);
    }, 250);

    const box = stage.querySelector('#b2-opts');
    options.forEach(opt => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.style.cssText = 'background:#fff;border:2px solid #fde68a;border-radius:16px;padding:14px 10px;font-size:1.15rem;font-weight:800;color:#1e293b;cursor:pointer;transition:transform 0.15s,background 0.2s;';
      btn.innerHTML = opt.label || opt;
      const val = opt.value || opt;
      btn.onclick = () => {
        if (val === correctAns) {
          btn.style.background = '#dcfce7';
          btn.style.borderColor = '#16a34a';
          btn.style.color = '#14532d';
          LumiGames.handleAnswer(true);
        } else {
          btn.style.background = '#fee2e2';
          btn.style.borderColor = '#dc2626';
          btn.classList.add('shake');
          LumiGames.handleAnswer(false);
        }
      };
      box.appendChild(btn);
    });
  }

  const prevRender = LumiGames.renderGameScreen.bind(LumiGames);
  LumiGames.renderGameScreen = function() {
    const gid = this.currentGameId;
    const stage = document.getElementById('game-stage');

    if (!stage || !NEW_GAMES_BATCH_2.some(g => g.id === gid)) {
      return prevRender();
    }

    const meta = NEW_GAMES_BATCH_2.find(g => g.id === gid);
    const titleEl = document.getElementById('game-title');
    if (titleEl && meta) titleEl.innerHTML = `${meta.icon} ${meta.nameEg} <small>(${meta.nameFr})</small>`;
    const lvlEl = document.getElementById('game-level-badge');
    if (lvlEl) lvlEl.innerText = `المستوى ${this.currentLevel || 1} / 10`;

    if (gid === 'human_body_quest') {
      const item = BODY_QS[Math.floor(Math.random() * BODY_QS.length)];
      const opts = [...item.opts].sort(() => Math.random() - 0.5);
      return renderBatch2UI(stage, '🫀 علوم وأحياء CM1', item.icon, item.q, item.fr, opts, item.ans);
    }

    if (gid === 'spelling_bee_pro') {
      const item = SPELLING_QS[Math.floor(Math.random() * SPELLING_QS.length)];
      const opts = [...item.opts].sort(() => Math.random() - 0.5);
      return renderBatch2UI(
        stage,
        '🔤 بطلة التهجئة',
        item.icon,
        `أكملي الحرف الناقص: <span dir="ltr" style="font-size:1.6rem;letter-spacing:3px;color:#b91c1c;">${item.word}</span>`,
        item.hint,
        opts,
        item.ans,
        () => speakNow(item.full)
      );
    }

    if (gid === 'number_duel_compare') {
      const n1 = Math.floor(Math.random() * 90) + 10;
      const n2 = Math.random() < 0.2 ? n1 : (Math.floor(Math.random() * 90) + 10);
      const ans = n1 > n2 ? '>' : (n1 < n2 ? '<' : '=');
      const opts = [
        { label: 'أكبر من ( > )', value: '>' },
        { label: 'أصغر من ( < )', value: '<' },
        { label: 'يساوي ( = )', value: '=' }
      ];
      return renderBatch2UI(
        stage,
        '⚖️ مقارنة الأعداد CM1',
        '🔢',
        `ضعي العلامة المناسبة: <span dir="ltr" style="font-size:1.7rem;color:#1d4ed8;">${n1} &nbsp;[ ? ]&nbsp; ${n2}</span>`,
        'Compare les deux nombres',
        opts,
        ans
      );
    }

    if (gid === 'helen_music_instruments') {
      const pool = [...INSTRUMENTS].sort(() => Math.random() - 0.5).slice(0, 3);
      const target = pool[0];
      const opts = [...pool].sort(() => Math.random() - 0.5).map(x => ({
        label: `<div style="font-size:3.2rem;">${x.icon}</div><div>${x.name}</div>`,
        value: x.name
      }));
      return renderBatch2UI(
        stage,
        '🎵 أوركسترا هيلن',
        '🎶',
        `يا هيلن، اختاري ${target.name}`,
        'اضغطي للاستماع للنغمة',
        opts,
        target.name,
        () => playNote(target.freq)
      );
    }

    if (gid === 'helen_weather_seasons') {
      const pool = [...WEATHER_ITEMS].sort(() => Math.random() - 0.5).slice(0, 3);
      const target = pool[0];
      const opts = [...pool].sort(() => Math.random() - 0.5).map(x => ({
        label: `<div style="font-size:3.3rem;">${x.icon}</div><div>${x.name}</div>`,
        value: x.name
      }));
      return renderBatch2UI(stage, '🌦️ طقس هيلن الجميل', '🌈', `أين ${target.name}؟`, '', opts, target.name);
    }
  };
})();
