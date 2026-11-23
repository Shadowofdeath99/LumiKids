(function() {
  if (typeof LumiDictionary === 'undefined' || typeof LumiGames === 'undefined') return;

  const NEW_GAMES_BATCH_1 = [
    { id: 'space_explorer', icon: '🪐', nameEg: 'مستكشف الفضاء', nameFr: 'Explorateur Spatial', domain: 'sciences', minAge: 6 },
    { id: 'mental_math_blitz', icon: '⚡', nameEg: 'الحساب الذهني السريع', nameFr: 'Calcul Mental', domain: 'math', minAge: 6 },
    { id: 'world_landmarks', icon: '🗺️', nameEg: 'معالم وقارات العالم', nameFr: 'Monuments du Monde', domain: 'geo', minAge: 6 },
    { id: 'helen_animal_sounds', icon: '🐾', nameEg: 'أصدقاء المزرعة والغابة', nameFr: 'Amis des Animaux', domain: 'discovery', minAge: 3 },
    { id: 'helen_fruit_basket', icon: '🍓', nameEg: 'سلة الفواكه اللذيذة', nameFr: 'Panier de Fruits', domain: 'discovery', minAge: 3 }
  ];

  LumiDictionary.games = LumiDictionary.games || [];
  LumiDictionary.gameInstructions = LumiDictionary.gameInstructions || [];

  NEW_GAMES_BATCH_1.forEach(g => {
    if (!LumiDictionary.games.some(x => x.id === g.id)) {
      LumiDictionary.games.push(g);
    }
  });

  const BATCH_1_INSTRUCTIONS = [
    { id: 'inst_space', gameId: 'space_explorer', eg: 'أهلاً برائدة الفضاء! اختاري الكوكب أو المعلومة الفلكية الصحيحة.', fr: 'Choisis la bonne planète ou réponse spatiale !' },
    { id: 'inst_mental', gameId: 'mental_math_blitz', eg: 'شغّلي عقلك السريع واحسبي الناتج الصحيح!', fr: 'Calcule rapidement le bon résultat !' },
    { id: 'inst_landmarks', gameId: 'world_landmarks', eg: 'في أي دولة أو قارة يوجد هذا المعلم الشهير؟', fr: 'Dans quel pays se trouve ce monument ?' },
    { id: 'inst_helen_animals', gameId: 'helen_animal_sounds', eg: 'يا هيلن يا جميلة، فين الحيوان المطلوب؟', fr: 'Où est l’animal demandé ?' },
    { id: 'inst_helen_fruits', gameId: 'helen_fruit_basket', eg: 'يا هيلن، اختاري الفاكهة اللذيذة المطلوبة!', fr: 'Choisis le bon fruit !' }
  ];

  BATCH_1_INSTRUCTIONS.forEach(ins => {
    if (!LumiDictionary.gameInstructions.some(x => x.gameId === ins.gameId)) {
      LumiDictionary.gameInstructions.push(ins);
    }
  });

  const SPACE_QS = [
    { q: 'ما هو أكبر كوكب في المجموعة الشمسية؟', fr: 'Quelle est la plus grande planète ?', icon: '🪐', opts: ['المشتري (Jupiter)', 'المريخ (Mars)', 'عطارد (Mercure)'], ans: 'المشتري (Jupiter)' },
    { q: 'أي كوكب يُلقب بالكوكب الأحمر؟', fr: 'Quelle est la planète rouge ?', icon: '🔴', opts: ['المريخ (Mars)', 'الزهرة (Vénus)', 'نبتون (Neptune)'], ans: 'المريخ (Mars)' },
    { q: 'ما هو أقرب كوكب إلى الشمس؟', fr: 'Quelle planète est la plus proche du Soleil ?', icon: '☀️', opts: ['عطارد (Mercure)', 'الأرض (Terre)', 'زحل (Saturne)'], ans: 'عطارد (Mercure)' },
    { q: 'أي كوكب يتميز بحلقات دائرية رائعة حوله؟', fr: 'Quelle planète a de magnifiques anneaux ?', icon: '🪐', opts: ['زحل (Saturne)', 'عطارد (Mercure)', 'المريخ (Mars)'], ans: 'زحل (Saturne)' },
    { q: 'ما هو النجم الذي يمد الأرض بالضوء والحرارة؟', fr: 'Quelle étoile éclaire la Terre ?', icon: '🌟', opts: ['الشمس (Le Soleil)', 'القمر (La Lune)', 'المريخ (Mars)'], ans: 'الشمس (Le Soleil)' },
    { q: 'كم عدد كواكب المجموعة الشمسية؟', fr: 'Combien de planètes dans le système solaire ?', icon: '🌌', opts: ['8 كواكب', '5 كواكب', '12 كوكباً'], ans: '8 كواكب' }
  ];

  const LANDMARK_QS = [
    { q: 'أين توجد أهرامات الجيزة وأبو الهول؟', fr: 'Où se trouvent les pyramides de Gizeh ?', icon: '🏛️', opts: ['مصر (Égypte)', 'فرنسا (France)', 'اليابان (Japon)'], ans: 'مصر (Égypte)' },
    { q: 'في أي دولة يقع برج إيفل الشهير؟', fr: 'Où se trouve la Tour Eiffel ?', icon: '🗼', opts: ['فرنسا (France)', 'إيطاليا (Italie)', 'مصر (Égypte)'], ans: 'فرنسا (France)' },
    { q: 'أين يقع سور الصين العظيم؟', fr: 'Où se trouve la Grande Muraille ?', icon: '🏯', opts: ['الصين (Chine)', 'البرازيل (Brésil)', 'كندا (Canada)'], ans: 'الصين (Chine)' },
    { q: 'في أي مدينة مصرية تقع قلعة قايتباي ومكتبة الإسكندرية؟', fr: 'Où se trouve la citadelle de Qaitbay ?', icon: '🌊', opts: ['الإسكندرية (Alexandrie)', 'أسوان (Assouan)', 'الأقصر (Louxor)'], ans: 'الإسكندرية (Alexandrie)' },
    { q: 'أين يقع برج بيزا المائل؟', fr: 'Où se trouve la Tour de Pise ?', icon: '🍕', opts: ['إيطاليا (Italie)', 'إسبانيا (Espagne)', 'ألمانيا (Allemagne)'], ans: 'إيطاليا (Italie)' }
  ];

  const HELEN_ANIMALS = [
    { name: 'الأسد الملك (Le Lion)', icon: '🦁', sound: 'زئير الأسد: رررر!' },
    { name: 'القطة اللطيفة (Le Chat)', icon: '🐱', sound: 'صوت القطة: مياو مياو!' },
    { name: 'البقرة الطيبة (La Vache)', icon: '🐄', sound: 'صوت البقرة: مووو!' },
    { name: 'الخروف الأبيض (Le Mouton)', icon: '🐑', sound: 'صوت الخروف: ماء ماء!' },
    { name: 'الفيل الكبير (L’Éléphant)', icon: '🐘', sound: 'صوت الفيل: ترررر!' },
    { name: 'البطة الصفراء (Le Canard)', icon: '🦆', sound: 'صوت البطة: كواك كواك!' }
  ];

  const HELEN_FRUITS = [
    { name: 'فراولة حمراء (Fraise)', icon: '🍓' },
    { name: 'موزة صفراء (Banane)', icon: '🍌' },
    { name: 'تفاحة خضراء (Pomme)', icon: '🍏' },
    { name: 'برتقالة لذيذة (Orange)', icon: '🍊' },
    { name: 'بطيخة منعشة (Pastèque)', icon: '🍉' },
    { name: 'عنب بنفسجي (Raisin)', icon: '🍇' }
  ];

  function speakNow(txt) {
    if (window.LumiQuestionVoice && typeof LumiQuestionVoice.speak === 'function') {
      LumiQuestionVoice.speak(txt);
    } else if (window.LumiAudio && typeof LumiAudio.speak === 'function') {
      LumiAudio.speak('q_custom', txt, '');
    }
  }

  function renderQuizUI(stage, badge, icon, questionText, subText, options, correctAns) {
    stage.innerHTML = `
      <div style="background:linear-gradient(135deg,#f8fafc,#eef2ff);border:2px solid #c7d2fe;border-radius:20px;padding:18px;text-align:center;max-width:650px;margin:0 auto;">
        <div style="display:inline-block;background:#4f46e5;color:#fff;padding:4px 14px;border-radius:999px;font-size:0.85rem;font-weight:700;margin-bottom:10px;">${badge}</div>
        <div style="font-size:3.6rem;margin:6px 0;">${icon}</div>
        <h3 style="font-size:1.3rem;color:#1e1b4b;margin:8px 0;line-height:1.5;">${questionText}</h3>
        ${subText ? `<p style="color:#4338ca;font-size:1rem;margin:4px 0 12px;">${subText}</p>` : ''}
        <button type="button" id="b1-listen-btn" style="background:linear-gradient(135deg,#0ea5e9,#2563eb);color:#fff;border:none;border-radius:12px;padding:8px 18px;font-size:1rem;font-weight:700;cursor:pointer;margin-bottom:16px;">🔊 استمع للسؤال</button>
        <div id="b1-opts" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:12px;"></div>
      </div>
    `;

    stage.querySelector('#b1-listen-btn').onclick = () => speakNow(questionText);
    setTimeout(() => speakNow(questionText), 250);

    const box = stage.querySelector('#b1-opts');
    options.forEach(opt => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.style.cssText = 'background:#fff;border:2px solid #cbd5e1;border-radius:16px;padding:14px 10px;font-size:1.1rem;font-weight:700;color:#0f172a;cursor:pointer;transition:transform 0.15s,background 0.2s;';
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

    if (!stage || !NEW_GAMES_BATCH_1.some(g => g.id === gid)) {
      return prevRender();
    }

    const meta = NEW_GAMES_BATCH_1.find(g => g.id === gid);
    const titleEl = document.getElementById('game-title');
    if (titleEl && meta) titleEl.innerHTML = `${meta.icon} ${meta.nameEg} <small>(${meta.nameFr})</small>`;
    const lvlEl = document.getElementById('game-level-badge');
    if (lvlEl) lvlEl.innerText = `المستوى ${this.currentLevel || 1} / 10`;

    if (gid === 'space_explorer') {
      const item = SPACE_QS[Math.floor(Math.random() * SPACE_QS.length)];
      const opts = [...item.opts].sort(() => Math.random() - 0.5);
      return renderQuizUI(stage, '🪐 علوم الفضاء CM1', item.icon, item.q, item.fr, opts, item.ans);
    }

    if (gid === 'mental_math_blitz') {
      const a = Math.floor(Math.random() * 25) + 12;
      const b = Math.floor(Math.random() * 19) + 6;
      const isAdd = Math.random() > 0.35;
      const ans = isAdd ? (a + b) : (a * 2);
      const qTxt = isAdd ? `احسبي ذهنياً: ${a} + ${b} = ؟` : `ما هو ضعف العدد ${a} (${a} × 2)؟`;
      const frTxt = isAdd ? `Calcule : ${a} + ${b}` : `Double de ${a}`;
      const distractors = new Set([String(ans)]);
      while (distractors.size < 3) {
        const delta = (Math.floor(Math.random() * 7) + 1) * (Math.random() > 0.5 ? 1 : -1);
        if (ans + delta > 0) distractors.add(String(ans + delta));
      }
      const opts = [...distractors].sort(() => Math.random() - 0.5);
      return renderQuizUI(stage, '⚡ الحساب الذهني السريع', '🧮', qTxt, frTxt, opts, String(ans));
    }

    if (gid === 'world_landmarks') {
      const item = LANDMARK_QS[Math.floor(Math.random() * LANDMARK_QS.length)];
      const opts = [...item.opts].sort(() => Math.random() - 0.5);
      return renderQuizUI(stage, '🗺️ جغرافيا ومعالم العالم', item.icon, item.q, item.fr, opts, item.ans);
    }

    if (gid === 'helen_animal_sounds') {
      const pool = [...HELEN_ANIMALS].sort(() => Math.random() - 0.5).slice(0, 3);
      const target = pool[0];
      const opts = [...pool].sort(() => Math.random() - 0.5).map(x => ({
        label: `<div style="font-size:3.2rem;">${x.icon}</div><div>${x.name}</div>`,
        value: x.name
      }));
      return renderQuizUI(stage, '🌸 عالم هيلن الجميل', '🐾', `أين ${target.name}؟`, target.sound, opts, target.name);
    }

    if (gid === 'helen_fruit_basket') {
      const pool = [...HELEN_FRUITS].sort(() => Math.random() - 0.5).slice(0, 3);
      const target = pool[0];
      const opts = [...pool].sort(() => Math.random() - 0.5).map(x => ({
        label: `<div style="font-size:3.4rem;">${x.icon}</div><div>${x.name}</div>`,
        value: x.name
      }));
      return renderQuizUI(stage, '🍓 سلة هيلن الملونة', '🧺', `اختاري ${target.name}`, '', opts, target.name);
    }
  };
})();
