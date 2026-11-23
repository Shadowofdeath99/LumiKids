(function() {
  if (typeof LumiGames === 'undefined') return;

  // 1. تأمين كل دوال LumiApp و LumiStorage التي تستدعيها handleAnswer
  if (window.LumiApp) {
    if (typeof LumiApp.updateTopStats !== 'function') LumiApp.updateTopStats = function() {};
    if (typeof LumiApp.triggerConfetti !== 'function') LumiApp.triggerConfetti = function() {};
    const origStickerModal = LumiApp.showStickerUnlockModal ? LumiApp.showStickerUnlockModal.bind(LumiApp) : null;
    LumiApp.showStickerUnlockModal = function(sticker, onClose) {
      if (origStickerModal) {
        try { origStickerModal(sticker, onClose); } catch (e) { if (typeof onClose === 'function') onClose(); }
      } else if (typeof onClose === 'function') {
        onClose();
      }
    };
  }

  if (window.LumiStorage && typeof LumiStorage.logSession !== 'function') {
    LumiStorage.logSession = function() {};
  }

  const CUSTOM_GAME_IDS = new Set([
    'fruits_veggies', 'vehicles_sounds', 'big_small', 'animal_homes', 'count_balloons',
    'fractions_pro', 'world_capitals', 'sentence_order', 'science_lab', 'cipher_logic',
    'cm1_math_numbers', 'cm1_math_geom', 'cm1_sciences', 'cm1_french_gram',
    'cm1_arabic_nahw', 'cm1_social_egypt', 'cm1_iq_master',
    'algo_robot', 'clock_master', 'english_smart', 'color_lab',
    'helen_puzzle_shapes', 'helen_emotions', 'helen_nature_colors',
    'space_explorer', 'mental_math_blitz', 'world_landmarks', 'helen_animal_sounds', 'helen_fruit_basket',
    'human_body_quest', 'spelling_bee_pro', 'number_duel_compare', 'helen_music_instruments', 'helen_weather_seasons',
    'egypt_history_quest', 'geometry_area_pro', 'logic_sequence_pro', 'helen_community_helpers', 'helen_vehicles_ride',
    'french_verbs_cm1', 'multiplication_pro_cm1', 'riddles_brain_pro', 'helen_healthy_food', 'helen_baby_animals'
  ]);

  let transitionLock = false;

  const origHandleAnswer = typeof LumiGames.handleAnswer === 'function'
    ? LumiGames.handleAnswer.bind(LumiGames)
    : null;

  LumiGames.handleAnswer = function(isCorrect, itemKey = null, onCompleteRound = null) {
    const gid = this.currentGameId;

    // أ) الألعاب الـ 24 الإضافية
    if (CUSTOM_GAME_IDS.has(gid)) {
      if (isCorrect) {
        if (transitionLock) return;
        transitionLock = true;
        try {
          if (typeof LumiAudio !== 'undefined' && LumiAudio.sfxSuccess) LumiAudio.sfxSuccess();
          if (typeof LumiStorage !== 'undefined' && LumiStorage.addStars) LumiStorage.addStars(1);
          if (this.activeSession) this.activeSession.correct = (this.activeSession.correct || 0) + 1;
        } catch (e) {}

        setTimeout(() => {
          transitionLock = false;
          if (this.currentGameId === gid) this.renderGameScreen();
        }, 650);
      } else {
        try {
          if (typeof LumiAudio !== 'undefined' && LumiAudio.sfxError) LumiAudio.sfxError();
          if (this.activeSession) this.activeSession.wrong = (this.activeSession.wrong || 0) + 1;
        } catch (e) {}
      }
      return;
    }

    // ب) الألعاب الأساسية الـ 20: تشغيل المنطق الأصلي + شبكة أمان تضمن الانتقال للتالي
    const stage = document.getElementById('game-stage');
    const htmlBefore = stage ? stage.innerHTML : '';

    if (origHandleAnswer) {
      origHandleAnswer(isCorrect, itemKey, onCompleteRound);
    }

    if (isCorrect && onCompleteRound) {
      setTimeout(() => {
        const currentStage = document.getElementById('game-stage');
        if (this.currentGameId === gid && currentStage && currentStage.innerHTML === htmlBefore) {
          this.renderGameScreen();
        }
      }, 1450);
    }
  };

  if (typeof LumiGames.start === 'function') {
    const origStart = LumiGames.start.bind(LumiGames);
    LumiGames.start = function(gameId, coOp = false) {
      transitionLock = false;
      return origStart(gameId, coOp);
    };
  }

  // 2. القطع التنازلي الناعم للصوتيات (Smooth Fade-Out Preemption)
  let activeHtmlAudio = null;
  let speechGeneration = 0;

  function fadeOutAndStopCurrent() {
    return new Promise(resolve => {
      try {
        if ('speechSynthesis' in window && (window.speechSynthesis.speaking || window.speechSynthesis.pending)) {
          window.speechSynthesis.cancel();
        }
      } catch (e) {}

      if (activeHtmlAudio) {
        const audio = activeHtmlAudio;
        activeHtmlAudio = null;
        let step = 0;
        const startVol = audio.volume || 1;
        const iv = setInterval(() => {
          step++;
          audio.volume = Math.max(0, startVol * (1 - step / 4));
          if (step >= 4) {
            clearInterval(iv);
            try { audio.pause(); audio.currentTime = 0; } catch (e) {}
            resolve();
          }
        }, 30);
      } else {
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
    const myGen = ++speechGeneration;
    await fadeOutAndStopCurrent();
    if (myGen !== speechGeneration) return;

    const parentBlob = await lookupParentCustomAudio(cleanSig);
    if (myGen !== speechGeneration) return;

    if (parentBlob) {
      const url = URL.createObjectURL(parentBlob);
      const audio = new Audio(url);
      audio.volume = 1.0;
      activeHtmlAudio = audio;
      audio.onended = () => { if (activeHtmlAudio === audio) activeHtmlAudio = null; URL.revokeObjectURL(url); };
      audio.onerror = () => { if (activeHtmlAudio === audio) activeHtmlAudio = null; URL.revokeObjectURL(url); };
      audio.play().catch(() => {});
      return;
    }

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

  if (window.LumiQuestionVoice) window.LumiQuestionVoice.speak = (t) => playInterruptible(t);
  if (window.LumiAudio) {
    LumiAudio.speakTerm = (t, lang) => playInterruptible(t, ({ ar: 'ar-EG', fr: 'fr-FR', en: 'en-US' })[lang]);
    LumiAudio.speak = async function(voiceId, textEg = '', textFr = '') {
      if (textEg) return playInterruptible(textEg, 'ar-EG');
      if (textFr) return playInterruptible(textFr, 'fr-FR');
    };
  }
})();
