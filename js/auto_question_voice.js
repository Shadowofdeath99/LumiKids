(function() {
  let lastSpokenSignature = '';
  let speakTimer = null;

  function detectLang(text) {
    if (/[\u0600-\u06FF]/.test(text)) return 'ar-EG';
    if (/[àâçéèêëîïôûùüÿñæœ]/i.test(text) || /\b(le|la|les|un|une|des|est|sont|quelle|quel|calcule|complète|choisis|dans|avec|pour)\b/i.test(text)) {
      return 'fr-FR';
    }
    return 'en-US';
  }

  function cleanForSpeech(raw) {
    return (raw || '')
      .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, ' ')
      .replace(/[_]{2,}/g, ' ... ')
      .replace(/\s+/g, ' ')
      .trim();
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

  function speakQuestionText(text) {
    const cleaned = cleanForSpeech(text);
    if (!cleaned || cleaned.length < 2 || !('speechSynthesis' in window)) return;
    const lang = detectLang(cleaned);
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(cleaned);
    u.lang = lang;
    const voice = pickSoftFemaleVoice(lang);
    if (voice) u.voice = voice;
    u.pitch = 1.12;
    u.rate = 0.92;
    window.speechSynthesis.speak(u);
  }

  function extractCurrentQuestion(stage) {
    if (!stage) return '';
    // استبعاد أشرطة التحكم والخزنة والتسجيل عند استخراج نص السؤال
    const clone = stage.cloneNode(true);
    ['#papa-vault-banner', '#parent-voice-bar', '#tri-dialogues-bar', '#auto-q-speak-bar', 'button', 'select', 'input'].forEach(sel => {
      clone.querySelectorAll(sel).forEach(el => el.remove());
    });
    const lines = clone.innerText
      .split('\n')
      .map(s => s.trim())
      .filter(s => s.length >= 3 && !/^بطاقة\s+\d+/.test(s) && !/^⚔️/.test(s));
    return lines.slice(0, 2).join(' . ');
  }

  function ensureReplayButton(stage, questionText) {
    if (!stage || !questionText) return;
    let bar = stage.querySelector('#auto-q-speak-bar');
    if (!bar) {
      bar = document.createElement('div');
      bar.id = 'auto-q-speak-bar';
      bar.style.cssText = 'text-align:center; margin:4px auto 10px auto;';
      const anchor = stage.querySelector('#parent-voice-bar') || stage.querySelector('#papa-vault-banner');
      if (anchor && anchor.nextSibling) {
        stage.insertBefore(bar, anchor.nextSibling);
      } else {
        stage.insertAdjacentElement('afterbegin', bar);
      }
    }
    bar.innerHTML = `<button type="button" style="padding:7px 16px; border-radius:999px; border:none; background:linear-gradient(135deg,#0EA5E9,#2563EB); color:#fff; font-weight:800; font-size:0.9rem; cursor:pointer; box-shadow:0 3px 10px rgba(37,99,235,0.25);">🔊 استمع لقراءة السؤال</button>`;
    bar.querySelector('button').onclick = () => speakQuestionText(questionText);
  }

  function bindStageObserver() {
    const stage = document.getElementById('game-stage');
    if (!stage || stage.dataset.qVoiceObserved) return;
    stage.dataset.qVoiceObserved = '1';

    const observer = new MutationObserver(() => {
      clearTimeout(speakTimer);
      speakTimer = setTimeout(() => {
        const gameView = document.getElementById('game-view');
        if (gameView && gameView.style.display === 'none') return;
        const qText = extractCurrentQuestion(stage);
        if (!qText || qText === lastSpokenSignature) return;
        lastSpokenSignature = qText;
        ensureReplayButton(stage, qText);
        speakQuestionText(qText);
      }, 280);
    });

    observer.observe(stage, { childList: true, subtree: true });
  }

  if ('speechSynthesis' in window) {
    window.speechSynthesis.getVoices();
    window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
  }

  window.LumiQuestionVoice = { speak: speakQuestionText };
  window.addEventListener('DOMContentLoaded', bindStageObserver);
  setInterval(bindStageObserver, 800);
})();
