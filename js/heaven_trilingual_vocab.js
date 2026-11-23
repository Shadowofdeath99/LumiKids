(function() {
  if (typeof LumiDictionary === 'undefined' || typeof LumiGames === 'undefined') return;

  const gameMeta = {
    id: 'trilingual_vocab',
    icon: '📚',
    nameEg: 'موسوعة الكلمات (عربي / فرنسي / إنجليش)',
    nameFr: 'Trésor des Mots (AR • FR • EN)',
    color: '#7C3AED',
    minAge: 8
  };

  const gameInst = {
    id: 'inst_trilingual_vocab',
    gameId: 'trilingual_vocab',
    eg: 'اختاري التاب المناسب (عربي أو فرنساوي أو إنجليش) واختاري المعنى أو العكس الصحيح!',
    fr: 'Choisis un onglet (Arabe, Français ou Anglais) et trouve la bonne réponse !'
  };

  if (Array.isArray(LumiDictionary.games) && !LumiDictionary.games.some(g => g.id === gameMeta.id)) {
    LumiDictionary.games.push(gameMeta);
  }
  if (Array.isArray(LumiDictionary.gameInstructions) && !LumiDictionary.gameInstructions.some(i => i.gameId === gameInst.gameId)) {
    LumiDictionary.gameInstructions.push(gameInst);
  }

  const vocabBank = {
    ar: [
      { word: 'شَغُوفٌ', kind: 'المعنى (المرادف)', ans: 'مُحِبٌّ بشدة ومتحمس', wrongs: ['كاره ومبتعد', 'متردد وخائف', 'بطيء وكسول'] },
      { word: 'مُثَابِرٌ', kind: 'المعنى (المرادف)', ans: 'مُواظب ومستمر دون يأس', wrongs: ['مستسلم بسرعة', 'مُهمل لواجباته', 'غاضب دائماً'] },
      { word: 'جَلِيٌّ', kind: 'المعنى (المرادف)', ans: 'واضحٌ وظاهرٌ تماماً', wrongs: ['غامض ومخفي', 'صغير جداً', 'بعيد المنال'] },
      { word: 'إِيثَارٌ', kind: 'المعنى (المرادف)', ans: 'تفضيل الآخرين على النفس', wrongs: ['الأنانية وحب النفس', 'البخل الشديد', 'الغضب السريع'] },
      { word: 'وَفِيرٌ', kind: 'العكس (المضاد)', ans: 'قليلٌ ونادرٌ', wrongs: ['كثيرٌ وغزيرٌ', 'واسعٌ وكبيرٌ', 'سريعٌ وخفيفٌ'] },
      { word: 'شُجَاعٌ', kind: 'العكس (المضاد)', ans: 'جَبَانٌ وخائفٌ', wrongs: ['مِقْدَامٌ وجريءٌ', 'قَوِيٌّ ومُتَحَمِّسٌ', 'ذَكِيٌّ وفَطِنٌ'] },
      { word: 'تَوَاضُعٌ', kind: 'العكس (المضاد)', ans: 'تَكَبُّرٌ وغُرُورٌ', wrongs: ['لُطْفٌ وأَدَبٌ', 'كَرَمٌ وسَخَاءٌ', 'صِدْقٌ وأَمَانَةٌ'] },
      { word: 'يَطْمَحُ', kind: 'المعنى (المرادف)', ans: 'يَتَطَلَّعُ إلى الأفضل ويسعى للنجاح', wrongs: ['يَتَرَاجَعُ إلى الخلف', 'يَنَامُ طويلاً', 'يَنْسَى أهدافه'] },
      { word: 'مُبْدِعٌ', kind: 'المعنى (المرادف)', ans: 'مُبْتَكِرٌ يأتي بأفكار جديدة', wrongs: ['مُقَلِّدٌ للآخرين', 'مُتَرَدِّدٌ في قراراته', 'صَامِتٌ دائماً'] },
      { word: 'أَمِينٌ', kind: 'العكس (المضاد)', ans: 'خَائِنٌ', wrongs: ['صَادِقٌ', 'مُخْلِصٌ', 'وَقُورٌ'] },
      { word: 'فَطِنٌ', kind: 'المعنى (المرادف)', ans: 'ذَكِيٌّ وسريع الفهم', wrongs: ['غَافِلٌ وبطيء', 'حَزِينٌ ومُتْعَبٌ', 'مُتَسَرِّعٌ بدون تفكير'] },
      { word: 'عَزِيمَةٌ', kind: 'المعنى (المرادف)', ans: 'إِرَادَةٌ قوية وإصرار', wrongs: ['ضَعْفٌ وتَخَاذُلٌ', 'خَوْفٌ وهُرُوبٌ', 'نِسْيَانٌ وإِهْمَالٌ'] }
    ],
    fr: [
      { word: 'Courageux / Courageuse', kind: 'معنى الكلمة بالفرنسية (CM1)', ans: 'شجاع / جريء (Brave)', wrongs: ['جبان وخائف (Peureux)', 'كسول (Paresseux)', 'غاضب (Fâché)'] },
      { word: 'Découvrir', kind: 'معنى الفعل بالفرنسية (CM1)', ans: 'يكتشف (Trouver quelque chose de nouveau)', wrongs: ['يُخفي (Cacher)', 'ينسى (Oublier)', 'يكسر (Casser)'] },
      { word: 'Protéger', kind: 'معنى الفعل بالفرنسية (CM1)', ans: 'يحمي ويحافظ على (Défendre / Garder)', wrongs: ['يُدمّر (Détruire)', 'يترك (Quitter)', 'يشتري (Acheter)'] },
      { word: 'Magnifique', kind: 'معنى الصفة بالفرنسية (CM1)', ans: 'رائع وجميل جداً (Très beau)', wrongs: ['قبيح (Laid)', 'صغير جداً (Minuscule)', 'قديم ومكسور (Cassé)'] },
      { word: 'Comprendre', kind: 'معنى الفعل بالفرنسية (CM1)', ans: 'يفهم ويستوعب', wrongs: ['يرسم', 'يجري بسرعة', 'يغلق الباب'] },
      { word: 'Heureux / Heureuse', kind: 'مرادف ومعنى الكلمة', ans: 'سعيد ومسرور (Content)', wrongs: ['حزين (Triste)', 'مريض (Malade)', 'متعب (Fatigué)'] },
      { word: 'Bibliothèque', kind: 'مصطلح دراسي (CM1)', ans: 'مكتبة للقراءة والاستعارة', wrongs: ['ملعب كرة قدم', 'محطة قطار', 'مستشفى'] },
      { word: 'Environnement', kind: 'مصطلح علوم وجغرافيا (CM1)', ans: 'البيئة والطبيعة المحيطة بنا', wrongs: ['الفضاء الخارجي', 'المطبخ', 'الحقيبة المدرسية'] },
      { word: 'Réussir', kind: 'معنى الفعل بالفرنسية', ans: 'ينجح ويتفوق', wrongs: ['يفشل (Échouer)', 'ينام (Dormir)', 'يبكي (Pleurer)'] },
      { word: 'Partager', kind: 'معنى الفعل بالفرنسية', ans: 'يُشارك ويتقاسم مع الآخرين', wrongs: ['يأخذ كل شيء لنفسه', 'يختبئ', 'يصرخ'] }
    ],
    en: [
      { word: 'Curious', kind: 'English Vocabulary Meaning', ans: 'فضولي ومُحب للاستكشاف والمعرفة', wrongs: ['كسول ولا يهتم بشيء', 'خائف من التجربة', 'غاضب وحزين'] },
      { word: 'Generous', kind: 'English Vocabulary Meaning', ans: 'كريم ومعطاء يُحب مساعدة الآخرين', wrongs: ['بخيل (Stingy)', 'أناني (Selfish)', 'قاسٍ (Cruel)'] },
      { word: 'Achieve', kind: 'English Vocabulary Meaning', ans: 'يُحقّق هدفاً أو ينجز نجاحاً', wrongs: ['يستسلم (Give up)', 'يُضيع الوقت (Waste)', 'ينسى (Forget)'] },
      { word: 'Brilliant', kind: 'English Vocabulary Meaning', ans: 'متألق وذكي جداً / رائع', wrongs: ['مُمل (Boring)', 'مُظلم (Dark)', 'ضعيف (Weak)'] },
      { word: 'Explore', kind: 'English Vocabulary Meaning', ans: 'يستكشف أماكن أو معلومات جديدة', wrongs: ['يبقى في مكانه', 'يُغلق الكتاب', 'يُخفي السر'] },
      { word: 'Confident', kind: 'English Vocabulary Meaning', ans: 'واثق من نفسه وقدراته', wrongs: ['مُتردد وخجول جداً', 'خائف', 'حائر'] },
      { word: 'Ancient', kind: 'English Vocabulary Meaning', ans: 'قديم جداً / أثري (مثل الحضارة المصرية)', wrongs: ['حديث جداً (Modern)', 'سريع (Fast)', 'صغير (Tiny)'] },
      { word: 'Protect', kind: 'English Vocabulary Meaning', ans: 'يحمي ويصون (Keep safe)', wrongs: ['يؤذي (Harm)', 'يهمل (Ignore)', 'يكسر (Break)'] },
      { word: 'Solution', kind: 'English Vocabulary Meaning', ans: 'حلّ للمشكلة أو اللغز', wrongs: ['مشكلة جديدة', 'سؤال صعب', 'خطأ كبير'] },
      { word: 'Respect', kind: 'English Vocabulary Meaning', ans: 'احترام وتقدير الآخرين', wrongs: ['إهمال وسخرية', 'غضب وصراخ', 'خوف'] }
    ]
  };

  let activeTab = 'ar';
  let tabScore = { ar: 0, fr: 0, en: 0 };

  const shuffle = arr => [...arr].sort(() => Math.random() - 0.5);
  const pick = arr => arr[Math.floor(Math.random() * arr.length)];

  function speakWord(text, lang) {
    try {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(text);
        u.lang = lang === 'fr' ? 'fr-FR' : (lang === 'en' ? 'en-US' : 'ar-EG');
        u.rate = 0.92;
        window.speechSynthesis.speak(u);
      }
    } catch (e) {}
  }

  function renderTrilingualGame(stage) {
    const item = pick(vocabBank[activeTab]);
    const options = shuffle([item.ans, ...item.wrongs]);
    const tabMeta = {
      ar: { label: '🇪🇬 عربي (معاني وعكس)', color: '#D97706', dir: 'rtl' },
      fr: { label: '🇫🇷 Français (CM1)', color: '#2563EB', dir: 'ltr' },
      en: { label: '🇬🇧 English Smart', color: '#059669', dir: 'ltr' }
    };

    stage.innerHTML = `
      <div style="max-width:760px; margin:0 auto; padding:14px; text-align:center;">
        <!-- شريط التابات الثلاثة -->
        <div style="display:flex; justify-content:center; gap:10px; flex-wrap:wrap; margin-bottom:18px;">
          ${['ar', 'fr', 'en'].map(t => `
            <button data-tab="${t}" class="nav-btn" style="
              padding:12px 18px;
              border-radius:14px;
              font-weight:800;
              font-size:1rem;
              cursor:pointer;
              background:${activeTab === t ? tabMeta[t].color : 'rgba(148,163,184,0.15)'};
              color:${activeTab === t ? '#fff' : 'inherit'};
              border:2px solid ${activeTab === t ? tabMeta[t].color : 'transparent'};
              transition:all 0.2s;
            ">
              ${tabMeta[t].label} (${tabScore[t]} ⭐)
            </button>
          `).join('')}
        </div>

        <!-- بطاقة عرض الكلمة -->
        <div style="background:linear-gradient(135deg, ${tabMeta[activeTab].color}18, rgba(99,102,241,0.08)); border:2px solid ${tabMeta[activeTab].color}44; border-radius:22px; padding:22px 16px; margin-bottom:18px;">
          <div style="display:inline-block; background:${tabMeta[activeTab].color}; color:#fff; padding:5px 14px; border-radius:999px; font-size:0.9rem; font-weight:700; margin-bottom:10px;">
            ${item.kind}
          </div>
          <div style="font-size:2rem; font-weight:900; margin:8px 0; direction:${tabMeta[activeTab].dir};">
            ${item.word}
          </div>
          <button id="tri-speak-btn" class="nav-btn" style="margin:6px auto 0; padding:8px 16px; border-radius:999px; font-size:0.95rem; font-weight:700; cursor:pointer;">
            🔊 استمع لنطق الكلمة
          </button>
        </div>

        <!-- خيارات الإجابة -->
        <div id="tri-options" style="display:grid; grid-template-columns:repeat(auto-fit, minmax(230px, 1fr)); gap:12px;"></div>
      </div>
    `;

    stage.querySelectorAll('button[data-tab]').forEach(btn => {
      btn.onclick = () => {
        activeTab = btn.getAttribute('data-tab');
        renderTrilingualGame(stage);
      };
    });

    const spk = stage.querySelector('#tri-speak-btn');
    if (spk) spk.onclick = () => speakWord(item.word.split('/')[0].trim(), activeTab);

    const optBox = stage.querySelector('#tri-options');
    options.forEach(opt => {
      const btn = document.createElement('button');
      btn.className = 'nav-btn';
      btn.style.cssText = 'padding:16px 14px; font-size:1.08rem; font-weight:700; border-radius:16px; justify-content:center; text-align:center; line-height:1.45; cursor:pointer;';
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
      if (titleEl) titleEl.innerHTML = `📚 موسوعة الكلمات (عربي / فرنسي / إنجليش) <small>(Trésor des Mots)</small>`;
      if (badgeEl) badgeEl.innerText = `3 لغات • مستوى متقدم ⭐`;
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
