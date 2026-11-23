(function() {
  // 1. محرك الصوتيات العصبية الأنثوية الهادئة + تسجيل صوت بابا وماما في IndexedDB
  const DB_NAME = 'LumiParentVoicesDB';
  const STORE_NAME = 'custom_recordings';

  function openVoiceDB() {
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

  async function saveParentRecording(key, blob) {
    const db = await openVoiceDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      tx.objectStore(STORE_NAME).put(blob, key);
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => reject(tx.error);
    });
  }

  async function getParentRecording(key) {
    try {
      const db = await openVoiceDB();
      return await new Promise(resolve => {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const req = tx.objectStore(STORE_NAME).get(key);
        req.onsuccess = () => resolve(req.result || null);
        req.onerror = () => resolve(null);
      });
    } catch (e) { return null; }
  }

  // اختيار أنعم صوت أنثوي متاح في المتصفح (مع استبعاد الأصوات الهندية والخشنة)
  function pickBestFemaleVoice(langPrefix) {
    if (!('speechSynthesis' in window)) return null;
    const voices = window.speechSynthesis.getVoices() || [];
    const filtered = voices.filter(v => {
      const l = (v.lang || '').toLowerCase();
      const n = (v.name || '').toLowerCase();
      if (!l.startsWith(langPrefix)) return false;
      if (l.includes('in') || n.includes('india') || n.includes('ravi') || n.includes('hemant')) return false;
      return true;
    });
    const femaleHints = ['salma', 'sara', 'layla', 'denise', 'amelie', 'celine', 'jenny', 'aria', 'samantha', 'victoria', 'zira', 'google', 'natural', 'female'];
    for (const hint of femaleHints) {
      const found = filtered.find(v => v.name.toLowerCase().includes(hint));
      if (found) return found;
    }
    return filtered[0] || null;
  }

  function speakSmoothTTS(text, langCode) {
    if (!text || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    const prefix = langCode.slice(0, 2).toLowerCase();
    u.lang = langCode;
    const best = pickBestFemaleVoice(prefix);
    if (best) u.voice = best;
    u.pitch = 1.12; // طبقة أنثوية دافئة وهادئة
    u.rate = 0.92;  // سرعة واضحة ومريحة للأطفال
    window.speechSynthesis.speak(u);
  }

  function playAudioFile(url) {
    return new Promise((resolve, reject) => {
      const audio = new Audio(url);
      if (window.LumiAudio) LumiAudio.currentAudio = audio;
      audio.onended = () => resolve(true);
      audio.onerror = () => reject(new Error('missing_audio'));
      audio.play().catch(reject);
    });
  }

  if (window.LumiAudio) {
    LumiAudio.speak = async function(voiceId, textEg = '', textFr = '') {
      if (this.currentAudio) {
        try { this.currentAudio.pause(); } catch (e) {}
        this.currentAudio = null;
      }
      const gid = (window.LumiGames && LumiGames.currentGameId) ? LumiGames.currentGameId : voiceId;

      // 1. الأولوية القصوى: صوت بابا مينا أو ماما ساندرا المسجل لهذه اللعبة
      const parentBlob = await getParentRecording(`game_${gid}`) || await getParentRecording(voiceId);
      if (parentBlob) {
        const url = URL.createObjectURL(parentBlob);
        await playAudioFile(url).catch(() => {});
        return;
      }

      // 2. الأولوية الثانية: ملفات الصوت العصبية الأنثوية المدمجة في المشروع (أوفلاين 100%)
      try {
        if (textEg) await playAudioFile(`assets/voices/ar/${gid}.mp3`);
        if (textFr) await playAudioFile(`assets/voices/fr/${gid}.mp3`);
        return;
      } catch (e) {
        // 3. البديل الذكي: نطق أنثوي هادئ مضبوط الطبقة
        if (textEg) speakSmoothTTS(textEg, 'ar-EG');
        else if (textFr) speakSmoothTTS(textFr, 'fr-FR');
      }
    };

    LumiAudio.speakTerm = function(text, lang) {
      const clean = text.replace(/\([^)]*\)/g, '').split('/')[0].trim();
      const map = { ar: 'ar-EG', fr: 'fr-FR', en: 'en-US' };
      speakSmoothTTS(clean, map[lang] || 'ar-EG');
    };
  }

  // زر تسجيل صوت بابا وماما داخل شاشة أي لعبة
  let activeRecorder = null;
  let recChunks = [];

  function injectParentRecorderBar(stage) {
    if (!stage || stage.querySelector('#parent-voice-bar')) return;
    const gid = (window.LumiGames && LumiGames.currentGameId) || 'general';
    const bar = document.createElement('div');
    bar.id = 'parent-voice-bar';
    bar.style.cssText = 'display:flex; justify-content:center; align-items:center; gap:8px; flex-wrap:wrap; margin:0 auto 12px auto; padding:8px 12px; border-radius:14px; background:rgba(236,72,153,0.08); border:1px dashed rgba(236,72,153,0.4); max-width:760px;';
    bar.innerHTML = `
      <span style="font-size:0.86rem; font-weight:800; color:#BE185D;">🎙️ صوت بابا وماما:</span>
      <button id="prec-btn" type="button" style="padding:6px 14px; border-radius:999px; border:none; background:#DB2777; color:#fff; font-weight:800; font-size:0.84rem; cursor:pointer;">● تسجيل صوتي للعبة</button>
      <button id="pplay-btn" type="button" style="padding:6px 14px; border-radius:999px; border:none; background:#059669; color:#fff; font-weight:800; font-size:0.84rem; cursor:pointer;">▶ سماع التسجيل</button>
      <span id="prec-status" style="font-size:0.82rem; font-weight:700; color:#64748B;"></span>
    `;
    stage.insertAdjacentElement('afterbegin', bar);

    const recBtn = bar.querySelector('#prec-btn');
    const playBtn = bar.querySelector('#pplay-btn');
    const statusEl = bar.querySelector('#prec-status');

    getParentRecording(`game_${gid}`).then(b => {
      if (b) statusEl.textContent = '✅ مسجل بصوتكم';
    });

    recBtn.onclick = async () => {
      if (activeRecorder && activeRecorder.state === 'recording') {
        activeRecorder.stop();
        recBtn.textContent = '● تسجيل صوتي للعبة';
        recBtn.style.background = '#DB2777';
        return;
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        recChunks = [];
        activeRecorder = new MediaRecorder(stream);
        activeRecorder.ondataavailable = e => { if (e.data.size > 0) recChunks.push(e.data); };
        activeRecorder.onstop = async () => {
          stream.getTracks().forEach(t => t.stop());
          const blob = new Blob(recChunks, { type: 'audio/webm' });
          await saveParentRecording(`game_${gid}`, blob);
          statusEl.textContent = '✅ تم حفظ صوتكم بنجاح!';
          playAudioFile(URL.createObjectURL(blob)).catch(() => {});
        };
        activeRecorder.start();
        recBtn.textContent = '⏹ إيقاف وحفظ';
        recBtn.style.background = '#EF4444';
        statusEl.textContent = '🔴 جاري التسجيل...';
      } catch (err) {
        statusEl.textContent = '⚠️ فعّل إذن الميكروفون للتسجيل';
      }
    };

    playBtn.onclick = async () => {
      const b = await getParentRecording(`game_${gid}`);
      if (b) playAudioFile(URL.createObjectURL(b)).catch(() => {});
      else statusEl.textContent = 'لا يوجد تسجيل بعد';
    };
  }

  // 2. تنظيم الشاشة الرئيسية وتبويب الفئات للموبايل والتابلت
  let activeCategory = 'all';
  const CAT_DEFS = [
    { id: 'all', label: '✨ الكل' },
    { id: 'cm1', label: '🎓 منهج 4ب (CM1)' },
    { id: 'vocab', label: '📚 موسوعة 300 مصطلح' },
    { id: 'logic', label: '🧠 ذكاء وبرمجة' },
    { id: 'kids', label: '🦄 ألعاب التأسيس والمرح' }
  ];

  const CM1_IDS = new Set(['cm1_math_numbers', 'cm1_math_geom', 'cm1_sciences', 'cm1_french_gram', 'cm1_arabic_nahw', 'cm1_social_egypt', 'fractions_pro', 'world_capitals', 'sentence_order', 'science_lab']);
  const LOGIC_IDS = new Set(['cm1_iq_master', 'algo_robot', 'clock_master', 'cipher_logic', 'english_smart', 'family_mission']);

  function matchCategory(cardId, cat) {
    if (cat === 'all') return true;
    if (cat === 'vocab') return cardId === 'trilingual_vocab';
    if (cat === 'cm1') return CM1_IDS.has(cardId);
    if (cat === 'logic') return LOGIC_IDS.has(cardId);
    return !CM1_IDS.has(cardId) && !LOGIC_IDS.has(cardId) && cardId !== 'trilingual_vocab';
  }

  function applyCategoryFilter() {
    const grid = document.getElementById('games-grid');
    if (!grid) return;
    grid.querySelectorAll('.game-card').forEach(card => {
      const oc = card.getAttribute('onclick') || '';
      const m = oc.match(/start\('([^']+)'/);
      const gid = m ? m[1] : '';
      card.style.display = matchCategory(gid, activeCategory) ? '' : 'none';
    });
  }

  function setupResponsiveHub() {
    const topControls = document.querySelector('header.topbar .top-controls');
    if (topControls && !document.getElementById('lumi-menu-toggle')) {
      const menuBtn = document.createElement('button');
      menuBtn.id = 'lumi-menu-toggle';
      menuBtn.className = 'nav-btn';
      menuBtn.style.background = 'linear-gradient(135deg, #4F46E5, #7C3AED)';
      menuBtn.style.color = '#fff';
      menuBtn.innerHTML = '☰ القائمة';
      menuBtn.onclick = () => document.getElementById('lumi-nav-drawer').classList.add('open');
      topControls.appendChild(menuBtn);
    }

    if (!document.getElementById('lumi-nav-drawer')) {
      const drawer = document.createElement('div');
      drawer.id = 'lumi-nav-drawer';
      drawer.innerHTML = `
        <div class="drawer-card">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <h3 style="margin:0;">🌟 أقسام تطبيق LumiKids</h3>
            <button id="close-lumi-drawer" style="border:none; background:#EF4444; color:#fff; border-radius:10px; padding:6px 12px; font-weight:800; cursor:pointer;">✕ إغلاق</button>
          </div>
          <div class="drawer-grid">
            <button class="drawer-item-btn" style="background:#4F46E5;" onclick="LumiApp.showView('home-view'); document.getElementById('lumi-nav-drawer').classList.remove('open');">🎮<span>كل الألعاب والدروس</span></button>
            <button class="drawer-item-btn" style="background:#DB2777;" onclick="LumiGames.start('family_mission'); document.getElementById('lumi-nav-drawer').classList.remove('open');">👨‍👩‍👧‍👧<span>رسائل بابا وماما</span></button>
            <button class="drawer-item-btn" style="background:#7C3AED;" onclick="LumiGames.start('trilingual_vocab'); document.getElementById('lumi-nav-drawer').classList.remove('open');">📚<span>موسوعة 300 مصطلح</span></button>
            <button class="drawer-item-btn" style="background:#0EA5E9;" onclick="LumiApp.openStories(); document.getElementById('lumi-nav-drawer').classList.remove('open');">📖<span>القصص الصوتية</span></button>
            <button class="drawer-item-btn" style="background:#EC4899;" onclick="LumiApp.openLittleTeacherDirect(); document.getElementById('lumi-nav-drawer').classList.remove('open');">👩‍🏫<span>المعلمة الصغيرة</span></button>
            <button class="drawer-item-btn" style="background:#F59E0B;" onclick="LumiRewards.openHub(); document.getElementById('lumi-nav-drawer').classList.remove('open');">🛒<span>المتجر والمهام</span></button>
            <button class="drawer-item-btn" style="background:#10B981;" onclick="LumiApp.openAdventureMap(); document.getElementById('lumi-nav-drawer').classList.remove('open');">🗺️<span>رحلة اليوم</span></button>
            <button class="drawer-item-btn" style="background:#6366F1;" onclick="LumiProGames.openArena(); document.getElementById('lumi-nav-drawer').classList.remove('open');">🚀<span>تحديات +10</span></button>
            <button class="drawer-item-btn" style="background:#334155;" onclick="LumiApp.openParentDashboard && LumiApp.openParentDashboard(); document.getElementById('lumi-nav-drawer').classList.remove('open');">🔐<span>لوحة تحكم الأهل</span></button>
          </div>
        </div>
      `;
      document.body.appendChild(drawer);
      drawer.onclick = e => { if (e.target === drawer) drawer.classList.remove('open'); };
      drawer.querySelector('#close-lumi-drawer').onclick = () => drawer.classList.remove('open');
    }

    const grid = document.getElementById('games-grid');
    if (grid && !document.getElementById('lumi-category-bar')) {
      const bar = document.createElement('div');
      bar.id = 'lumi-category-bar';
      bar.innerHTML = CAT_DEFS.map(c => `
        <button type="button" class="lumi-cat-pill ${c.id === activeCategory ? 'active' : ''}" data-cat="${c.id}">${c.label}</button>
      `).join('');
      grid.parentNode.insertBefore(bar, grid);
      bar.querySelectorAll('.lumi-cat-pill').forEach(btn => {
        btn.onclick = () => {
          activeCategory = btn.getAttribute('data-cat');
          bar.querySelectorAll('.lumi-cat-pill').forEach(b => b.classList.toggle('active', b === btn));
          applyCategoryFilter();
        };
      });
    }
    applyCategoryFilter();
  }

  if (window.LumiApp && typeof LumiApp.renderGamesGrid === 'function') {
    const origGrid = LumiApp.renderGamesGrid.bind(LumiApp);
    LumiApp.renderGamesGrid = function() {
      origGrid();
      setupResponsiveHub();
    };
  }

  if (window.LumiGames && typeof LumiGames.renderGameScreen === 'function') {
    const origRender = LumiGames.renderGameScreen.bind(LumiGames);
    LumiGames.renderGameScreen = function() {
      origRender();
      injectParentRecorderBar(document.getElementById('game-stage'));
    };
  }

  window.addEventListener('DOMContentLoaded', setupResponsiveHub);
  setTimeout(setupResponsiveHub, 250);
})();
