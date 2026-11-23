(function() {
  const DB_NAME = 'LumiMasterVoiceDB_v1';
  const STORE_NAME = 'utterances';

  // مفتاح موحد لأي جملة أو كلمة في التطبيق بالكامل
  function normalizeKey(text) {
    return (text || '')
      .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, '')
      .replace(/\s+/g, ' ')
      .trim()
      .toLowerCase();
  }

  function openMasterDB() {
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

  async function saveVoiceBlob(text, blob) {
    const key = normalizeKey(text);
    if (!key) return false;
    const db = await openMasterDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      tx.objectStore(STORE_NAME).put({ blob, updatedAt: Date.now(), raw: text }, key);
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => reject(tx.error);
    });
  }

  async function getVoiceBlob(text) {
    const key = normalizeKey(text);
    if (!key) return null;
    try {
      const db = await openMasterDB();
      return await new Promise(resolve => {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const req = tx.objectStore(STORE_NAME).get(key);
        req.onsuccess = () => resolve(req.result ? req.result.blob : null);
        req.onerror = () => resolve(null);
      });
    } catch (e) { return null; }
  }

  async function deleteVoiceBlob(text) {
    const key = normalizeKey(text);
    const db = await openMasterDB();
    return new Promise(resolve => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      tx.objectStore(STORE_NAME).delete(key);
      tx.oncomplete = () => resolve(true);
    });
  }

  async function getAllRecordedKeys() {
    try {
      const db = await openMasterDB();
      return await new Promise(resolve => {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const req = tx.objectStore(STORE_NAME).getAllKeys();
        req.onsuccess = () => resolve(new Set(req.result || []));
        req.onerror = () => resolve(new Set());
      });
    } catch (e) { return new Set(); }
  }

  // الصوت الافتراضي الأنثوي الهادئ (عربي / فرنسي / إنجليزي)
  function detectLang(text) {
    if (/[\u0600-\u06FF]/.test(text)) return 'ar-EG';
    if (/[àâçéèêëîïôûùüÿñæœ]/i.test(text) || /\b(le|la|les|un|une|des|est|sont|quelle|quel|calcule|complète|choisis|dans|avec|pour|bonjour|merci)\b/i.test(text)) {
      return 'fr-FR';
    }
    return 'en-US';
  }

  function pickSoftFemaleVoice(langCode) {
    if (!('speechSynthesis' in window)) return null;
    const prefix = langCode.slice(0, 2).toLowerCase();
    const voices = window.speechSynthesis.getVoices() || [];
    const valid = voices.filter(v => {
      const l = (v.lang || '').toLowerCase();
      const n = (v.name || '').toLowerCase();
      if (!l.startsWith(prefix)) return false;
      if (l.includes('in') || n.includes('india') || n.includes('ravi') || n.includes('hemant')) return false;
      return true;
    });
    const hints = ['salma', 'sara', 'layla', 'denise', 'amelie', 'celine', 'jenny', 'aria', 'samantha', 'victoria', 'zira', 'google', 'natural', 'female'];
    for (const h of hints) {
      const found = valid.find(v => v.name.toLowerCase().includes(h));
      if (found) return found;
    }
    return valid[0] || null;
  }

  function playDefaultSoftTTS(text, forcedLang) {
    const cleaned = (text || '')
      .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, ' ')
      .replace(/[_]{2,}/g, ' ... ')
      .replace(/\s+/g, ' ')
      .trim();
    if (!cleaned || !('speechSynthesis' in window)) return;
    const lang = forcedLang || detectLang(cleaned);
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(cleaned);
    u.lang = lang;
    const v = pickSoftFemaleVoice(lang);
    if (v) u.voice = v;
    u.pitch = 1.12;
    u.rate = 0.92;
    window.speechSynthesis.speak(u);
  }

  let currentPlayer = null;
  async function speakUnified(text, forcedLang) {
    if (!text) return;
    if (currentPlayer) {
      try { currentPlayer.pause(); } catch (e) {}
      currentPlayer = null;
    }
    // 1. الأولوية لصوت الأهل المسجل في القاموس الشامل
    const blob = await getVoiceBlob(text);
    if (blob) {
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      currentPlayer = audio;
      audio.onended = () => URL.revokeObjectURL(url);
      audio.play().catch(() => playDefaultSoftTTS(text, forcedLang));
      return;
    }
    // 2. الصوت الافتراضي الأنثوي الهادئ
    playDefaultSoftTTS(text, forcedLang);
  }

  // ربط النطق الموحد بكل محركات الصوت في التطبيق
  if (window.LumiQuestionVoice) {
    window.LumiQuestionVoice.speak = (t) => speakUnified(t);
  }
  if (window.LumiAudio) {
    LumiAudio.speakTerm = (t, lang) => {
      const map = { ar: 'ar-EG', fr: 'fr-FR', en: 'en-US' };
      speakUnified(t, map[lang]);
    };
    const origSpeak = LumiAudio.speak ? LumiAudio.speak.bind(LumiAudio) : null;
    LumiAudio.speak = async function(voiceId, textEg = '', textFr = '') {
      if (textEg) {
        const bEg = await getVoiceBlob(textEg);
        if (bEg) return speakUnified(textEg, 'ar-EG');
      }
      if (textFr) {
        const bFr = await getVoiceBlob(textFr);
        if (bFr) return speakUnified(textFr, 'fr-FR');
      }
      if (origSpeak) return origSpeak(voiceId, textEg, textFr);
      if (textEg) return speakUnified(textEg, 'ar-EG');
      if (textFr) return speakUnified(textFr, 'fr-FR');
    };
  }

  // إزالة شريط التسجيل من تحت الأسئلة لإبقاء شاشة البنات صافية ومنظمة
  const cleanOldBars = () => {
    ['#parent-voice-bar', '#vocab-rec-term', '#vocab-play-term'].forEach(sel => {
      document.querySelectorAll(sel).forEach(el => el.remove());
    });
  };
  setInterval(cleanOldBars, 500);

  // جمع كافة الجمل والمصطلحات والأسئلة من ملفات المشروع تلقائياً (حتى 1000+ جملة)
  async function buildMasterCorpus() {
    const items = [];
    const seen = new Set();
    const add = (cat, lang, text, hint = '') => {
      const k = normalizeKey(text);
      if (!k || k.length < 2 || seen.has(k)) return;
      seen.add(k);
      items.push({ cat, lang, text: text.trim(), hint, key: k });
    };

    // 1. عبارات الترحيب والتشجيع الأساسية
    add('تشجيع وترحيب', 'ar-EG', 'أهلاً بك يا بطلة في عالم لومي كيدز! اختاري لعبتك المفضلة.', 'ترحيب البداية');
    add('تشجيع وترحيب', 'ar-EG', 'برافو عليكي! إجابة ممتازة يا عبقرية.', 'عند الإجابة الصحيحة');
    add('تشجيع وترحيب', 'ar-EG', 'حاولي مرة تانية يا جميلة، إنتي شاطرة وتقدري تجيبيها!', 'عند المحاولة');
    add('تشجيع وترحيب', 'fr-FR', 'Bravo ! Excellente réponse, continue comme ça !', 'تشجيع فرنسي');
    add('تشجيع وترحيب', 'en-US', 'Awesome job! That is the correct answer.', 'تشجيع إنجليزي');

    // 2. تعليمات الألعاب من LumiDictionary
    if (window.LumiDictionary && Array.isArray(LumiDictionary.gameInstructions)) {
      LumiDictionary.gameInstructions.forEach(inst => {
        if (inst.eg) add('تعليمات الألعاب', 'ar-EG', inst.eg, `لعبة: ${inst.gameId}`);
        if (inst.fr) add('تعليمات الألعاب', 'fr-FR', inst.fr, `Jeu: ${inst.gameId}`);
      });
    }

    // 3. استخراج كافة مصطلحات الموسوعة (300 مصطلح) والأسئلة من ملفات السكربت
    const scriptUrls = ['js/heaven_trilingual_vocab.js', 'js/heaven_cm1_pack.js', 'js/heaven_cm1_expansion.js', 'js/games_pack2.js', 'js/lumi_ultimate_suite.js'];
    for (const url of scriptUrls) {
      try {
        const res = await fetch(url);
        if (!res.ok) continue;
        const code = await res.text();
        for (const m of code.matchAll(/"word"\s*:\s*"([^"]+)"/g)) {
          const w = m[1];
          add('موسوعة المصطلحات', detectLang(w), w, 'مصطلح دراسي');
        }
        for (const m of code.matchAll(/title\s*:\s*'([^']+)'/g)) {
          const q = m[1];
          add('أسئلة المنهج', detectLang(q), q, 'سؤال منهج CM1');
        }
        for (const m of code.matchAll(/\b(ar|fr|en)\s*:\s*'([^']{8,})'/g)) {
          const langMap = { ar: 'ar-EG', fr: 'fr-FR', en: 'en-US' };
          add('حوارات وجمل', langMap[m[1]], m[2], 'جملة محادثة');
        }
      } catch (e) {}
    }
    return items;
  }

  // إضافة نشاط "استوديو صوت بابا وماما" في القائمة والشبكة
  const studioMeta = {
    id: 'master_voice_studio',
    icon: '🎙️',
    nameEg: 'استوديو صوت بابا وماما (القاموس الشامل)',
    nameFr: 'Studio Vocal des Parents',
    color: '#BE185D',
    minAge: 8
  };
  if (window.LumiDictionary && Array.isArray(LumiDictionary.games) && !LumiDictionary.games.some(g => g.id === studioMeta.id)) {
    LumiDictionary.games.unshift(studioMeta);
  }

  let corpusCache = [];
  let currentCat = 'الكل';
  let currentIndex = 0;
  let autoAdvance = true;
  let recorder = null;
  let chunks = [];

  async function renderMasterStudio(stage) {
    if (corpusCache.length === 0) {
      stage.innerHTML = `<div style="padding:30px; text-align:center; font-weight:800;">⏳ جاري تجميع كافة جمل وكلمات التطبيق في القاموس الشامل...</div>`;
      corpusCache = await buildMasterCorpus();
    }

    const recordedKeys = await getAllRecordedKeys();
    const cats = ['الكل', 'موسوعة المصطلحات', 'أسئلة المنهج', 'حوارات وجمل', 'تعليمات الألعاب', 'تشجيع وترحيب'];
    const filtered = currentCat === 'الكل' ? corpusCache : corpusCache.filter(x => x.cat === currentCat);
    const list = filtered.length > 0 ? filtered : corpusCache;
    if (currentIndex >= list.length) currentIndex = 0;
    if (currentIndex < 0) currentIndex = list.length - 1;

    const item = list[currentIndex];
    const isRecorded = recordedKeys.has(item.key);
    const totalRecorded = corpusCache.filter(x => recordedKeys.has(x.key)).length;

    stage.innerHTML = `
      <div style="max-width:800px; margin:0 auto; padding:14px; text-align:center;">
        <!-- شريط الإحصائيات -->
        <div style="background:linear-gradient(135deg,#BE185D,#7C3AED); color:#fff; padding:16px; border-radius:20px; margin-bottom:14px;">
          <h3 style="margin:0 0 6px;">🎙️ القاموس الصوتي الشامل لبابا مينا وماما ساندرا</h3>
          <div style="font-size:0.95rem; opacity:0.95;">
            تم تسجيل <strong>${totalRecorded}</strong> جملة بصوتكم من أصل <strong>${corpusCache.length}</strong> جملة وكلمة في التطبيق
          </div>
        </div>

        <!-- فلاتر الأقسام -->
        <div style="display:flex; justify-content:center; gap:6px; flex-wrap:wrap; margin-bottom:14px;">
          ${cats.map(c => `
            <button type="button" data-scat="${c}" style="
              padding:7px 13px; border-radius:999px; font-size:0.85rem; font-weight:800; cursor:pointer;
              border:2px solid ${currentCat === c ? '#BE185D' : '#CBD5E1'};
              background:${currentCat === c ? '#BE185D' : 'transparent'};
              color:${currentCat === c ? '#fff' : 'inherit'};
            ">${c}</button>
          `).join('')}
        </div>

        <!-- بطاقة الجملة الحالية (جملة جملة) -->
        <div style="background:rgba(190,24,93,0.06); border:2px solid ${isRecorded ? '#10B981' : 'rgba(190,24,93,0.3)'}; border-radius:24px; padding:22px 16px; margin-bottom:14px;">
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; margin-bottom:10px;">
            <span style="background:#334155; color:#fff; padding:4px 12px; border-radius:999px; font-size:0.84rem; font-weight:800;">
              جملة ${currentIndex + 1} من ${list.length} (${item.cat})
            </span>
            <span style="background:${isRecorded ? '#10B981' : '#F59E0B'}; color:#fff; padding:4px 12px; border-radius:999px; font-size:0.84rem; font-weight:800;">
              ${isRecorded ? '✅ مسجلة بصوت بابا/ماما' : '🔊 تعمل بالصوت الافتراضي حالياً'}
            </span>
          </div>

          <div style="font-size:1.55rem; font-weight:900; line-height:1.6; margin:14px 0; direction:${item.lang === 'ar-EG' ? 'rtl' : 'ltr'};">
            ${item.text}
          </div>

          <!-- أزرار التحكم الصوتي -->
          <div style="display:flex; justify-content:center; gap:10px; flex-wrap:wrap; margin-top:14px;">
            <button id="mvs-rec-btn" type="button" class="nav-btn" style="background:#E11D48; color:#fff; padding:14px 20px; border-radius:16px; font-size:1.05rem; font-weight:900; cursor:pointer;">
              ● ابدأ تسجيل صوتك
            </button>
            <button id="mvs-play-parent" type="button" class="nav-btn" style="background:#10B981; color:#fff; padding:14px 18px; border-radius:16px; font-size:1rem; font-weight:800; cursor:pointer; opacity:${isRecorded ? '1' : '0.45'};">
              ▶ سماع صوتكم
            </button>
            <button id="mvs-play-default" type="button" class="nav-btn" style="background:#0284C7; color:#fff; padding:14px 18px; border-radius:16px; font-size:1rem; font-weight:800; cursor:pointer;">
              🔊 الصوت الافتراضي
            </button>
            ${isRecorded ? `<button id="mvs-del-btn" type="button" class="nav-btn" style="background:#64748B; color:#fff; padding:14px 14px; border-radius:16px; font-size:0.92rem; cursor:pointer;">🗑️ حذف التسجيل</button>` : ''}
          </div>
          <div id="mvs-status" style="margin-top:10px; font-weight:800; color:#BE185D; font-size:0.95rem;"></div>
        </div>

        <!-- التنقل بين الجمل + الانتقال التلقائي -->
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
          <button id="mvs-prev" type="button" class="nav-btn" style="padding:12px 20px; border-radius:14px; font-weight:800; cursor:pointer;">⬅️ الجملة السابقة</button>
          <label style="font-weight:800; font-size:0.92rem; cursor:pointer;">
            <input id="mvs-auto-next" type="checkbox" ${autoAdvance ? 'checked' : ''} /> الانتقال للجملة التالية تلقائياً بعد الحفظ
          </label>
          <button id="mvs-next" type="button" class="nav-btn" style="padding:12px 20px; border-radius:14px; font-weight:800; cursor:pointer;">الجملة التالية ➡️</button>
        </div>
      </div>
    `;

    stage.querySelectorAll('button[data-scat]').forEach(b => {
      b.onclick = () => {
        currentCat = b.dataset.scat;
        currentIndex = 0;
        renderMasterStudio(stage);
      };
    });

    stage.querySelector('#mvs-auto-next').onchange = e => { autoAdvance = e.target.checked; };
    stage.querySelector('#mvs-prev').onclick = () => { currentIndex--; renderMasterStudio(stage); };
    stage.querySelector('#mvs-next').onclick = () => { currentIndex++; renderMasterStudio(stage); };
    stage.querySelector('#mvs-play-default').onclick = () => playDefaultSoftTTS(item.text, item.lang);

    stage.querySelector('#mvs-play-parent').onclick = async () => {
      const b = await getVoiceBlob(item.text);
      if (b) new Audio(URL.createObjectURL(b)).play().catch(() => {});
      else stage.querySelector('#mvs-status').textContent = 'هذه الجملة لم تُسجل بصوتكم بعد — يعمل الصوت الافتراضي.';
    };

    const delBtn = stage.querySelector('#mvs-del-btn');
    if (delBtn) {
      delBtn.onclick = async () => {
        await deleteVoiceBlob(item.text);
        renderMasterStudio(stage);
      };
    }

    const recBtn = stage.querySelector('#mvs-rec-btn');
    const statusEl = stage.querySelector('#mvs-status');
    recBtn.onclick = async () => {
      if (recorder && recorder.state === 'recording') {
        recorder.stop();
        recBtn.textContent = '● ابدأ تسجيل صوتك';
        recBtn.style.background = '#E11D48';
        return;
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        chunks = [];
        recorder = new MediaRecorder(stream);
        recorder.ondataavailable = e => { if (e.data.size > 0) chunks.push(e.data); };
        recorder.onstop = async () => {
          stream.getTracks().forEach(t => t.stop());
          const blob = new Blob(chunks, { type: 'audio/webm' });
          await saveVoiceBlob(item.text, blob);
          statusEl.textContent = '✅ تم حفظ صوتكم بنجاح!';
          if (autoAdvance) {
            setTimeout(() => { currentIndex++; renderMasterStudio(stage); }, 550);
          } else {
            renderMasterStudio(stage);
          }
        };
        recorder.start();
        recBtn.textContent = '⏹ إيقاف وحفظ الآن';
        recBtn.style.background = '#10B981';
        statusEl.textContent = '🔴 جاري التسجيل بصوتك... اقرأ الجملة بوضوح ثم اضغط إيقاف';
      } catch (e) {
        statusEl.textContent = '⚠️ يرجى السماح بإذن الميكروفون للتسجيل';
      }
    };
  }

  // ربط شاشة الاستوديو في محرك الألعاب وفي درج القائمة
  if (window.LumiGames && typeof LumiGames.renderGameScreen === 'function') {
    const prev = LumiGames.renderGameScreen.bind(LumiGames);
    LumiGames.renderGameScreen = function() {
      if (this.currentGameId === 'master_voice_studio') {
        const stage = document.getElementById('game-stage');
        const titleEl = document.getElementById('game-title');
        const badgeEl = document.getElementById('game-level-badge');
        const coOpBtn = document.getElementById('coop-toggle-btn');
        if (titleEl) titleEl.innerHTML = `🎙️ استوديو صوت بابا وماما <small>(القاموس الشامل)</small>`;
        if (badgeEl) badgeEl.innerText = `تسجيل جملة جملة ❤️`;
        if (coOpBtn) coOpBtn.style.display = 'none';
        renderMasterStudio(stage);
        return;
      }
      return prev();
    };
  }

  // إضافة زر الاستوديو في درج القائمة الرئيسية
  function injectStudioDrawerBtn() {
    const dGrid = document.querySelector('#lumi-nav-drawer .drawer-grid');
    if (dGrid && !dGrid.querySelector('#drawer-studio-btn')) {
      const btn = document.createElement('button');
      btn.id = 'drawer-studio-btn';
      btn.className = 'drawer-item-btn';
      btn.style.background = '#BE185D';
      btn.innerHTML = '🎙️<span>القاموس الصوتي (بابا/ماما)</span>';
      btn.onclick = () => {
        document.getElementById('lumi-nav-drawer').classList.remove('open');
        LumiGames.start('master_voice_studio');
      };
      dGrid.insertAdjacentElement('afterbegin', btn);
    }
  }
  setInterval(injectStudioDrawerBtn, 800);

  if (window.LumiApp && typeof LumiApp.renderGamesGrid === 'function') {
    LumiApp.renderGamesGrid();
  }
})();
