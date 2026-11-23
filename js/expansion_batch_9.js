(function() {
  if (typeof LumiDictionary === 'undefined' || typeof LumiGames === 'undefined') return;

  const NEW_GAMES_BATCH_9 = [
    { id: 'units_measure_cm1', icon: '📏', nameEg: 'وحدات الطول والوزن CM1', nameFr: 'Unités de Mesure', domain: 'math', minAge: 6 },
    { id: 'social_wisdom_pro', icon: '🤝', nameEg: 'الذكاء الاجتماعي والأدب', nameFr: 'Savoir-Vivre', domain: 'logic', minAge: 6 },
    { id: 'matter_states_cm1', icon: '🧊', nameEg: 'حالات المادة والماء', nameFr: 'États de la Matière', domain: 'sciences', minAge: 6 },
    { id: 'helen_french_numbers', icon: '1️⃣', nameEg: 'أرقام هيلن بالفرنسية', nameFr: 'Compter 1 à 5', domain: 'math', minAge: 3 },
    { id: 'helen_forest_treasures', icon: '🌲', nameEg: 'طبيعة هيلن الساحرة', nameFr: 'La Nature', domain: 'discovery', minAge: 3 }
  ];

  LumiDictionary.games = LumiDictionary.games || [];
  LumiDictionary.gameInstructions = LumiDictionary.gameInstructions || [];

  NEW_GAMES_BATCH_9.forEach(g => {
    if (!LumiDictionary.games.some(x => x.id === g.id)) {
      LumiDictionary.games.push(g);
    }
  });

  const BATCH_9_INSTRUCTIONS = [
    { id: 'inst_units_cm1', gameId: 'units_measure_cm1', eg: 'حوّلي وحدات الطول والوزن بدقة يا بطلة الرياضيات!', fr: 'Convertis les unités de mesure !' },
    { id: 'inst_social_wis', gameId: 'social_wisdom_pro', eg: 'اختاري التصرف الذكي والمهذب في كل موقف!', fr: 'Choisis le meilleur comportement !' },
    { id: 'inst_matter', gameId: 'matter_states_cm1', eg: 'حددي حالة المادة الصحيحة في علوم رابعة ابتدائي!', fr: 'Choisis le bon état de la matière !' },
    { id: 'inst_helen_frnum', gameId: 'helen_french_numbers', eg: 'يا هيلن، عُدّي واختاري الرقم الفرنسي الصحيح!', fr: 'Compte et choisis le bon chiffre !' },
    { id: 'inst_helen_forest', gameId: 'helen_forest_treasures', eg: 'يا هيلن، اختاري منظر الطبيعة المطلوب!', fr: 'Choisis le bon élément de la nature !' }
  ];

  BATCH_9_INSTRUCTIONS.forEach(ins => {
    if (!LumiDictionary.gameInstructions.some(x => x.gameId === ins.gameId)) {
      LumiDictionary.gameInstructions.push(ins);
    }
  });

  const UNITS_QS = [
    { q: 'كم سنتيمتراً يوجد في المتر الواحد (1 m = ? cm)؟', fr: '1 mètre égale combien de centimètres ?', icon: '📏', opts: ['100 سم (100 cm)', '10 سم (10 cm)', '1000 سم (1000 cm)'], ans: '100 سم (100 cm)' },
    { q: 'كم جراماً يوجد في الكيلوجرام الواحد (1 kg = ? g)؟', fr: '1 kilogramme égale combien de grammes ?', icon: '⚖️', opts: ['1000 جرام (1000 g)', '100 جرام (100 g)', '500 جرام (500 g)'], ans: '1000 جرام (1000 g)' },
    { q: 'نصف كيلوجرام (1/2 kg) يساوي كم جراماً؟', fr: 'Un demi-kilogramme égale combien de grammes ?', icon: '🍎', opts: ['500 جرام (500 g)', '250 جراماً (250 g)', '100 جرام (100 g)'], ans: '500 جرام (500 g)' },
    { q: 'أي وحدة نستخدم لقياس المسافة الطويلة بين الإسكندرية والقاهرة؟', fr: 'Quelle unité mesure la distance entre deux villes ?', icon: '🚗', opts: ['الكيلومتر (Kilomètre - km)', 'السنتيمتر (Centimètre - cm)', 'المليمتر (Millimètre - mm)'], ans: 'الكيلومتر (Kilomètre - km)' },
    { q: 'كم متراً يوجد في 3 كيلومترات (3 km)؟', fr: '3 kilomètres égalent combien de mètres ?', icon: '🛣️', opts: ['3000 متر', '300 متر', '30 متراً'], ans: '3000 متر' }
  ];

  const SOCIAL_QS = [
    { q: 'إذا أخطأ زميلك دون قصد واعتذر لك بلطف، ماذا تقولين له؟', fr: 'Comment réagir avec politesse ?', icon: '🤝', opts: ['لا بأس، أسامحك بكل سرور', 'أغضب ولا أرد عليه', 'أصرخ في وجهه'], ans: 'لا بأس، أسامحك بكل سرور' },
    { q: 'طلب منكِ شخص غريب على الإنترنت اسم مدرستك وعنوان بيتك، ماذا تفعلين؟', fr: 'Sécurité sur Internet', icon: '🛡️', opts: ['أرفض فوراً وأخبر بابا وماما', 'أكتب له العنوان فوراً', 'أرسل له صورتي'], ans: 'أرفض فوراً وأخبر بابا وماما' },
    { q: 'عندما يتحدث شخص أكبر منكِ أو المعلمة في الفصل، ما التصرف الصحيح؟', fr: 'Écoute et respect en classe', icon: '🏫', opts: ['أنصت باهتمام وأرفع يدي للإذن', 'أقاطعه بصوت عالٍ', 'ألعب بالهاتف'], ans: 'أنصت باهتمام وأرفع يدي للإذن' },
    { q: 'وجدتِ قلماً أو محفظة مفقودة في فناء المدرسة، ماذا تفعلين؟', fr: 'Honnêteté à l’école', icon: '🌟', opts: ['أسلمها للمعلمة أو الإدارة فوراً', 'أخفيها في حقيبتي', 'أرميها على الأرض'], ans: 'أسلمها للمعلمة أو الإدارة فوراً' }
  ];

  const MATTER_QS = [
    { q: 'ما هي حالة مكعب الثلج (La glace)؟', fr: 'Quel est l’état de la glace ?', icon: '🧊', opts: ['حالة صلبة (Solide)', 'حالة سائلة (Liquide)', 'حالة غازية (Gazeux)'], ans: 'حالة صلبة (Solide)' },
    { q: 'ماذا يحدث للماء عندما نضعه في الفريزر (درجة حرارة 0)؟', fr: 'Que devient l’eau au congélateur ?', icon: '❄️', opts: ['يتجمد ويصبح ثلجاً (Solidification)', 'يتبخر في الهواء', 'يغلي ويفور'], ans: 'يتجمد ويصبح ثلجاً (Solidification)' },
    { q: 'ما هي حالة بخار الماء المتصاعد من الإبريق الساخن؟', fr: 'Quel est l’état de la vapeur d’eau ?', icon: '♨️', opts: ['حالة غازية (Gazeux)', 'حالة صلبة (Solide)', 'حالة معدنية'], ans: 'حالة غازية (Gazeux)' },
    { q: 'العصير والماء وزيت الزيتون أمثلة على أي حالة من حالات المادة؟', fr: 'L’eau et le jus sont dans quel état ?', icon: '🧃', opts: ['حالة سائلة (Liquide)', 'حالة صلبة (Solide)', 'حالة غازية (Gazeux)'], ans: 'حالة سائلة (Liquide)' }
  ];

  const FR_NUMS = [
    { count: 1, icon: '🍎', name: 'واحد — Un (1)' },
    { count: 2, icon: '🐱🐱', name: 'اثنان — Deux (2)' },
    { count: 3, icon: '⭐⭐⭐', name: 'ثلاثة — Trois (3)' },
    { count: 4, icon: '🦋🦋🦋🦋', name: 'أربعة — Quatre (4)' },
    { count: 5, icon: '🍓🍓🍓🍓🍓', name: 'خمسة — Cinq (5)' }
  ];

  const FOREST_ITEMS = [
    { name: 'الشجرة الخضراء (L’Arbre)', icon: '🌳' },
    { name: 'الجبل العالي (La Montagne)', icon: '⛰️' },
    { name: 'قوس قزح (L’Arc-en-ciel)', icon: '🌈' },
    { name: 'الوردة الحمراء (La Fleur)', icon: '🌹' },
    { name: 'الماء والنهر (La Rivière)', icon: '🏞️' }
  ];

  function speakNow(txt) {
    if (window.LumiQuestionVoice && typeof LumiQuestionVoice.speak === 'function') {
      LumiQuestionVoice.speak(txt);
    } else if (window.LumiAudio && typeof LumiAudio.speak === 'function') {
      LumiAudio.speak('q_custom9', txt, '');
    }
  }

  function renderBatch9UI(stage, badge, icon, questionText, subText, options, correctAns) {
    stage.innerHTML = `
      <div style="background:linear-gradient(135deg,#fefce8,#fef08a);border:2px solid #eab308;border-radius:20px;padding:18px;text-align:center;max-width:650px;margin:0 auto;">
        <div style="display:inline-block;background:#ca8a04;color:#fff;padding:4px 14px;border-radius:999px;font-size:0.85rem;font-weight:700;margin-bottom:10px;">${badge}</div>
        <div style="font-size:3.4rem;margin:6px 0;">${icon}</div>
        <h3 style="font-size:1.3rem;color:#713f12;margin:8px 0;line-height:1.5;">${questionText}</h3>
        ${subText ? `<p style="color:#a16207;font-size:1.02rem;font-weight:700;margin:4px 0 12px;">${subText}</p>` : ''}
        <button type="button" id="b9-listen-btn" style="background:linear-gradient(135deg,#0ea5e9,#2563eb);color:#fff;border:none;border-radius:12px;padding:8px 18px;font-size:1rem;font-weight:700;cursor:pointer;margin-bottom:16px;">🔊 استمع للسؤال</button>
        <div id="b9-opts" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(165px,1fr));gap:12px;"></div>
      </div>
    `;

    stage.querySelector('#b9-listen-btn').onclick = () => speakNow(questionText);
    setTimeout(() => speakNow(questionText), 250);

    const box = stage.querySelector('#b9-opts');
    options.forEach(opt => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.style.cssText = 'background:#fff;border:2px solid #fde047;border-radius:16px;padding:14px 10px;font-size:1.15rem;font-weight:800;color:#0f172a;cursor:pointer;transition:transform 0.15s,background 0.2s;';
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

    if (!stage || !NEW_GAMES_BATCH_9.some(g => g.id === gid)) {
      return prevRender();
    }

    const meta = NEW_GAMES_BATCH_9.find(g => g.id === gid);
    const titleEl = document.getElementById('game-title');
    if (titleEl && meta) titleEl.innerHTML = `${meta.icon} ${meta.nameEg} <small>(${meta.nameFr})</small>`;
    const lvlEl = document.getElementById('game-level-badge');
    if (lvlEl) lvlEl.innerText = `المستوى ${this.currentLevel || 1} / 10`;

    if (gid === 'units_measure_cm1') {
      const item = UNITS_QS[Math.floor(Math.random() * UNITS_QS.length)];
      const opts = [...item.opts].sort(() => Math.random() - 0.5);
      return renderBatch9UI(stage, '📏 قياس وتحويل CM1', item.icon, item.q, item.fr, opts, item.ans);
    }

    if (gid === 'social_wisdom_pro') {
      const item = SOCIAL_QS[Math.floor(Math.random() * SOCIAL_QS.length)];
      const opts = [...item.opts].sort(() => Math.random() - 0.5);
      return renderBatch9UI(stage, '🤝 الذكاء الاجتماعي', item.icon, item.q, item.fr, opts, item.ans);
    }

    if (gid === 'matter_states_cm1') {
      const item = MATTER_QS[Math.floor(Math.random() * MATTER_QS.length)];
      const opts = [...item.opts].sort(() => Math.random() - 0.5);
      return renderBatch9UI(stage, '🧊 علوم المادة CM1', item.icon, item.q, item.fr, opts, item.ans);
    }

    if (gid === 'helen_french_numbers') {
      const pool = [...FR_NUMS].sort(() => Math.random() - 0.5).slice(0, 3);
      const target = pool[0];
      const opts = [...pool].sort(() => Math.random() - 0.5).map(x => ({
        label: `<div style="font-size:1.3rem;">${x.name}</div>`,
        value: x.name
      }));
      return renderBatch9UI(stage, '1️⃣ أرقام هيلن', target.icon, `كم عدد العناصر هنا؟ اختاري الرقم!`, '', opts, target.name);
    }

    if (gid === 'helen_forest_treasures') {
      const pool = [...FOREST_ITEMS].sort(() => Math.random() - 0.5).slice(0, 3);
      const target = pool[0];
      const opts = [...pool].sort(() => Math.random() - 0.5).map(x => ({
        label: `<div style="font-size:3.2rem;">${x.icon}</div><div>${x.name}</div>`,
        value: x.name
      }));
      return renderBatch9UI(stage, '🌲 طبيعة هيلن', '🌿', `يا هيلن، أين ${target.name}؟`, '', opts, target.name);
    }
  };
})();
