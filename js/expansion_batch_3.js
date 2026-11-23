(function() {
  if (typeof LumiDictionary === 'undefined' || typeof LumiGames === 'undefined') return;

  const NEW_GAMES_BATCH_3 = [
    { id: 'egypt_history_quest', icon: '🏺', nameEg: 'كنوز وحضارة مصر', nameFr: 'Trésors d’Égypte', domain: 'geo', minAge: 6 },
    { id: 'geometry_area_pro', icon: '📐', nameEg: 'المحيط والمساحة CM1', nameFr: 'Périmètre et Aire', domain: 'math', minAge: 6 },
    { id: 'logic_sequence_pro', icon: '🧩', nameEg: 'ألغاز المتتاليات الذكية', nameFr: 'Suites Logiques', domain: 'logic', minAge: 6 },
    { id: 'helen_community_helpers', icon: '👩‍⚕️', nameEg: 'أبطال المهن الجميلة', nameFr: 'Les Métiers', domain: 'discovery', minAge: 3 },
    { id: 'helen_vehicles_ride', icon: '🚀', nameEg: 'مواصلات البر والبحر والجو', nameFr: 'Les Transports', domain: 'discovery', minAge: 3 }
  ];

  LumiDictionary.games = LumiDictionary.games || [];
  LumiDictionary.gameInstructions = LumiDictionary.gameInstructions || [];

  NEW_GAMES_BATCH_3.forEach(g => {
    if (!LumiDictionary.games.some(x => x.id === g.id)) {
      LumiDictionary.games.push(g);
    }
  });

  const BATCH_3_INSTRUCTIONS = [
    { id: 'inst_egypt_hist', gameId: 'egypt_history_quest', eg: 'استكشفي كنوز وحضارة مصر العريقة واختاري الإجابة الصحيحة!', fr: 'Découvre l’histoire de l’Égypte !' },
    { id: 'inst_geom_area', gameId: 'geometry_area_pro', eg: 'احسبي المحيط أو المساحة بدقة يا مهندسة!', fr: 'Calcule le périmètre ou l’aire !' },
    { id: 'inst_logic_seq', gameId: 'logic_sequence_pro', eg: 'اكتشفي القاعدة واختاري الرقم التالي في السلسلة!', fr: 'Trouve le nombre suivant dans la suite !' },
    { id: 'inst_helen_jobs', gameId: 'helen_community_helpers', eg: 'يا هيلن، اختاري البطل المناسب لكل مهنة!', fr: 'Choisis le bon métier !' },
    { id: 'inst_helen_rides', gameId: 'helen_vehicles_ride', eg: 'يا هيلن، اختاري وسيلة المواصلات المطلوبة!', fr: 'Choisis le bon transport !' }
  ];

  BATCH_3_INSTRUCTIONS.forEach(ins => {
    if (!LumiDictionary.gameInstructions.some(x => x.gameId === ins.gameId)) {
      LumiDictionary.gameInstructions.push(ins);
    }
  });

  const EGYPT_QS = [
    { q: 'ما هو أطول نهر في العالم ويمر في قلب مصر؟', fr: 'Quel est le plus long fleuve d’Égypte ?', icon: '🌊', opts: ['نهر النيل (Le Nil)', 'نهر السين (La Seine)', 'نهر الأمازون (L’Amazone)'], ans: 'نهر النيل (Le Nil)' },
    { q: 'من هو الملك المصري الصغير الذي اكتُشفت مقبرته كاملة؟', fr: 'Quel jeune pharaon est célèbre pour son trésor ?', icon: '👑', opts: ['توت عنخ آمون (Toutânkhamon)', 'خوفو (Khéops)', 'أحمس (Ahmôsis)'], ans: 'توت عنخ آمون (Toutânkhamon)' },
    { q: 'ما اسم القناة التي تربط البحر الأحمر بالبحر المتوسط في مصر؟', fr: 'Quel canal relie la mer Rouge à la Méditerranée ?', icon: '🚢', opts: ['قناة السويس (Canal de Suez)', 'قناة بنما (Canal de Panama)', 'بحيرة ناصر (Lac Nasser)'], ans: 'قناة السويس (Canal de Suez)' },
    { q: 'أي مدينة مصرية تُلقب بعروس البحر الأبيض المتوسط؟', fr: 'Quelle ville est la perle de la Méditerranée ?', icon: '🏖️', opts: ['الإسكندرية (Alexandrie)', 'الأقصر (Louxor)', 'المنيا (Minya)'], ans: 'الإسكندرية (Alexandrie)' },
    { q: 'على أي ورق كان يكتب المصريون القدماء؟', fr: 'Sur quoi écrivaient les anciens Égyptiens ?', icon: '📜', opts: ['ورق البردي (Le Papyrus)', 'الورق المقوى (Le Carton)', 'البلاستيك (Le Plastique)'], ans: 'ورق البردي (Le Papyrus)' }
  ];

  const HELEN_JOBS = [
    { name: 'الطبيبة (Le Médecin)', icon: '👩‍⚕️', clue: 'تعالج المرضى في المستشفى' },
    { name: 'رجل الإطفاء (Le Pompier)', icon: '👨‍🚒', clue: 'يطفئ الحرائق وينقذ الناس' },
    { name: 'رائد الفضاء (L’Astronaute)', icon: '👩‍🚀', clue: 'يسافر بالصاروخ إلى القمر' },
    { name: 'المعلمة (La Maîtresse)', icon: '👩‍🏫', clue: 'تعلمنا القراءة والرياضيات' },
    { name: 'الطباخ الماهر (Le Cuisinier)', icon: '👨‍🍳', clue: 'يجهز أشهى الأطعمة' }
  ];

  const HELEN_VEHICLES = [
    { name: 'الطائرة (L’Avion)', icon: '✈️', clue: 'تطير عالياً في السماء' },
    { name: 'السفينة (Le Bateau)', icon: '🚢', clue: 'تبحر في البحر والنيل' },
    { name: 'القطار (Le Train)', icon: '🚆', clue: 'يسير بسرعة على القضبان' },
    { name: 'السيارة (La Voiture)', icon: '🚗', clue: 'تسير على الطريق' },
    { name: 'الدراجة (Le Vélo)', icon: '🚲', clue: 'لها عجلتان ونركبها في الحديقة' }
  ];

  function speakNow(txt) {
    if (window.LumiQuestionVoice && typeof LumiQuestionVoice.speak === 'function') {
      LumiQuestionVoice.speak(txt);
    } else if (window.LumiAudio && typeof LumiAudio.speak === 'function') {
      LumiAudio.speak('q_custom3', txt, '');
    }
  }

  function renderBatch3UI(stage, badge, icon, questionText, subText, options, correctAns) {
    stage.innerHTML = `
      <div style="background:linear-gradient(135deg,#ecfdf5,#d1fae5);border:2px solid #6ee7b7;border-radius:20px;padding:18px;text-align:center;max-width:650px;margin:0 auto;">
        <div style="display:inline-block;background:#059669;color:#fff;padding:4px 14px;border-radius:999px;font-size:0.85rem;font-weight:700;margin-bottom:10px;">${badge}</div>
        <div style="font-size:3.6rem;margin:6px 0;">${icon}</div>
        <h3 style="font-size:1.3rem;color:#064e3b;margin:8px 0;line-height:1.5;">${questionText}</h3>
        ${subText ? `<p style="color:#047857;font-size:1.02rem;font-weight:700;margin:4px 0 12px;">${subText}</p>` : ''}
        <button type="button" id="b3-listen-btn" style="background:linear-gradient(135deg,#0ea5e9,#2563eb);color:#fff;border:none;border-radius:12px;padding:8px 18px;font-size:1rem;font-weight:700;cursor:pointer;margin-bottom:16px;">🔊 استمع للسؤال</button>
        <div id="b3-opts" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(165px,1fr));gap:12px;"></div>
      </div>
    `;

    stage.querySelector('#b3-listen-btn').onclick = () => speakNow(questionText);
    setTimeout(() => speakNow(questionText), 250);

    const box = stage.querySelector('#b3-opts');
    options.forEach(opt => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.style.cssText = 'background:#fff;border:2px solid #a7f3d0;border-radius:16px;padding:14px 10px;font-size:1.12rem;font-weight:800;color:#0f172a;cursor:pointer;transition:transform 0.15s,background 0.2s;';
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

    if (!stage || !NEW_GAMES_BATCH_3.some(g => g.id === gid)) {
      return prevRender();
    }

    const meta = NEW_GAMES_BATCH_3.find(g => g.id === gid);
    const titleEl = document.getElementById('game-title');
    if (titleEl && meta) titleEl.innerHTML = `${meta.icon} ${meta.nameEg} <small>(${meta.nameFr})</small>`;
    const lvlEl = document.getElementById('game-level-badge');
    if (lvlEl) lvlEl.innerText = `المستوى ${this.currentLevel || 1} / 10`;

    if (gid === 'egypt_history_quest') {
      const item = EGYPT_QS[Math.floor(Math.random() * EGYPT_QS.length)];
      const opts = [...item.opts].sort(() => Math.random() - 0.5);
      return renderBatch3UI(stage, '🏺 دراسات وحضارة مصر', item.icon, item.q, item.fr, opts, item.ans);
    }

    if (gid === 'geometry_area_pro') {
      const isSquare = Math.random() > 0.5;
      const side = Math.floor(Math.random() * 7) + 3;
      const w = Math.floor(Math.random() * 5) + 2;
      const ans = isSquare ? (side * 4) : (side * w);
      const qTxt = isSquare
        ? `مربع طول ضلعه ${side} سم، كم يساوي محيطه (الضلع × 4)؟`
        : `مستطيل طوله ${side} سم وعرضه ${w} سم، كم تساوي مساحته (الطول × العرض)؟`;
      const frTxt = isSquare ? `Périmètre du carré de côté ${side} cm` : `Aire du rectangle (${side} × ${w})`;
      const set = new Set([`${ans} سم`]);
      while (set.size < 3) {
        const fake = ans + (Math.floor(Math.random() * 6) + 2) * (Math.random() > 0.5 ? 1 : -1);
        if (fake > 0) set.add(`${fake} سم`);
      }
      return renderBatch3UI(stage, '📐 هندسة CM1', '📏', qTxt, frTxt, [...set].sort(() => Math.random() - 0.5), `${ans} سم`);
    }

    if (gid === 'logic_sequence_pro') {
      const start = Math.floor(Math.random() * 10) + 2;
      const step = [2, 3, 5, 10][Math.floor(Math.random() * 4)];
      const seq = [start, start + step, start + step * 2, start + step * 3];
      const ans = String(start + step * 4);
      const opts = [ans, String(start + step * 4 + 1), String(start + step * 3 + 1)].sort(() => Math.random() - 0.5);
      return renderBatch3UI(
        stage,
        '🧩 متتاليات منطقية',
        '🔢',
        `أكملي الرقم التالي: <span dir="ltr" style="font-size:1.5rem;color:#065f46;">${seq.join(' , ')} , [ ? ]</span>`,
        `الزيادة بمقدار +${step} في كل خطوة`,
        opts,
        ans
      );
    }

    if (gid === 'helen_community_helpers') {
      const pool = [...HELEN_JOBS].sort(() => Math.random() - 0.5).slice(0, 3);
      const target = pool[0];
      const opts = [...pool].sort(() => Math.random() - 0.5).map(x => ({
        label: `<div style="font-size:3.2rem;">${x.icon}</div><div>${x.name}</div>`,
        value: x.name
      }));
      return renderBatch3UI(stage, '🌸 عالم هيلن الجميل', '🌟', `اختاري ${target.name}`, target.clue, opts, target.name);
    }

    if (gid === 'helen_vehicles_ride') {
      const pool = [...HELEN_VEHICLES].sort(() => Math.random() - 0.5).slice(0, 3);
      const target = pool[0];
      const opts = [...pool].sort(() => Math.random() - 0.5).map(x => ({
        label: `<div style="font-size:3.3rem;">${x.icon}</div><div>${x.name}</div>`,
        value: x.name
      }));
      return renderBatch3UI(stage, '🚀 مواصلات هيلن', '🚦', `أين ${target.name}؟`, target.clue, opts, target.name);
    }
  };
})();
