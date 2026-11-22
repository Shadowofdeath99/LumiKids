const LumiProGames = {
  currentMode: 'pro_math',
  currentLevel: 1,
  score: 0,
  questionIndex: 0,
  totalQuestions: 5,

  openArena() {
    if (typeof LumiApp !== 'undefined' && LumiApp.showView) LumiApp.showView('pro-arena-view');
    const wrap = document.getElementById('pro-arena-content');
    if (!wrap) return;
    wrap.innerHTML = `
      <div style="background:linear-gradient(135deg,#4F46E5,#7C3AED); color:#FFF; padding:20px; border-radius:24px; margin-bottom:18px;">
        <h2 style="margin:0 0 6px 0;">🚀 ساحة تحديات الأبطال (+10 سنوات - هيفن)</h2>
        <p style="margin:0; font-size:0.95rem;">اختاري التحدي واكسبي نجوماً مضاعفة في الحساب الذهني، المنطق، والعلوم!</p>
      </div>
      <div class="games-grid" style="margin-bottom:18px;">
        <div class="game-card" onclick="LumiProGames.launch('pro_math', 1)">
          <div class="g-icon">🧮</div>
          <div class="g-name-eg">تحدي الحساب الذهني السريع</div>
          <button class="primary-btn" style="margin-top:8px;">ابدئي التحدي ⚡</button>
        </div>
        <div class="game-card" onclick="LumiProGames.launch('pro_logic', 1)">
          <div class="g-icon">🧩</div>
          <div class="g-name-eg">ألغاز التسلسل والمنطق</div>
          <button class="primary-btn" style="margin-top:8px;">ابدئي التحدي 🧠</button>
        </div>
        <div class="game-card" onclick="LumiProGames.launch('pro_science', 1)">
          <div class="g-icon">🌍</div>
          <div class="g-name-eg">موسوعة العلوم والفضاء</div>
          <button class="primary-btn" style="margin-top:8px;">ابدئي التحدي 🔭</button>
        </div>
      </div>
      <div id="pro-stage" class="set-box" style="min-height:180px;"></div>
    `;
    this.launch('pro_math', 1);
  },

  generateQuestion(mode, level) {
    if (mode === 'pro_logic') {
      const step = 3 + level;
      const start = 4 + level * 2;
      const ans = start + step * 3;
      return {
        q: `أكملي المتتالية: ${start} ، ${start + step} ، ${start + step * 2} ، ؟`,
        ans: String(ans),
        options: [String(ans), String(ans + step), String(ans - 2), String(ans + 1)].sort(() => Math.random() - 0.5)
      };
    }
    if (mode === 'pro_science') {
      const bank = [
        { q: 'ما هو أكبر كوكب في المجموعة الشمسية؟', ans: 'المشتري', options: ['المشتري', 'زحل', 'المريخ', 'الأرض'] },
        { q: 'ما الغاز الذي تمتصه النباتات للقيام بالبناء الضوئي؟', ans: 'ثاني أكسيد الكربون', options: ['ثاني أكسيد الكربون', 'الأكسجين', 'النيتروجين', 'الهيليوم'] },
        { q: 'كم عدد عظام جسم الإنسان البالغ تقريباً؟', ans: '206', options: ['206', '150', '310', '98'] },
        { q: 'ما هو أقرب كوكب إلى الشمس؟', ans: 'عطارد', options: ['عطارد', 'الزهرة', 'المريخ', 'نبتون'] }
      ];
      const item = bank[Math.floor(Math.random() * bank.length)];
      return { q: item.q, ans: item.ans, options: [...item.options].sort(() => Math.random() - 0.5) };
    }
    const a = Math.floor(Math.random() * (12 * level)) + 11;
    const b = Math.floor(Math.random() * (9 * level)) + 7;
    const ans = a + b;
    return {
      q: `احسبي بسرعة: ${a} + ${b} = ؟`,
      ans: String(ans),
      options: [String(ans), String(ans + 3), String(ans - 4), String(ans + 10)].sort(() => Math.random() - 0.5)
    };
  },

  launch(mode, level = 1) {
    this.currentMode = mode;
    this.currentLevel = level;
    this.score = 0;
    this.questionIndex = 0;
    this.renderQuestion();
  },

  renderQuestion() {
    const stage = document.getElementById('pro-stage');
    if (!stage) return;
    if (this.questionIndex >= this.totalQuestions) {
      const starsEarned = Math.max(2, this.score * 2);
      if (typeof LumiStorage !== 'undefined' && LumiStorage.getState) {
        const st = LumiStorage.getState();
        st.stars = (st.stars || 0) + starsEarned;
        LumiStorage.saveState(st);
        if (typeof LumiApp !== 'undefined' && LumiApp.updateTopStats) LumiApp.updateTopStats();
      }
      stage.innerHTML = `
        <div style="text-align:center; padding:16px;">
          <h3>🏆 أحسنتِ يا بطلة! أنهيتِ التحدي بنتيجة ${this.score}/${this.totalQuestions}</h3>
          <p style="color:#D97706; font-weight:bold; font-size:1.1rem;">حصلتِ على +${starsEarned} نجوم ⭐</p>
          <button class="primary-btn" onclick="LumiProGames.launch('${this.currentMode}', ${this.currentLevel + 1})">المستوى التالي 🚀</button>
        </div>
      `;
      return;
    }
    const item = this.generateQuestion(this.currentMode, this.currentLevel);
    stage.innerHTML = `
      <div style="display:flex; justify-content:space-between; margin-bottom:10px; font-weight:bold; color:#4F46E5;">
        <span>المستوى ${this.currentLevel}</span>
        <span>السؤال ${this.questionIndex + 1} من ${this.totalQuestions}</span>
      </div>
      <h3 style="text-align:center; font-size:1.35rem; margin:14px 0;">${item.q}</h3>
      <div style="display:grid; grid-template-columns:repeat(auto-fit,minmax(140px,1fr)); gap:10px;">
        ${item.options.map(opt => `
          <div class="option-card" style="padding:14px; text-align:center; border:2px solid #CBD5E1; border-radius:16px; cursor:pointer; font-weight:bold; font-size:1.1rem;" onclick="LumiProGames.answer('${opt.replace(/'/g, '')}', '${item.ans.replace(/'/g, '')}')">
            ${opt}
          </div>
        `).join('')}
      </div>
    `;
  },

  answer(picked, correct) {
    if (picked === correct) {
      this.score++;
      if (typeof LumiAudio !== 'undefined' && LumiAudio.sfxSuccess) LumiAudio.sfxSuccess();
    }
    this.questionIndex++;
    this.renderQuestion();
  }
};
window.LumiProGames = LumiProGames;
