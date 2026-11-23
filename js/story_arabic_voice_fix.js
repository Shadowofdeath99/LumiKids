(function() {
  // 1. اختيار أفضل صوت عربي متاح على الجهاز (ar-EG -> ar-SA -> ar-* -> Google/Microsoft Arabic)
  function pickBestArabicVoice() {
    if (!('speechSynthesis' in window)) return null;
    const voices = window.speechSynthesis.getVoices() || [];
    return (
      voices.find(v => /ar[-_]EG/i.test(v.lang)) ||
      voices.find(v => /ar[-_]SA/i.test(v.lang)) ||
      voices.find(v => /^ar\b/i.test(v.lang)) ||
      voices.find(v => /arabic|عرب/i.test(v.name)) ||
      null
    );
  }

  // 2. تقسيم النص الطويل لجمل قصيرة حتى لا يتجاهله متصفح Chrome / Android WebView
  function splitSentences(text) {
    const clean = String(text || '')
      .replace(/[\U0001F300-\U0001FAFF\u2600-\u27BF]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    if (!clean) return [];
    const parts = clean.split(/(?<=[.!؟،؛\n])\s+/).filter(Boolean);
    const chunks = [];
    parts.forEach(p => {
      if (p.length <= 140) {
        chunks.push(p);
      } else {
        const words = p.split(' ');
        let cur = '';
        words.forEach(w => {
          if ((cur + ' ' + w).trim().length > 130) {
            if (cur) chunks.push(cur.trim());
            cur = w;
          } else {
            cur = (cur + ' ' + w).trim();
          }
        });
        if (cur) chunks.push(cur.trim());
      }
    });
    return chunks;
  }

  // 3. تشغيل النطق العربي المضمون (تسجيل بابا/ماما أولاً -> ثم SpeechSynthesis -> ثم Audio Fallback)
  window.LumiStoryVoice = {
    isSpeaking: false,
    stop() {
      this.isSpeaking = false;
      try { if ('speechSynthesis' in window) window.speechSynthesis.cancel(); } catch (e) {}
      if (this._fallbackAudio) {
        try { this._fallbackAudio.pause(); this._fallbackAudio = null; } catch (e) {}
      }
    },
    speakArabic(text, onEnd) {
      this.stop();
      const chunks = splitSentences(text);
      if (!chunks.length) {
        if (typeof onEnd === 'function') onEnd();
        return;
      }

      this.isSpeaking = true;
      let idx = 0;

      const speakNext = () => {
        if (!this.isSpeaking || idx >= chunks.length) {
          this.isSpeaking = false;
          if (typeof onEnd === 'function') onEnd();
          return;
        }

        const sentence = chunks[idx++];

        if ('speechSynthesis' in window) {
          try {
            window.speechSynthesis.resume();
            const utter = new SpeechSynthesisUtterance(sentence);
            const arVoice = pickBestArabicVoice();
            if (arVoice) {
              utter.voice = arVoice;
              utter.lang = arVoice.lang;
            } else {
              utter.lang = 'ar-EG';
            }
            utter.rate = 0.94;
            utter.pitch = 1.05;
            utter.volume = 1.0;

            let finished = false;
            const done = () => {
              if (finished) return;
              finished = true;
              speakNext();
            };

            utter.onend = done;
            utter.onerror = () => {
              // Fallback صوتي فوري في حال فشل محرك الجهاز المحلي
              this.playCloudFallback(sentence, done);
            };

            window.speechSynthesis.speak(utter);

            // مؤقت أمان لو المتصفح علّق ولم يطلق onend
            const safeMs = Math.max(2500, sentence.length * 110);
            setTimeout(() => {
              if (!finished && this.isSpeaking && !window.speechSynthesis.speaking) {
                done();
              }
            }, safeMs);
            return;
          } catch (e) {}
        }

        this.playCloudFallback(sentence, speakNext);
      };

      speakNext();
    },
    playCloudFallback(sentence, cb) {
      try {
        const url = `https://translate.googleapis.com/translate_tts?ie=UTF-8&client=tw-ob&tl=ar&q=${encodeURIComponent(sentence)}`;
        const audio = new Audio(url);
        this._fallbackAudio = audio;
        audio.onended = () => { this._fallbackAudio = null; cb(); };
        audio.onerror = () => { this._fallbackAudio = null; cb(); };
        audio.play().catch(() => cb());
      } catch (e) {
        cb();
      }
    }
  };

  if ('speechSynthesis' in window) {
    window.speechSynthesis.getVoices();
    window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
  }

  // 4. ربط المحرك تلقائياً بكل دوال نطق القصص في التطبيق (LumiStories / LumiAudio)
  function patchStoryAudio() {
    if (window.LumiStories) {
      const origRead = LumiStories.readPage || LumiStories.speakPage || LumiStories.playAudio;
      ['readPage', 'speakPage', 'playAudio', 'narrate'].forEach(fn => {
        if (typeof LumiStories[fn] === 'function') {
          const orig = LumiStories[fn].bind(LumiStories);
          LumiStories[fn] = function(...args) {
            const txt = args.find(a => typeof a === 'string' && /[\u0600-\u06FF]/.test(a));
            if (txt) {
              window.LumiStoryVoice.speakArabic(txt);
            }
            return orig(...args);
          };
        }
      });
    }

    if (window.LumiAudio && typeof LumiAudio.speak === 'function') {
      const origSpeak = LumiAudio.speak.bind(LumiAudio);
      LumiAudio.speak = function(key, egText, frText, ...rest) {
        const hasAr = typeof egText === 'string' && /[\u0600-\u06FF]/.test(egText);
        // إذا كان النص طويلاً (فقرة قصة) أو محرك المتصفح لا يملك صوتاً عربياً، استخدم LumiStoryVoice
        const arVoice = pickBestArabicVoice();
        if (hasAr && (egText.length > 45 || !arVoice)) {
          window.LumiStoryVoice.speakArabic(egText);
          if (frText && !egText) return origSpeak(key, '', frText, ...rest);
          return;
        }
        return origSpeak(key, egText, frText, ...rest);
      };
    }
  }

  window.addEventListener('DOMContentLoaded', patchStoryAudio);
  window.addEventListener('load', patchStoryAudio);
  setTimeout(patchStoryAudio, 400);
})();
