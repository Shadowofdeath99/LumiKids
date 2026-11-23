(function() {
  if (typeof LumiDictionary === 'undefined' || typeof LumiGames === 'undefined') return;

  const NEW_GAMES_BATCH_7 = [
    { id: 'arabic_grammar_pro', icon: '🖋️', nameEg: 'أسرار النحو والتراكيب', nameFr: 'Grammaire Arabe', domain: 'lang', minAge: 6 },
    { id: 'decimals_master_cm1', icon: '🔢', nameEg: 'الأعداد العشرية CM1', nameFr: 'Nombres Décimaux', domain: 'math', minAge: 6 },
    { id: 'coding_logic_blocks', icon: '🤖', nameEg: 'منطق البرمجة والشروط', nameFr: 'Logique de Code', domain: 'logic', minAge: 6 },
    { id: 'helen_toy_box', icon: '🧸', nameEg: 'صندوق ألعاب هيلن', nameFr: 'Les Jouets', domain: 'discovery', minAge: 3 },
    { id: 'helen_garden_bugs', icon: '🦋', nameEg: 'حديقة الفراشات والزهور', nameFr: 'Le Jardin et Insectes', domain: 'discovery', minAge: 3 }
  ];

  LumiDictionary.games = LumiDictionary.games || [];
  LumiDictionary.gameInstructions = LumiDictionary.gameInstructions || [];

  NEW_GAMES_BATCH_7.forEach(g => {
    if (!LumiDictionary.games.some(x => x.id === g.id)) {
      LumiDictionary.games.push(g);
    }
  });

  const BATCH_7_INSTRUCTIONS = [
    { id: 'inst_ar_gram', gameId: 'arabic_grammar_pro', eg: 'حددي نوع الجملة أو الكلمة في النحو العربي يا متفوقة!', fr: 'Choisis la bonne règle de grammaire !' },
    { id: 'inst_decimals', gameId: 'decimals_master_cm1', eg: 'اختاري العدد العشري الصحيح لرياضيات رابعة ابتدائي!', fr: 'Choisis le bon nombre décimal !' },
    { id: 'inst_coding', gameId: 'coding_logic_blocks', eg: 'فكّري كمبرمجة ذكية واختاري ناتج الكود البرمجي!', fr: 'Trouve le résultat du code logique !' },
    { id: 'inst_helen_toys', gameId: 'helen_toy_box', eg: 'يا هيلن، اختاري اللعبة الجميلة المطلوبة من الصندوق!', fr: 'Choisis le bon jouet !' },
    { id: 'inst_helen_garden', gameId: 'helen_garden_bugs', eg: 'يا هيلن، أين الفراشة أو الزهرة المطلوبة في الحديقة؟', fr: 'Où est l’élément du jardin ?' }
  ];

  BATCH_7_INSTRUCTIONS.forEach(ins => {
    if (!LumiDictionary.gameInstructions.some(x => x.gameId === ins.gameId)) {
      LumiDictionary.gameInstructions.push(ins);
    }
  });

  const AR_GRAM_QS = [
    { q: 'ما نوع جملة: «الشمسُ مشرقةٌ»؟', fr: 'Phrase nominale ou verbale ?', icon: '☀️', opts: ['جملة اسمية (تبدأ باسم)', 'جملة فعلية (تبدأ بفعل)', 'شبه جملة'], ans: 'جملة اسمية (تبدأ باسم)' },
    { q: 'ما نوع جملة: «يكتبُ التلميذُ الدرسَ»؟', fr: 'Phrase verbale', icon: '✍️', opts: ['جملة فعلية (تبدأ بفعل)', 'جملة اسمية (تبدأ باسم)', 'حرف جر'], ans: 'جملة فعلية (تبدأ بفعل)' },
    { q: 'في جملة «السماءُ صافيةٌ»، ما إعراب كلمة «السماءُ»؟', fr: 'Le sujet (Mubtada)', icon: '🌤️', opts: ['مبتدأ مرفوع', 'فعل ماضٍ', 'حرف عطف'], ans: 'مبتدأ مرفوع' },
    { q: 'أي كلمة من الكلمات التالية تُعد «حرف جر»؟', fr: 'Préposition en arabe', icon: '🔗', opts: ['في / على / إلى', 'مدرسة / كتاب', 'يلعب / يشرب'], ans: 'في / على / إلى' },
    { q: 'ما جمع كلمة «عصفور»؟', fr: 'Pluriel de oiseau', icon: '🐦', opts: ['عصافير (جمع تكسير)', 'عصفوران (مثنى)', 'عصفورة (مفرد)'], ans: 'عصافير (جمع تكسير)' }
  ];

  const DECIMALS_QS = [
    { q: 'كيف نكتب الكسر العشري (نصف = 1/2) في صورة عدد عشري؟', fr: 'Écris 1/2 en nombre décimal', icon: '➗', opts: ['0.5', '0.05', '5.0'], ans: '0.5' },
    { q: 'أي عدد عشري هو الأكبر بين الأعداد التالية؟', fr: 'Quel est le plus grand nombre décimal ?', icon: '📊', opts: ['3.8', '3.25', '3.09'], ans: '3.8' },
    { q: 'كم يساوي مجموع: 1.5 + 2.5 = ؟', fr: 'Calcule : 1,5 + 2,5', icon: '➕', opts: ['4.0', '3.5', '4.5'], ans: '4.0' },
    { q: 'الكسر 3/10 (ثلاثة أجزاء من عشرة) يساوي كم؟', fr: '3/10 est égal à combien ?', icon: '🔟', opts: ['0.3', '0.03', '3.1'], ans: '0.3' },
    { q: 'كم يساوي: 5.7 - 0.7 = ؟', fr: 'Calcule : 5,7 - 0,7', icon: '➖', opts: ['5.0', '5.7', '4.0'], ans: '5.0' }
  ];

  const CODING_QS = [
    { q: 'إذا كان الروبوت يمشي 3 خطوات للأمام ثم يكرر ذلك مرتين (Repeat 2)، كم خطوة سيمشي؟', fr: 'Repeat 2: avancer de 3 pas', icon: '🤖', opts: ['6 خطوات', '3 خطوات', '5 خطوات'], ans: '6 خطوات' },
    { q: 'شرط برمجي: «إذا كان الطقس ممطراً (If Rain) خذ مظلة، وإلا (Else) خذ نظارة شمس». الطقس اليوم مشمس، ماذا تأخذ؟', fr: 'Condition If / Else', icon: '🕶️', opts: ['نظارة شمس', 'مظلة مطر', 'معطف ثلج'], ans: 'نظارة شمس' },
    { q: 'في البرمجة، ماذا نسمي الخطأ الذي يمنع البرنامج من العمل الصحيح؟', fr: 'Comment appelle-t-on une erreur de code ?', icon: '🐞', opts: ['Bug (خطأ برمجي)', 'Wi-Fi (شبكة)', 'Screen (شاشة)'], ans: 'Bug (خطأ برمجي)' },
    { q: 'لدينا متغير X = 5، نفذنا الأمر: X = X + 4. كم تصبح قيمة X الآن؟', fr: 'Variable X = 5; X = X + 4', icon: '💻', opts: ['9', '5', '4'], ans: '9' },
    { q: 'أي أمر برمجي نستخدمه لتكرار حركة معينة 10 مرات دون إعادة كتابة الكود؟', fr: 'Instruction de répétition', icon: '🔁', opts: ['حلقة تكرار (Loop / Répéter)', 'إيقاف (Stop)', 'حذف (Delete)'], ans: 'حلقة تكرار (Loop / Répéter)' }
  ];

  const HELEN_TOYS = [
    { name: 'الدبدوب اللطيف (L’Ours en peluche)', icon: '🧸' },
    { name: 'الكرة الملونة (Le Ballon)', icon: '⚽' },
    { name: 'قطار الألعاب (Le Petit Train)', icon: '🚂' },
    { name: 'المكعبات (Les Cubes)', icon: '🧱' },
    { name: 'الطائرة الورقية (Le Cerf-volant)', icon: '🪁' }
  ];

  const HELEN_GARDEN = [
    { name: 'الفراشة الجميلة (Le Papillon)', icon: '🦋' },
    { name: 'النحلة النشيطة (L’Abeille)', icon: '🐝' },
    { name: 'الدعسوقة الحمراء (La Coccinelle)', icon: '🐞' },
    { name: 'زهرة عباد الشمس (Le Tournesol)', icon: '🌻' },
    { name: 'السلحفاة الهادئة (La Tortue)', icon: '🐢' }
  ];

  function speakNow(txt) {
    if (window.LumiQuestionVoice && typeof LumiQuestionVoice.speak === 'function') {
      LumiQuestionVoice.speak(txt);
    } else if (window.LumiAudio && typeof LumiAudio.speak === 'function') {
      LumiAudio.speak('q_custom7', txt, '');
    }
  }

  function renderBatch7UI(stage, badge, icon, questionText, subText, options, correctAns) {
    stage.innerHTML = `
      <div style="background:linear-gradient(135deg,#fff7ed,#ffedd5);border:2px solid #fdba74;border-radius:20px;padding:18px;text-align:center;max-width:650px;margin:0 auto;">
        <div style="display:inline-block;background:#ea580c;color:#fff;padding:4px 14px;border-radius:999px;font-size:0.85rem;font-weight:700;margin-bottom:10px;">${badge}</div>
        <div style="font-size:3.6rem;margin:6px 0;">${icon}</div>
        <h3 style="font-size:1.3rem;color:#7c2d12;margin:8px 0;line-height:1.5;">${questionText}</h3>
        ${subText ? `<p style="color:#c2410c;font-size:1.02rem;font-weight:700;margin:4px 0 12px;">${subText}</p>` : ''}
        <button type="button" id="b7-listen-btn" style="background:linear-gradient(135deg,#0ea5e9,#2563eb);color:#fff;border:none;border-radius:12px;padding:8px 18px;font-size:1rem;font-weight:700;cursor:pointer;margin-bottom:16px;">🔊 استمع للسؤال</button>
        <div id="b7-opts" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(165px,1fr));gap:12px;"></div>
      </div>
    `;

    stage.querySelector('#b7-listen-btn').onclick = () => speakNow(questionText);
    setTimeout(() => speakNow(questionText), 250);

    const box = stage.querySelector('#b7-opts');
    options.forEach(opt => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.style.cssText = 'background:#fff;border:2px solid #fed7aa;border-radius:16px;padding:14px 10px;font-size:1.15rem;font-weight:800;color:#0f172a;cursor:pointer;transition:transform 0.15s,background 0.2s;';
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

    if (!stage || !NEW_GAMES_BATCH_7.some(g => g.id === gid)) {
      return prevRender();
    }

    const meta = NEW_GAMES_BATCH_7.find(g => g.id === gid);
    const titleEl = document.getElementById('game-title');
    if (titleEl && meta) titleEl.innerHTML = `${meta.icon} ${meta.nameEg} <small>(${meta.nameFr})</small>`;
    const lvlEl = document.getElementById('game-level-badge');
    if (lvlEl) lvlEl.innerText = `المستوى ${this.currentLevel || 1} / 10`;

    if (gid === 'arabic_grammar_pro') {
      const item = AR_GRAM_QS[Math.floor(Math.random() * AR_GRAM_QS.length)];
      const opts = [...item.opts].sort(() => Math.random() - 0.5);
      return renderBatch7UI(stage, '🖋️ النحو والتراكيب', item.icon, item.q, item.fr, opts, item.ans);
    }

    if (gid === 'decimals_master_cm1') {
      const item = DECIMALS_QS[Math.floor(Math.random() * DECIMALS_QS.length)];
      const opts = [...item.opts].sort(() => Math.random() - 0.5);
      return renderBatch7UI(stage, '🔢 الأعداد العشرية CM1', item.icon, item.q, item.fr, opts, item.ans);
    }

    if (gid === 'coding_logic_blocks') {
      const item = CODING_QS[Math.floor(Math.random() * CODING_QS.length)];
      const opts = [...item.opts].sort(() => Math.random() - 0.5);
      return renderBatch7UI(stage, '🤖 منطق البرمجة', item.icon, item.q, item.fr, opts, item.ans);
    }

    if (gid === 'helen_toy_box') {
      const pool = [...HELEN_TOYS].sort(() => Math.random() - 0.5).slice(0, 3);
      const target = pool[0];
      const opts = [...pool].sort(() => Math.random() - 0.5).map(x => ({
        label: `<div style="font-size:3.2rem;">${x.icon}</div><div>${x.name}</div>`,
        value: x.name
      }));
      return renderBatch7UI(stage, '🧸 صندوق ألعاب هيلن', '🎁', `يا هيلن، اختاري ${target.name}`, '', opts, target.name);
    }

    if (gid === 'helen_garden_bugs') {
      const pool = [...HELEN_GARDEN].sort(() => Math.random() - 0.5).slice(0, 3);
      const target = pool[0];
      const opts = [...pool].sort(() => Math.random() - 0.5).map(x => ({
        label: `<div style="font-size:3.3rem;">${x.icon}</div><div>${x.name}</div>`,
        value: x.name
      }));
      return renderBatch7UI(stage, '🦋 حديقة هيلن', '🌿', `أين ${target.name}؟`, '', opts, target.name);
    }
  };
})();
