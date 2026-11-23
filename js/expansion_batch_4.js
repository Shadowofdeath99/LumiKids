(function() {
  if (typeof LumiDictionary === 'undefined' || typeof LumiGames === 'undefined') return;

  const NEW_GAMES_BATCH_4 = [
    { id: 'french_verbs_cm1', icon: '🇫🇷', nameEg: 'تصريف الأفعال الفرنسية', nameFr: 'Conjugaison CM1', domain: 'lang', minAge: 6 },
    { id: 'multiplication_pro_cm1', icon: '✖️', nameEg: 'بطلة جدول الضرب', nameFr: 'Tables de Multiplication', domain: 'math', minAge: 6 },
    { id: 'riddles_brain_pro', icon: '💡', nameEg: 'فوازير وألغاز الأذكياء', nameFr: 'Énigmes Intelligentes', domain: 'logic', minAge: 6 },
    { id: 'helen_healthy_food', icon: '🥗', nameEg: 'أطباق هيلن الصحية', nameFr: 'Aliments Sains', domain: 'discovery', minAge: 3 },
    { id: 'helen_baby_animals', icon: '🐣', nameEg: 'صغار الحيوانات اللطيفة', nameFr: 'Bébés Animaux', domain: 'discovery', minAge: 3 }
  ];

  LumiDictionary.games = LumiDictionary.games || [];
  LumiDictionary.gameInstructions = LumiDictionary.gameInstructions || [];

  NEW_GAMES_BATCH_4.forEach(g => {
    if (!LumiDictionary.games.some(x => x.id === g.id)) {
      LumiDictionary.games.push(g);
    }
  });

  const BATCH_4_INSTRUCTIONS = [
    { id: 'inst_fr_verbs', gameId: 'french_verbs_cm1', eg: 'اختاري تصريف الفعل الفرنسي الصحيح في الجملة!', fr: 'Choisis la bonne conjugaison du verbe !' },
    { id: 'inst_mult_pro', gameId: 'multiplication_pro_cm1', eg: 'احسبي حاصل الضرب الصحيح بسرعة يا بطلة!', fr: 'Trouve le bon produit de la multiplication !' },
    { id: 'inst_riddles', gameId: 'riddles_brain_pro', eg: 'فكّري بذكاء وحلّي الفزورة الممتعة!', fr: 'Trouve la réponse à l’énigme !' },
    { id: 'inst_helen_food', gameId: 'helen_healthy_food', eg: 'يا هيلن، اختاري الطعام الصحي اللذيذ المطلوب!', fr: 'Choisis le bon aliment sain !' },
    { id: 'inst_helen_babies', gameId: 'helen_baby_animals', eg: 'يا هيلن، أين صغير الحيوان اللطيف؟', fr: 'Où est le petit animal ?' }
  ];

  BATCH_4_INSTRUCTIONS.forEach(ins => {
    if (!LumiDictionary.gameInstructions.some(x => x.gameId === ins.gameId)) {
      LumiDictionary.gameInstructions.push(ins);
    }
  });

  const FRENCH_VERBS_QS = [
    { q: 'Nous ______ très contents aujourd’hui. (Verbe être)', fr: 'Nous sommes très contents aujourd’hui.', icon: '😊', opts: ['sommes', 'êtes', 'sont'], ans: 'sommes', full: 'Nous sommes très contents aujourd’hui.' },
    { q: 'Elle ______ un beau livre d’histoires. (Verbe avoir)', fr: 'Elle a un beau livre d’histoires.', icon: '📖', opts: ['a', 'as', 'ont'], ans: 'a', full: 'Elle a un beau livre d’histoires.' },
    { q: 'Je ______ à l’école chaque matin. (Verbe aller)', fr: 'Je vais à l’école chaque matin.', icon: '🎒', opts: ['vais', 'vas', 'va'], ans: 'vais', full: 'Je vais à l’école chaque matin.' },
    { q: 'Vous ______ vos devoirs avec soin. (Verbe faire)', fr: 'Vous faites vos devoirs avec soin.', icon: '✍️', opts: ['faites', 'faisons', 'font'], ans: 'faites', full: 'Vous faites vos devoirs avec soin.' },
    { q: 'Ils ______ dans le jardin. (Verbe jouer)', fr: 'Ils jouent dans le jardin.', icon: '🌳', opts: ['jouent', 'joue', 'jouons'], ans: 'jouent', full: 'Ils jouent dans le jardin.' }
  ];

  const RIDDLES_QS = [
    { q: 'شيء له عقارب ولا يلسع، ويدور حول نفسه ليخبرنا بالوقت، فما هو؟', fr: 'J’ai des aiguilles mais je ne pique pas. Qui suis-je ?', icon: '⏰', opts: ['الساعة (L’horloge)', 'النحلة (L’abeille)', 'البوصلة (La boussole)'], ans: 'الساعة (L’horloge)' },
    { q: 'ما هو الشيء الذي يكتب ولا يقرأ، ويساعدنا في المدرسة؟', fr: 'J’écris mais je ne sais pas lire. Qui suis-je ?', icon: '✏️', opts: ['القلم (Le stylo)', 'الكتاب (Le livre)', 'الممحاة (La gomme)'], ans: 'القلم (Le stylo)' },
    { q: 'لونه أزرق شاسع، تعيش فيه الأسماك وتبحر فيه السفن، فما هو؟', fr: 'Je suis grand et bleu, plein de poissons. Qui suis-je ?', icon: '🌊', opts: ['البحر (La mer)', 'الصحراء (Le désert)', 'الغابة (La forêt)'], ans: 'البحر (La mer)' },
    { q: 'يظهر في السماء ليلاً وينير الظلام بنوره الفضي الجميل، فما هو؟', fr: 'Je brille la nuit dans le ciel. Qui suis-je ?', icon: '🌙', opts: ['القمر (La lune)', 'السحاب (Le nuage)', 'قوس قزح (L’arc-en-ciel)'], ans: 'القمر (La lune)' },
    { q: 'له أوراق وليس شجرة، ويعلمنا القصص والعلوم، فما هو؟', fr: 'J’ai des feuilles mais je ne suis pas un arbre. Qui suis-je ?', icon: '📚', opts: ['الكتاب (Le livre)', 'الكرسي (La chaise)', 'الحقيبة (Le sac)'], ans: 'الكتاب (Le livre)' }
  ];

  const HEALTHY_FOODS = [
    { name: 'السمك الطازج (Le Poisson)', icon: '🐟' },
    { name: 'العسل الذهبي (Le Miel)', icon: '🍯' },
    { name: 'الزيتون الأخضر (Les Olives)', icon: '🫒' },
    { name: 'البطاطا الحلوة (La Patate Douce)', icon: '🍠' },
    { name: 'الفطر اللذيذ (Le Champignon)', icon: '🍄' },
    { name: 'التمر المغذي (Les Dattes)', icon: '🌴' }
  ];

  const BABY_ANIMALS = [
    { name: 'الكتكوت الصغير (Le Poussin)', icon: '🐣' },
    { name: 'القطة الصغيرة (Le Chaton)', icon: '🐱' },
    { name: 'الحمل الوديع (L’Agneau)', icon: '🐑' },
    { name: 'البطة الصغيرة (Le Caneton)', icon: '🦆' },
    { name: 'الأرنب الصغير (Le Lapereau)', icon: '🐰' }
  ];

  function speakNow(txt) {
    if (window.LumiQuestionVoice && typeof LumiQuestionVoice.speak === 'function') {
      LumiQuestionVoice.speak(txt);
    } else if (window.LumiAudio && typeof LumiAudio.speak === 'function') {
      LumiAudio.speak('q_custom4', txt, '');
    }
  }

  function renderBatch4UI(stage, badge, icon, questionText, subText, options, correctAns, speakOverride) {
    stage.innerHTML = `
      <div style="background:linear-gradient(135deg,#fdf2f8,#fce7f3);border:2px solid #f9a8d4;border-radius:20px;padding:18px;text-align:center;max-width:650px;margin:0 auto;">
        <div style="display:inline-block;background:#db2777;color:#fff;padding:4px 14px;border-radius:999px;font-size:0.85rem;font-weight:700;margin-bottom:10px;">${badge}</div>
        <div style="font-size:3.6rem;margin:6px 0;">${icon}</div>
        <h3 style="font-size:1.3rem;color:#831843;margin:8px 0;line-height:1.5;">${questionText}</h3>
        ${subText ? `<p style="color:#be185d;font-size:1.02rem;font-weight:700;margin:4px 0 12px;">${subText}</p>` : ''}
        <button type="button" id="b4-listen-btn" style="background:linear-gradient(135deg,#0ea5e9,#2563eb);color:#fff;border:none;border-radius:12px;padding:8px 18px;font-size:1rem;font-weight:700;cursor:pointer;margin-bottom:16px;">🔊 استمع للسؤال</button>
        <div id="b4-opts" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(165px,1fr));gap:12px;"></div>
      </div>
    `;

    const voiceTxt = speakOverride || questionText;
    stage.querySelector('#b4-listen-btn').onclick = () => speakNow(voiceTxt);
    setTimeout(() => speakNow(voiceTxt), 250);

    const box = stage.querySelector('#b4-opts');
    options.forEach(opt => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.style.cssText = 'background:#fff;border:2px solid #fbcfe8;border-radius:16px;padding:14px 10px;font-size:1.15rem;font-weight:800;color:#0f172a;cursor:pointer;transition:transform 0.15s,background 0.2s;';
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

    if (!stage || !NEW_GAMES_BATCH_4.some(g => g.id === gid)) {
      return prevRender();
    }

    const meta = NEW_GAMES_BATCH_4.find(g => g.id === gid);
    const titleEl = document.getElementById('game-title');
    if (titleEl && meta) titleEl.innerHTML = `${meta.icon} ${meta.nameEg} <small>(${meta.nameFr})</small>`;
    const lvlEl = document.getElementById('game-level-badge');
    if (lvlEl) lvlEl.innerText = `المستوى ${this.currentLevel || 1} / 10`;

    if (gid === 'french_verbs_cm1') {
      const item = FRENCH_VERBS_QS[Math.floor(Math.random() * FRENCH_VERBS_QS.length)];
      const opts = [...item.opts].sort(() => Math.random() - 0.5);
      return renderBatch4UI(stage, '🇫🇷 قواعد فرنسية CM1', item.icon, item.q, '', opts, item.ans, item.full);
    }

    if (gid === 'multiplication_pro_cm1') {
      const a = Math.floor(Math.random() * 10) + 3;
      const b = Math.floor(Math.random() * 9) + 2;
      const ans = a * b;
      const qTxt = `كم يساوي حاصل الضرب: <span dir="ltr" style="font-size:1.6rem;color:#9d174d;">${a} × ${b} = ؟</span>`;
      const frTxt = `Calcule le produit : ${a} × ${b}`;
      const set = new Set([String(ans)]);
      while (set.size < 3) {
        const fake = ans + (Math.floor(Math.random() * 6) + 1) * (Math.random() > 0.5 ? 1 : -1);
        if (fake > 0) set.add(String(fake));
      }
      return renderBatch4UI(stage, '✖️ جدول الضرب السريع', '🧮', qTxt, frTxt, [...set].sort(() => Math.random() - 0.5), String(ans), `${a} في ${b} يساوي كام؟`);
    }

    if (gid === 'riddles_brain_pro') {
      const item = RIDDLES_QS[Math.floor(Math.random() * RIDDLES_QS.length)];
      const opts = [...item.opts].sort(() => Math.random() - 0.5);
      return renderBatch4UI(stage, '💡 فوازير الذكاء', item.icon, item.q, item.fr, opts, item.ans, item.q);
    }

    if (gid === 'helen_healthy_food') {
      const pool = [...HEALTHY_FOODS].sort(() => Math.random() - 0.5).slice(0, 3);
      const target = pool[0];
      const opts = [...pool].sort(() => Math.random() - 0.5).map(x => ({
        label: `<div style="font-size:3.2rem;">${x.icon}</div><div>${x.name}</div>`,
        value: x.name
      }));
      return renderBatch4UI(stage, '🥗 أطباق هيلن الصحية', '🍽️', `يا هيلن، اختاري ${target.name}`, '', opts, target.name);
    }

    if (gid === 'helen_baby_animals') {
      const pool = [...BABY_ANIMALS].sort(() => Math.random() - 0.5).slice(0, 3);
      const target = pool[0];
      const opts = [...pool].sort(() => Math.random() - 0.5).map(x => ({
        label: `<div style="font-size:3.3rem;">${x.icon}</div><div>${x.name}</div>`,
        value: x.name
      }));
      return renderBatch4UI(stage, '🐣 صغار الحيوانات', '🐾', `أين ${target.name}؟`, '', opts, target.name);
    }
  };
})();
