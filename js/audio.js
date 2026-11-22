const LumiAudio = {
  ctx: null,
  mediaRecorder: null,
  recordedChunks: [],
  currentAudio: null,

  init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
  },

  // توليد مؤثرات صوتية مبهجة بالكود (Web Audio API)
  playTone(freq, type = 'sine', duration = 0.2, delay = 0) {
    this.init();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime + delay);
    gain.gain.setValueAtTime(0.25, this.ctx.currentTime + delay);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + delay + duration);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(this.ctx.currentTime + delay);
    osc.stop(this.ctx.currentTime + delay + duration);
  },

  sfxClick() { this.playTone(520, 'sine', 0.1); },
  sfxSuccess() {
    this.playTone(523.25, 'triangle', 0.15, 0);
    this.playTone(659.25, 'triangle', 0.15, 0.12);
    this.playTone(783.99, 'triangle', 0.3, 0.24);
  },
  sfxError() {
    this.playTone(260, 'sawtooth', 0.2, 0);
    this.playTone(210, 'sawtooth', 0.3, 0.18);
  },
  sfxWin() {
    [523, 659, 783, 1046].forEach((f, i) => this.playTone(f, 'triangle', 0.25, i * 0.12));
  },

  // تشغيل صوت الأهل المسجل أو الرجوع للنطق الآلي الذكي
  async speak(voiceId, textEg = "", textFr = "") {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio = null;
    }
    window.speechSynthesis.cancel();

    const state = LumiStorage.getState();
    const preferred = state.settings.preferredParent || 'auto';
    const langMode = state.settings.langMode || 'both';

    // 1. البحث عن تسجيل صوتي للأب أو الأم في قاعدة البيانات
    if (voiceId) {
      const blob = await LumiStorage.getVoice(voiceId, preferred);
      if (blob) {
        const url = URL.createObjectURL(blob);
        this.currentAudio = new Audio(url);
        this.currentAudio.play();
        return;
      }
    }

    // 2. في حالة عدم التسجيل بعد: نطق آلي ذكي بالعامية/العربية والفرنسية
    const speakUtterance = (txt, lang) => {
      return new Promise((resolve) => {
        if (!txt) return resolve();
        if (typeof SpeechSynthesisUtterance === "undefined") return resolve(); const u = new SpeechSynthesisUtterance(txt);
        u.lang = lang;
        u.rate = 0.92;
        u.pitch = 1.15;
        u.onend = resolve;
        u.onerror = resolve;
        window.speechSynthesis.speak(u);
      });
    };

    if (langMode === 'fr' && textFr) {
      await speakUtterance(textFr, 'fr-FR');
    } else if (langMode === 'eg' && textEg) {
      await speakUtterance(textEg, 'ar-EG');
    } else {
      if (textEg) await speakUtterance(textEg, 'ar-EG');
      if (textFr) await speakUtterance(textFr, 'fr-FR');
    }
  },

  // بدء تسجيل صوت الأب أو الأم
  async startRecording() {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    this.recordedChunks = [];
    this.mediaRecorder = new MediaRecorder(stream);
    this.mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) this.recordedChunks.push(e.data);
    };
    this.mediaRecorder.start();
  },

  stopRecording() {
    return new Promise((resolve) => {
      if (!this.mediaRecorder) return resolve(null);
      this.mediaRecorder.onstop = () => {
        const blob = new Blob(this.recordedChunks, { type: 'audio/webm' });
        this.mediaRecorder.stream.getTracks().forEach(t => t.stop());
        resolve(blob);
      };
      this.mediaRecorder.stop();
    });
  },

  // مدرب النطق الفرنسي الذكي للطفلة (Speech Recognition)
  listenFrenchWord(expectedWord, onResult) {
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRec) {
      onResult(true, expectedWord, "المتصفح لا يدعم المايك، تم احتساب المحاولة!");
      return;
    }
    const rec = new SpeechRec();
    rec.lang = 'fr-FR';
    rec.interimResults = false;
    rec.maxAlternatives = 3;

    rec.onresult = (event) => {
      const results = Array.from(event.results[0]).map(r => r.transcript.toLowerCase().trim());
      const cleanExpected = expectedWord.toLowerCase().replace(/^(le|la|l'|les)\s+/i, '').trim();
      const matched = results.some(r => r.includes(cleanExpected) || cleanExpected.includes(r));
      onResult(matched, results[0] || "");
    };
    rec.onerror = () => onResult(false, "");
    rec.start();
  }
};
