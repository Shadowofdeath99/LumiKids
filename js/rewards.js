const LumiRewards = {
  defaultCatalog: [
    { id: 'r1', icon: '🍦', title: 'آيس كريم أو حلوى مفضلة', cost: 25 },
    { id: 'r2', icon: '🎬', title: 'اختيار فيلم السهرة للعائلة', cost: 40 },
    { id: 'r3', icon: '🎨', title: 'نشاط تلوين أو أشغال يدوية مع بابا/ماما', cost: 30 },
    { id: 'r4', icon: '📖', title: 'قصة إضافية قبل النوم', cost: 15 },
    { id: 'r5', icon: '🎡', title: 'فسحة أو نزهة نهاية الأسبوع', cost: 80 }
  ],

  defaultHabits: {
    heaven: [
      { id: 'h1', icon: '📚', title: 'إنهاء الواجب المدرسي والمراجعة', stars: 5 },
      { id: 'h2', icon: '📖', title: 'قراءة قصة أو كتاب لمدة 15 دقيقة', stars: 4 },
      { id: 'h3', icon: '🛏️', title: 'ترتيب الغرفة والسرير صباحاً', stars: 3 },
      { id: 'h4', icon: '🤝', title: 'مساعدة أختي الصغيرة هيلن', stars: 4 }
    ],
    helen: [
      { id: 'l1', icon: '🪥', title: 'غسل الأسنان صباحاً ومساءً', stars: 3 },
      { id: 'l2', icon: '🧸', title: 'ترتيب الألعاب بعد اللعب', stars: 3 },
      { id: 'l3', icon: '💧', title: 'شرب الماء والأكل الصحي', stars: 2 },
      { id: 'l4', icon: '😴', title: 'الاستعداد للنوم في الموعد', stars: 3 }
    ]
  },

  getFamilyData() {
    try {
      const raw = localStorage.getItem('LumiKids_FamilyRewards');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (!parsed.catalog) parsed.catalog = [...this.defaultCatalog];
        if (!parsed.redemptions) parsed.redemptions = [];
        return parsed;
      }
    } catch (e) {}
    return {
      catalog: [...this.defaultCatalog],
      redemptions: []
    };
  },

  saveFamilyData(data) {
    localStorage.setItem('LumiKids_FamilyRewards', JSON.stringify(data));
    if (typeof LumiCloud !== 'undefined') LumiCloud.scheduleAutoPush();
  },

  getTodayKey() {
    return new Date().toISOString().slice(0, 10);
  },

  getProfileHabits(prof) {
    const isYoung = (prof.age && prof.age <= 5) || (prof.id && prof.id.includes('helen')) || prof.name.includes('هيلن');
    return isYoung ? this.defaultHabits.helen : this.defaultHabits.heaven;
  },

  openHub() {
    LumiApp.showView('rewards-hub-view');
    const prof = LumiStorage.getActiveProfile();
    const state = LumiStorage.getState();
    const fam = this.getFamilyData();
    const today = this.getTodayKey();
    state.dailyHabitsDone = state.dailyHabitsDone || {};
    const doneToday = state.dailyHabitsDone[today] || [];
    const habits = this.getProfileHabits(prof);

    const container = document.getElementById('rewards-hub-content');
    container.innerHTML = `
      <div style="background:linear-gradient(135deg,#F59E0B,#EA580C); color:#FFF; padding:20px; border-radius:24px; margin-bottom:18px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
        <div>
          <h2 style="margin:0 0 6px 0;">🛒 متجر المكافآت والمهام اليومية</h2>
          <p style="margin:0; font-size:0.95rem;">أهلاً يا ${prof.avatar} <b>${prof.name}</b>! أكملي مهامك اليومية واجمعي النجوم لاستبدالها بمكافآت حقيقية من بابا وماما.</p>
        </div>
        <div style="background:rgba(255,255,255,0.2); padding:10px 18px; border-radius:50px; font-size:1.2rem; font-weight:bold;">
          ⭐ رصيدك: ${state.stars || 0} نجمة
        </div>
      </div>

      <!-- قسم المهام اليومية -->
      <div class="set-box" style="margin-bottom:20px; border:2px solid #10B981;">
        <h3 style="color:#059669; margin-top:0;">📅 مهامي اليومية (${today})</h3>
        <div style="display:grid; gap:10px;">
          ${habits.map(h => {
            const isDone = doneToday.includes(h.id);
            return `
              <div class="lock-row" style="justify-content:space-between; flex-wrap:wrap; gap:10px; background:${isDone ? 'rgba(16,185,129,0.12)' : 'var(--bg)'}; border:1px solid ${isDone ? '#10B981' : '#E2E8F0'};">
                <div style="display:flex; align-items:center; gap:10px;">
                  <span style="font-size:1.8rem;">${h.icon}</span>
                  <div>
                    <div style="font-weight:bold; text-decoration:${isDone ? 'line-through' : 'none'};">${h.title}</div>
                    <div style="font-size:0.85rem; color:#D97706; font-weight:bold;">+${h.stars} نجوم ⭐</div>
                  </div>
                </div>
                <button class="primary-btn" style="margin:0; padding:8px 16px; font-size:0.9rem; background:${isDone ? '#94A3B8' : '#10B981'};" ${isDone ? 'disabled' : `onclick="LumiRewards.completeHabit('${h.id}', ${h.stars}, '${h.title}')"`}>
                  ${isDone ? '✅ مكتملة اليوم' : 'إتمام المهمة ⭐'}
                </button>
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <!-- قسم متجر المكافآت العائلي -->
      <div class="set-box" style="border:2px solid #F59E0B;">
        <h3 style="color:#D97706; margin-top:0;">🎁 متجر المكافآت العائلي</h3>
        <div class="games-grid">
          ${fam.catalog.map(item => {
            const canBuy = (state.stars || 0) >= item.cost;
            return `
              <div class="game-card" style="border:2px solid ${canBuy ? '#F59E0B' : '#CBD5E1'}; opacity:${canBuy ? '1' : '0.82'};">
                <div class="g-icon">${item.icon}</div>
                <div class="g-name-eg" style="font-size:1.05rem;">${item.title}</div>
                <div style="margin:8px 0; font-weight:bold; color:#D97706; font-size:1.1rem;">⭐ ${item.cost} نجمة</div>
                <button class="primary-btn" style="margin:0; padding:8px 16px; font-size:0.9rem; background:${canBuy ? 'linear-gradient(135deg,#F59E0B,#D97706)' : '#94A3B8'};" onclick="LumiRewards.redeemReward('${item.id}')">
                  ${canBuy ? '🎉 اطلبي المكافأة' : `ينقصك ${item.cost - (state.stars || 0)} نجمة`}
                </button>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  },

  completeHabit(habitId, stars, title) {
    const state = LumiStorage.getState();
    const today = this.getTodayKey();
    state.dailyHabitsDone = state.dailyHabitsDone || {};
    state.dailyHabitsDone[today] = state.dailyHabitsDone[today] || [];
    if (state.dailyHabitsDone[today].includes(habitId)) return;

    state.dailyHabitsDone[today].push(habitId);
    state.stars = (state.stars || 0) + stars;
    state.history = state.history || [];
    state.history.unshift({
      game: `مهمة يومية: ${title}`,
      level: 1,
      stars: stars,
      date: new Date().toLocaleString('ar-EG')
    });
    LumiStorage.saveState(state);
    LumiApp.updateTopStats();
    LumiAudio.sfxWin();
    LumiApp.triggerConfetti();
    this.openHub();
  },

  redeemReward(rewardId) {
    const prof = LumiStorage.getActiveProfile();
    const state = LumiStorage.getState();
    const fam = this.getFamilyData();
    const item = fam.catalog.find(r => r.id === rewardId);
    if (!item) return;

    if ((state.stars || 0) < item.cost) {
      alert(`رصيدك الحالي ${state.stars || 0} نجمة، وتحتاجين إلى ${item.cost} نجمة للحصول على "${item.title}".`);
      return;
    }

    if (!confirm(`هل تريدين استبدال ${item.cost} نجمة للحصول على: "${item.title}"؟`)) return;

    state.stars -= item.cost;
    LumiStorage.saveState(state);
    LumiApp.updateTopStats();

    fam.redemptions.unshift({
      id: 'red_' + Date.now(),
      childName: prof.name,
      childAvatar: prof.avatar,
      rewardTitle: item.title,
      rewardIcon: item.icon,
      cost: item.cost,
      date: new Date().toLocaleString('ar-EG'),
      fulfilled: false
    });
    this.saveFamilyData(fam);

    LumiAudio.sfxWin();
    LumiApp.triggerConfetti();
    alert(`🎉 مبروك يا ${prof.name}! تم إرسال طلب مكافأة "${item.title}" إلى بابا وماما في لوحة الأهل.`);
    this.openHub();
  },

  addCustomReward() {
    const title = prompt('اكتب اسم المكافأة الجديدة (مثال: رحلة للبحر أو لعبة جديدة):');
    if (!title || !title.trim()) return;
    const costStr = prompt('كم نجمة تتطلب هذه المكافأة؟', '35');
    const cost = Math.max(5, parseInt(costStr, 10) || 35);
    const icon = prompt('اختر رمزاً تعبيرياً للمكافأة:', '🎁') || '🎁';

    const fam = this.getFamilyData();
    fam.catalog.push({ id: 'r_' + Date.now(), icon, title: title.trim(), cost });
    this.saveFamilyData(fam);
    LumiAudio.sfxSuccess();
    if (typeof LumiParent !== 'undefined') LumiParent.renderParentArea();
  },

  deleteReward(id) {
    const fam = this.getFamilyData();
    fam.catalog = fam.catalog.filter(r => r.id !== id);
    this.saveFamilyData(fam);
    if (typeof LumiParent !== 'undefined') LumiParent.renderParentArea();
  },

  markFulfilled(redId) {
    const fam = this.getFamilyData();
    const rec = fam.redemptions.find(r => r.id === redId);
    if (rec) rec.fulfilled = true;
    this.saveFamilyData(fam);
    LumiAudio.sfxSuccess();
    if (typeof LumiParent !== 'undefined') LumiParent.renderParentArea();
  }
};
