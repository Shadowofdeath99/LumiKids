(function() {
  if (typeof LumiDictionary === 'undefined' || typeof LumiGames === 'undefined') return;

  const NEW_GAMES_BATCH_10 = [
    { id: 'champion_quiz_cm1', icon: '🏆', nameEg: 'بطولة الأبطال الشاملة', nameFr: 'Grand Quiz CM1', domain: 'logic', minAge: 6 },
    { id: 'prime_patterns_cm1', icon: '🔢', nameEg: 'الأعداد الزوجية والفردية', nameFr: 'Pairs et Impairs', domain: 'math', minAge: 6 },
    { id: 'french_dialogues_pro', icon: '🇫🇷', nameEg: 'حوارات الفرنسية اليومية', nameFr: 'Dialogues Français', domain: 'lang', minAge: 6 },
    { id: 'inventors_lab_cm1', icon: '💡', nameEg: 'مخترعون غيروا العالم', nameFr: 'Grands Inventeurs', domain: 'sciences', minAge: 6 },
    { id: 'helen_birthday_party', icon: '🎂', nameEg: 'حفلة هيلن السعيدة', nameFr: 'Fête d’Anniversaire', domain: 'discovery', minAge: 3 },
    { id: 'helen_sky_stars', icon: '🌟', nameEg: 'نجوم وسماء هيلن', nameFr: 'Le Ciel et les Étoiles', domain: 'discovery', minAge: 3 }
  ];

  LumiDictionary.games = LumiDictionary.games || [];
  LumiDictionary.gameInstructions = LumiDictionary.gameInstructions || [];

  NEW_GAMES_BATCH_10.forEach(g => {
    if (!LumiDictionary.games.some(x => x.id === g.id)) {
      LumiDictionary.games.push(g);
    }
  });

  const BATCH_10_INSTRUCTIONS = [
    { id: 'inst_champ_100', gameId: 'champion_quiz_cm1', eg: 'أهلاً بكِ في بطولة الأبطال الكبرى! اختاري الإجابة الصحيحة.', fr: 'Bienvenue au Grand Quiz des Champions !' },
    { id: 'inst_prime_100', gameId: 'prime_patterns_cm1', eg: 'حددي نوع العدد (زوجي أم فردي أم من المضاعفات) يا عبقرية!', fr: 'Trouve le nombre pair ou impair !' },
    { id: 'inst_fr_dial_100', gameId: 'french_dialogues_pro', eg: 'اختاري الرد الفرنسي الصحيح في المحادثة!', fr: 'Choisis la bonne réponse dans le dialogue !' },
    { id: 'inst_invent_100', gameId: 'inventors_lab_cm1', eg: 'اكتشفي من اخترع هذه الاختراعات الرائعة!', fr: 'Découvre les grands inventeurs !' },
    { id: 'inst_helen_bday', gameId: 'helen_birthday_party', eg: 'يا هيلن، اختاري زينة الحفلة الجميلة المطلوبة!', fr: 'Choisis le bon élément de la fête !' },
    { id: 'inst_helen_sky', gameId: 'helen_sky_stars', eg: 'يا هيلن، أين النجمة أو القمر المطلوب في السماء؟', fr: 'Où est l’élément du ciel demandé ?' }
  ];

  BATCH_10_INSTRUCTIONS.forEach(ins => {
    if (!LumiDictionary.gameInstructions.some(x => x.gameId === ins.gameId)) {
      LumiDictionary.gameInstructions.push(ins);
    }
  });

  const CHAMP_QS = [
    { q: 'ما هي عاصمة جمهورية مصر العربية؟', fr: 'Quelle est la capitale de l’Égypte ?', icon: '🇪🇬', opts: ['القاهرة (Le Caire)', 'الإسكندرية (Alexandrie)', 'أسوان (Assouan)'], ans: 'القاهرة (Le Caire)' },
    { q: 'ما هي عاصمة فرنسا؟', fr: 'Quelle est la capitale de la France ?', icon: '🇫🇷', opts: ['باريس (Paris)', 'ليون (Lyon)', 'مارسيليا (Marseille)'], ans: 'باريس (Paris)' },
    { q: 'كم عدد ألوان قوس قزح؟', fr: 'Combien de couleurs dans l’arc-en-ciel ?', icon: '🌈', opts: ['7 ألوان', '5 ألوان', '10 ألوان'], ans: '7 ألوان' },
    { q: 'ما هو أسرع حيوان بري في العالم؟', fr: 'Quel est l’animal terrestre le plus rapide ?', icon: '🐆', opts: ['الفهد الصياد (Le Guépard)', 'الأسد (Le Lion)', 'الحصان (Le Cheval)'], ans: 'الفهد الصياد (Le Guépard)' },
    { q: 'كم يوماً في السنة العادية (غير الكبيسة)؟', fr: 'Combien de jours dans une année normale ?', icon: '📅', opts: ['365 يوماً', '300 يوم', '400 يوم'], ans: '365 يوماً' }
  ];

  const FR_DIALOGUE_QS = [
    { q: 'Comment tu t’appelles ? (ما اسمك؟)', fr: 'اختر الرد المناسب بالفرنسية', icon: '👋', opts: ['Je m’appelle Heaven.', 'Il fait beau aujourd’hui.', 'J’ai dix pommes.'], ans: 'Je m’appelle Heaven.' },
    { q: 'Quel âge as-tu ? (كم عمرك؟)', fr: 'اختر الرد المناسب بالفرنسية', icon: '🎂', opts: ['J’ai dix ans.', 'Je vais à l’école.', 'Merci beaucoup.'], ans: 'J’ai dix ans.' },
    { q: 'Comment ça va ? (كيف حالك؟)', fr: 'اختر الرد المناسب بالفرنسية', icon: '😊', opts: ['Ça va très bien, merci !', 'À demain matin.', 'C’est un livre.'], ans: 'Ça va très bien, merci !' },
    { q: 'Quelle heure est-il ? (كم الساعة؟)', fr: 'اختر الرد المناسب بالفرنسية', icon: '⌚', opts: ['Il est huit heures.', 'Je suis contente.', 'Bonjour maman.'], ans: 'Il est huit heures.' }
  ];

  const INVENTORS_QS = [
    { q: 'من هو العالم الذي اخترع المصباح الكهربائي؟', fr: 'Qui a inventé l’ampoule électrique ?', icon: '💡', opts: ['توماس إديسون (Thomas Edison)', 'الأخوان رايت (Frères Wright)', 'إسحاق نيوتن (Isaac Newton)'], ans: 'توماس إديسون (Thomas Edison)' },
    { q: 'من هما الأخوان اللذان نجحا في صنع أول طائرة تطير في السماء؟', fr: 'Qui a inventé le premier avion ?', icon: '✈️', opts: ['الأخوان رايت (Les frères Wright)', 'غراهام بيل (Graham Bell)', 'غاليليو (Galilée)'], ans: 'الأخوان رايت (Les frères Wright)' },
    { q: 'من اخترع الهاتف للتواصل الصوتي عن بُعد؟', fr: 'Qui a inventé le téléphone ?', icon: '☎️', opts: ['ألكسندر غراهام بيل (Graham Bell)', 'لويس باستور (Louis Pasteur)', 'ماركوني (Marconi)'], ans: 'ألكسندر غراهام بيل (Graham Bell)' },
    { q: 'ما هو الاختراع الذي نستخدمه لرؤية الكواكب والنجوم البعيدة؟', fr: 'Quel instrument permet d’observer les planètes ?', icon: '🔭', opts: ['التلسكوب (Le Télescope)', 'المجهر (Le Microscope)', 'الترمومتر (Le Thermomètre)'], ans: 'التلسكوب (Le Télescope)' }
  ];

  const HELEN_PARTY = [
    { name: 'كعكة عيد الميلاد (Le Gâteau)', icon: '🎂' },
    { name: 'البالون الملون (Le Ballon)', icon: '🎈' },
    { name: 'الهدية الجميلة (Le Cadeau)', icon: '🎁' },
    { name: 'التاج الذهبي (La Couronne)', icon: '👑' },
    { name: 'الحلوى اللذيذة (Les Bonbons)', icon: '🍬' }
  ];

  const HELEN_SKY = [
    { name: 'النجمة المضيئة (L’Étoile)', icon: '⭐' },
    { name: 'القمر الفضي (La Lune)', icon: '🌙' },
    { name: 'الشمس الدافئة (Le Soleil)', icon: '☀️' },
    { name: 'السحابة البيضاء (Le Nuage)', icon: '☁️' },
    { name: 'صاروخ الفضاء (La Fusée)', icon: '🚀' }
  ];

  function speakNow(txt) {
    if (window.LumiQuestionVoice && typeof LumiQuestionVoice.speak === 'function') {
      LumiQuestionVoice.speak(txt);
    } else if (window.LumiAudio && typeof LumiAudio.speak === 'function') {
      LumiAudio.speak('q_custom10', txt, '');
    }
  }

  function renderBatch10UI(stage, badge, icon, questionText, subText, options, correctAns, speakOverride) {
    stage.innerHTML = `
      <div style="background:linear-gradient(135deg,#eef2ff,#e0e7ff);border:2px solid #818cf8;border-radius:20px;padding:18px;text-align:center;max-width:650px;margin:0 auto;">
        <div style="display:inline-block;background:#4338ca;color:#fff;padding:4px 14px;border-radius:999px;font-size:0.85rem;font-weight:700;margin-bottom:10px;">${badge}</div>
        <div style="font-size:3.6rem;margin:6px 0;">${icon}</div>
        <h3 style="font-size:1.3rem;color:#1e1b4b;margin:8px 0;line-height:1.5;">${questionText}</h3>
        ${subText ? `<p style="color:#3730a3;font-size:1.02rem;font-weight:700;margin:4px 0 12px;">${subText}</p>` : ''}
        <button type="button" id="b10-listen-btn" style="background:linear-gradient(135deg,#0ea5e9,#2563eb);color:#fff;border:none;border-radius:12px;padding:8px 18px;font-size:1rem;font-weight:700;cursor:pointer;margin-bottom:16px;">🔊 استمع للسؤال</button>
        <div id="b10-opts" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(165px,1fr));gap:12px;"></div>
      </div>
    `;

    const voiceTxt = speakOverride || questionText;
    stage.querySelector('#b10-listen-btn').onclick = () => speakNow(voiceTxt);
    setTimeout(() => speakNow(voiceTxt), 250);

    const box = stage.querySelector('#b10-opts');
    options.forEach(opt => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.style.cssText = 'background:#fff;border:2px solid #c7d2fe;border-radius:16px;padding:14px 10px;font-size:1.15rem;font-weight:800;color:#0f172a;cursor:pointer;transition:transform 0.15s,background 0.2s;';
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

    if (!stage || !NEW_GAMES_BATCH_10.some(g => g.id === gid)) {
      return prevRender();
    }

    const meta = NEW_GAMES_BATCH_10.find(g => g.id === gid);
    const titleEl = document.getElementById('game-title');
    if (titleEl && meta) titleEl.innerHTML = `${meta.icon} ${meta.nameEg} <small>(${meta.nameFr})</small>`;
    const lvlEl = document.getElementById('game-level-badge');
    if (lvlEl) lvlEl.innerText = `المستوى ${this.currentLevel || 1} / 10`;

    if (gid === 'champion_quiz_cm1') {
      const item = CHAMP_QS[Math.floor(Math.random() * CHAMP_QS.length)];
      const opts = [...item.opts].sort(() => Math.random() - 0.5);
      return renderBatch10UI(stage, '🏆 بطولة الأبطال الكبرى', item.icon, item.q, item.fr, opts, item.ans);
    }

    if (gid === 'prime_patterns_cm1') {
      const n = Math.floor(Math.random() * 88) + 11;
      const isEven = n % 2 === 0;
      const ans = isEven ? 'عدد زوجي (Nombre Pair)' : 'عدد فردي (Nombre Impair)';
      const opts = ['عدد زوجي (Nombre Pair)', 'عدد فردي (Nombre Impair)', 'يساوي صفراً (Zéro)'];
      return renderBatch10UI(stage, '🔢 تصنيف الأعداد CM1', '🎲', `هل العدد <span dir="ltr" style="font-size:1.6rem;color:#312e81;">${n}</span> زوجي أم فردي؟`, 'Pair ou Impair ?', opts, ans, `هل العدد ${n} زوجي أم فردي؟`);
    }

    if (gid === 'french_dialogues_pro') {
      const item = FR_DIALOGUE_QS[Math.floor(Math.random() * FR_DIALOGUE_QS.length)];
      const opts = [...item.opts].sort(() => Math.random() - 0.5);
      return renderBatch10UI(stage, '🇫🇷 محادثات فرنسية', item.icon, `<span dir="ltr">${item.q}</span>`, item.fr, opts, item.ans, item.q.split('(')[0].trim());
    }

    if (gid === 'inventors_lab_cm1') {
      const item = INVENTORS_QS[Math.floor(Math.random() * INVENTORS_QS.length)];
      const opts = [...item.opts].sort(() => Math.random() - 0.5);
      return renderBatch10UI(stage, '💡 مخترعون واكتشافات', item.icon, item.q, item.fr, opts, item.ans);
    }

    if (gid === 'helen_birthday_party') {
      const pool = [...HELEN_PARTY].sort(() => Math.random() - 0.5).slice(0, 3);
      const target = pool[0];
      const opts = [...pool].sort(() => Math.random() - 0.5).map(x => ({
        label: `<div style="font-size:3.2rem;">${x.icon}</div><div>${x.name}</div>`,
        value: x.name
      }));
      return renderBatch10UI(stage, '🎂 حفلة هيلن', '🎉', `يا هيلن، اختاري ${target.name}`, '', opts, target.name);
    }

    if (gid === 'helen_sky_stars') {
      const pool = [...HELEN_SKY].sort(() => Math.random() - 0.5).slice(0, 3);
      const target = pool[0];
      const opts = [...pool].sort(() => Math.random() - 0.5).map(x => ({
        label: `<div style="font-size:3.3rem;">${x.icon}</div><div>${x.name}</div>`,
        value: x.name
      }));
      return renderBatch10UI(stage, '🌟 سماء هيلن', '✨', `أين ${target.name} في السماء؟`, '', opts, target.name);
    }
  };
})();
