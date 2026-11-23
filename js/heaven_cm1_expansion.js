(function() {
  if (typeof LumiDictionary === 'undefined' || typeof LumiGames === 'undefined') return;

  const extraActivities = [
    { id: 'algo_robot', icon: '🤖', nameEg: 'الروبوت والمبرمج الصغير', nameFr: 'Algo & Logique Robot', color: '#0F766E', minAge: 8 },
    { id: 'clock_master', icon: '⏰', nameEg: 'تحدي الساعة والوقت', nameFr: 'L’Heure et le Temps', color: '#B45309', minAge: 6 },
    { id: 'english_smart', icon: '🇬🇧', nameEg: 'المستكشف الإنجليزي الذكي', nameFr: 'English Explorer', color: '#1D4ED8', minAge: 5 },
    { id: 'color_lab', icon: '🎨', nameEg: 'مختبر خلط الألوان', nameFr: 'Mélange des Couleurs', color: '#BE185D', minAge: 3 }
  ];

  const extraInstructions = [
    { id: 'inst_algo', gameId: 'algo_robot', eg: 'اتّبعي خطوات البرمجة وحددي أين سيصل الروبوت!', fr: 'Suis les instructions du robot !' },
    { id: 'inst_clock', gameId: 'clock_master', eg: 'اقرئي الساعة أو احسبي الوقت بدقة!', fr: 'Lis l’heure ou calcule la durée !' },
    { id: 'inst_eng', gameId: 'english_smart', eg: 'اختاري الكلمة أو الجملة الإنجليزية الصحيحة!', fr: 'Choisis la bonne réponse en anglais !' },
    { id: 'inst_col_lab', gameId: 'color_lab', eg: 'ماذا ينتج عندما نخلط هذين اللونين معاً؟', fr: 'Quelle couleur obtient-on en mélangeant ?' }
  ];

  if (Array.isArray(LumiDictionary.games)) {
    extraActivities.forEach(ng => {
      if (!LumiDictionary.games.some(g => g.id === ng.id)) LumiDictionary.games.push(ng);
    });
  }
  if (Array.isArray(LumiDictionary.gameInstructions)) {
    extraInstructions.forEach(ni => {
      if (!LumiDictionary.gameInstructions.some(i => i.gameId === ni.gameId)) LumiDictionary.gameInstructions.push(ni);
    });
  }

  const pick = arr => arr[Math.floor(Math.random() * arr.length)];
  const shuffle = arr => [...arr].sort(() => Math.random() - 0.5);
  const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

  // توليد مسائل رياضيات متجددة لا تنتهي لرابعة ابتدائي فرنسي
  function generateDynamicMath(gameId) {
    if (gameId === 'cm1_math_numbers') {
      const mode = randInt(1, 3);
      if (mode === 1) {
        const a = randInt(12, 35), b = randInt(3, 9);
        const ans = a * b;
        return {
          badge: `✖️ ${a} × ${b}`,
          title: `Calcule le produit : ${a} × ${b} = ?`,
          sub: 'احسبي حاصل الضرب ذهنياً أو بالورقة والقلم:',
          ans: `${ans}`,
          wrongs: [`${ans + b}`, `${ans - a}`, `${ans + 10}`]
        };
      } else if (mode === 2) {
        const denom = pick([4, 5, 6, 8, 10]);
        const n1 = randInt(1, denom - 2);
        const n2 = randInt(1, denom - n1);
        return {
          badge: `🍕 ${n1}/${denom} + ${n2}/${denom}`,
          title: `Calcule la somme des fractions : ${n1}/${denom} + ${n2}/${denom}`,
          sub: 'اجمعي الكسرين متشابهي المقام:',
          ans: `${n1 + n2}/${denom}`,
          wrongs: [`${n1 + n2}/${denom * 2}`, `${Math.abs(n1 - n2) + 1}/${denom}`, `${n1 * n2}/${denom}`]
        };
      } else {
        const divisor = pick([3, 4, 5, 6, 7, 8, 9]);
        const quotient = randInt(6, 15);
        const dividend = divisor * quotient;
        return {
          badge: `➗ ${dividend} ÷ ${divisor}`,
          title: `Calcule le quotient : ${dividend} ÷ ${divisor} = ?`,
          sub: 'اقسمي العدد بدقة:',
          ans: `${quotient}`,
          wrongs: [`${quotient + 1}`, `${quotient - 1}`, `${quotient + 2}`]
        };
      }
    }

    if (gameId === 'cm1_math_geom') {
      const isSquare = Math.random() > 0.5;
      if (isSquare) {
        const side = randInt(4, 15);
        const askArea = Math.random() > 0.5;
        return {
          badge: `⬜ Carré (c = ${side} cm)`,
          title: askArea
            ? `Un carré a un côté de ${side} cm. Quelle est son AIRE ?`
            : `Un carré a un côté de ${side} cm. Quel est son PÉRIMÈTRE ?`,
          sub: askArea ? 'المساحة = الضلع × نفسه (cm²)' : 'المحيط = الضلع × 4 (cm)',
          ans: askArea ? `${side * side} cm²` : `${side * 4} cm`,
          wrongs: askArea
            ? [`${side * 4} cm²`, `${side * 2} cm²`, `${side * side + 4} cm²`]
            : [`${side * side} cm`, `${side * 2} cm`, `${side * 4 + 2} cm`]
        };
      } else {
        const L = randInt(7, 14), l = randInt(3, 6);
        const askArea = Math.random() > 0.5;
        return {
          badge: `▭ Rectangle (${L} cm × ${l} cm)`,
          title: askArea
            ? `Un rectangle mesure ${L} cm de long et ${l} cm de large. Quelle est son AIRE ?`
            : `Un rectangle mesure ${L} cm de long et ${l} cm de large. Quel est son PÉRIMÈTRE ?`,
          sub: askArea ? 'المساحة = الطول × العرض' : 'المحيط = (الطول + العرض) × 2',
          ans: askArea ? `${L * l} cm²` : `${(L + l) * 2} cm`,
          wrongs: askArea
            ? [`${(L + l) * 2} cm²`, `${L + l} cm²`, `${L * l + 5} cm²`]
            : [`${L * l} cm`, `${L + l} cm`, `${(L + l) * 2 + 4} cm`]
        };
      }
    }
    return null;
  }

  const expandedBanks = {
    cm1_sciences: [
      { badge: '🌿 Chaîne alimentaire', title: 'Dans une chaîne alimentaire, qui produit sa propre nourriture grâce au soleil ?', sub: 'في السلسلة الغذائية، من يصنع غذاءه بنفسه؟', ans: 'Les plantes vertes (النباتات الخضراء)', wrongs: ['Les carnivores (آكلات اللحوم)', 'Les champignons', 'Les poissons'] },
      { badge: '🫁 Système respiratoire', title: 'Quel gaz notre corps absorbe-t-il quand nous respirons ?', sub: 'ما الغاز الذي يمتصه جسمنا عند الشهيق؟', ans: 'L’oxygène (الأكسجين)', wrongs: ['Le dioxyde de carbone', 'L’azote pur', 'La vapeur d’eau'] },
      { badge: '🐧 Adaptation polaire', title: 'Pourquoi le manchot (البطريق) a-t-il une épaisse couche de graisse ?', sub: 'تكيف الحيوانات في البيئة القطبية:', ans: 'Pour garder la chaleur de son corps', wrongs: ['Pour voler plus haut', 'Pour courir dans le désert', 'Pour grimper aux arbres'] },
      { badge: '⚡ Force et mouvement', title: 'Quelle force attire tous les objets vers le centre de la Terre ?', sub: 'القوة التي تجذب الأجسام نحو الأرض:', ans: 'La gravité (الجاذبية الأرضية)', wrongs: ['Le magnétisme', 'Le frottement de l’air', 'L’électricité'] },
      { badge: '💧 États de la matière', title: 'Comment appelle-t-on le passage de l’eau liquide à la vapeur ?', sub: 'تحول الماء السائل إلى بخار ماء:', ans: 'L’évaporation (التبخر)', wrongs: ['La fusion (الانصهار)', 'La solidification (التجمد)', 'La condensation (التكثف)'] }
    ],
    cm1_french_gram: [
      { badge: '🔤 Verbe FINIR (Présent)', title: 'Complète : Les élèves ______ leurs devoirs avant de jouer.', sub: 'تصريف فعل المجموعة الثانية (finir) مع ils:', ans: 'finissent', wrongs: ['finissons', 'finit', 'finissez'] },
      { badge: '❓ Mots interrogatifs', title: '______ habites-tu ? — J’habite à Alexandrie.', sub: 'اختر أداة الاستفهام المناسبة للمكان:', ans: 'Où (أين)', wrongs: ['Quand (متى)', 'Combien (كم)', 'Pourquoi (لماذا)'] },
      { badge: '📖 Futur proche', title: 'Demain, nous ______ visiter la bibliothèque d’Alexandrie.', sub: 'المستقبل القريب (aller + infinitif):', ans: 'allons', wrongs: ['sommes', 'avons', 'allez'] },
      { badge: '🏷️ Genre des noms', title: 'Choisis l’article correct : ______ étoile brillante.', sub: 'اسم مفرد يبدأ بحرف متحرك:', ans: 'Une / L’', wrongs: ['Un', 'Le', 'Des'] },
      { badge: '✍️ Verbe FAIRE', title: 'Complète au présent : Vous ______ du sport chaque vendredi.', sub: 'تصريف فعل faire مع الضمير Vous:', ans: 'faites', wrongs: ['faisez', 'font', 'faisons'] }
    ],
    cm1_arabic_nahw: [
      { badge: '📝 الجملة الفعلية', title: 'حدد المفعول به في جملة: « قرأتْ هيفنُ القصةَ الممتعةَ »', sub: 'أركان الجملة الفعلية:', ans: 'القصةَ (مفعول به منصوب)', wrongs: ['هيفنُ (فاعل)', 'قرأتْ (فعل ماضٍ)', 'الممتعةَ (نعت)'] },
      { badge: '⏳ ظرف الزمان والمكان', title: 'ما نوع كلمة « صباحاً » في: « أذهب إلى المدرسة صباحاً »؟', sub: 'الظرف الدال على الوقت:', ans: 'ظرف زمان منصوب', wrongs: ['ظرف مكان', 'حرف جر', 'مبتدأ'] },
      { badge: '📚 أنواع الجموع', title: 'ما نوع الجمع في كلمة « العلماء » وكلمة « الكتب »؟', sub: 'جمع يتغير فيه صورة المفرد:', ans: 'جمع تكسير', wrongs: ['جمع مذكر سالم', 'جمع مؤنث سالم', 'مثنى'] },
      { badge: '🔗 حروف الجر', title: 'أكمل بحرف جر مناسب: « يكتب التلميذ ______ القلمِ »', sub: 'حروف الجر المتصلة والمنفصلة:', ans: 'بـِ (بالقلمِ)', wrongs: ['عن', 'إلى', 'فوق'] }
    ],
    cm1_social_egypt: [
      { badge: '🏛️ معالم الإسكندرية', title: 'أين تقع قلعة قايتباي الشهيرة في الإسكندرية؟', sub: 'تاريخ ومعالم عروس البحر المتوسط:', ans: 'على ساحل البحر المتوسط مكان فنار الإسكندرية القديم', wrongs: ['في وسط الصحراء الغربية', 'على ضفاف بحيرة ناصر', 'في محافظة أسوان'] },
      { badge: '⚡ مصادر الطاقة', title: 'أي مما يلي يُعد من مصادر الطاقة غير المتجددة؟', sub: 'الموارد الطبيعية في مصر:', ans: 'البترول والغاز الطبيعي والفحم', wrongs: ['طاقة الرياح', 'الطاقة الشمسية', 'طاقة المياه'] },
      { badge: '🧭 الاتجاهات الأصلية', title: 'إذا وقفتَ ووجهك نحو الشمال، فأين يكون الشرق؟', sub: 'مهارات الخريطة والبوصلة:', ans: 'على يمينك', wrongs: ['على يسارك', 'خلفك', 'أمامك'] },
      { badge: '🌾 البيئات المصرية', title: 'بماذا تشتهر البيئة الزراعية في وادي النيل والدلتا؟', sub: 'تنوع البيئات في مصر:', ans: 'وفرة المياه العذبة والتربة الخصبة', wrongs: ['ندرة الأمطار والرمال', 'الشعاب المرجانية', 'الجبال الجليدية'] }
    ],
    cm1_iq_master: [
      { badge: '🔢 شفرة الحروف', title: 'إذا كانت كلمة (باب) تساوي 2 + 1 + 2 = 5، فكم تساوي كلمة (أب)؟', sub: 'ترتيب الحروف الأبجدية:', ans: '3 (1 + 2)', wrongs: ['4', '5', '2'] },
      { badge: '⚖️ لغز الميزان', title: 'أيهما أثقل: كيلو جرام من الحديد أم كيلو جرام من القطن؟', sub: 'تركيز وانتباه للتفاصيل:', ans: 'متساويان في الوزن (كلاهما 1 كجم!)', wrongs: ['الحديد أثقل', 'القطن أثقل', 'لا يمكن المقارنة'] },
      { badge: '🧩 نمط الأعداد', title: 'اكتشفي الرقم الناقص: 1 ، 4 ، 9 ، 16 ، 25 ، ...', sub: 'مربعات الأعداد (1×1، 2×2، 3×3...):', ans: '36 (6 × 6)', wrongs: ['30', '32', '49'] },
      { badge: '🕰️ لغز الساعة', title: 'إذا كانت الساعة الآن 3:15 عصراً، فكم تكون الساعة بعد ساعتين و45 دقيقة؟', sub: 'حساب الزمن الذهني:', ans: '6:00 مساءً', wrongs: ['5:45 مساءً', '6:15 مساءً', '5:30 مساءً'] }
    ],
    algo_robot: [
      { badge: '🤖 مسار الروبوت', title: 'الروبوت يقف عند (0). تحرك: [يمين 3 خطوات] ثم [يمين خطوتين] ثم [يسار خطوة]. أين يقف الآن؟', sub: 'تتبع الخوارزمية خطوة بخطوة:', ans: 'عند النقطة 4', wrongs: ['عند النقطة 5', 'عند النقطة 6', 'عند النقطة 3'] },
      { badge: '🔁 حلقة التكرار (Loop)', title: 'كرر 4 مرات: (اقفز مرتين + صفّق مرة). كم مرة قفز الروبوت في المجموع؟', sub: 'مفهوم التكرار في البرمجة:', ans: '8 قفزات', wrongs: ['4 قفزات', '6 قفزات', '12 قفزة'] },
      { badge: '🔀 الشرط البرمجي (IF)', title: 'إذا (كان الجو ممطراً) خذ المظلة، وإلا البس النظارة الشمسية. الجو اليوم مشمس ☀️، ماذا سيفعل الروبوت؟', sub: 'الجمل الشرطية IF / ELSE:', ans: 'يلبس النظارة الشمسية 😎', wrongs: ['يأخذ المظلة ☂️', 'ينام في البيت', 'يلبس المعطف الشتوي'] },
      { badge: '🧭 اتجاه البوصلة', title: 'الروبوت ينظر للشمال ⬆️. استدار لليمين 90° ثم استدار لليمين 90° مرة أخرى. أين ينظر الآن؟', sub: 'التدوير والاتجاهات:', ans: 'نحو الجنوب ⬇️', wrongs: ['نحو الشرق ➡️', 'نحو الغرب ⬅️', 'نحو الشمال ⬆️'] }
    ],
    clock_master: [
      { badge: '🕒 3:30', title: 'كيف نقول الساعة 3:30 باللغة الفرنسية؟', sub: 'قراءة الساعة بالفرنسية:', ans: 'Il est trois heures et demie', wrongs: ['Il est trois heures pile', 'Il est quatre heures', 'Il est midi'] },
      { badge: '🕛 12:00', title: 'ماذا تعني عبارة « Il est midi » بالفرنسية؟', sub: 'توقيت منتصف اليوم:', ans: 'الساعة 12 ظهراً', wrongs: ['الساعة 12 منتصف الليل', 'الساعة 6 صباحاً', 'الساعة 3 عصراً'] },
      { badge: '⏱️ حساب المدة', title: 'بدأت الحصة الساعة 9:10 صباحاً وانتهت الساعة 9:55 صباحاً. كم دقيقة استمرت الحصة؟', sub: 'حساب الفارق الزمني:', ans: '45 دقيقة', wrongs: ['35 دقيقة', '55 دقيقة', '40 دقيقة'] },
      { badge: '🕕 6:15', title: 'الساعة السادسة والربع تعني كم دقيقة بعد السادسة؟', sub: 'الربع ساعة =', ans: '15 دقيقة', wrongs: ['30 دقيقة', '45 دقيقة', '20 دقيقة'] }
    ],
    english_smart: [
      { badge: '🇬🇧 Grammar', title: 'Complete: She ______ to school every day.', sub: 'المضارع البسيط مع الضمير المفرد She:', ans: 'goes', wrongs: ['go', 'going', 'gone'] },
      { badge: '🦁 Vocabulary', title: 'Which animal is called "The King of the Jungle"?', sub: 'مفردات الحيوانات بالإنجليزية:', ans: 'The Lion 🦁', wrongs: ['The Rabbit 🐰', 'The Turtle 🐢', 'The Duck 🦆'] },
      { badge: '🌈 Colors & Sky', title: 'What color is the sky on a clear sunny day?', sub: 'الألوان والطبيعة:', ans: 'Blue 🔵', wrongs: ['Green 🟢', 'Purple 🟣', 'Black ⚫'] },
      { badge: '📚 Opposites', title: 'What is the opposite (عكس) of the word "Fast"?', sub: 'الكلمة وعكسها:', ans: 'Slow (بطيء)', wrongs: ['Quick (سريع)', 'Big (كبير)', 'Tall (طويل)'] }
    ],
    color_lab: [
      { badge: '🔴 + 🟡 = ❓', title: 'عندما نخلط اللون الأحمر مع اللون الأصفر، ما اللون الجديد الذي يظهر؟', sub: 'تجربة خلط الألوان الأساسية:', ans: 'البرتقالي 🟠 (Orange)', wrongs: ['الأخضر 🟢 (Vert)', 'البنفسجي 🟣 (Violet)', 'الأسود ⚫ (Noir)'] },
      { badge: '🔵 + 🟡 = ❓', title: 'عندما نخلط اللون الأزرق مع اللون الأصفر، نحصل على اللون:', sub: 'ألوان الطبيعة والأشجار:', ans: 'الأخضر 🟢 (Vert)', wrongs: ['البرتقالي 🟠 (Orange)', 'الوردي 🌸 (Rose)', 'البني 🟤 (Marron)'] },
      { badge: '🔴 + 🔵 = ❓', title: 'عندما نخلط اللون الأحمر مع اللون الأزرق، نحصل على اللون:', sub: 'خلط الألوان:', ans: 'البنفسجي 🟣 (Violet)', wrongs: ['الأصفر 🟡 (Jaune)', 'الأخضر 🟢 (Vert)', 'الأبيض ⚪ (Blanc)'] },
      { badge: '🔴 + ⚪ = ❓', title: 'عندما نضيف اللون الأبيض إلى اللون الأحمر، نحصل على اللون:', sub: 'تفتيح الألوان:', ans: 'الوردي 🌸 (Rose)', wrongs: ['الأسود ⚫ (Noir)', 'الأزرق 🔵 (Bleu)', 'البني 🟤 (Marron)'] }
    ]
  };

  function renderExpandedActivity(stage, gameId) {
    let q = generateDynamicMath(gameId);
    if (!q && expandedBanks[gameId]) {
      q = pick(expandedBanks[gameId]);
    }
    if (!q) return false;

    const opts = shuffle([q.ans, ...q.wrongs]);
    stage.innerHTML = `
      <div style="max-width:740px; margin:0 auto; padding:18px; text-align:center;">
        <div style="display:inline-block; background:linear-gradient(135deg,#0F766E,#2563EB); color:#fff; padding:8px 18px; border-radius:999px; font-weight:800; font-size:1.1rem; margin-bottom:14px;">
          ${q.badge}
        </div>
        <div style="font-size:1.3rem; font-weight:800; line-height:1.6; margin-bottom:6px; direction:auto;">${q.title}</div>
        <div style="font-size:0.98rem; color:#64748B; margin-bottom:18px;">${q.sub}</div>
        <div id="exp-options" style="display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:12px;"></div>
      </div>
    `;
    const box = stage.querySelector('#exp-options');
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
    return true;
  }

  const prevRender2 = LumiGames.renderGameScreen.bind(LumiGames);
  LumiGames.renderGameScreen = function() {
    if (this.currentGameId === 'cm1_math_numbers' || this.currentGameId === 'cm1_math_geom' || expandedBanks[this.currentGameId]) {
      const meta = LumiDictionary.games.find(g => g.id === this.currentGameId) || { icon: '🎓', nameEg: this.currentGameId, nameFr: '' };
      const stage = document.getElementById('game-stage');
      const titleEl = document.getElementById('game-title');
      const badgeEl = document.getElementById('game-level-badge');
      const coOpBtn = document.getElementById('coop-toggle-btn');
      if (titleEl) titleEl.innerHTML = `${meta.icon} ${meta.nameEg} <small>(${meta.nameFr})</small>`;
      if (badgeEl) badgeEl.innerText = `المستوى ${this.currentLevel || 1} ⭐`;
      if (coOpBtn) coOpBtn.style.display = 'none';
      this.questionStartTime = Date.now();
      if (renderExpandedActivity(stage, this.currentGameId)) return;
    }
    return prevRender2();
  };

  if (window.LumiApp && typeof LumiApp.renderGamesGrid === 'function') {
    LumiApp.renderGamesGrid();
  }
})();
