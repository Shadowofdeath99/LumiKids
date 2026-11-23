(function() {
  if (typeof LumiDictionary === 'undefined' || typeof LumiGames === 'undefined') return;

  // 1. إضافة الأنشطة الجديدة (التنافس العائلي + لوحة الخزنة + 3 ألعاب لهيلن)
  const suiteGames = [
    { id: 'family_duel_split', icon: '⚔️', nameEg: 'تحدي العائلة وجهاً لوجه', nameFr: 'Duel Famille (Écran Partagé)', color: '#E11D48', minAge: 6 },
    { id: 'vault_manager_hub', icon: '🏦', nameEg: 'إدارة خزنة هدية بابا والتقارير', nameFr: 'Coffre-fort & Rapports', color: '#D97706', minAge: 8 },
    { id: 'helen_puzzle_shapes', icon: '🧩', nameEg: 'بازل الحيوانات والأشكال (هيلن)', nameFr: 'Puzzle Formes & Animaux', color: '#8B5CF6', minAge: 3 },
    { id: 'helen_emotions', icon: '😊', nameEg: 'لعبة المشاعر والتعبيرات (هيلن)', nameFr: 'Les Émotions', color: '#EC4899', minAge: 3 },
    { id: 'helen_nature_colors', icon: '🌈', nameEg: 'ألوان الطبيعة الجميلة (هيلن)', nameFr: 'Couleurs de la Nature', color: '#10B981', minAge: 3 }
  ];

  const suiteInst = [
    { id: 'inst_duel', gameId: 'family_duel_split', eg: 'تحدي مباشر وجهاً لوجه بين هيفن وبابا أو ماما!', fr: 'Duel direct entre Heaven et Papa ou Maman !' },
    { id: 'inst_vault', gameId: 'vault_manager_hub', eg: 'متابعة رصيد خزنة بابا وتقارير المذاكرة لكل مادة!', fr: 'Suivi du coffre-fort et des progrès !' },
    { id: 'inst_hpuz', gameId: 'helen_puzzle_shapes', eg: 'اختاري الشكل أو الظل المطابق للحيوان يا هيلن!', fr: 'Trouve la bonne forme pour chaque animal !' },
    { id: 'inst_hemo', gameId: 'helen_emotions', eg: 'مين فرحان ومين زعلان؟ اختاري الوجه الصحيح!', fr: 'Choisis la bonne émotion !' },
    { id: 'inst_hcol', gameId: 'helen_nature_colors', eg: 'لون الشمس إيه؟ ولون البحر إيه؟ اختاري يا جميلة!', fr: 'Quelle est la couleur dans la nature ?' }
  ];

  if (Array.isArray(LumiDictionary.games)) {
    suiteGames.forEach(ng => {
      if (!LumiDictionary.games.some(g => g.id === ng.id)) LumiDictionary.games.push(ng);
    });
  }
  if (Array.isArray(LumiDictionary.gameInstructions)) {
    suiteInst.forEach(ni => {
      if (!LumiDictionary.gameInstructions.some(i => i.gameId === ni.gameId)) LumiDictionary.gameInstructions.push(ni);
    });
  }

  const pick = arr => arr[Math.floor(Math.random() * arr.length)];
  const shuffle = arr => [...arr].sort(() => Math.random() - 0.5);

  // 2. تخزين صوتيات بابا وماما للموسوعة والخزنة في IndexedDB
  const DB_NAME = 'LumiParentVoicesDB';
  const STORE_NAME = 'custom_recordings';

  function openVDB() {
    return new Promise((resolve, reject) => {
      const req = indexedDB.open(DB_NAME, 1);
      req.onupgradeneeded = e => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) db.createObjectStore(STORE_NAME);
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }

  async function saveRec(key, blob) {
    const db = await openVDB();
    return new Promise((res, rej) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      tx.objectStore(STORE_NAME).put(blob, key);
      tx.oncomplete = () => res(true);
      tx.onerror = () => rej(tx.error);
    });
  }

  async function loadRec(key) {
    try {
      const db = await openVDB();
      return await new Promise(res => {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const r = tx.objectStore(STORE_NAME).get(key);
        r.onsuccess = () => res(r.result || null);
        r.onerror = () => res(null);
      });
    } catch (e) { return null; }
  }

  // 3. بنك الجمل والحوارات اليومية (عربي / فرنسي / إنجليزي)
  const dialoguesBank = [
    { ar: 'صباح الخير يا بابا، أنا مستعدة للمدرسة!', fr: 'Bonjour Papa, je suis prête pour l’école !', en: 'Good morning Dad, I am ready for school!', meaning: 'تحية الصباح والاستعداد للمدرسة' },
    { ar: 'من فضلك، هل يمكنك مساعدتي في هذه المسألة؟', fr: 'S’il te plaît, peux-tu m’aider avec ce problème ?', en: 'Please, can you help me with this problem?', meaning: 'طلب المساعدة بأدب في المذاكرة' },
    { ar: 'أنا أحب القراءة والعلوم والرياضيات كثيراً.', fr: 'J’aime beaucoup la lecture, les sciences et les maths.', en: 'I love reading, science, and math very much.', meaning: 'التعبير عن حب التعلم والمواد الدراسية' },
    { ar: 'مدينتي الإسكندرية جميلة جداً على شاطئ البحر.', fr: 'Ma ville Alexandrie est très belle au bord de la mer.', en: 'My city Alexandria is very beautiful by the sea.', meaning: 'وصف مدينة الإسكندرية' },
    { ar: 'شكراً لك يا ماما على هذا الطعام اللذيذ.', fr: 'Merci Maman pour ce délicieux repas.', en: 'Thank you Mom for this delicious meal.', meaning: 'شكر الأم على الطعام' },
    { ar: 'هيا نلعب معاً ونتعاون كفريق واحد!', fr: 'Jouons ensemble et coopérons en équipe !', en: 'Let us play together and cooperate as one team!', meaning: 'الدعوة للعب الجماعي والتعاون' },
    { ar: 'كم الساعة الآن؟ حان وقت المراجعة.', fr: 'Quelle heure est-il ? C’est l’heure de réviser.', en: 'What time is it now? It is time to review.', meaning: 'السؤال عن الوقت للمراجعة' },
    { ar: 'يجب أن نحافظ على نظافة بيئتنا ونزرع الأشجار.', fr: 'Nous devons protéger notre environnement et planter des arbres.', en: 'We must protect our environment and plant trees.', meaning: 'الحفاظ على البيئة' },
    { ar: 'أنا فخورة بنفسي لأنني نجحت في التحدي!', fr: 'Je suis fière de moi parce que j’ai réussi le défi !', en: 'I am proud of myself because I succeeded in the challenge!', meaning: 'الفخر بالنجاح والإنجاز' },
    { ar: 'أين تقع مكتبة الإسكندرية الكبرى؟', fr: 'Où se trouve la grande Bibliothèque d’Alexandrie ?', en: 'Where is the great Library of Alexandria located?', meaning: 'السؤال عن موقع معلم سياحي' }
  ];

  // 4. لعبة التنافس العائلي المباشر وجهاً لوجه (Split-Screen Duel)
  let duelScore = { heaven: 0, parent: 0 };
  const duelQuestions = [
    { q: '7 × 8 = ?', ans: '56', opts: ['54', '56', '64', '48'] },
    { q: 'عاصمة فرنسا (Capitale de la France)؟', ans: 'Paris', opts: ['Lyon', 'Paris', 'Rome', 'Madrid'] },
    { q: 'محيط مربع طول ضلعه 9 سم؟', ans: '36 سم', opts: ['81 سم', '36 سم', '18 سم', '27 سم'] },
    { q: 'الغاز الذي تتنفسه النباتات في البناء الضوئي؟', ans: 'ثاني أكسيد الكربون', opts: ['الأكسجين', 'ثاني أكسيد الكربون', 'الهيليوم', 'النيتروجين'] },
    { q: '144 ÷ 12 = ?', ans: '12', opts: ['11', '12', '14', '10'] },
    { q: 'معنى كلمة (Magnifique) بالفرنسية؟', ans: 'رائع وجميل', opts: ['صغير', 'رائع وجميل', 'سريع', 'حزين'] },
    { q: 'أقرب كوكب للشمس؟', ans: 'عطارد', opts: ['الأرض', 'المريخ', 'عطارد', 'زحل'] },
    { q: '3/4 تساوي كام في المية (%)؟', ans: '75%', opts: ['25%', '50%', '75%', '80%'] },
    { q: 'جمع كلمة (Cheval) بالفرنسية؟', ans: 'Chevaux', opts: ['Chevals', 'Chevaux', 'Chevaus', 'Chevales'] },
    { q: 'أكبر محافظات مصر مساحة؟', ans: 'الوادي الجديد', opts: ['الإسكندرية', 'القاهرة', 'الوادي الجديد', 'أسوان'] }
  ];

  function renderSplitDuel(stage) {
    const item = pick(duelQuestions);
    const opts = shuffle(item.opts);
    stage.innerHTML = `
      <div style="max-width:760px; margin:0 auto; padding:10px; display:flex; flex-direction:column; gap:12px;">
        <!-- نصف الأهل (مقلوب 180 درجة للعب وجهاً لوجه على التابلت أو عادي) -->
        <div style="background:linear-gradient(135deg,#1E293B,#334155); color:#fff; border-radius:20px; padding:14px; text-align:center; transform:rotate(180deg);">
          <div style="font-weight:900; font-size:1.05rem; color:#FBBF24; margin-bottom:6px;">❤️ بابا مينا / ماما ساندرا • النقاط: ${duelScore.parent}</div>
          <div style="font-size:1.15rem; font-weight:800; margin-bottom:10px;">${item.q}</div>
          <div style="display:grid; grid-template-columns:repeat(2, 1fr); gap:8px;">
            ${opts.map(o => `<button class="duel-p-btn" data-ans="${o}" style="padding:10px; border-radius:12px; border:none; background:#475569; color:#fff; font-weight:800; font-size:0.95rem; cursor:pointer;">${o}</button>`).join('')}
          </div>
        </div>

        <div style="text-align:center; font-weight:900; font-size:1rem; color:#E11D48;">
          ⚔️ تحدي السرعة والذكاء — أول من يصل إلى 10 نقاط يفوز! ⚔️
        </div>

        <!-- نصف هيفن -->
        <div style="background:linear-gradient(135deg,#4F46E5,#7C3AED); color:#fff; border-radius:20px; padding:14px; text-align:center;">
          <div style="font-weight:900; font-size:1.05rem; color:#FDE047; margin-bottom:6px;">👸 البطلة هيفن • النقاط: ${duelScore.heaven}</div>
          <div style="font-size:1.15rem; font-weight:800; margin-bottom:10px;">${item.q}</div>
          <div style="display:grid; grid-template-columns:repeat(2, 1fr); gap:8px;">
            ${opts.map(o => `<button class="duel-h-btn" data-ans="${o}" style="padding:10px; border-radius:12px; border:none; background:rgba(255,255,255,0.2); color:#fff; font-weight:800; font-size:0.95rem; cursor:pointer;">${o}</button>`).join('')}
          </div>
        </div>
      </div>
    `;

    stage.querySelectorAll('.duel-p-btn').forEach(btn => {
      btn.onclick = () => {
        if (btn.dataset.ans === item.ans) {
          duelScore.parent += 1;
          btn.style.background = '#10B981';
          setTimeout(() => renderSplitDuel(stage), 500);
        } else {
          btn.style.background = '#EF4444';
        }
      };
    });

    stage.querySelectorAll('.duel-h-btn').forEach(btn => {
      btn.onclick = () => {
        if (btn.dataset.ans === item.ans) {
          duelScore.heaven += 1;
          btn.style.background = '#10B981';
          if (typeof LumiStorage !== 'undefined' && typeof LumiStorage.addStars === 'function') LumiStorage.addStars(2);
          setTimeout(() => renderSplitDuel(stage), 500);
        } else {
          btn.style.background = '#EF4444';
        }
      };
    });
  }

  // 5. لوحة تحكم خزنة بابا وتقارير المذاكرة وتسجيل تهنئة الخزنة
  function renderVaultManager(stage) {
    const v = (window.LumiVault && LumiVault.getStatus) ? LumiVault.getStatus() : { solved: 0, unlockedLevel: 0, cash: 0, paidOut: 0 };
    const available = Math.max(0, v.cash - (v.paidOut || 0));

    stage.innerHTML = `
      <div style="max-width:740px; margin:0 auto; padding:16px;">
        <div style="background:linear-gradient(135deg,#F59E0B,#D97706); color:#fff; padding:20px; border-radius:22px; text-align:center; margin-bottom:16px;">
          <h3 style="margin:0 0 8px;">🏦 لوحة إدارة خزنة هدية بابا وتقارير المذاكرة</h3>
          <div style="display:flex; justify-content:center; gap:14px; flex-wrap:wrap; margin-top:10px;">
            <div style="background:rgba(255,255,255,0.2); padding:10px 16px; border-radius:14px;">
              <div style="font-size:0.85rem;">الرصيد المتاح حالياً</div>
              <div style="font-size:1.5rem; font-weight:900;">${available} جنيه</div>
            </div>
            <div style="background:rgba(255,255,255,0.2); padding:10px 16px; border-radius:14px;">
              <div style="font-size:0.85rem;">إجمالي ما تم فتحه</div>
              <div style="font-size:1.5rem; font-weight:900;">${v.cash} جنيه</div>
            </div>
            <div style="background:rgba(255,255,255,0.2); padding:10px 16px; border-radius:14px;">
              <div style="font-size:0.85rem;">أسئلة المنهج المحلولة</div>
              <div style="font-size:1.5rem; font-weight:900;">${v.solved} سؤال</div>
            </div>
          </div>
        </div>

        <!-- تسجيل رسالة تهنئة صوتية بصوت بابا أو ماما عند فتح الأقفال -->
        <div style="padding:16px; border-radius:18px; background:rgba(236,72,153,0.08); border:2px dashed #EC4899; margin-bottom:16px; text-align:center;">
          <div style="font-weight:900; color:#BE185D; margin-bottom:8px;">🎙️ تسجيل تهنئة بصوت بابا أو ماما عند فتح أقفال الخزنة:</div>
          <div style="display:flex; justify-content:center; gap:10px; flex-wrap:wrap;">
            <button id="vault-rec-btn" class="nav-btn" style="background:#DB2777; color:#fff; border-radius:12px; padding:10px 16px;">● تسجيل تهنئة الخزنة</button>
            <button id="vault-play-btn" class="nav-btn" style="background:#059669; color:#fff; border-radius:12px; padding:10px 16px;">▶ سماع التهنئة</button>
          </div>
          <div id="vault-rec-msg" style="margin-top:8px; font-size:0.88rem; font-weight:700; color:#64748B;"></div>
        </div>

        <!-- صرف مكافأة كاش لهيفن -->
        <div style="padding:16px; border-radius:18px; background:rgba(16,185,129,0.08); border:1px solid #10B981; text-align:center;">
          <div style="font-weight:900; margin-bottom:10px;">💵 تسجيل تسليم مكافأة نقدية (كاش) لهيفن:</div>
          <div style="display:flex; justify-content:center; gap:8px; flex-wrap:wrap;">
            <input id="payout-amt" type="number" min="5" max="${available}" value="${available > 0 ? available : 25}" style="width:120px; padding:10px; border-radius:10px; border:1px solid #CBD5E1; font-weight:800; text-align:center;" />
            <button id="payout-btn" class="nav-btn" style="background:#10B981; color:#fff; border-radius:10px; padding:10px 18px;">✅ تأكيد التسليم كاش</button>
          </div>
        </div>
      </div>
    `;

    let vRec = null, vChunks = [];
    const rBtn = stage.querySelector('#vault-rec-btn');
    const pBtn = stage.querySelector('#vault-play-btn');
    const mEl = stage.querySelector('#vault-rec-msg');

    loadRec('vault_celebration').then(b => { if (b) mEl.textContent = '✅ توجد تهنئة مسجلة بصوتكم وجاهزة للتشغيل!'; });

    rBtn.onclick = async () => {
      if (vRec && vRec.state === 'recording') {
        vRec.stop();
        rBtn.textContent = '● تسجيل تهنئة الخزنة';
        return;
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        vChunks = [];
        vRec = new MediaRecorder(stream);
        vRec.ondataavailable = e => { if (e.data.size > 0) vChunks.push(e.data); };
        vRec.onstop = async () => {
          stream.getTracks().forEach(t => t.stop());
          const blob = new Blob(vChunks, { type: 'audio/webm' });
          await saveRec('vault_celebration', blob);
          mEl.textContent = '✅ تم حفظ تهنئة الخزنة بصوتكم!';
          new Audio(URL.createObjectURL(blob)).play().catch(() => {});
        };
        vRec.start();
        rBtn.textContent = '⏹ إيقاف وحفظ';
        mEl.textContent = '🔴 جاري تسجيل التهنئة...';
      } catch (e) { mEl.textContent = '⚠️ يرجى السماح بالميكروفون'; }
    };

    pBtn.onclick = async () => {
      const b = await loadRec('vault_celebration');
      if (b) new Audio(URL.createObjectURL(b)).play().catch(() => {});
      else mEl.textContent = 'لا يوجد تسجيل بعد';
    };

    stage.querySelector('#payout-btn').onclick = () => {
      const amt = Number(stage.querySelector('#payout-amt').value || 0);
      if (amt > 0 && window.LumiVault) {
        LumiVault.payout(amt);
        renderVaultManager(stage);
      }
    };
  }

  // 6. ألعاب هيلن الحسية الجديدة (3 سنوات)
  function renderHelenGame(stage, gid) {
    const banks = {
      helen_puzzle_shapes: [
        { q: 'أين قطعة البازل المناسبة للقطة؟ 🐱', badge: '🧩 بازل الحيوانات', ans: '🐱 قطة جميلة', opts: ['🐱 قطة جميلة', '🚗 سيارة سريعة', '🌳 شجرة خضراء', '⚽ كرة قدم'] },
        { q: 'اختاري الشكل الدائري مثل الشمس والكرة:', badge: '⭕ الأشكال الهندسية', ans: '🔴 دائرة (Cercle)', opts: ['🔴 دائرة (Cercle)', '🟦 مربع (Carré)', '🔺 مثلث (Triangle)', '⭐ نجمة (Étoile)'] },
        { q: 'اختاري شكل النجمة المضيئة في السماء:', badge: '⭐ الأشكال', ans: '⭐ نجمة (Étoile)', opts: ['⭐ نجمة (Étoile)', '🍎 تفاحة', '🐟 سمكة', '🏠 بيت'] },
        { q: 'أين قطعة البازل المناسبة للفراشة الملونة؟ 🦋', badge: '🧩 بازل الفراشة', ans: '🦋 فراشة ملونة', opts: ['🦋 فراشة ملونة', '🐘 فيل كبير', '🚂 قطار', '🍌 موزة'] }
      ],
      helen_emotions: [
        { q: 'عندما نضحك ونلعب مع بابا وماما نكون:', badge: '😊 المشاعر', ans: '😊 فرحان وسعيد (Content)', opts: ['😊 فرحان وسعيد (Content)', '😢 زعلان ويبكي (Triste)', '😴 نعسان (Fatigué)', '😠 غاضب (Fâché)'] },
        { q: 'عندما يحين وقت النوم ليلاً نكون:', badge: '😴 وقت النوم', ans: '😴 نعسان (Fatigué)', opts: ['😴 نعسان (Fatigué)', '🥳 محتفل', '😂 يضحك بشدة', '🏃 يجري بسرعة'] },
        { q: 'عندما نرى مفاجأة جميلة من بابا نكون:', badge: '🤩 المفاجأة', ans: '🤩 مندهش وسعيد (Surpris)', opts: ['🤩 مندهش وسعيد (Surpris)', '😢 حزين', '🥶 بردان', '🤒 مريض'] }
      ],
      helen_nature_colors: [
        { q: 'ما هو لون الشمس المشرقة في السماء؟ ☀️', badge: '☀️ ألوان الطبيعة', ans: '🟡 أصفر (Jaune)', opts: ['🟡 أصفر (Jaune)', '🔵 أزرق (Bleu)', '⚫ أسود (Noir)', '🟣 بنفسجي (Violet)'] },
        { q: 'ما هو لون مياه البحر الجميلة في الإسكندرية؟ 🌊', badge: '🌊 البحر', ans: '🔵 أزرق (Bleu)', opts: ['🔵 أزرق (Bleu)', '🔴 أحمر (Rouge)', '🟡 أصفر (Jaune)', '🟤 بني (Marron)'] },
        { q: 'ما هو لون أوراق الشجر والحديقة؟ 🌳', badge: '🌳 الأشجار', ans: '🟢 أخضر (Vert)', opts: ['🟢 أخضر (Vert)', '🟠 برتقالي (Orange)', '⚪ أبيض (Blanc)', '🟣 بنفسجي (Violet)'] },
        { q: 'ما هو لون الفراولة اللذيذة؟ 🍓', badge: '🍓 الفواكه', ans: '🔴 أحمر (Rouge)', opts: ['🔴 أحمر (Rouge)', '🔵 أزرق (Bleu)', '⚫ أسود (Noir)', '🟡 أصفر (Jaune)'] }
      ]
    };

    const item = pick(banks[gid]);
    const opts = shuffle(item.opts);
    stage.innerHTML = `
      <div style="max-width:680px; margin:0 auto; padding:16px; text-align:center;">
        <div style="display:inline-block; background:#EC4899; color:#fff; padding:8px 18px; border-radius:999px; font-weight:800; font-size:1.1rem; margin-bottom:14px;">${item.badge}</div>
        <div style="font-size:1.45rem; font-weight:900; margin-bottom:18px;">${item.q}</div>
        <div id="helen-opts" style="display:grid; grid-template-columns:repeat(2, 1fr); gap:14px;"></div>
      </div>
    `;
    const box = stage.querySelector('#helen-opts');
    opts.forEach(o => {
      const btn = document.createElement('button');
      btn.className = 'nav-btn';
      btn.style.cssText = 'padding:20px 12px; font-size:1.25rem; font-weight:900; border-radius:20px; justify-content:center; min-height:76px; cursor:pointer;';
      btn.textContent = o;
      btn.onclick = () => {
        if (o === item.ans) {
          btn.style.background = '#10B981';
          btn.style.color = '#fff';
          if (typeof LumiGames.handleAnswer === 'function') LumiGames.handleAnswer(true);
          else setTimeout(() => LumiGames.renderGameScreen(), 600);
        } else {
          btn.style.background = '#EF4444';
          btn.style.color = '#fff';
        }
      };
      box.appendChild(btn);
    });
  }

  // 7. إضافة تبويب "💬 جمل وحوارات" + زر تسجيل صوت بابا وماما لكل مصطلح داخل الموسوعة
  function enhanceTrilingualScreen(stage) {
    if (!stage || stage.querySelector('#tri-dialogues-bar')) return;
    const bar = document.createElement('div');
    bar.id = 'tri-dialogues-bar';
    bar.style.cssText = 'max-width:780px; margin:12px auto 0 auto; padding:12px; border-radius:18px; background:rgba(79,70,229,0.08); border:1px solid rgba(79,70,229,0.25); text-align:center;';

    const d = pick(dialoguesBank);
    const termTitle = (stage.querySelector('div[style*="font-size:1.8rem"]') || {}).textContent || 'term';
    const termKey = 'vocab_' + termTitle.trim().slice(0, 24);

    bar.innerHTML = `
      <div style="display:flex; justify-content:center; gap:8px; flex-wrap:wrap; margin-bottom:10px;">
        <button id="vocab-rec-term" type="button" style="padding:6px 14px; border-radius:999px; border:none; background:#DB2777; color:#fff; font-weight:800; font-size:0.84rem; cursor:pointer;">🎙️ سجّل نطق هذه الكلمة بصوت بابا/ماما</button>
        <button id="vocab-play-term" type="button" style="padding:6px 14px; border-radius:999px; border:none; background:#059669; color:#fff; font-weight:800; font-size:0.84rem; cursor:pointer;">▶ سماع صوتكم</button>
      </div>
      <div style="border-top:1px dashed #CBD5E1; padding-top:10px; margin-top:6px;">
        <div style="font-weight:900; color:#4F46E5; font-size:0.95rem; margin-bottom:6px;">💬 جملة اليوم والحوار بالتلات لغات (${d.meaning}):</div>
        <div style="font-size:1rem; font-weight:800; margin-bottom:4px;">🇪🇬 ${d.ar}</div>
        <div style="font-size:0.98rem; font-weight:700; color:#2563EB; direction:ltr; margin-bottom:4px;">🇫🇷 ${d.fr} <button type="button" onclick="LumiAudio.speakTerm('${d.fr.replace(/'/g, "\\'")}', 'fr')" style="border:none; background:#DBEAFE; border-radius:8px; padding:2px 8px; cursor:pointer;">🔊</button></div>
        <div style="font-size:0.98rem; font-weight:700; color:#059669; direction:ltr;">🇬🇧 ${d.en} <button type="button" onclick="LumiAudio.speakTerm('${d.en.replace(/'/g, "\\'")}', 'en')" style="border:none; background:#D1FAE5; border-radius:8px; padding:2px 8px; cursor:pointer;">🔊</button></div>
      </div>
    `;
    stage.appendChild(bar);

    let tRec = null, tChunks = [];
    const recBtn = bar.querySelector('#vocab-rec-term');
    const playBtn = bar.querySelector('#vocab-play-term');

    recBtn.onclick = async () => {
      if (tRec && tRec.state === 'recording') {
        tRec.stop();
        recBtn.textContent = '🎙️ سجّل نطق هذه الكلمة بصوت بابا/ماما';
        return;
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        tChunks = [];
        tRec = new MediaRecorder(stream);
        tRec.ondataavailable = e => { if (e.data.size > 0) tChunks.push(e.data); };
        tRec.onstop = async () => {
          stream.getTracks().forEach(t => t.stop());
          const blob = new Blob(tChunks, { type: 'audio/webm' });
          await saveRec(termKey, blob);
          recBtn.textContent = '✅ تم حفظ صوتكم للكلمة!';
          new Audio(URL.createObjectURL(blob)).play().catch(() => {});
        };
        tRec.start();
        recBtn.textContent = '⏹ إيقاف وحفظ';
      } catch (e) {}
    };

    playBtn.onclick = async () => {
      const b = await loadRec(termKey);
      if (b) new Audio(URL.createObjectURL(b)).play().catch(() => {});
    };
  }

  // ربط الشاشات الجديدة في محرك الألعاب
  const prevRender = LumiGames.renderGameScreen.bind(LumiGames);
  LumiGames.renderGameScreen = function() {
    const stage = document.getElementById('game-stage');
    const titleEl = document.getElementById('game-title');
    const badgeEl = document.getElementById('game-level-badge');
    const coOpBtn = document.getElementById('coop-toggle-btn');

    if (this.currentGameId === 'family_duel_split') {
      if (titleEl) titleEl.innerHTML = `⚔️ تحدي العائلة وجهاً لوجه <small>(Duel Famille)</small>`;
      if (badgeEl) badgeEl.innerText = `شاشة مقسومة 👨‍👧`;
      if (coOpBtn) coOpBtn.style.display = 'none';
      renderSplitDuel(stage);
      return;
    }
    if (this.currentGameId === 'vault_manager_hub') {
      if (titleEl) titleEl.innerHTML = `🏦 إدارة خزنة هدية بابا والتقارير <small>(Coffre-fort)</small>`;
      if (badgeEl) badgeEl.innerText = `لوحة الأهل 🔐`;
      if (coOpBtn) coOpBtn.style.display = 'none';
      renderVaultManager(stage);
      return;
    }
    if (['helen_puzzle_shapes', 'helen_emotions', 'helen_nature_colors'].includes(this.currentGameId)) {
      const meta = LumiDictionary.games.find(g => g.id === this.currentGameId) || { icon: '🦄', nameEg: 'لعبة هيلن', nameFr: '' };
      if (titleEl) titleEl.innerHTML = `${meta.icon} ${meta.nameEg} <small>(${meta.nameFr})</small>`;
      if (badgeEl) badgeEl.innerText = `هيلن الجميلة 🦄`;
      if (coOpBtn) coOpBtn.style.display = 'none';
      renderHelenGame(stage, this.currentGameId);
      return;
    }

    prevRender();
    if (this.currentGameId === 'trilingual_vocab') {
      enhanceTrilingualScreen(stage);
    }
  };

  if (window.LumiApp && typeof LumiApp.renderGamesGrid === 'function') {
    LumiApp.renderGamesGrid();
  }
})();
