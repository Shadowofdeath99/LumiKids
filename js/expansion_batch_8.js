(function() {
  if (typeof LumiDictionary === 'undefined' || typeof LumiGames === 'undefined') return;

  const NEW_GAMES_BATCH_8 = [
    { id: 'division_word_cm1', icon: '➗', nameEg: 'القسمة والتوزيع CM1', nameFr: 'Division et Partage', domain: 'math', minAge: 6 },
    { id: 'reading_comprehension_pro', icon: '📚', nameEg: 'الفهم القرائي السريع', nameFr: 'Compréhension de Lecture', domain: 'lang', minAge: 6 },
    { id: 'compass_directions_cm1', icon: '🧭', nameEg: 'البوصلة والاتجاهات', nameFr: 'Les Points Cardinaux', domain: 'geo', minAge: 6 },
    { id: 'helen_face_parts', icon: '👀', nameEg: 'وجه هيلن الجميل', nameFr: 'Les Parties du Visage', domain: 'discovery', minAge: 3 },
    { id: 'helen_color_mix', icon: '🎨', nameEg: 'ألوان هيلن السحرية', nameFr: 'Mélange des Couleurs', domain: 'discovery', minAge: 3 }
  ];

  LumiDictionary.games = LumiDictionary.games || [];
  LumiDictionary.gameInstructions = LumiDictionary.gameInstructions || [];

  NEW_GAMES_BATCH_8.forEach(g => {
    if (!LumiDictionary.games.some(x => x.id === g.id)) {
      LumiDictionary.games.push(g);
    }
  });

  const BATCH_8_INSTRUCTIONS = [
    { id: 'inst_div_cm1', gameId: 'division_word_cm1', eg: 'وزّعي بالتساوي واحسبي ناتج القسمة الصحيح يا بطلة!', fr: 'Partage équitablement et trouve le quotient !' },
    { id: 'inst_read_pro', gameId: 'reading_comprehension_pro', eg: 'اقرئي الفقرة القصيرة بتركيز واختاري الإجابة الصحيحة!', fr: 'Lis attentivement et réponds à la question !' },
    { id: 'inst_compass', gameId: 'compass_directions_cm1', eg: 'حددي الاتجاه الصحيح على البوصلة!', fr: 'Choisis la bonne direction sur la boussole !' },
    { id: 'inst_helen_face', gameId: 'helen_face_parts', eg: 'يا هيلن، أين العين أو الأنف أو الفم المطلوب؟', fr: 'Où est la partie du visage demandée ?' },
    { id: 'inst_helen_mix', gameId: 'helen_color_mix', eg: 'يا هيلن، ماذا ينتج عندما نخلط هذين اللونين الجميلين؟', fr: 'Quelle couleur obtient-on en mélangeant ?' }
  ];

  BATCH_8_INSTRUCTIONS.forEach(ins => {
    if (!LumiDictionary.gameInstructions.some(x => x.gameId === ins.gameId)) {
      LumiDictionary.gameInstructions.push(ins);
    }
  });

  const READ_QS = [
    { q: '«ذهبت هيفن إلى المكتبة صباحاً واستعارت كتاباً عن الفضاء». متى ذهبت هيفن إلى المكتبة؟', fr: 'Quand Heaven est-elle allée à la bibliothèque ?', icon: '📖', opts: ['صباحاً (Le matin)', 'ليلاً (La nuit)', 'في منتصف الليل (Minuit)'], ans: 'صباحاً (Le matin)' },
    { q: '«Le chat blanc dort sur le tapis rouge». Où dort le chat ?', fr: 'أين ينام القط الأبيض؟', icon: '🐱', opts: ['Sur le tapis rouge (على السجادة الحمراء)', 'Dans le jardin (في الحديقة)', 'Sur la table (فوق الطاولة)'], ans: 'Sur le tapis rouge (على السجادة الحمراء)' },
    { q: '«تشرق الشمس من جهة الشرق وتغرب من جهة الغرب». من أين تشرق الشمس؟', fr: 'Où se lève le Soleil ?', icon: '🌅', opts: ['من جهة الشرق (À l’Est)', 'من جهة الغرب (À l’Ouest)', 'من جهة الشمال (Au Nord)'], ans: 'من جهة الشرق (À l’Est)' },
    { q: '«Mina prépare un gâteau aux fraises pour sa famille». Quel fruit utilise Mina ?', fr: 'ما الفاكهة التي استخدمها مينا؟', icon: '🍓', opts: ['Des fraises (الفراولة)', 'Des bananes (الموز)', 'Des pommes (التفاح)'], ans: 'Des fraises (الفراولة)' }
  ];

  const COMPASS_QS = [
    { q: 'ما هو الاتجاه المقابل (المعاكس) للشمال (Nord)؟', fr: 'Quel est l’opposé du Nord ?', icon: '🧭', opts: ['الجنوب (Le Sud)', 'الشرق (L’Est)', 'الغرب (L’Ouest)'], ans: 'الجنوب (Le Sud)' },
    { q: 'ما هو الاتجاه المقابل (المعاكس) للشرق (Est)؟', fr: 'Quel est l’opposé de l’Est ?', icon: '🗺️', opts: ['الغرب (L’Ouest)', 'الشمال (Le Nord)', 'الجنوب (Le Sud)'], ans: 'الغرب (L’Ouest)' },
    { q: 'يقع البحر الأبيض المتوسط في أي جهة من مصر (الإسكندرية)؟', fr: 'Où se trouve la mer Méditerranée en Égypte ?', icon: '🌊', opts: ['في الشمال (Au Nord)', 'في الجنوب (Au Sud)', 'في الغرب (À l’Ouest)'], ans: 'في الشمال (Au Nord)' },
    { q: 'يقع البحر الأحمر في أي جهة من مصر؟', fr: 'Où se trouve la mer Rouge en Égypte ?', icon: '🐠', opts: ['في الشرق (À l’Est)', 'في الغرب (À l’Ouest)', 'في الشمال (Au Nord)'], ans: 'في الشرق (À l’Est)' }
  ];

  const HELEN_FACE = [
    { name: 'العين الجميلة (L’Œil)', icon: '👁️' },
    { name: 'الأنف الصغير (Le Nez)', icon: '👃' },
    { name: 'الفم المبتسم (La Bouche)', icon: '👄' },
    { name: 'الأذن (L’Oreille)', icon: '👂' },
    { name: 'اليد اللطيفة (La Main)', icon: '✋' }
  ];

  const HELEN_MIXES = [
    { q: 'أحمر 🔴 + أصفر 🟡 = ؟', ans: 'برتقالي (Orange) 🟠', opts: ['برتقالي (Orange) 🟠', 'أزرق (Bleu) 🔵', 'أسود (Noir) ⚫'] },
    { q: 'أزرق 🔵 + أصفر 🟡 = ؟', ans: 'أخضر (Vert) 🟢', opts: ['أخضر (Vert) 🟢', 'أحمر (Rouge) 🔴', 'وردي (Rose) 🌸'] },
    { q: 'أحمر 🔴 + أزرق 🔵 = ؟', ans: 'بنفسجي (Violet) 🟣', opts: ['بنفسجي (Violet) 🟣', 'أصفر (Jaune) 🟡', 'أبيض (Blanc) ⚪'] },
    { q: 'أحمر 🔴 + أبيض ⚪ = ؟', ans: 'وردي جميل (Rose) 🌸', opts: ['وردي جميل (Rose) 🌸', 'أخضر (Vert) 🟢', 'بني (Marron) 🟤'] }
  ];

  function speakNow(txt) {
    if (window.LumiQuestionVoice && typeof LumiQuestionVoice.speak === 'function') {
      LumiQuestionVoice.speak(txt);
    } else if (window.LumiAudio && typeof LumiAudio.speak === 'function') {
      LumiAudio.speak('q_custom8', txt, '');
    }
  }

  function renderBatch8UI(stage, badge, icon, questionText, subText, options, correctAns) {
    stage.innerHTML = `
      <div style="background:linear-gradient(135deg,#f0fdfa,#ccfbf1);border:2px solid #5eead4;border-radius:20px;padding:18px;text-align:center;max-width:650px;margin:0 auto;">
        <div style="display:inline-block;background:#0d9488;color:#fff;padding:4px 14px;border-radius:999px;font-size:0.85rem;font-weight:700;margin-bottom:10px;">${badge}</div>
        <div style="font-size:3.6rem;margin:6px 0;">${icon}</div>
        <h3 style="font-size:1.3rem;color:#134e4a;margin:8px 0;line-height:1.5;">${questionText}</h3>
        ${subText ? `<p style="color:#0f766e;font-size:1.02rem;font-weight:700;margin:4px 0 12px;">${subText}</p>` : ''}
        <button type="button" id="b8-listen-btn" style="background:linear-gradient(135deg,#0ea5e9,#2563eb);color:#fff;border:none;border-radius:12px;padding:8px 18px;font-size:1rem;font-weight:700;cursor:pointer;margin-bottom:16px;">🔊 استمع للسؤال</button>
        <div id="b8-opts" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(165px,1fr));gap:12px;"></div>
      </div>
    `;

    stage.querySelector('#b8-listen-btn').onclick = () => speakNow(questionText);
    setTimeout(() => speakNow(questionText), 250);

    const box = stage.querySelector('#b8-opts');
    options.forEach(opt => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.style.cssText = 'background:#fff;border:2px solid #99f6e4;border-radius:16px;padding:14px 10px;font-size:1.15rem;font-weight:800;color:#0f172a;cursor:pointer;transition:transform 0.15s,background 0.2s;';
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

    if (!stage || !NEW_GAMES_BATCH_8.some(g => g.id === gid)) {
      return prevRender();
    }

    const meta = NEW_GAMES_BATCH_8.find(g => g.id === gid);
    const titleEl = document.getElementById('game-title');
    if (titleEl && meta) titleEl.innerHTML = `${meta.icon} ${meta.nameEg} <small>(${meta.nameFr})</small>`;
    const lvlEl = document.getElementById('game-level-badge');
    if (lvlEl) lvlEl.innerText = `المستوى ${this.currentLevel || 1} / 10`;

    if (gid === 'division_word_cm1') {
      const divisor = [2, 3, 4, 5, 6][Math.floor(Math.random() * 5)];
      const quotient = Math.floor(Math.random() * 8) + 2;
      const dividend = divisor * quotient;
      const qTxt = `لدينا ${dividend} قطعة حلوى نريد توزيعها بالتساوي على ${divisor} أصدقاء، كم يأخذ كل صديق؟ (${dividend} ÷ ${divisor})`;
      const frTxt = `Partage ${dividend} bonbons entre ${divisor} amis`;
      const set = new Set([String(quotient)]);
      while (set.size < 3) {
        const fake = quotient + (Math.floor(Math.random() * 4) + 1) * (Math.random() > 0.5 ? 1 : -1);
        if (fake > 0) set.add(String(fake));
      }
      return renderBatch8UI(stage, '➗ القسمة والتوزيع CM1', '🍬', qTxt, frTxt, [...set].sort(() => Math.random() - 0.5), String(quotient));
    }

    if (gid === 'reading_comprehension_pro') {
      const item = READ_QS[Math.floor(Math.random() * READ_QS.length)];
      const opts = [...item.opts].sort(() => Math.random() - 0.5);
      return renderBatch8UI(stage, '📚 الفهم القرائي', item.icon, item.q, item.fr, opts, item.ans);
    }

    if (gid === 'compass_directions_cm1') {
      const item = COMPASS_QS[Math.floor(Math.random() * COMPASS_QS.length)];
      const opts = [...item.opts].sort(() => Math.random() - 0.5);
      return renderBatch8UI(stage, '🧭 الاتجاهات الأربعة', item.icon, item.q, item.fr, opts, item.ans);
    }

    if (gid === 'helen_face_parts') {
      const pool = [...HELEN_FACE].sort(() => Math.random() - 0.5).slice(0, 3);
      const target = pool[0];
      const opts = [...pool].sort(() => Math.random() - 0.5).map(x => ({
        label: `<div style="font-size:3.2rem;">${x.icon}</div><div>${x.name}</div>`,
        value: x.name
      }));
      return renderBatch8UI(stage, '👀 وجه هيلن الجميل', '😊', `يا هيلن، أين ${target.name}؟`, '', opts, target.name);
    }

    if (gid === 'helen_color_mix') {
      const item = HELEN_MIXES[Math.floor(Math.random() * HELEN_MIXES.length)];
      const opts = [...item.opts].sort(() => Math.random() - 0.5);
      return renderBatch8UI(stage, '🎨 ألوان هيلن السحرية', '🖌️', `ماذا ينتج عند خلط: ${item.q}`, '', opts, item.ans);
    }
  };
})();
