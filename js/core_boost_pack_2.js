(function() {
  if (typeof LumiGames === 'undefined') return;

  // ==========================================
  // 1. ترقية لعبة فرز الألوان والأحجام والتصنيفات (sorting)
  // ==========================================
  const SORTING_CHALLENGES = [
    { q: 'أي سلة نضع فيها التفاحة الحمراء 🍎؟', baskets: ['🔴 أشياء حمراء', '🔵 أشياء زرقاء', '🟡 أشياء صفراء'], ans: '🔴 أشياء حمراء' },
    { q: 'أي سلة نضع فيها الحوت الأزرق 🐋؟', baskets: ['🌊 حيوانات بحرية', '🌲 حيوانات الغابة', '🦅 طيور السماء'], ans: '🌊 حيوانات بحرية' },
    { q: 'أين نصنّف الحافلة الكبيرة 🚌؟', baskets: ['🐘 كبير الحجم', '🐜 صغير الحجم', '🍓 فاكهة لذيذة'], ans: '🐘 كبير الحجم' },
    { q: 'أين نصنّف النملة الصغيرة 🐜؟', baskets: ['🐘 كبير الحجم', '🐜 صغير الحجم', '🚀 مركبة فضائية'], ans: '🐜 صغير الحجم' },
    { q: 'تصنيف المثلث 🔺 والدائرة 🔵 والمربع 🟥:', baskets: ['📐 أشكال هندسية', '🦁 حيوانات مفترسة', '🎹 آلات موسيقية'], ans: '📐 أشكال هندسية' },
    { q: 'تصنيف الجزر 🥕 والخيار 🥒 والطماطم 🍅:', baskets: ['🥗 خضروات صحية', '🍭 حلويات وسكاكر', '🚗 وسائل نقل'], ans: '🥗 خضروات صحية' },
    { q: 'تصنيف العدد 10 والعدد 24 والعدد 100:', baskets: ['🔢 أعداد زوجية', '🎲 أعداد فردية', '🔤 حروف فرنسية'], ans: '🔢 أعداد زوجية' },
    { q: 'تصنيف كلمة "Pomme" و "Chat" و "Soleil":', baskets: ['🇫🇷 كلمات فرنسية', '🔢 عمليات حسابية', '🪐 كواكب المجموعة'], ans: '🇫🇷 كلمات فرنسية' }
  ];

  LumiGames.buildSorting = function(stage) {
    const item = SORTING_CHALLENGES[Math.floor(Math.random() * SORTING_CHALLENGES.length)];
    const opts = [...item.baskets].sort(() => Math.random() - 0.5);

    stage.innerHTML = `
      <div style="max-width:660px;margin:0 auto;text-align:center;">
        <div style="background:linear-gradient(135deg,#f3e8ff,#e9d5ff);border:2px solid #c084fc;border-radius:20px;padding:18px;margin-bottom:14px;">
          <div style="font-size:3rem;">🧺</div>
          <div style="font-size:1.25rem;font-weight:800;color:#581c87;margin-top:6px;">${item.q}</div>
        </div>
        <div id="sort-baskets" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(175px,1fr));gap:12px;"></div>
      </div>
    `;

    const box = stage.querySelector('#sort-baskets');
    opts.forEach(b => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.style.cssText = 'background:#fff;border:3px solid #d8b4fe;border-radius:18px;padding:16px 12px;font-size:1.15rem;font-weight:900;color:#3b0764;cursor:pointer;';
      btn.innerText = b;
      btn.onclick = () => {
        if (b === item.ans) {
          btn.style.background = '#dcfce7';
          btn.style.borderColor = '#16a34a';
          this.handleAnswer(true, 'sort_ok', true);
        } else {
          btn.style.background = '#fee2e2';
          btn.style.borderColor = '#dc2626';
          btn.classList.add('shake');
          this.handleAnswer(false, 'sort_err', false);
        }
      };
      box.appendChild(btn);
    });
  };

  // ==========================================
  // 2. ترقية لعبة مرآة المشاعر والمواقف (emotions)
  // ==========================================
  const EMOTION_SCENARIOS = [
    { q: 'حصلتِ على درجة ممتازة وهدية جميلة من بابا، ما هو شعورك؟', fr: 'Contente / Heureuse', ans: '😊 سعيدة ومبتهجة' },
    { q: 'انكسرت لعبتك المفضلة فجأة، ما هو الشعور المناسب؟', fr: 'Triste', ans: '😢 حزينة' },
    { q: 'رأيتِ مفاجأة رائعة غير متوقعة في عيد ميلادك!', fr: 'Surprise', ans: '😲 مندهشة ومتفاجئة' },
    { q: 'سمعتِ صوت رعد قوي في الليل المظلم، ما هو الشعور؟', fr: 'Effrayée', ans: '😨 خائفة قليلاً' },
    { q: 'شخص ما أخذ أدواتك دون استئذان، كيف تشعرين؟', fr: 'En colère', ans: '😠 غاضبة ومنزعجة' },
    { q: 'تستعدين للنوم بعد يوم طويل مليء باللعب والمذاكرة:', fr: 'Fatiguée', ans: '😴 متعبة ونعسانة' },
    { q: 'نجحتِ في مساعدة صديقتك في حل مسألة صعبة:', fr: 'Fière', ans: '🥰 فخورة ومطمئنة' }
  ];

  LumiGames.buildEmotions = function(stage) {
    const pool = [...EMOTION_SCENARIOS].sort(() => Math.random() - 0.5).slice(0, 4);
    const target = pool[0];
    const opts = [...pool].sort(() => Math.random() - 0.5);

    stage.innerHTML = `
      <div style="max-width:660px;margin:0 auto;text-align:center;">
        <div style="background:linear-gradient(135deg,#ffe4e6,#fecdd3);border:2px solid #fb7185;border-radius:20px;padding:18px;margin-bottom:14px;">
          <div style="font-size:2.8rem;">🎭</div>
          <div style="font-size:1.22rem;font-weight:800;color:#881337;margin-top:6px;">${target.q}</div>
        </div>
        <div id="emo-grid" style="display:grid;grid-template-columns:repeat(2,1fr);gap:12px;"></div>
      </div>
    `;

    const box = stage.querySelector('#emo-grid');
    opts.forEach(o => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.style.cssText = 'background:#fff;border:3px solid #fda4af;border-radius:18px;padding:16px 10px;font-size:1.15rem;font-weight:900;color:#1e293b;cursor:pointer;';
      btn.innerHTML = `<div>${o.ans}</div><small style="color:#be123c;">${o.fr}</small>`;
      btn.onclick = () => {
        if (o.ans === target.ans) {
          btn.style.background = '#dcfce7';
          btn.style.borderColor = '#16a34a';
          this.handleAnswer(true, 'emo_ok', true);
        } else {
          btn.style.background = '#fee2e2';
          btn.style.borderColor = '#dc2626';
          btn.classList.add('shake');
          this.handleAnswer(false, 'emo_err', false);
        }
      };
      box.appendChild(btn);
    });
  };

  // ==========================================
  // 3. ترقية لعبة روتيني والساعة (routine — قراءة الساعة + الروتين)
  // ==========================================
  const ROUTINE_CLOCK_QS = [
    { icon: '🌅', q: 'تشرق الشمس ونستيقظ في السابعة صباحاً (07:00) لنتناول:', ans: 'وجبة الإفطار والذهاب للمدرسة 🥐' },
    { icon: '🕛', q: 'عندما تكون الساعة الثانية عشرة ظهراً (12:00 Midi):', ans: 'منتصف النهار ووقت الظهيرة ☀️' },
    { icon: '🌙', q: 'في التاسعة مساءً (21:00) نغسل أسناننا بالفرشاة ونستعد لـ:', ans: 'النوم المريح وقصة قبل النوم 🛏️' },
    { icon: '🕒', q: 'عقرب الساعات على 3 وعقرب الدقائق على 12، كم الساعة؟', ans: 'الثالثة تماماً (Il est trois heures) 🕒' },
    { icon: '🕕', q: 'عقرب الساعات على 6 وعقرب الدقائق على 12، كم الساعة؟', ans: 'السادسة تماماً (Il est six heures) 🕕' },
    { icon: '🕣', q: 'الساعة الثامنة والنصف (08:30)، كم دقيقة في نصف الساعة؟', ans: '30 دقيقة (Une demi-heure) ⏱️' }
  ];

  LumiGames.buildRoutine = function(stage) {
    const pool = [...ROUTINE_CLOCK_QS].sort(() => Math.random() - 0.5).slice(0, 3);
    const target = pool[0];
    const opts = [...pool].sort(() => Math.random() - 0.5);

    stage.innerHTML = `
      <div style="max-width:660px;margin:0 auto;text-align:center;">
        <div style="background:linear-gradient(135deg,#e0f2fe,#bae6fd);border:2px solid #38bdf8;border-radius:20px;padding:18px;margin-bottom:14px;">
          <div style="font-size:3.2rem;">${target.icon}</div>
          <div style="font-size:1.22rem;font-weight:800;color:#0c4a6e;margin-top:6px;">${target.q}</div>
        </div>
        <div id="rot-grid" style="display:grid;grid-template-columns:1fr;gap:10px;"></div>
      </div>
    `;

    const box = stage.querySelector('#rot-grid');
    opts.forEach(o => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.style.cssText = 'background:#fff;border:3px solid #7dd3fc;border-radius:16px;padding:14px;font-size:1.15rem;font-weight:900;color:#0f172a;cursor:pointer;';
      btn.innerText = o.ans;
      btn.onclick = () => {
        if (o.ans === target.ans) {
          btn.style.background = '#dcfce7';
          btn.style.borderColor = '#16a34a';
          this.handleAnswer(true, 'rot_ok', true);
        } else {
          btn.style.background = '#fee2e2';
          btn.style.borderColor = '#dc2626';
          btn.classList.add('shake');
          this.handleAnswer(false, 'rot_err', false);
        }
      };
      box.appendChild(btn);
    });
  };

  // ==========================================
  // 4. ترقية لعبة ميزان المنطق والمعادلات (balance)
  // ==========================================
  LumiGames.buildBalance = function(stage) {
    const lvl = this.currentLevel || 1;
    const isHard = lvl >= 4;
    let leftText = '';
    let knownRight = 0;
    let totalWeight = 0;

    if (!isHard) {
      totalWeight = Math.floor(Math.random() * 8) + 4;
      knownRight = Math.floor(Math.random() * (totalWeight - 1)) + 1;
      leftText = `🐰 × ${totalWeight}`;
    } else {
      const a = Math.floor(Math.random() * 6) + 4;
      const b = Math.floor(Math.random() * 6) + 3;
      totalWeight = a + b;
      knownRight = Math.floor(Math.random() * 6) + 2;
      leftText = `${a} + ${b}`;
    }

    const missing = totalWeight - knownRight;
    const set = new Set([missing]);
    while (set.size < 4) {
      const fake = missing + (Math.floor(Math.random() * 4) + 1) * (Math.random() > 0.5 ? 1 : -1);
      if (fake > 0) set.add(fake);
    }
    const opts = [...set].sort(() => Math.random() - 0.5);

    stage.innerHTML = `
      <div style="max-width:660px;margin:0 auto;text-align:center;">
        <div style="background:linear-gradient(135deg,#ede9fe,#ddd6fe);border:2px solid #8b5cf6;border-radius:20px;padding:18px;margin-bottom:14px;">
          <div style="font-size:2.8rem;">⚖️</div>
          <div style="font-size:1.2rem;font-weight:800;color:#4c1d95;margin:6px 0;">وازني كفتي الميزان! ما هو العدد المجهول (❓)؟</div>
          <div dir="ltr" style="display:flex;justify-content:center;align-items:center;gap:14px;margin-top:12px;font-size:1.35rem;font-weight:900;">
            <span style="background:#fff;border:2.5px solid #7c3aed;border-radius:14px;padding:10px 16px;color:#4c1d95;">${leftText}</span>
            <span style="font-size:1.8rem;color:#7c3aed;">=</span>
            <span style="background:#fef08a;border:2.5px solid #eab308;border-radius:14px;padding:10px 16px;color:#713f12;">${knownRight} + ❓</span>
          </div>
        </div>
        <div id="bal-opts" style="display:grid;grid-template-columns:repeat(2,1fr);gap:12px;"></div>
      </div>
    `;

    const box = stage.querySelector('#bal-opts');
    opts.forEach(val => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.style.cssText = 'background:#fff;border:3px solid #c4b5fd;border-radius:16px;padding:16px;font-size:1.6rem;font-weight:900;color:#4c1d95;cursor:pointer;';
      btn.innerText = `+ ${val}`;
      btn.onclick = () => {
        if (val === missing) {
          btn.style.background = '#dcfce7';
          btn.style.borderColor = '#16a34a';
          this.handleAnswer(true, 'bal_ok', true);
        } else {
          btn.style.background = '#fee2e2';
          btn.style.borderColor = '#dc2626';
          btn.classList.add('shake');
          this.handleAnswer(false, 'bal_err', false);
        }
      };
      box.appendChild(btn);
    });
  };
})();
