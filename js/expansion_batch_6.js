(function() {
  if (typeof LumiDictionary === 'undefined' || typeof LumiGames === 'undefined') return;

  const NEW_GAMES_BATCH_6 = [
    { id: 'eco_energy_cm1', icon: '🌱', nameEg: 'حراس الطبيعة والطاقة', nameFr: 'Énergie et Nature', domain: 'sciences', minAge: 6 },
    { id: 'angles_shapes_cm1', icon: '🔷', nameEg: 'المضلعات والزوايا CM1', nameFr: 'Polygones et Angles', domain: 'math', minAge: 6 },
    { id: 'english_builders_pro', icon: '🇬🇧', nameEg: 'بناء الجمل الإنجليزية', nameFr: 'English Sentence Pro', domain: 'lang', minAge: 6 },
    { id: 'helen_magic_shapes', icon: '🔺', nameEg: 'أشكال هيلن السحرية', nameFr: 'Les Formes Géométriques', domain: 'discovery', minAge: 3 },
    { id: 'helen_school_bag', icon: '🎒', nameEg: 'حقيبة هيلن المدرسية', nameFr: 'Fournitures Scolaires', domain: 'discovery', minAge: 3 }
  ];

  LumiDictionary.games = LumiDictionary.games || [];
  LumiDictionary.gameInstructions = LumiDictionary.gameInstructions || [];

  NEW_GAMES_BATCH_6.forEach(g => {
    if (!LumiDictionary.games.some(x => x.id === g.id)) {
      LumiDictionary.games.push(g);
    }
  });

  const BATCH_6_INSTRUCTIONS = [
    { id: 'inst_eco', gameId: 'eco_energy_cm1', eg: 'كوني حارسة للطبيعة واختاري الإجابة الصحيحة لحماية كوكبنا!', fr: 'Protège la nature et choisis la bonne réponse !' },
    { id: 'inst_angles', gameId: 'angles_shapes_cm1', eg: 'اختاري الشكل الهندسي أو نوع الزاوية الصحيح!', fr: 'Choisis le bon polygone ou angle !' },
    { id: 'inst_eng_build', gameId: 'english_builders_pro', eg: 'أكملي الجملة الإنجليزية بالكلمة الصحيحة!', fr: 'Complète la phrase en anglais !' },
    { id: 'inst_helen_shapes', gameId: 'helen_magic_shapes', eg: 'يا هيلن، اختاري الشكل الهندسي المطلوب!', fr: 'Choisis la bonne forme !' },
    { id: 'inst_helen_bag', gameId: 'helen_school_bag', eg: 'يا هيلن، اختاري الأداة المدرسية المطلوبة!', fr: 'Choisis le bon objet scolaire !' }
  ];

  BATCH_6_INSTRUCTIONS.forEach(ins => {
    if (!LumiDictionary.gameInstructions.some(x => x.gameId === ins.gameId)) {
      LumiDictionary.gameInstructions.push(ins);
    }
  });

  const ECO_QS = [
    { q: 'أي مصدر طاقة نظيف نحصل عليه من أشعة الشمس؟', fr: 'Quelle énergie propre vient du Soleil ?', icon: '☀️', opts: ['الطاقة الشمسية (Énergie solaire)', 'الفحم (Le charbon)', 'البترول (Le pétrole)'], ans: 'الطاقة الشمسية (Énergie solaire)' },
    { q: 'ماذا نسمي عملية تحويل الورق والبلاستيك القديم إلى منتجات جديدة؟', fr: 'Comment appelle-t-on la réutilisation des déchets ?', icon: '♻️', opts: ['إعادة التدوير (Le recyclage)', 'التلوث (La pollution)', 'التبخر (L’évaporation)'], ans: 'إعادة التدوير (Le recyclage)' },
    { q: 'ما الذي تنتجه الأشجار والنباتات ويساعدنا على التنفس؟', fr: 'Quel gaz vital produisent les arbres ?', icon: '🌳', opts: ['الأكسجين (L’oxygène)', 'الدخان (La fumée)', 'الرمال (Le sable)'], ans: 'الأكسجين (L’oxygène)' },
    { q: 'كيف نحافظ على الماء في المنزل؟', fr: 'Comment économiser l’eau à la maison ?', icon: '💧', opts: ['نغلق الصنبور جيداً بعد الاستخدام', 'نترك الماء مفتوحاً طوال اليوم', 'نهدر الماء في اللعب'], ans: 'نغلق الصنبور جيداً بعد الاستخدام' },
    { q: 'أي طاقة تحرك توربينات الهواء العملاقة لتوليد الكهرباء؟', fr: 'Quelle énergie fait tourner les éoliennes ?', icon: '🌬️', opts: ['طاقة الرياح (Énergie éolienne)', 'طاقة الصوت (Énergie sonore)', 'طاقة الجاذبية (Gravité)'], ans: 'طاقة الرياح (Énergie éolienne)' }
  ];

  const ANGLES_QS = [
    { q: 'كم عدد أضلاع الشكل السداسي (Hexagone)؟', fr: 'Combien de côtés a un hexagone ?', icon: '⬡', opts: ['6 أضلاع', '5 أضلاع', '8 أضلاع'], ans: '6 أضلاع' },
    { q: 'كم عدد أضلاع الشكل الخماسي (Pentagone)؟', fr: 'Combien de côtés a un pentagone ?', icon: '⬠', opts: ['5 أضلاع', '4 أضلاع', '3 أضلاع'], ans: '5 أضلاع' },
    { q: 'ما نوع الزاوية التي قياسها 90 درجة بالضبط مثل زاوية الكتاب؟', fr: 'Comment appelle-t-on un angle de 90° ?', icon: '📐', opts: ['زاوية قائمة (Angle droit)', 'زاوية حادة (Angle aigu)', 'زاوية منفرجة (Angle obtus)'], ans: 'زاوية قائمة (Angle droit)' },
    { q: 'كم عدد أضلاع المثلث (Triangle)؟', fr: 'Combien de côtés a un triangle ?', icon: '🔺', opts: ['3 أضلاع', '4 أضلاع', '6 أضلاع'], ans: '3 أضلاع' },
    { q: 'أي شكل له 4 أضلاع متساوية في الطول و4 زوايا قائمة؟', fr: 'Quelle figure a 4 côtés égaux et 4 angles droits ?', icon: '🟦', opts: ['المربع (Le carré)', 'المثلث (Le triangle)', 'الدائرة (Le cercle)'], ans: 'المربع (Le carré)' }
  ];

  const ENG_QS = [
    { q: 'She ______ a clever girl.', fr: 'هي فتاة ذكية', icon: '👧', opts: ['is', 'am', 'are'], ans: 'is', full: 'She is a clever girl.' },
    { q: 'They ______ playing in the park.', fr: 'هم يلعبون في الحديقة', icon: '🏞️', opts: ['are', 'is', 'am'], ans: 'are', full: 'They are playing in the park.' },
    { q: 'I ______ ready for school.', fr: 'أنا مستعد للمدرسة', icon: '🎒', opts: ['am', 'is', 'are'], ans: 'am', full: 'I am ready for school.' },
    { q: 'We ______ two lovely cats.', fr: 'نحن لدينا قطتان جميلتان', icon: '🐱', opts: ['have', 'has', 'is'], ans: 'have', full: 'We have two lovely cats.' },
    { q: 'The sun ______ bright today.', fr: 'الشمس مشرقة اليوم', icon: '☀️', opts: ['is', 'are', 'am'], ans: 'is', full: 'The sun is bright today.' }
  ];

  const HELEN_SHAPES = [
    { name: 'الدائرة (Le Cercle)', icon: '🔴' },
    { name: 'المربع (Le Carré)', icon: '🟦' },
    { name: 'المثلث (Le Triangle)', icon: '🔺' },
    { name: 'النجمة (L’Étoile)', icon: '⭐' },
    { name: 'القلب (Le Cœur)', icon: '❤️' }
  ];

  const HELEN_SCHOOL = [
    { name: 'الحقيبة المدرسية (Le Cartable)', icon: '🎒' },
    { name: 'الكتاب الملون (Le Livre)', icon: '📘' },
    { name: 'القلم الرصاص (Le Crayon)', icon: '✏️' },
    { name: 'المسطرة (La Règle)', icon: '📏' },
    { name: 'ألوان الرسم (La Palette)', icon: '🎨' }
  ];

  function speakNow(txt) {
    if (window.LumiQuestionVoice && typeof LumiQuestionVoice.speak === 'function') {
      LumiQuestionVoice.speak(txt);
    } else if (window.LumiAudio && typeof LumiAudio.speak === 'function') {
      LumiAudio.speak('q_custom6', txt, '');
    }
  }

  function renderBatch6UI(stage, badge, icon, questionText, subText, options, correctAns, speakOverride) {
    stage.innerHTML = `
      <div style="background:linear-gradient(135deg,#f5f3ff,#ede9fe);border:2px solid #c4b5fd;border-radius:20px;padding:18px;text-align:center;max-width:650px;margin:0 auto;">
        <div style="display:inline-block;background:#7c3aed;color:#fff;padding:4px 14px;border-radius:999px;font-size:0.85rem;font-weight:700;margin-bottom:10px;">${badge}</div>
        <div style="font-size:3.6rem;margin:6px 0;">${icon}</div>
        <h3 style="font-size:1.3rem;color:#4c1d95;margin:8px 0;line-height:1.5;">${questionText}</h3>
        ${subText ? `<p style="color:#6d28d9;font-size:1.02rem;font-weight:700;margin:4px 0 12px;">${subText}</p>` : ''}
        <button type="button" id="b6-listen-btn" style="background:linear-gradient(135deg,#0ea5e9,#2563eb);color:#fff;border:none;border-radius:12px;padding:8px 18px;font-size:1rem;font-weight:700;cursor:pointer;margin-bottom:16px;">🔊 استمع للسؤال</button>
        <div id="b6-opts" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(165px,1fr));gap:12px;"></div>
      </div>
    `;

    const voiceTxt = speakOverride || questionText;
    stage.querySelector('#b6-listen-btn').onclick = () => speakNow(voiceTxt);
    setTimeout(() => speakNow(voiceTxt), 250);

    const box = stage.querySelector('#b6-opts');
    options.forEach(opt => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.style.cssText = 'background:#fff;border:2px solid #ddd6fe;border-radius:16px;padding:14px 10px;font-size:1.15rem;font-weight:800;color:#0f172a;cursor:pointer;transition:transform 0.15s,background 0.2s;';
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

    if (!stage || !NEW_GAMES_BATCH_6.some(g => g.id === gid)) {
      return prevRender();
    }

    const meta = NEW_GAMES_BATCH_6.find(g => g.id === gid);
    const titleEl = document.getElementById('game-title');
    if (titleEl && meta) titleEl.innerHTML = `${meta.icon} ${meta.nameEg} <small>(${meta.nameFr})</small>`;
    const lvlEl = document.getElementById('game-level-badge');
    if (lvlEl) lvlEl.innerText = `المستوى ${this.currentLevel || 1} / 10`;

    if (gid === 'eco_energy_cm1') {
      const item = ECO_QS[Math.floor(Math.random() * ECO_QS.length)];
      const opts = [...item.opts].sort(() => Math.random() - 0.5);
      return renderBatch6UI(stage, '🌱 علوم البيئة والطاقة', item.icon, item.q, item.fr, opts, item.ans);
    }

    if (gid === 'angles_shapes_cm1') {
      const item = ANGLES_QS[Math.floor(Math.random() * ANGLES_QS.length)];
      const opts = [...item.opts].sort(() => Math.random() - 0.5);
      return renderBatch6UI(stage, '🔷 هندسة ومضلعات CM1', item.icon, item.q, item.fr, opts, item.ans);
    }

    if (gid === 'english_builders_pro') {
      const item = ENG_QS[Math.floor(Math.random() * ENG_QS.length)];
      const opts = [...item.opts].sort(() => Math.random() - 0.5);
      return renderBatch6UI(stage, '🇬🇧 قواعد إنجليزية', item.icon, `<span dir="ltr">${item.q}</span>`, item.fr, opts, item.ans, item.full);
    }

    if (gid === 'helen_magic_shapes') {
      const pool = [...HELEN_SHAPES].sort(() => Math.random() - 0.5).slice(0, 3);
      const target = pool[0];
      const opts = [...pool].sort(() => Math.random() - 0.5).map(x => ({
        label: `<div style="font-size:3.2rem;">${x.icon}</div><div>${x.name}</div>`,
        value: x.name
      }));
      return renderBatch6UI(stage, '🔺 أشكال هيلن السحرية', '✨', `يا هيلن، اختاري ${target.name}`, '', opts, target.name);
    }

    if (gid === 'helen_school_bag') {
      const pool = [...HELEN_SCHOOL].sort(() => Math.random() - 0.5).slice(0, 3);
      const target = pool[0];
      const opts = [...pool].sort(() => Math.random() - 0.5).map(x => ({
        label: `<div style="font-size:3.3rem;">${x.icon}</div><div>${x.name}</div>`,
        value: x.name
      }));
      return renderBatch6UI(stage, '🎒 حقيبة هيلن', '🏫', `اختاري ${target.name}`, '', opts, target.name);
    }
  };
})();
