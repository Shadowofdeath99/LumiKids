(function() {
  if (typeof LumiDictionary === 'undefined' || typeof LumiGames === 'undefined') return;

  const cm1Games = [
    { id: 'cm1_math_numbers', icon: '🔢', nameEg: 'رياضيات 4ب: الأعداد والكسور', nameFr: 'Maths CM1: Nombres & Fractions', color: '#2563EB', minAge: 8 },
    { id: 'cm1_math_geom', icon: '📐', nameEg: 'رياضيات 4ب: الهندسة والمساحة', nameFr: 'Maths CM1: Géométrie & Aire', color: '#7C3AED', minAge: 8 },
    { id: 'cm1_sciences', icon: '🧬', nameEg: 'علوم 4ب: التكيف والطاقة', nameFr: 'Sciences CM1: Adaptation & Énergie', color: '#059669', minAge: 8 },
    { id: 'cm1_french_gram', icon: '🇫🇷', nameEg: 'فرنساوي 4ب: القواعد والأفعال', nameFr: 'Français CM1: Grammaire & Verbes', color: '#DC2626', minAge: 8 },
    { id: 'cm1_arabic_nahw', icon: '📜', nameEg: 'عربي 4ب: النحو والتراكيب', nameFr: 'Arabe 4ème: Grammaire', color: '#D97706', minAge: 8 },
    { id: 'cm1_social_egypt', icon: '🏛️', nameEg: 'دراسات 4ب: مصر والإسكندرية', nameFr: 'Géographie: L’Égypte', color: '#0891B2', minAge: 8 },
    { id: 'cm1_iq_master', icon: '🧠', nameEg: 'تحدي العباقرة والمنطق', nameFr: 'Défi Génie & Logique', color: '#4F46E5', minAge: 8 },
    { id: 'family_mission', icon: '👨‍👩‍👧‍👧', nameEg: 'تحدي بابا مينا وماما ساندرا', nameFr: 'Mission Famille', color: '#DB2777', minAge: 3 }
  ];

  const cm1Instructions = [
    { id: 'inst_cm1_num', gameId: 'cm1_math_numbers', eg: 'اقرئي المسألة بالفرنسية واحسبي الإجابة الدقيقة!', fr: 'Lis bien et calcule la bonne réponse !' },
    { id: 'inst_cm1_geo', gameId: 'cm1_math_geom', eg: 'احسبي المحيط أو المساحة أو نوع الزاوية!', fr: 'Calcule le périmètre, l’aire ou l’angle !' },
    { id: 'inst_cm1_sci', gameId: 'cm1_sciences', eg: 'اختاري التفسير العلمي الصحيح بالفرنسية!', fr: 'Choisis la bonne réponse scientifique !' },
    { id: 'inst_cm1_fr', gameId: 'cm1_french_gram', eg: 'اختاري التصريف أو الصيغة الصحيحة في اللغة الفرنسية!', fr: 'Choisis la bonne forme grammaticale !' },
    { id: 'inst_cm1_ar', gameId: 'cm1_arabic_nahw', eg: 'اختاري الإعراب أو التركيب النحوي الصحيح!', fr: 'Choisis la bonne structure en arabe !' },
    { id: 'inst_cm1_soc', gameId: 'cm1_social_egypt', eg: 'اختاري المعلومة الجغرافية أو التاريخية الصحيحة!', fr: 'Choisis la bonne réponse géographique !' },
    { id: 'inst_cm1_iq', gameId: 'cm1_iq_master', eg: 'فكّري بذكاء لحل اللغز المنطقي!', fr: 'Réfléchis bien pour résoudre l’énigme !' },
    { id: 'inst_fam', gameId: 'family_mission', eg: 'رسالة وتحدي خاص من بابا مينا وماما ساندرا!', fr: 'Défi spécial de Papa Mina et Maman Sandra !' }
  ];

  if (Array.isArray(LumiDictionary.games)) {
    cm1Games.forEach(ng => {
      if (!LumiDictionary.games.some(g => g.id === ng.id)) LumiDictionary.games.push(ng);
    });
  }
  if (Array.isArray(LumiDictionary.gameInstructions)) {
    cm1Instructions.forEach(ni => {
      if (!LumiDictionary.gameInstructions.some(i => i.gameId === ni.gameId)) LumiDictionary.gameInstructions.push(ni);
    });
  }

  const pick = arr => arr[Math.floor(Math.random() * arr.length)];
  const shuffle = arr => [...arr].sort(() => Math.random() - 0.5);

  const banks = {
    cm1_math_numbers: [
      { title: 'Quelle est la valeur du chiffre 7 dans : 4 725 310 ?', sub: 'ما هي القيمة المكانية للرقم 7 في العدد؟', badge: '4 725 310', ans: '700 000 (7 centaines de mille)', wrongs: ['70 000', '7 000 000', '7 000'] },
      { title: 'Calcule : 3/5 + 1/5 = ?', sub: 'اجمعي الكسرين:', badge: '3/5 + 1/5', ans: '4/5', wrongs: ['4/10', '2/5', '3/25'] },
      { title: 'Lequel est le plus grand nombre décimal ?', sub: 'أي عدد عشري هو الأكبر؟', badge: '0,45  vs  0,5', ans: '0,5 (0,50)', wrongs: ['0,45', '0,09', '0,49'] },
      { title: 'Un livre coûte 45 L.E. Combien coûtent 4 livres ?', sub: 'مسألة كلامية بالفرنسية:', badge: '45 × 4 = ?', ans: '180 L.E.', wrongs: ['160 L.E.', '175 L.E.', '190 L.E.'] },
      { title: 'Convertis en nombre décimal : 7 / 10', sub: 'حوّلي الكسر إلى عدد عشري:', badge: '7 / 10', ans: '0,7', wrongs: ['0,07', '7,0', '0,77'] }
    ],
    cm1_math_geom: [
      { title: 'Un carré a un côté de 6 cm. Quel est son périmètre (P) ?', sub: 'محيط المربع = طول الضلع × 4', badge: '⬜ Côté = 6 cm', ans: '24 cm', wrongs: ['36 cm', '12 cm', '18 cm'] },
      { title: 'Un rectangle mesure 8 cm de long et 5 cm de large. Quelle est son aire (A) ?', sub: 'مساحة المستطيل = الطول × العرض', badge: '▭ 8 cm × 5 cm', ans: '40 cm²', wrongs: ['26 cm²', '13 cm²', '45 cm²'] },
      { title: 'Un angle qui mesure 90° s’appelle :', sub: 'الزاوية التي قياسها 90 درجة تسمى:', badge: '📐 90°', ans: 'Un angle droit (زاوية قائمة)', wrongs: ['Un angle aigu (حادة)', 'Un angle obtus (منفرجة)', 'Un angle plat (مستقيمة)'] },
      { title: 'Combien de côtés a un hexagone ?', sub: 'كم عدد أضلاع الشكل السداسي؟', badge: '⬡ Hexagone', ans: '6 côtés', wrongs: ['5 côtés', '8 côtés', '7 côtés'] }
    ],
    cm1_sciences: [
      { title: 'Comment le fennec s’adapte-t-il à la chaleur du désert ?', sub: 'كيف يتكيف ثعلب الفنك مع حرارة الصحراء؟', badge: '🦊 Le Fennec', ans: 'Il a de grandes oreilles pour évacuer la chaleur', wrongs: ['Il a une épaisse couche de graisse', 'Il vit sous l’eau', 'Il dort tout l’hiver'] },
      { title: 'Quel organe analyse les messages envoyés par les sens ?', sub: 'أي عضو يحلل الرسائل القادمة من الحواس؟', badge: '🧠 Système nerveux', ans: 'Le cerveau (المخ)', wrongs: ['Le cœur (القلب)', 'L’estomac (المعدة)', 'Les poumons (الرئتان)'] },
      { title: 'Quelle source d’énergie est renouvelable et propre ?', sub: 'أي مصدر طاقة متجدد ونظيف؟', badge: '☀️ Énergie', ans: 'L’énergie solaire (الطاقة الشمسية)', wrongs: ['Le charbon (الفحم)', 'Le pétrole (البترول)', 'Le gaz naturel'] },
      { title: 'Que se passe-t-il quand la lumière frappe un miroir ?', sub: 'ماذا يحدث عندما يسقط الضوء على مرآة؟', badge: '🪞 La Lumière', ans: 'Elle est réfléchie (ينعكس الضوء)', wrongs: ['Elle disparaît complètement', 'Elle devient du son', 'Le miroir fond'] }
    ],
    cm1_french_gram: [
      { title: 'Complète au présent : Nous ______ nos leçons chaque soir.', sub: 'صرّفي فعل (étudier) مع الضمير Nous:', badge: 'Nous + étudier', ans: 'étudions', wrongs: ['étudiez', 'étudient', 'étudie'] },
      { title: 'Choisis l’adjectif correct : Une fleur ______ .', sub: 'اختاري الصفة المؤنثة المناسبة:', badge: 'Une fleur (fém.)', ans: 'blanche', wrongs: ['blanc', 'blancs', 'blanches'] },
      { title: 'Quel est le pluriel de « un cheval » ?', sub: 'ما هو جمع كلمة cheval؟', badge: 'un cheval ➡️ des ...', ans: 'des chevaux', wrongs: ['des chevals', 'des chevaus', 'des chevales'] },
      { title: 'Complète avec le verbe « aller » : Tu ______ à l’école.', sub: 'صرّفي فعل aller مع Tu:', badge: 'Tu + aller', ans: 'vas', wrongs: ['vais', 'va', 'allez'] }
    ],
    cm1_arabic_nahw: [
      { title: 'حدد ركني الجملة الاسمية في: « العلمُ نورٌ ساطعٌ »', sub: 'قواعد النحو للصف الرابع الابتدائي:', badge: 'العلمُ نورٌ', ans: 'المبتدأ: العلمُ — الخبر: نورٌ', wrongs: ['الفعل: العلمُ — الفاعل: نورٌ', 'المبتدأ: نورٌ — الخبر: ساطعٌ', 'جار ومجرور'] },
      { title: 'ما نوع الجمع في كلمة « المهندسون »؟', sub: 'أنواع الجموع في اللغة العربية:', badge: 'المهندسون', ans: 'جمع مذكر سالم', wrongs: ['جمع مؤنث سالم', 'جمع تكسير', 'مثنى'] },
      { title: 'أعرب كلمة « التلميذُ » في جملة: « نجحَ التلميذُ في الامتحانِ »', sub: 'تحديد الفاعل وعلامة رفعه:', badge: 'نجحَ التلميذُ', ans: 'فاعل مرفوع وعلامة رفعه الضمة', wrongs: ['مفعول به منصوب', 'مبتدأ مرفوع', 'اسم مجرور'] },
      { title: 'اختر الضمير المناسب: « ______ تلميذتان مجتهدتان »', sub: 'ضمائر الغائب للمثنى المؤنث:', badge: 'تلميذتان مجتهدتان', ans: 'هما', wrongs: ['هم', 'هن', 'هي'] }
    ],
    cm1_social_egypt: [
      { title: 'تقع مدينة الإسكندرية على ساحل أي بحر؟', sub: 'جغرافية مصر والبيئات الساحلية:', badge: '🌊 الإسكندرية', ans: 'البحر المتوسط', wrongs: ['البحر الأحمر', 'بحيرة ناصر', 'نهر الفرات'] },
      { title: 'ما هي أكبر محافظات مصر من حيث المساحة؟', sub: 'محافظات الحدود الصحراوية:', badge: '🗺️ محافظات مصر', ans: 'الوادي الجديد', wrongs: ['القاهرة', 'الإسكندرية', 'دمياط'] },
      { title: 'أين يصب نهر النيل في شمال مصر؟', sub: 'مجرى نهر النيل:', badge: '🏞️ نهر النيل', ans: 'في البحر المتوسط (فرعا دمياط ورشيد)', wrongs: ['في البحر الأحمر', 'في المحيط الهندي', 'في بحيرة قارون'] },
      { title: 'ما اللون الذي يدل على السلام في علم مصر؟', sub: 'رموز العلم المصري:', badge: '🇪🇬 علم مصر', ans: 'اللون الأبيض', wrongs: ['اللون الأحمر', 'اللون الأسود', 'اللون الأصفر'] }
    ],
    cm1_iq_master: [
      { title: 'إذا كان عمر هيفن 10 سنوات وعمر أختها هيلن 3 سنوات، فكم يكون مجموع عمريهما بعد 5 سنوات؟', sub: 'لغز التفكير الرياضي الذكي:', badge: '🧠 لغز الأعمار', ans: '23 سنة (15 + 8)', wrongs: ['18 سنة', '20 سنة', '25 سنة'] },
      { title: 'ما العدد الذي إذا ضربته في نفسه وأضفت إليه 4 أصبح الناتج 29؟', sub: 'معادلة ذهنية سريعة:', badge: '(؟ × ؟) + 4 = 29', ans: '5', wrongs: ['6', '4', '7'] },
      { title: 'أكملي المتتالية المنطقية: 3 ، 6 ، 12 ، 24 ، ...', sub: 'اكتشفي قاعدة الضرب:', badge: '3 ➡️ 6 ➡️ 12 ➡️ 24 ➡️ ❓', ans: '48', wrongs: ['30', '36', '42'] },
      { title: 'أنا شيء كلما أخذت مني كبرتُ، وكلما وضعت فيّ صغرتُ.. فمن أنا؟', sub: 'لغز التفكير الجانبي:', badge: '🤔 فزورة ذكية', ans: 'الحفرة', wrongs: ['البالون', 'الحقيبة', 'البحر'] }
    ]
  };

  function renderCM1Quiz(stage, gameId) {
    const q = pick(banks[gameId]);
    const opts = shuffle([q.ans, ...q.wrongs]);
    stage.innerHTML = `
      <div style="max-width:720px; margin:0 auto; padding:18px; text-align:center;">
        <div style="display:inline-block; background:linear-gradient(135deg,#4F46E5,#0EA5E9); color:#fff; padding:8px 18px; border-radius:999px; font-weight:800; font-size:1.1rem; margin-bottom:14px;">
          ${q.badge}
        </div>
        <div style="font-size:1.3rem; font-weight:800; line-height:1.6; margin-bottom:6px; direction:auto;">${q.title}</div>
        <div style="font-size:0.98rem; color:#64748B; margin-bottom:18px;">${q.sub}</div>
        <div id="cm1-options" style="display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:12px;"></div>
      </div>
    `;
    const box = stage.querySelector('#cm1-options');
    opts.forEach(opt => {
      const btn = document.createElement('button');
      btn.className = 'nav-btn';
      btn.style.cssText = 'padding:16px; font-size:1.08rem; font-weight:700; border-radius:16px; justify-content:center; text-align:center; line-height:1.4; cursor:pointer;';
      btn.textContent = opt;
      btn.onclick = () => {
        if (opt === q.ans) {
          btn.style.background = '#10B981';
          btn.style.color = '#fff';
          if (typeof LumiGames.handleAnswer === 'function') LumiGames.handleAnswer(true);
          else setTimeout(() => LumiGames.renderGameScreen(), 650);
        } else {
          btn.style.background = '#EF4444';
          btn.style.color = '#fff';
          if (typeof LumiGames.handleAnswer === 'function') LumiGames.handleAnswer(false);
        }
      };
      box.appendChild(btn);
    });
  }

  function renderFamilyMission(stage) {
    const prof = (typeof LumiStorage !== 'undefined') ? LumiStorage.getActiveProfile() : { id: 'heaven', name: 'هيفن' };
    const key = 'lumikids_family_missions_v1';
    let missions = [];
    try { missions = JSON.parse(localStorage.getItem(key) || '[]'); } catch (e) {}
    if (missions.length === 0) {
      missions = [
        { id: 1, from: 'بابا مينا ❤️', text: 'حلي 3 أسئلة في رياضيات رابعة ابتدائي بالفرنساوي ولكي نجمة ذهبية كبيرة!', done: false },
        { id: 2, from: 'ماما ساندرا 💕', text: 'راجعي درس العلوم (التكيف) وبعدها نلعب مع بعض تحدي الذاكرة!', done: false }
      ];
      localStorage.setItem(key, JSON.stringify(missions));
    }

    stage.innerHTML = `
      <div style="max-width:680px; margin:0 auto; padding:16px;">
        <div style="background:linear-gradient(135deg,#EC4899,#8B5CF6); color:#fff; padding:18px; border-radius:20px; text-align:center; margin-bottom:16px;">
          <h3 style="margin:0 0 6px;">👨‍👩‍👧‍👧 ركن التواصل الأسري مع ${prof.name}</h3>
          <p style="margin:0; font-size:0.95rem; opacity:0.95;">هنا يضع بابا مينا وماما ساندرا تحديات اليوم ورسائل التشجيع!</p>
        </div>

        <div id="fam-list" style="display:flex; flex-direction:column; gap:10px; margin-bottom:18px;">
          ${missions.map((m, idx) => `
            <div style="display:flex; align-items:center; justify-content:space-between; gap:10px; padding:14px 16px; border-radius:16px; background:${m.done ? 'rgba(16,185,129,0.12)' : 'rgba(99,102,241,0.08)'}; border:2px solid ${m.done ? '#10B981' : 'rgba(99,102,241,0.2)'};">
              <div>
                <div style="font-weight:800; color:#DB2777; font-size:0.92rem;">${m.from}</div>
                <div style="font-size:1.05rem; font-weight:700; text-decoration:${m.done ? 'line-through' : 'none'};">${m.text}</div>
              </div>
              <button class="nav-btn" data-idx="${idx}" style="background:${m.done ? '#10B981' : '#4F46E5'}; color:#fff; border-radius:12px; padding:10px 14px; white-space:nowrap;">
                ${m.done ? 'تم الإنجاز ✅' : 'أنجزتها! 🌟'}
              </button>
            </div>
          `).join('')}
        </div>

        <div style="padding:14px; border-radius:16px; border:1px dashed #94A3B8; background:rgba(148,163,184,0.06);">
          <div style="font-weight:800; margin-bottom:8px;">✍️ إضافة مهمة أو رسالة جديدة من بابا أو ماما:</div>
          <div style="display:flex; gap:8px; flex-wrap:wrap;">
            <select id="fam-sender" style="padding:10px; border-radius:10px; border:1px solid #CBD5E1; font-weight:700;">
              <option value="بابا مينا ❤️">بابا مينا ❤️</option>
              <option value="ماما ساندرا 💕">ماما ساندرا 💕</option>
            </select>
            <input id="fam-input" type="text" placeholder="اكتب التحدي أو الرسالة هنا..." style="flex:1; min-width:200px; padding:10px; border-radius:10px; border:1px solid #CBD5E1;" />
            <button id="fam-add-btn" class="nav-btn" style="background:#DB2777; color:#fff; border-radius:10px; padding:10px 16px;">إرسال 💌</button>
          </div>
        </div>
      </div>
    `;

    stage.querySelectorAll('#fam-list button').forEach(btn => {
      btn.onclick = () => {
        const i = Number(btn.getAttribute('data-idx'));
        missions[i].done = !missions[i].done;
        localStorage.setItem(key, JSON.stringify(missions));
        if (missions[i].done && typeof LumiStorage !== 'undefined' && typeof LumiStorage.addStars === 'function') {
          LumiStorage.addStars(5);
        }
        renderFamilyMission(stage);
      };
    });

    const addBtn = stage.querySelector('#fam-add-btn');
    if (addBtn) {
      addBtn.onclick = () => {
        const sender = stage.querySelector('#fam-sender').value;
        const text = stage.querySelector('#fam-input').value.trim();
        if (!text) return;
        missions.unshift({ id: Date.now(), from: sender, text, done: false });
        localStorage.setItem(key, JSON.stringify(missions));
        renderFamilyMission(stage);
      };
    }
  }

  const prevRender = LumiGames.renderGameScreen.bind(LumiGames);
  LumiGames.renderGameScreen = function() {
    if (this.currentGameId === 'family_mission') {
      const stage = document.getElementById('game-stage');
      const titleEl = document.getElementById('game-title');
      const badgeEl = document.getElementById('game-level-badge');
      const coOpBtn = document.getElementById('coop-toggle-btn');
      if (titleEl) titleEl.innerHTML = `👨‍👩‍👧‍👧 تحدي بابا مينا وماما ساندرا <small>(Mission Famille)</small>`;
      if (badgeEl) badgeEl.innerText = `تواصل عائلي ❤️`;
      if (coOpBtn) coOpBtn.style.display = 'none';
      renderFamilyMission(stage);
      return;
    }
    if (banks[this.currentGameId]) {
      const meta = LumiDictionary.games.find(g => g.id === this.currentGameId) || { icon: '🎓', nameEg: this.currentGameId, nameFr: 'CM1' };
      const stage = document.getElementById('game-stage');
      const titleEl = document.getElementById('game-title');
      const badgeEl = document.getElementById('game-level-badge');
      const coOpBtn = document.getElementById('coop-toggle-btn');
      if (titleEl) titleEl.innerHTML = `${meta.icon} ${meta.nameEg} <small>(${meta.nameFr})</small>`;
      if (badgeEl) badgeEl.innerText = `رابعة ابتدائي — مستوى ${this.currentLevel || 1}`;
      if (coOpBtn) coOpBtn.style.display = 'none';
      this.questionStartTime = Date.now();
      renderCM1Quiz(stage, this.currentGameId);
      return;
    }
    return prevRender();
  };

  if (window.LumiApp && typeof LumiApp.renderGamesGrid === 'function') {
    LumiApp.renderGamesGrid();
  }
})();
