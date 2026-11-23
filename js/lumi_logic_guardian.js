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

  // 2. مدير طابور الصوت الذكي: يمنع قفل أو قطع الصوت عند الضغط على زر صوتي آخر
  const audioQueue = [];
  let isAudioPlaying = false;
  let lastQueuedText = '';
  let lastQueuedTime = 0;

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

  async function processAudioQueue() {
    if (isAudioPlaying || audioQueue.length === 0) return;
    isAudioPlaying = true;
    const item = audioQueue.shift();

    try {
      // الأولوية 1: تسجيل بابا وماما في القاموس الشامل
      const parentBlob = await lookupParentCustomAudio(item.text);
      if (parentBlob) {
        await new Promise(resolve => {
          const url = URL.createObjectURL(parentBlob);
          const a = new Audio(url);
          a.onended = () => { URL.revokeObjectURL(url); resolve(); };
          a.onerror = () => { URL.revokeObjectURL(url); resolve(); };
          a.play().catch(resolve);
        });
        isAudioPlaying = false;
        processAudioQueue();
        return;
      }

      // الأولوية 2: الصوت الافتراضي الأنثوي الهادئ بدون قطع مفاجئ
      const cleaned = (item.text || '')
        .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, ' ')
        .replace(/[_]{2,}/g, ' ... ')
        .replace(/\s+/g, ' ')
        .trim();

      if (cleaned && 'speechSynthesis' in window) {
        if (window.speechSynthesis.paused) window.speechSynthesis.resume();
        await new Promise(resolve => {
          const u = new SpeechSynthesisUtterance(cleaned);
          const lang = item.lang || detectLangSafe(cleaned);
          u.lang = lang;
          const v = pickFemaleVoiceSafe(lang);
          if (v) u.voice = v;
          u.pitch = 1.12;
          u.rate = 0.92;
          let done = false;
          const finish = () => { if (!done) { done = true; resolve(); } };
          u.onend = finish;
          u.onerror = finish;
          setTimeout(finish, Math.min(12000, Math.max(2500, cleaned.length * 110)));
          window.speechSynthesis.speak(u);
        });
      }
    } catch (e) {}

    isAudioPlaying = false;
    processAudioQueue();
  }

  function enqueueSpeech(text, lang) {
    const cleanSig = (text || '').trim();
    if (!cleanSig) return;
    const now = Date.now();
    // منع تكرار نفس الجملة مرتين متتاليتين خلال ثانيتين
    if (cleanSig === lastQueuedText && (now - lastQueuedTime) < 2000) return;
    lastQueuedText = cleanSig;
    lastQueuedTime = now;

    // الاحتفاظ بآخر طلبين فقط في الطابور لمنع التراكم الطويل
    if (audioQueue.length >= 2) audioQueue.shift();
    audioQueue.push({ text: cleanSig, lang });
    processAudioQueue();
  }

  // توجيه كل دوال النطق في التطبيق عبر الطابور الآمن
  if (window.LumiQuestionVoice) {
    window.LumiQuestionVoice.speak = (t) => enqueueSpeech(t);
  }
  if (window.LumiAudio) {
    LumiAudio.speakTerm = (t, lang) => {
      const map = { ar: 'ar-EG', fr: 'fr-FR', en: 'en-US' };
      enqueueSpeech(t, map[lang]);
    };
    LumiAudio.speak = async function(voiceId, textEg = '', textFr = '') {
      if (textEg) enqueueSpeech(textEg, 'ar-EG');
      if (textFr) enqueueSpeech(textFr, 'fr-FR');
    };
  }
})();
