(function() {
  if (typeof LumiGames === 'undefined') return;

  const CUSTOM_GAME_IDS = new Set([
    'fruits_veggies', 'vehicles_sounds', 'big_small', 'animal_homes', 'count_balloons',
    'fractions_pro', 'world_capitals', 'sentence_order', 'science_lab', 'cipher_logic',
    'cm1_math_numbers', 'cm1_math_geom', 'cm1_sciences', 'cm1_french_gram',
    'cm1_arabic_nahw', 'cm1_social_egypt', 'cm1_iq_master',
    'algo_robot', 'clock_master', 'english_smart', 'color_lab',
    'helen_puzzle_shapes', 'helen_emotions', 'helen_nature_colors'
  ]);

  let transitionLock = false;

  // 1. ضمان الانتقال السلس للسؤال التالي في كل الألعاب
  const origHandleAnswer = typeof LumiGames.handleAnswer === 'function'
    ? LumiGames.handleAnswer.bind(LumiGames)
    : null;

  LumiGames.handleAnswer = function(isCorrect) {
    const gid = this.currentGameId;

    if (CUSTOM_GAME_IDS.has(gid)) {
      if (isCorrect) {
        if (transitionLock) return;
        transitionLock = true;

        try {
          if (typeof LumiAudio !== 'undefined' && typeof LumiAudio.sfxSuccess === 'function') {
            LumiAudio.sfxSuccess();
          }
          if (typeof LumiStorage !== 'undefined' && typeof LumiStorage.addStars === 'function') {
            LumiStorage.addStars(1);
          }
          if (this.activeSession) {
            this.activeSession.correct = (this.activeSession.correct || 0) + 1;
          }
          const starEl = document.getElementById('top-stars');
          if (starEl && typeof LumiStorage !== 'undefined' && typeof LumiStorage.getActiveProfile === 'function') {
            const p = LumiStorage.getActiveProfile();
            if (p && typeof p.stars === 'number') starEl.innerText = p.stars;
          }
        } catch (e) {}

        setTimeout(() => {
          transitionLock = false;
          if (this.currentGameId === gid) {
            this.renderGameScreen();
          }
        }, 650);
      } else {
        try {
          if (typeof LumiAudio !== 'undefined' && typeof LumiAudio.sfxError === 'function') {
            LumiAudio.sfxError();
          }
          if (this.activeSession) {
            this.activeSession.wrong = (this.activeSession.wrong || 0) + 1;
          }
        } catch (e) {}
      }
      return;
    }

    if (origHandleAnswer) {
      return origHandleAnswer(isCorrect);
    }
  };

  if (typeof LumiGames.start === 'function') {
    const origStart = LumiGames.start.bind(LumiGames);
    LumiGames.start = function(gameId) {
      transitionLock = false;
      return origStart(gameId);
    };
  }

  // 2. القطع التنازلي الناعم (Smooth Fade-Out Preemption) عند الضغط على زر صوتي جديد
  let activeHtmlAudio = null;
  let speechGeneration = 0;

  function fadeOutAndStopCurrent() {
    return new Promise(resolve => {
      // إيقاف أي نطق آلي جاري بأمان بدون تعليق أندرويد
      try {
        if ('speechSynthesis' in window && (window.speechSynthesis.speaking || window.speechSynthesis.pending)) {
          window.speechSynthesis.cancel();
        }
      } catch (e) {}

      // خفض تدريجي ناعم للصوت المسجل خلال 120ms
      if (activeHtmlAudio) {
        const audio = activeHtmlAudio;
        activeHtmlAudio = null;
        let step = 0;
        const steps = 4;
        const startVol = audio.volume || 1;
        const iv = setInterval(() => {
          step++;
          audio.volume = Math.max(0, startVol * (1 - step / steps));
          if (step >= steps) {
            clearInterval(iv);
            try { audio.pause(); audio.currentTime = 0; } catch (e) {}
            resolve();
          }
        }, 30);
      } else {
        // مهلة 65ms ليفرغ محرك TTS في أندرويد البافر قبل الجملة الجديدة
        setTimeout(resolve, 65);
      }
    });
  }

  function detectLangSafe(text) {
    if (/[\u0600-\u06FF]/.test(text)) return 'ar-EG';
    if (/[àâçéèêëîïôûùüÿñæœ]/i.test(text) || /\b(le|la|les|un|une|des|est|sont|quelle|quel|calcule|complète|choisis|dans|avec|pour|bonjour|merci)\b/i.test(text)) {
      return 'fr-FR';
    }
    return 'en-US';
  }

  function pickFemaleVoiceSafe(langCode) {
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

  async function lookupParentCustomAudio(text) {
    try {
      const key = (text || '')
        .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, '')
        .replace(/\s+/g, ' ')
        .trim()
        .toLowerCase();
      if (!key) return null;
      return await new Promise(resolve => {
        const req = indexedDB.open('LumiMasterVoiceDB_v1', 1);
        req.onerror = () => resolve(null);
        req.onsuccess = () => {
          const db = req.result;
          if (!db.objectStoreNames.contains('utterances')) return resolve(null);
          const tx = db.transaction('utterances', 'readonly');
          const getReq = tx.objectStore('utterances').get(key);
          getReq.onsuccess = () => resolve(getReq.result ? getReq.result.blob : null);
          getReq.onerror = () => resolve(null);
        };
      });
    } catch (e) { return null; }
  }

  async function playInterruptible(text, lang) {
    const cleanSig = (text || '').trim();
    if (!cleanSig) return;

    // إلغاء أي صوت سابق فوراً بخفض تنازلي ناعم وبدء الصوت الجديد
    const myGen = ++speechGeneration;
    await fadeOutAndStopCurrent();
    if (myGen !== speechGeneration) return;

    // 1. الأولوية لصوت بابا وماما المسجل
    const parentBlob = await lookupParentCustomAudio(cleanSig);
    if (myGen !== speechGeneration) return;

    if (parentBlob) {
      const url = URL.createObjectURL(parentBlob);
      const audio = new Audio(url);
      audio.volume = 1.0;
      activeHtmlAudio = audio;
      audio.onended = () => {
        if (activeHtmlAudio === audio) activeHtmlAudio = null;
        URL.revokeObjectURL(url);
      };
      audio.onerror = () => {
        if (activeHtmlAudio === audio) activeHtmlAudio = null;
        URL.revokeObjectURL(url);
      };
      audio.play().catch(() => {});
      return;
    }

    // 2. الصوت الافتراضي الأنثوي الهادئ
    const cleaned = cleanSig
      .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, ' ')
      .replace(/[_]{2,}/g, ' ... ')
      .replace(/\s+/g, ' ')
      .trim();

    if (cleaned && 'speechSynthesis' in window) {
      if (window.speechSynthesis.paused) window.speechSynthesis.resume();
      const u = new SpeechSynthesisUtterance(cleaned);
      const targetLang = lang || detectLangSafe(cleaned);
      u.lang = targetLang;
      const v = pickFemaleVoiceSafe(targetLang);
      if (v) u.voice = v;
      u.pitch = 1.12;
      u.rate = 0.92;
      window.speechSynthesis.speak(u);
    }
  }

  // توجيه كل دوال النطق عبر القطع التنازلي الناعم
  if (window.LumiQuestionVoice) {
    window.LumiQuestionVoice.speak = (t) => playInterruptible(t);
  }
  if (window.LumiAudio) {
    LumiAudio.speakTerm = (t, lang) => {
      const map = { ar: 'ar-EG', fr: 'fr-FR', en: 'en-US' };
      playInterruptible(t, map[lang]);
    };
    LumiAudio.speak = async function(voiceId, textEg = '', textFr = '') {
      if (textEg) return playInterruptible(textEg, 'ar-EG');
      if (textFr) return playInterruptible(textFr, 'fr-FR');
    };
  }
})();
