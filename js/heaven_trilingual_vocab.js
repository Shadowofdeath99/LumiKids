(function() {
  if (typeof LumiDictionary === 'undefined' || typeof LumiGames === 'undefined') return;

  const gameMeta = {
    id: 'trilingual_vocab',
    icon: '📚',
    nameEg: 'موسوعة مصطلحات المواد (عربي / فرنسي / إنجليش)',
    nameFr: 'Encyclopédie des Matières (AR • FR • EN)',
    color: '#7C3AED',
    minAge: 8
  };

  const gameInst = {
    id: 'inst_trilingual_vocab',
    gameId: 'trilingual_vocab',
    eg: 'اختاري اللغة والمادة الدراسية، ثم اختاري المعنى أو المصطلح الصحيح!',
    fr: 'Choisis la langue et la matière, puis trouve la bonne réponse !'
  };

  if (Array.isArray(LumiDictionary.games) && !LumiDictionary.games.some(g => g.id === gameMeta.id)) {
    LumiDictionary.games.push(gameMeta);
  }
  if (Array.isArray(LumiDictionary.gameInstructions) && !LumiDictionary.gameInstructions.some(i => i.gameId === gameInst.gameId)) {
    LumiDictionary.gameInstructions.push(gameInst);
  }

  // بنك موسع شامل لكل مواد رابعة ابتدائي بالتلات لغات
  const vocabBank = {
    ar: [
      // لغة وأدب (معاني وعكس)
      { subj: 'لغة وأدب', word: 'شَغُوفٌ', kind: 'المعنى (المرادف)', ans: 'مُحِبٌّ بشدة ومتحمس', wrongs: ['كاره ومبتعد', 'متردد وخائف', 'بطيء وكسول'] },
      { subj: 'لغة وأدب', word: 'مُثَابِرٌ', kind: 'المعنى (المرادف)', ans: 'مُواظب ومستمر دون يأس', wrongs: ['مستسلم بسرعة', 'مُهمل لواجباته', 'غاضب دائماً'] },
      { subj: 'لغة وأدب', word: 'جَلِيٌّ', kind: 'المعنى (المرادف)', ans: 'واضحٌ وظاهرٌ تماماً', wrongs: ['غامض ومخفي', 'صغير جداً', 'بعيد المنال'] },
      { subj: 'لغة وأدب', word: 'إِيثَارٌ', kind: 'المعنى (المرادف)', ans: 'تفضيل الآخرين على النفس', wrongs: ['الأنانية وحب النفس', 'البخل الشديد', 'الغضب السريع'] },
      { subj: 'لغة وأدب', word: 'وَفِيرٌ', kind: 'العكس (المضاد)', ans: 'قليلٌ ونادرٌ', wrongs: ['كثيرٌ وغزيرٌ', 'واسعٌ وكبيرٌ', 'سريعٌ وخفيفٌ'] },
      { subj: 'لغة وأدب', word: 'شُجَاعٌ', kind: 'العكس (المضاد)', ans: 'جَبَانٌ وخائفٌ', wrongs: ['مِقْدَامٌ وجريءٌ', 'قَوِيٌّ ومُتَحَمِّسٌ', 'ذَكِيٌّ وفَطِنٌ'] },
      { subj: 'لغة وأدب', word: 'تَوَاضُعٌ', kind: 'العكس (المضاد)', ans: 'تَكَبُّرٌ وغُرُورٌ', wrongs: ['لُطْفٌ وأَدَبٌ', 'كَرَمٌ وسَخَاءٌ', 'صِدْقٌ وأَمَانَةٌ'] },
      { subj: 'لغة وأدب', word: 'فَطِنٌ', kind: 'المعنى (المرادف)', ans: 'ذَكِيٌّ وسريع الفهم', wrongs: ['غَافِلٌ وبطيء', 'حَزِينٌ ومُتْعَبٌ', 'مُتَسَرِّعٌ بدون تفكير'] },
      { subj: 'لغة وأدب', word: 'عَزِيمَةٌ', kind: 'المعنى (المرادف)', ans: 'إِرَادَةٌ قوية وإصرار', wrongs: ['ضَعْفٌ وتَخَاذُلٌ', 'خَوْفٌ وهُرُوبٌ', 'نِسْيَانٌ وإِهْمَالٌ'] },
      { subj: 'لغة وأدب', word: 'مُزْدَهِرٌ', kind: 'العكس (المضاد)', ans: 'مُتَدَهْوِرٌ ومُتَأَخِّرٌ', wrongs: ['مُتَقَدِّمٌ ونَاجِحٌ', 'مُشْرِقٌ ولامِعٌ', 'كَبِيرٌ وعَظِيمٌ'] },
      // مصطلحات الرياضيات
      { subj: 'رياضيات', word: 'المُحِيطُ (Périmètre)', kind: 'مصطلح هندسي', ans: 'مجموع أطوال أضلاع الشكل الهندسي من الخارج', wrongs: ['المساحة الداخلية للشكل', 'عدد زوايا الشكل فقط', 'حجم المجسم'] },
      { subj: 'رياضيات', word: 'المِسَاحَةُ (Aire)', kind: 'مصطلح هندسي', ans: 'عدد الوحدات المربعة التي تغطي سطح الشكل', wrongs: ['طول الإطار الخارجي', 'مجموع الأضلاع', 'قياس الزاوية القائمة'] },
      { subj: 'رياضيات', word: 'البَسْطُ والمَقَامُ', kind: 'مصطلح كسور', ans: 'البسط أعلى خط الكسر، والمقام أسفله ويمثل الكل', wrongs: ['البسط أسفل الكسر دائماً', 'رقمان متساويان دائماً', 'علامة الجمع والطرح'] },
      { subj: 'رياضيات', word: 'العَدَدُ الأَوَّلِيُّ', kind: 'مصطلح حسابي', ans: 'عدد أكبر من 1 له عاملان فقط: نفسه والواحد', wrongs: ['أي عدد زوجي', 'عدد يقبل القسمة على 10', 'الصفر والواحد'] },
      { subj: 'رياضيات', word: 'المُتَوَازِيَانِ (Parallèles)', kind: 'مصطلح هندسي', ans: 'خطان مستقيمان لا يلتقيان أبداً مهما امتدا', wrongs: ['خطان يتقاطعان بزاوية قائمة', 'خطان منحنيان', 'مثلث متساوي الأضلاع'] },
      // مصطلحات العلوم
      { subj: 'علوم', word: 'التَّكَيُّفُ (Adaptation)', kind: 'مصطلح علوم', ans: 'خاصية تساعد الكائن الحي على البقاء والتكاثر في بيئته', wrongs: ['انقراض الكائنات الحية', 'تحول الماء إلى بخار', 'دوران الأرض حول الشمس'] },
      { subj: 'علوم', word: 'التَّمَثِيلُ الضَّوْئِيُّ', kind: 'مصطلح نباتات', ans: 'عملية يصنع بها النبات غذاءه باستخدام ضوء الشمس', wrongs: ['تنفس الإنسان ليلاً', 'تبخر مياه البحار', 'انكسار الضوء في الماء'] },
      { subj: 'علوم', word: 'الاحْتِكَاكُ (Frottement)', kind: 'مصطلح فيزياء', ans: 'قوة تنشأ بين سطحين متلامسين وتُبطئ الحركة', wrongs: ['قوة جذب المغناطيس', 'سرعة الضوء في الفراغ', 'طاقة الوضع المختزنة'] },
      { subj: 'علوم', word: 'المُوصِلَاتُ الحَرَارِيَّةُ', kind: 'مصطلح طاقة', ans: 'مواد تسمح بمرور الحرارة خلالها بسهولة مثل المعادن', wrongs: ['مواد تمنع الحرارة مثل الخشب', 'غازات لا تُرى', 'سوائل متجمدة'] },
      { subj: 'علوم', word: 'السِّلْسِلَةُ الغِذَائِيَّةُ', kind: 'مصطلح بيئة', ans: 'مسار انتقال الطاقة الغذائية من كائن حي إلى آخر', wrongs: ['ترتيب الكواكب حول الشمس', 'دورة المياه في الطبيعة', 'أنواع الصخور البركانية'] },
      // مصطلحات الدراسات
      { subj: 'دراسات', word: 'مِقْيَاسُ الرَّسْمِ', kind: 'مصطلح خرائط', ans: 'النسبة بين المسافة على الخريطة وما يقابلها على الطبيعة', wrongs: ['ألوان العلم الوطني', 'اتجاه الرياح الموسمية', 'عدد سكان المحافظة'] },
      { subj: 'دراسات', word: 'المَوَارِدُ المُتَجَدِّدَةُ', kind: 'مصطلح جغرافيا', ans: 'موارد لا تنفد رغم استخدامنا المستمر لها كالشمس والرياح', wrongs: ['البترول والفحم والغاز', 'المعادن النادرة في باطن الأرض', 'الوقود الأحفوري'] },
      { subj: 'دراسات', word: 'الطَّقْسُ والمُنَاخُ', kind: 'مصطلح جغرافيا', ans: 'الطقس وصف الجو لفترة قصيرة، والمناخ لفترة زمنية طويلة', wrongs: ['كلاهما يصف الزلازل', 'الطقس للبحار والمناخ للجبال', 'لا فرق بينهما أبداً'] },
      { subj: 'دراسات', word: 'التُّرَاثُ الثَّقَافِيُّ', kind: 'مصطلح تاريخ', ans: 'كل ما تركه لنا الأجداد من آثار وعادات وتقاليد وفنون', wrongs: ['المصانع الحديثة فقط', 'الطقس اليومي', 'الموارد المعدنية'] }
    ],

    fr: [
      // Maths CM1
      { subj: 'رياضيات', word: 'Numérateur / Dénominateur', kind: 'Maths CM1 (Les Fractions)', ans: 'البسط (أعلى الكسر) والمقام (أسفل الكسر)', wrongs: ['الطول والعرض', 'المحيط والمساحة', 'الجمع والطرح'] },
      { subj: 'رياضيات', word: 'Périmètre et Aire', kind: 'Maths CM1 (Géométrie)', ans: 'المحيط (إطار الشكل) والمساحة (السطح الداخلي)', wrongs: ['الزاوية الحادة والمنفرجة', 'الضرب والقسمة', 'الأعداد العشرية'] },
      { subj: 'رياضيات', word: 'Droites Perpendiculaires', kind: 'Maths CM1 (Géométrie)', ans: 'مستقيمان متعامدان يصنعان زاوية قائمة 90°', wrongs: ['مستقيمان متوازيان لا يلتقيان', 'دائرة ومثلث', 'نصف مستقيم'] },
      { subj: 'رياضيات', word: 'Nombre Décimal', kind: 'Maths CM1 (Nombres)', ans: 'عدد عشري يحتوي على فاصلة (مثل 3,5)', wrongs: ['عدد أولي فقط', 'شكل هندسي سداسي', 'كسر أكبر من 100'] },
      { subj: 'رياضيات', word: 'Quotient et Reste', kind: 'Maths CM1 (Division)', ans: 'خارج القسمة وباقي القسمة', wrongs: ['حاصل الضرب', 'مجموع الأضلاع', 'الفرق في الطرح'] },
      { subj: 'رياضيات', word: 'Angle Aigu / Obtus', kind: 'Maths CM1 (Angles)', ans: 'زاوية حادة (أقل من 90°) وزاوية منفرجة (أكبر من 90°)', wrongs: ['مربع ومستطيل', 'متر وسنتيمتر', 'كيلوجرام وجرام'] },
      // Sciences CM1
      { subj: 'علوم', word: 'Camouflage', kind: 'Sciences CM1 (Adaptation)', ans: 'التخفي والتمويه لحماية الحيوان من الأعداء', wrongs: ['الهجرة في الشتاء', 'التنفس تحت الماء', 'انكسار الضوء'] },
      { subj: 'علوم', word: 'Photosynthèse', kind: 'Sciences CM1 (Plantes)', ans: 'عملية البناء الضوئي لصنع غذاء النبات', wrongs: ['هضم الطعام في المعدة', 'تجمد الماء', 'دوران القمر'] },
      { subj: 'علوم', word: 'Énergie Renouvelable', kind: 'Sciences CM1 (Énergie)', ans: 'طاقة متجددة نظيفة (كالشمس والرياح)', wrongs: ['وقود أحفوري ملوث', 'بطارية منتهية', 'طاقة حرارية مفقودة'] },
      { subj: 'علوم', word: 'Système Nerveux', kind: 'Sciences CM1 (Corps humain)', ans: 'الجهاز العصبي (المخ والأعصاب والحبل الشوكي)', wrongs: ['الجهاز الهضمي', 'الجهاز التنفسي', 'الهيكل العظمي'] },
      { subj: 'علوم', word: 'Réflexion de la Lumière', kind: 'Sciences CM1 (Physique)', ans: 'انعكاس الضوء عند سقوطه على سطح لامع كالمرآة', wrongs: ['امتصاص الصوت', 'ذوبان الجليد', 'توليد الكهرباء'] },
      { subj: 'علوم', word: 'Gravité et Frottement', kind: 'Sciences CM1 (Mouvement)', ans: 'الجاذبية الأرضية وقوة الاحتكاك', wrongs: ['التبخر والتكثف', 'الضوء والصوت', 'المغناطيس والحديد'] },
      // Français & Grammaire CM1
      { subj: 'لغة وأدب', word: 'Synonymes et Antonymes', kind: 'Français CM1 (Vocabulaire)', ans: 'المترادفات (نفس المعنى) والأضداد (عكس المعنى)', wrongs: ['المذكر والمؤنث', 'المفرد والجمع', 'الفاعل والمفعول'] },
      { subj: 'لغة وأدب', word: 'Adjectif Qualificatif', kind: 'Français CM1 (Grammaire)', ans: 'الصفة (النعت) التي تصف الاسم وتتبع نوعه وعدده', wrongs: ['فعل الأمر', 'حرف الجر', 'أداة الاستفهام'] },
      { subj: 'لغة وأدب', word: 'Courageux / Magnifique', kind: 'Français CM1 (Adjectifs)', ans: 'شجاع / رائع وجميل جداً', wrongs: ['جبان / قبيح', 'كسول / بطيء', 'حزين / متعب'] },
      { subj: 'لغة وأدب', word: 'Découvrir et Protéger', kind: 'Français CM1 (Verbes)', ans: 'يكتشف ويحمي', wrongs: ['يُخفي ويُدمّر', 'ينسى ويترك', 'يغلق ويكسر'] },
      // Géographie & Histoire
      { subj: 'دراسات', word: 'Boussole et Points Cardinaux', kind: 'Géographie CM1', ans: 'البوصلة والاتجاهات الأصلية (شمال، جنوب، شرق، غرب)', wrongs: ['فصول السنة الأربعة', 'أيام الأسبوع', 'أدوات الهندسة'] },
      { subj: 'دراسات', word: 'Environnement et Climat', kind: 'Géographie CM1', ans: 'البيئة والمناخ', wrongs: ['التاريخ القديم', 'اللغة والأدب', 'الحساب الذهني'] }
    ],

    en: [
      // Math Terms
      { subj: 'رياضيات', word: 'Fraction & Decimal', kind: 'Math Vocabulary', ans: 'الكسر الاعتيادي والعدد العشري', wrongs: ['المثلث والدائرة', 'الجمع والطرح', 'الساعة والدقيقة'] },
      { subj: 'رياضيات', word: 'Perimeter & Area', kind: 'Geometry Vocabulary', ans: 'المحيط (الإطار الخارجي) والمساحة (السطح)', wrongs: ['الوزن والطول', 'السرعة والزمن', 'الزاوية القائمة'] },
      { subj: 'رياضيات', word: 'Parallel & Perpendicular', kind: 'Geometry Vocabulary', ans: 'متوازيان ومتعامدان', wrongs: ['كبير وصغير', 'سريع وبطيء', 'موجب وسالب'] },
      { subj: 'رياضيات', word: 'Multiply & Divide', kind: 'Arithmetic Operations', ans: 'يضرب ويقسم', wrongs: ['يجمع ويطرح', 'يقيس ويرسم', 'يعدّ ويقارن'] },
      // Science Terms
      { subj: 'علوم', word: 'Adaptation & Survival', kind: 'Science Vocabulary', ans: 'التكيف والبقاء على قيد الحياة', wrongs: ['التبخر والتجمد', 'الضوء والصوت', 'الحركة والسرعة'] },
      { subj: 'علوم', word: 'Renewable Energy', kind: 'Science Vocabulary', ans: 'الطاقة المتجددة (مثل الشمس والرياح)', wrongs: ['الوقود الأحفوري', 'التلوث البيئي', 'الكهرباء الساكنة'] },
      { subj: 'علوم', word: 'Gravity & Friction', kind: 'Physics Vocabulary', ans: 'الجاذبية وقوة الاحتكاك', wrongs: ['التنفس والهضم', 'الإنبات والتلقيح', 'الانعكاس والانكسار'] },
      { subj: 'علوم', word: 'Digestive & Respiratory', kind: 'Human Body Systems', ans: 'الجهاز الهضمي والجهاز التنفسي', wrongs: ['المجموعة الشمسية', 'دورة المياه', 'السلسلة الغذائية'] },
      { subj: 'علوم', word: 'Evaporation & Condensation', kind: 'States of Matter', ans: 'التبخر والتكثف', wrongs: ['الذوبان والاحتراق', 'الطفو والغوص', 'الشد والدفع'] },
      // Social Studies
      { subj: 'دراسات', word: 'Compass & Directions', kind: 'Geography Vocabulary', ans: 'البوصلة والاتجاهات (North, South, East, West)', wrongs: ['الألوان والأشكال', 'الحيوانات والنباتات', 'المواد الدراسية'] },
      { subj: 'دراسات', word: 'Ancient Civilization', kind: 'History Vocabulary', ans: 'الحضارة القديمة (مثل الحضارة المصرية)', wrongs: ['التكنولوجيا الحديثة', 'الطقس اليومي', 'التجارة الإلكترونية'] },
      { subj: 'دراسات', word: 'Natural Resources', kind: 'Geography Vocabulary', ans: 'الموارد الطبيعية (المياه، التربة، المعادن)', wrongs: ['الأجهزة الذكية', 'المباني الحديثة', 'وسائل المواصلات'] },
      // General Smart Vocabulary
      { subj: 'لغة وأدب', word: 'Curious & Brilliant', kind: 'Smart Adjectives', ans: 'فضولي للمعرفة ومتألق الذكاء', wrongs: ['كسول ومُهمل', 'خائف ومتردد', 'غاضب وحزين'] },
      { subj: 'لغة وأدب', word: 'Achieve & Explore', kind: 'Action Verbs', ans: 'يُحقق هدفاً ويستكشف الجديد', wrongs: ['يستسلم وينسى', 'يُخفي ويُهمل', 'يتأخر ويتراجع'] },
      { subj: 'لغة وأدب', word: 'Generous & Respect', kind: 'Values & Ethics', ans: 'كريم المعطاء والاحترام', wrongs: ['بخيل وأناني', 'قاسٍ ومتكبر', 'غاضب ومتسرع'] }
    ]
  };

  let activeTab = 'ar';
  let activeSubj = 'الكل';
  let tabScore = { ar: 0, fr: 0, en: 0 };

  const shuffle = arr => [...arr].sort(() => Math.random() - 0.5);
  const pick = arr => arr[Math.floor(Math.random() * arr.length)];

  function speakWord(text, lang) {
    try {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const cleanText = text.replace(/\([^)]*\)/g, '').split('/')[0].trim();
        const u = new SpeechSynthesisUtterance(cleanText);
        u.lang = lang === 'fr' ? 'fr-FR' : (lang === 'en' ? 'en-US' : 'ar-EG');
        u.rate = 0.92;
        window.speechSynthesis.speak(u);
      }
    } catch (e) {}
  }

  function renderTrilingualGame(stage) {
    const poolAll = vocabBank[activeTab] || [];
    const filtered = activeSubj === 'الكل' ? poolAll : poolAll.filter(x => x.subj === activeSubj);
    const activePool = filtered.length > 0 ? filtered : poolAll;
    const item = pick(activePool);
    const options = shuffle([item.ans, ...item.wrongs]);

    const tabMeta = {
      ar: { label: '🇪🇬 عربي', color: '#D97706', dir: 'rtl' },
      fr: { label: '🇫🇷 Français', color: '#2563EB', dir: 'ltr' },
      en: { label: '🇬🇧 English', color: '#059669', dir: 'ltr' }
    };
    const subjects = ['الكل', 'رياضيات', 'علوم', 'دراسات', 'لغة وأدب'];

    stage.innerHTML = `
      <div style="max-width:780px; margin:0 auto; padding:12px; text-align:center;">
        <!-- شريط التابات الثلاثة للغات -->
        <div style="display:flex; justify-content:center; gap:8px; flex-wrap:wrap; margin-bottom:10px;">
          ${['ar', 'fr', 'en'].map(t => `
            <button data-tab="${t}" class="nav-btn" style="
              padding:10px 16px;
              border-radius:14px;
              font-weight:800;
              font-size:0.98rem;
              cursor:pointer;
              background:${activeTab === t ? tabMeta[t].color : 'rgba(148,163,184,0.15)'};
              color:${activeTab === t ? '#fff' : 'inherit'};
              border:2px solid ${activeTab === t ? tabMeta[t].color : 'transparent'};
            ">
              ${tabMeta[t].label} (${tabScore[t]} ⭐)
            </button>
          `).join('')}
        </div>

        <!-- شريط تصفية المواد الدراسية -->
        <div style="display:flex; justify-content:center; gap:6px; flex-wrap:wrap; margin-bottom:16px;">
          ${subjects.map(s => `
            <button data-subj="${s}" style="
              padding:6px 12px;
              border-radius:999px;
              font-size:0.85rem;
              font-weight:700;
              cursor:pointer;
              border:1px solid ${activeSubj === s ? tabMeta[activeTab].color : '#CBD5E1'};
              background:${activeSubj === s ? tabMeta[activeTab].color + '22' : 'transparent'};
              color:inherit;
            ">
              ${s === 'الكل' ? '📚 كل المواد' : s}
            </button>
          `).join('')}
        </div>

        <!-- بطاقة عرض المصطلح -->
        <div style="background:linear-gradient(135deg, ${tabMeta[activeTab].color}18, rgba(99,102,241,0.08)); border:2px solid ${tabMeta[activeTab].color}44; border-radius:22px; padding:20px 16px; margin-bottom:16px;">
          <div style="display:flex; justify-content:center; gap:8px; flex-wrap:wrap; margin-bottom:8px;">
            <span style="background:${tabMeta[activeTab].color}; color:#fff; padding:4px 12px; border-radius:999px; font-size:0.85rem; font-weight:700;">
              ${item.subj}
            </span>
            <span style="background:rgba(100,116,139,0.15); padding:4px 12px; border-radius:999px; font-size:0.85rem; font-weight:700;">
              ${item.kind}
            </span>
          </div>
          <div style="font-size:1.85rem; font-weight:900; margin:8px 0; direction:${tabMeta[activeTab].dir};">
            ${item.word}
          </div>
          <button id="tri-speak-btn" class="nav-btn" style="margin:6px auto 0; padding:8px 16px; border-radius:999px; font-size:0.92rem; font-weight:700; cursor:pointer;">
            🔊 استمع لنطق المصطلح
          </button>
        </div>

        <!-- خيارات الإجابة -->
        <div id="tri-options" style="display:grid; grid-template-columns:repeat(auto-fit, minmax(240px, 1fr)); gap:10px;"></div>
      </div>
    `;

    stage.querySelectorAll('button[data-tab]').forEach(btn => {
      btn.onclick = () => {
        activeTab = btn.getAttribute('data-tab');
        renderTrilingualGame(stage);
      };
    });

    stage.querySelectorAll('button[data-subj]').forEach(btn => {
      btn.onclick = () => {
        activeSubj = btn.getAttribute('data-subj');
        renderTrilingualGame(stage);
      };
    });

    const spk = stage.querySelector('#tri-speak-btn');
    if (spk) spk.onclick = () => speakWord(item.word, activeTab);

    const optBox = stage.querySelector('#tri-options');
    options.forEach(opt => {
      const btn = document.createElement('button');
      btn.className = 'nav-btn';
      btn.style.cssText = 'padding:15px 14px; font-size:1.05rem; font-weight:700; border-radius:16px; justify-content:center; text-align:center; line-height:1.45; cursor:pointer;';
      btn.textContent = opt;
      btn.onclick = () => {
        if (opt === item.ans) {
          btn.style.background = '#10B981';
          btn.style.color = '#fff';
          tabScore[activeTab] += 1;
          if (typeof LumiStorage !== 'undefined' && typeof LumiStorage.addStars === 'function') {
            LumiStorage.addStars(1);
          }
          setTimeout(() => renderTrilingualGame(stage), 650);
        } else {
          btn.style.background = '#EF4444';
          btn.style.color = '#fff';
        }
      };
      optBox.appendChild(btn);
    });
  }

  const prevRender = LumiGames.renderGameScreen.bind(LumiGames);
  LumiGames.renderGameScreen = function() {
    if (this.currentGameId === 'trilingual_vocab') {
      const stage = document.getElementById('game-stage');
      const titleEl = document.getElementById('game-title');
      const badgeEl = document.getElementById('game-level-badge');
      const coOpBtn = document.getElementById('coop-toggle-btn');
      if (titleEl) titleEl.innerHTML = `📚 موسوعة مصطلحات المواد (عربي / فرنسي / إنجليش) <small>(AR • FR • EN)</small>`;
      if (badgeEl) badgeEl.innerText = `كل المواد • 3 لغات ⭐`;
      if (coOpBtn) coOpBtn.style.display = 'none';
      this.questionStartTime = Date.now();
      renderTrilingualGame(stage);
      return;
    }
    return prevRender();
  };

  if (window.LumiApp && typeof LumiApp.renderGamesGrid === 'function') {
    LumiApp.renderGamesGrid();
  }
})();
