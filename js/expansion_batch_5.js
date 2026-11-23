(function() {
  if (typeof LumiDictionary === 'undefined' || typeof LumiGames === 'undefined') return;

  const NEW_GAMES_BATCH_5 = [
    { id: 'ocean_mysteries_cm1', icon: '🐋', nameEg: 'أسرار البحار والمحيطات', nameFr: 'Mystères des Océans', domain: 'sciences', minAge: 6 },
    { id: 'time_converter_cm1', icon: '⏱️', nameEg: 'حساب الوقت والدقائق', nameFr: 'Mesure du Temps', domain: 'math', minAge: 6 },
    { id: 'synonyms_antonyms_pro', icon: '📖', nameEg: 'المرادفات والأضداد', nameFr: 'Synonymes et Contraires', domain: 'lang', minAge: 6 },
    { id: 'helen_home_rooms', icon: '🏡', nameEg: 'بيت هيلن الجميل', nameFr: 'Les Pièces de la Maison', domain: 'discovery', minAge: 3 },
    { id: 'helen_clothes_wardrobe', icon: '👗', nameEg: 'خزانة ملابس هيلن', nameFr: 'Les Vêtements', domain: 'discovery', minAge: 3 }
  ];

  LumiDictionary.games = LumiDictionary.games || [];
  LumiDictionary.gameInstructions = LumiDictionary.gameInstructions || [];

  NEW_GAMES_BATCH_5.forEach(g => {
    if (!LumiDictionary.games.some(x => x.id === g.id)) {
      LumiDictionary.games.push(g);
    }
  });

  const BATCH_5_INSTRUCTIONS = [
    { id: 'inst_oceans', gameId: 'ocean_mysteries_cm1', eg: 'اكتشفي أسرار البحار والمحيطات والكائنات البحرية!', fr: 'Découvre les mystères des océans !' },
    { id: 'inst_time_conv', gameId: 'time_converter_cm1', eg: 'احسبي الدقائق والساعات بدقة يا بطلة!', fr: 'Calcule les heures et les minutes !' },
    { id: 'inst_syn_ant', gameId: 'synonyms_antonyms_pro', eg: 'اختاري الكلمة المضادة أو المرادفة الصحيحة!', fr: 'Choisis le bon contraire ou synonyme !' },
    { id: 'inst_helen_home', gameId: 'helen_home_rooms', eg: 'يا هيلن، اختاري المكان المناسب في البيت!', fr: 'Choisis la bonne pièce de la maison !' },
    { id: 'inst_helen_clothes', gameId: 'helen_clothes_wardrobe', eg: 'يا هيلن، اختاري قطعة الملابس المطلوبة!', fr: 'Choisis le bon vêtement !' }
  ];

  BATCH_5_INSTRUCTIONS.forEach(ins => {
    if (!LumiDictionary.gameInstructions.some(x => x.gameId === ins.gameId)) {
      LumiDictionary.gameInstructions.push(ins);
    }
  });

  const OCEAN_QS = [
    { q: 'ما هو أكبر حيوان يعيش في المحيطات وعلى كوكب الأرض؟', fr: 'Quel est le plus grand animal des océans ?', icon: '🐋', opts: ['الحوت الأزرق (La Baleine Bleue)', 'القرش الأبيض (Le Requin)', 'الدلفين (Le Dauphin)'], ans: 'الحوت الأزرق (La Baleine Bleue)' },
    { q: 'بماذا تتنفس الأسماك تحت الماء؟', fr: 'Comment respirent les poissons sous l’eau ?', icon: '🐠', opts: ['بالخياشيم (Les Branchies)', 'بالرئتين (Les Poumons)', 'بالأنف (Le Nez)'], ans: 'بالخياشيم (Les Branchies)' },
    { q: 'كم عدد أذرع الأخطبوط البحري؟', fr: 'Combien de bras a une pieuvre ?', icon: '🐙', opts: ['8 أذرع', '4 أذرع', '12 ذراعاً'], ans: '8 أذرع' },
    { q: 'أي بحر يشتهر بالشعب المرجانية الملونة في شرق مصر؟', fr: 'Quelle mer est célèbre pour ses coraux en Égypte ?', icon: '🪸', opts: ['البحر الأحمر (La Mer Rouge)', 'بحيرة قارون (Lac Qaroun)', 'نهر النيل (Le Nil)'], ans: 'البحر الأحمر (La Mer Rouge)' },
    { q: 'ما هو الكائن البحري الذكي الذي يقفز فوق الأمواج ويحب اللعب؟', fr: 'Quel animal marin intelligent adore sauter ?', icon: '🐬', opts: ['الدلفين (Le Dauphin)', 'السلحفاة (La Tortue)', 'نجم البحر (L’Étoile de mer)'], ans: 'الدلفين (Le Dauphin)' }
  ];

  const TIME_QS = [
    { q: 'كم دقيقة توجد في الساعة الواحدة؟', fr: 'Combien de minutes dans une heure ?', icon: '⏰', opts: ['60 دقيقة', '30 دقيقة', '100 دقيقة'], ans: '60 دقيقة' },
    { q: 'كم دقيقة توجد في نصف ساعة (30 + 0)؟', fr: 'Combien de minutes dans une demi-heure ?', icon: '⏲️', opts: ['30 دقيقة', '15 دقيقة', '45 دقيقة'], ans: '30 دقيقة' },
    { q: 'كم ساعة في اليوم الكامل (ليلاً ونهاراً)؟', fr: 'Combien d’heures dans une journée entière ?', icon: '🌞', opts: ['24 ساعة', '12 ساعة', '48 ساعة'], ans: '24 ساعة' },
    { q: 'إذا كانت الساعة 3:00 وأضفنا إليها 45 دقيقة، كم تصبح؟', fr: 'Il est 3h00, quelle heure sera-t-il dans 45 min ?', icon: '🕒', opts: ['3:45', '4:15', '3:30'], ans: '3:45' },
    { q: 'ساعتان (2 heures) تساوي كم دقيقة؟', fr: '2 heures égalent combien de minutes ?', icon: '⌛', opts: ['120 دقيقة', '90 دقيقة', '60 دقيقة'], ans: '120 دقيقة' }
  ];

  const SYN_ANT_QS = [
    { q: 'ما هو مضاد (عكس) كلمة «سريع»؟', fr: 'Quel est le contraire de « rapide » ?', icon: '🐇', opts: ['بطيء (Lent)', 'قوي (Fort)', 'كبير (Grand)'], ans: 'بطيء (Lent)' },
    { q: 'Quel est le contraire de « grand » (كبير) ?', fr: 'عكس كلمة كبير بالفرنسية', icon: '🐘', opts: ['petit (صغير)', 'haut (عالي)', 'beau (جميل)'], ans: 'petit (صغير)' },
    { q: 'ما هو مرادف (معنى) كلمة «سعيد»؟', fr: 'Quel est le synonyme de « content » ?', icon: '😄', opts: ['فرحان ومسرور (Heureux)', 'حزين (Triste)', 'غاضب (Fâché)'], ans: 'فرحان ومسرور (Heureux)' },
    { q: 'Quel est le contraire de « chaud » (ساخن) ?', fr: 'عكس كلمة ساخن بالفرنسية', icon: '❄️', opts: ['froid (بارد)', 'tiède (دافئ)', 'sec (جاف)'], ans: 'froid (بارد)' },
    { q: 'ما هو مضاد (عكس) كلمة «النهار»؟', fr: 'Quel est le contraire du « jour » ?', icon: '🌙', opts: ['الليل (La nuit)', 'الصباح (Le matin)', 'الربيع (Le printemps)'], ans: 'الليل (La nuit)' }
  ];

  const HOME_ROOMS = [
    { name: 'المطبخ (La Cuisine)', icon: '🍳', clue: 'نعد فيه الطعام اللذيذ' },
    { name: 'غرفة النوم (La Chambre)', icon: '🛏️', clue: 'ننام فيها ونستريح' },
    { name: 'الحديقة (Le Jardin)', icon: '🌻', clue: 'نلعب فيها بين الزهور' },
    { name: 'غرفة الجلوس (Le Salon)', icon: '🛋️', clue: 'نجلس فيها مع العائلة' },
    { name: 'الحمام (La Salle de Bain)', icon: '🛁', clue: 'نغسل فيه أيدينا وأسناننا' }
  ];

  const CLOTHES_ITEMS = [
    { name: 'الفستان الجميل (La Robe)', icon: '👗' },
    { name: 'المعطف الدافئ (Le Manteau)', icon: '🧥' },
    { name: 'القبعة الشمسية (Le Chapeau)', icon: '👒' },
    { name: 'الحذاء الرياضي (Les Baskets)', icon: '👟' },
    { name: 'النظارة الشمسية (Les Lunettes)', icon: '🕶️' }
  ];

  function speakNow(txt) {
    if (window.LumiQuestionVoice && typeof LumiQuestionVoice.speak === 'function') {
      LumiQuestionVoice.speak(txt);
    } else if (window.LumiAudio && typeof LumiAudio.speak === 'function') {
      LumiAudio.speak('q_custom5', txt, '');
    }
  }

  function renderBatch5UI(stage, badge, icon, questionText, subText, options, correctAns) {
    stage.innerHTML = `
      <div style="background:linear-gradient(135deg,#eff6ff,#dbeafe);border:2px solid #93c5fd;border-radius:20px;padding:18px;text-align:center;max-width:650px;margin:0 auto;">
        <div style="display:inline-block;background:#1d4ed8;color:#fff;padding:4px 14px;border-radius:999px;font-size:0.85rem;font-weight:700;margin-bottom:10px;">${badge}</div>
        <div style="font-size:3.6rem;margin:6px 0;">${icon}</div>
        <h3 style="font-size:1.3rem;color:#1e3a8a;margin:8px 0;line-height:1.5;">${questionText}</h3>
        ${subText ? `<p style="color:#1d4ed8;font-size:1.02rem;font-weight:700;margin:4px 0 12px;">${subText}</p>` : ''}
        <button type="button" id="b5-listen-btn" style="background:linear-gradient(135deg,#0ea5e9,#2563eb);color:#fff;border:none;border-radius:12px;padding:8px 18px;font-size:1rem;font-weight:700;cursor:pointer;margin-bottom:16px;">🔊 استمع للسؤال</button>
        <div id="b5-opts" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(165px,1fr));gap:12px;"></div>
      </div>
    `;

    stage.querySelector('#b5-listen-btn').onclick = () => speakNow(questionText);
    setTimeout(() => speakNow(questionText), 250);

    const box = stage.querySelector('#b5-opts');
    options.forEach(opt => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.style.cssText = 'background:#fff;border:2px solid #bfdbfe;border-radius:16px;padding:14px 10px;font-size:1.15rem;font-weight:800;color:#0f172a;cursor:pointer;transition:transform 0.15s,background 0.2s;';
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

    if (!stage || !NEW_GAMES_BATCH_5.some(g => g.id === gid)) {
      return prevRender();
    }

    const meta = NEW_GAMES_BATCH_5.find(g => g.id === gid);
    const titleEl = document.getElementById
cd ~/LumiKids && cat << 'EOF' > js/expansion_batch_6.js
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
