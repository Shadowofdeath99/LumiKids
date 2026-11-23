(function() {
  if (typeof LumiDictionary === 'undefined' || typeof LumiGames === 'undefined') return;

  const newGamesMeta = [
    // 5 ألعاب جديدة لهيلن (3 سنوات)
    { id: 'fruits_veggies', icon: '🍓', nameEg: 'فرز الفواكه والخضروات', nameFr: 'Fruits & Légumes', color: '#EC4899', minAge: 3 },
    { id: 'vehicles_sounds', icon: '🚂', nameEg: 'المواصلات والآلات', nameFr: 'Les Transports', color: '#3B82F6', minAge: 3 },
    { id: 'big_small', icon: '🐘', nameEg: 'الكبير والصغير', nameFr: 'Grand et Petit', color: '#F59E0B', minAge: 3 },
    { id: 'animal_homes', icon: '🏡', nameEg: 'بيت كل حيوان', nameFr: 'Maisons des Animaux', color: '#10B981', minAge: 3 },
    { id: 'count_balloons', icon: '🎈', nameEg: 'عدّ البالونات والنجوم', nameFr: 'Compter les Ballons', color: '#8B5CF6', minAge: 3 },
    // 5 ألعاب جديدة لهيفن (10 سنوات)
    { id: 'fractions_pro', icon: '🍕', nameEg: 'تحدي الكسور والنسب', nameFr: 'Défi des Fractions', color: '#EF4444', minAge: 8 },
    { id: 'world_capitals', icon: '🌍', nameEg: 'عواصم ومعالم العالم', nameFr: 'Capitales du Monde', color: '#0EA5E9', minAge: 8 },
    { id: 'sentence_order', icon: '✍️', nameEg: 'ترتيب الجمل الذكي', nameFr: 'Ordre des Phrases', color: '#6366F1', minAge: 8 },
    { id: 'science_lab', icon: '🔬', nameEg: 'مختبر العلوم والتجارب', nameFr: 'Labo des Sciences', color: '#14B8A6', minAge: 8 },
    { id: 'cipher_logic', icon: '🔐', nameEg: 'فك الشفرات والمنطق', nameFr: 'Codes et Logique', color: '#F97316', minAge: 8 }
  ];

  const newInstructions = [
    { id: 'inst_fruits', gameId: 'fruits_veggies', eg: 'اختاري الفاكهة أو الخضار المطلوب!', fr: 'Choisis le fruit ou le légume !' },
    { id: 'inst_vehicles', gameId: 'vehicles_sounds', eg: 'اختاري وسيلة المواصلات الصحيحة!', fr: 'Choisis le bon transport !' },
    { id: 'inst_bigsmall', gameId: 'big_small', eg: 'فين الأكبر أو الأصغر؟ اختاري بسرعة!', fr: 'Lequel est le plus grand ou le plus petit ?' },
    { id: 'inst_homes', gameId: 'animal_homes', eg: 'كل حيوان عايش فين؟ وصّليه ببيته!', fr: 'Où habite chaque animal ?' },
    { id: 'inst_balloons', gameId: 'count_balloons', eg: 'عدّي البالونات واختاري الرقم الصح!', fr: 'Compte les ballons et choisis le nombre !' },
    { id: 'inst_fractions', gameId: 'fractions_pro', eg: 'احسبي الكسر أو النسبة الصحيحة يا بطلة!', fr: 'Calcule la bonne fraction !' },
    { id: 'inst_capitals', gameId: 'world_capitals', eg: 'اختاري العاصمة أو المعلم الصحيح للدولة!', fr: 'Choisis la bonne capitale !' },
    { id: 'inst_sentence', gameId: 'sentence_order', eg: 'رتّبي الكلمات لتكوين جملة مفيدة!', fr: 'Mets les mots dans le bon ordre !' },
    { id: 'inst_science', gameId: 'science_lab', eg: 'أجيبي على سؤال التجربة العلمية!', fr: 'Réponds à la question scientifique !' },
    { id: 'inst_cipher', gameId: 'cipher_logic', eg: 'اكتشفي الرقم أو الرمز الناقص في الشفرة!', fr: 'Trouve le code manquant !' }
  ];

  if (Array.isArray(LumiDictionary.games)) {
    newGamesMeta.forEach(ng => {
      if (!LumiDictionary.games.some(g => g.id === ng.id)) LumiDictionary.games.push(ng);
    });
  }
  if (Array.isArray(LumiDictionary.gameInstructions)) {
    newInstructions.forEach(ni => {
      if (!LumiDictionary.gameInstructions.some(i => i.gameId === ni.gameId)) LumiDictionary.gameInstructions.push(ni);
    });
  }

  const pick = arr => arr[Math.floor(Math.random() * arr.length)];
  const shuffle = arr => [...arr].sort(() => Math.random() - 0.5);

  const renderQuizUI = (stage, promptAr, promptFr, visualHtml, options, onChoose) => {
    stage.innerHTML = `
      <div style="text-align:center; padding:16px; max-width:680px; margin:0 auto;">
        <div style="font-size:1.35rem; font-weight:800; margin-bottom:4px;">${promptAr}</div>
        <div style="font-size:0.95rem; color:#64748B; margin-bottom:16px;">${promptFr}</div>
        <div style="font-size:3.5rem; margin:14px 0; padding:18px; background:rgba(99,102,241,0.08); border-radius:20px;">${visualHtml}</div>
        <div id="pack2-opts" style="display:grid; grid-template-columns:repeat(auto-fit, minmax(140px, 1fr)); gap:12px; margin-top:16px;"></div>
      </div>
    `;
    const box = stage.querySelector('#pack2-opts');
    options.forEach(opt => {
      const btn = document.createElement('button');
      btn.className = 'nav-btn';
      btn.style.cssText = 'padding:16px 12px; font-size:1.15rem; font-weight:700; border-radius:16px; justify-content:center; cursor:pointer;';
      btn.innerHTML = opt.label;
      btn.onclick = () => onChoose(opt.correct, btn);
      box.appendChild(btn);
    });
  };

  const handlePack2Choice = (isCorrect, btn) => {
    if (isCorrect) {
      btn.style.background = '#10B981';
      btn.style.color = '#fff';
      if (typeof LumiGames.handleAnswer === 'function') {
        LumiGames.handleAnswer(true);
      } else {
        setTimeout(() => LumiGames.renderGameScreen(), 600);
      }
    } else {
      btn.style.background = '#EF4444';
      btn.style.color = '#fff';
      if (typeof LumiGames.handleAnswer === 'function') LumiGames.handleAnswer(false);
    }
  };

  const pack2Builders = {
    fruits_veggies(stage) {
      const items = [
        { icon: '🍎', name: 'تفاحة (Pomme)', type: 'فاكهة 🍓' },
        { icon: '🍌', name: 'موزة (Banane)', type: 'فاكهة 🍓' },
        { icon: '🍇', name: 'عنب (Raisin)', type: 'فاكهة 🍓' },
        { icon: '🥕', name: 'جزرة (Carotte)', type: 'خضار 🥦' },
        { icon: '🍅', name: 'طماطم (Tomate)', type: 'خضار 🥦' },
        { icon: '🥒', name: 'خيار (Concombre)', type: 'خضار 🥦' }
      ];
      const q = pick(items);
      renderQuizUI(stage, `هل (${q.name}) فاكهة أم خضار؟`, 'Fruit ou Légume ?', q.icon, [
        { label: 'فاكهة 🍓', correct: q.type === 'فاكهة 🍓' },
        { label: 'خضار 🥦', correct: q.type === 'خضار 🥦' }
      ], handlePack2Choice);
    },

    vehicles_sounds(stage) {
      const pool = [
        { icon: '🚂', name: 'القطار (Train)', clue: 'يمشي على القضبان ويقول توت توت' },
        { icon: '✈️', name: 'الطائرة (Avion)', clue: 'تطير عالياً في السماء بين السحاب' },
        { icon: '🚑', name: 'سيارة الإسعاف (Ambulance)', clue: 'تساعد المرضى بسرعة بصوتها العالي' },
        { icon: '🚢', name: 'السفينة (Bateau)', clue: 'تبحر في البحر الكبير' }
      ];
      const q = pick(pool);
      const opts = shuffle(pool).map(x => ({ label: `${x.icon} ${x.name}`, correct: x.icon === q.icon }));
      renderQuizUI(stage, `اختاري: ${q.clue}`, 'Choisis le bon transport', '🚦❓', opts, handlePack2Choice);
    },

    big_small(stage) {
      const pairs = [
        { big: '🐘 الفيل', small: '🐭 الفأر' },
        { big: '🐋 الحوت', small: '🐠 السمكة الصغيرة' },
        { big: '🌳 الشجرة الكبيرة', small: '🌱 الزهرة الصغيرة' },
        { big: '🚌 الأتوبيس', small: '🚲 العجلة' }
      ];
      const p = pick(pairs);
      const askBig = Math.random() > 0.5;
      renderQuizUI(
        stage,
        askBig ? 'أيهما هو الأكبر حجماً؟' : 'أيهما هو الأصغر حجماً؟',
        askBig ? 'Lequel est le plus GRAND ?' : 'Lequel est le plus PETIT ?',
        `${p.big.split(' ')[0]}  🆚  ${p.small.split(' ')[0]}`,
        shuffle([
          { label: p.big, correct: askBig },
          { label: p.small, correct: !askBig }
        ]),
        handlePack2Choice
      );
    },

    animal_homes(stage) {
      const homes = [
        { animal: '🐦 العصفور', home: '🪺 العش (Nid)' },
        { animal: '🐝 النحلة', home: '🍯 الخلية (Ruche)' },
        { animal: '🐠 السمكة', home: '🌊 البحر (Mer)' },
        { animal: '🦁 الأسد', home: '🌴 الغابة (Forêt)' }
      ];
      const q = pick(homes);
      const opts = shuffle(homes).map(h => ({ label: h.home, correct: h.animal === q.animal }));
      renderQuizUI(stage, `أين يعيش ${q.animal}؟`, 'Où habite cet animal ?', q.animal.split(' ')[0], opts, handlePack2Choice);
    },

    count_balloons(stage) {
      const maxN = Math.min(10, 3 + (LumiGames.currentLevel || 1));
      const count = Math.floor(Math.random() * maxN) + 1;
      const emoji = pick(['🎈', '⭐', '🦋', '🍓']);
      const choices = new Set([count]);
      while (choices.size < 4) choices.add(Math.floor(Math.random() * 10) + 1);
      const opts = shuffle([...choices]).map(n => ({ label: `${n}`, correct: n === count }));
      renderQuizUI(stage, 'كم عدد العناصر في الصورة؟', 'Combien y en a-t-il ?', emoji.repeat(count), opts, handlePack2Choice);
    },

    fractions_pro(stage) {
      const qs = [
        { visual: '🍕 نصف بيتزا (1 من 2)', q: 'ما هو الكسر الذي يمثل النصف؟', ans: '1/2', wrongs: ['1/4', '2/3', '3/4'] },
        { visual: '🍫 قطعة واحدة من 4 قطع متساوية', q: 'ما هو الكسر الذي يمثل الربع؟', ans: '1/4', wrongs: ['1/2', '3/4', '1/3'] },
        { visual: '🥧 3 أرباع فطيرة', q: 'كم يساوي 3/4 كنسبة مئوية؟', ans: '75%', wrongs: ['25%', '50%', '40%'] },
        { visual: '💯 نصف الـ 100', q: 'كم يساوي 50% من العدد 80؟', ans: '40', wrongs: ['20', '60', '30'] }
      ];
      const item = pick(qs);
      const opts = shuffle([item.ans, ...item.wrongs]).map(o => ({ label: o, correct: o === item.ans }));
      renderQuizUI(stage, item.q, 'Défi des Fractions', item.visual, opts, handlePack2Choice);
    },

    world_capitals(stage) {
      const caps = [
        { country: 'مصر 🇪🇬', capital: 'القاهرة (Le Caire)', wrongs: ['الإسكندرية', 'باريس', 'الرياض'] },
        { country: 'فرنسا 🇫🇷', capital: 'باريس (Paris)', wrongs: ['ليون', 'روما', 'لندن'] },
        { country: 'اليابان 🇯🇵', capital: 'طوكيو (Tokyo)', wrongs: ['بكين', 'سيول', 'بانكوك'] },
        { country: 'إيطاليا 🇮🇹', capital: 'روما (Rome)', wrongs: ['مدريد', 'أثينا', 'برلين'] },
        { country: 'السعودية 🇸🇦', capital: 'الرياض (Riyad)', wrongs: ['جدة', 'القاهرة', 'دبي'] }
      ];
      const q = pick(caps);
      const opts = shuffle([q.capital, ...q.wrongs]).map(c => ({ label: c, correct: c === q.capital }));
      renderQuizUI(stage, `ما هي عاصمة ${q.country}؟`, 'Quelle est la capitale ?', '🗺️🧭', opts, handlePack2Choice);
    },

    sentence_order(stage) {
      const bank = [
        { scrambled: 'المدرسة / إلى / هيفن / تذهب', correct: 'تذهب هيفن إلى المدرسة', wrongs: ['إلى هيفن المدرسة تذهب', 'المدرسة تذهب هيفن إلى'] },
        { scrambled: 'chat / Le / petit / dort', correct: 'Le petit chat dort', wrongs: ['Dort chat le petit', 'Petit le dort chat'] },
        { scrambled: 'جميلة / مدينة / الإسكندرية', correct: 'الإسكندرية مدينة جميلة', wrongs: ['مدينة الإسكندرية جميلة', 'جميلة الإسكندرية مدينة'] },
        { scrambled: 'pomme / mange / Elle / une', correct: 'Elle mange une pomme', wrongs: ['Mange une elle pomme', 'Pomme elle mange une'] }
      ];
      const q = pick(bank);
      const opts = shuffle([q.correct, ...q.wrongs]).map(s => ({ label: s, correct: s === q.correct }));
      renderQuizUI(stage, 'اختاري الترتيب الصحيح للجملة:', 'Choisis la phrase correcte', `🧩 ${q.scrambled}`, opts, handlePack2Choice);
    },

    science_lab(stage) {
      const qs = [
        { q: 'ماذا يحدث للماء عند درجة حرارة صفر مئوية؟', ans: 'يتجمد ويتحول إلى ثلج ❄️', wrongs: ['يتبخر فوراً 💨', 'يتحول إلى زيت 🛢️'] },
        { q: 'ما هو أقرب كوكب إلى الشمس؟', ans: 'عطارد (Mercure) 🪐', wrongs: ['المريخ', 'زحل'] },
        { q: 'أي عضو في جسم الإنسان يضخ الدم؟', ans: 'القلب ❤️', wrongs: ['المعدة', 'الرئة'] },
        { q: 'ما الغاز الذي تتنفسه النباتات لصنع غذائها؟', ans: 'ثاني أكسيد الكربون 🌿', wrongs: ['الهيليوم', 'النيتروجين فقط'] }
      ];
      const q = pick(qs);
      const opts = shuffle([q.ans, ...q.wrongs]).map(o => ({ label: o, correct: o === q.ans }));
      renderQuizUI(stage, q.q, 'Expérience Scientifique', '🔬⚗️', opts, handlePack2Choice);
    },

    cipher_logic(stage) {
      const seqs = [
        { seq: '2  ➡️  4  ➡️  8  ➡️  16  ➡️  ❓', ans: '32', wrongs: ['18', '24', '20'] },
        { seq: '🔺  ➡️  🔵  ➡️  🔺  ➡️  🔵  ➡️  ❓', ans: '🔺', wrongs: ['🔵', '🟩', '⭐'] },
        { seq: '100  ➡️  90  ➡️  80  ➡️  70  ➡️  ❓', ans: '60', wrongs: ['65', '50', '75'] },
        { seq: '1  ➡️  1  ➡️  2  ➡️  3  ➡️  5  ➡️  ❓ (فيبوناتشي)', ans: '8', wrongs: ['6', '7', '9'] }
      ];
      const q = pick(seqs);
      const opts = shuffle([q.ans, ...q.wrongs]).map(o => ({ label: o, correct: o === q.ans }));
      renderQuizUI(stage, 'اكتشفي العنصر الناقص في التسلسل:', 'Trouve la suite logique', q.seq, opts, handlePack2Choice);
    }
  };

  const origRender = LumiGames.renderGameScreen.bind(LumiGames);
  LumiGames.renderGameScreen = function() {
    if (pack2Builders[this.currentGameId]) {
      const gameMeta = LumiDictionary.games.find(g => g.id === this.currentGameId) || { icon: '🎮', nameEg: this.currentGameId, nameFr: '' };
      const stage = document.getElementById('game-stage');
      const titleEl = document.getElementById('game-title');
      const badgeEl = document.getElementById('game-level-badge');
      const coOpBtn = document.getElementById('coop-toggle-btn');
      if (titleEl) titleEl.innerHTML = `${gameMeta.icon} ${gameMeta.nameEg} <small>(${gameMeta.nameFr})</small>`;
      if (badgeEl) badgeEl.innerText = `المستوى ${this.currentLevel || 1} / 10`;
      if (coOpBtn) coOpBtn.style.display = 'none';
      this.questionStartTime = Date.now();
      pack2Builders[this.currentGameId](stage);
      return;
    }
    return origRender();
  };

  if (window.LumiApp && typeof LumiApp.renderGamesGrid === 'function') {
    LumiApp.renderGamesGrid();
  }
})();
