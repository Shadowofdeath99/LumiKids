(function() {
  if (typeof LumiGames === 'undefined') return;

  const CUSTOM_GAME_IDS = new Set([
    // Pack 2 (10 games)
    'fruits_veggies', 'vehicles_sounds', 'big_small', 'animal_homes', 'count_balloons',
    'fractions_pro', 'world_capitals', 'sentence_order', 'science_lab', 'cipher_logic',
    // CM1 Pack & Expansion (11 games)
    'cm1_math_numbers', 'cm1_math_geom', 'cm1_sciences', 'cm1_french_gram',
    'cm1_arabic_nahw', 'cm1_social_egypt', 'cm1_iq_master',
    'algo_robot', 'clock_master', 'english_smart', 'color_lab',
    // Helen Sensory Pack (3 games)
    'helen_puzzle_shapes', 'helen_emotions', 'helen_nature_colors'
  ]);

  let transitionLock = false;

  // ضمان عمل handleAnswer بسلاسة والانتقال للسؤال التالي في كل الألعاب
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
          // تحديث عداد النجوم العلوي إن وجد
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

    // الألعاب الأساسية الـ 20 تعمل بمنطقها الأصلي
    if (origHandleAnswer) {
      return origHandleAnswer(isCorrect);
    }
  };

  // فك أي قفل عند بدء لعبة جديدة أو العودة للرئيسية
  if (typeof LumiGames.start === 'function') {
    const origStart = LumiGames.start.bind(LumiGames);
    LumiGames.start = function(gameId) {
      transitionLock = false;
      return origStart(gameId);
    };
  }
})();
