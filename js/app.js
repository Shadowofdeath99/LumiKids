const LumiApp = {
  warnedSleep: false,

  async init() {
    await LumiStorage.initDB();
    this.renderProfileSwitcher();
    this.renderProfileSwitcher();
    this.applyVisualSettings();
    this.updateTopStats();
    this.renderHomeGrid();
    const apkBtn = document.getElementById('apk-download-btn');
    if (apkBtn && (window.Capacitor || /wv\)/.test(navigator.userAgent))) {
      apkBtn.style.display = 'none';
    }
    this.startEyeCareTimer();
  },


  renderProfileSwitcher() {
    const meta = LumiStorage.getProfilesMeta();
    const sel = document.getElementById('profile-switcher');
    if (!sel) return;
    sel.innerHTML = meta.list.map(p =>
      `<option value="${p.id}" ${p.id === meta.activeId ? 'selected' : ''}>${p.avatar} ${p.name}</option>`
    ).join('');
  },

  onSwitchProfile(profileId) {
    if (typeof LumiGames !== 'undefined') LumiGames.endCurrentSession();
    LumiStorage.switchProfile(profileId);
    this.renderProfileSwitcher();
    this.renderProfileSwitcher();
    this.applyVisualSettings();
    this.updateTopStats();
    this.showView('home-view');
    LumiAudio.sfxSuccess();
  },


  renderProfileSwitcher() {
    const meta = LumiStorage.getProfilesMeta();
    const sel = document.getElementById('profile-switcher');
    if (!sel) return;
    sel.innerHTML = meta.list.map(p =>
      `<option value="${p.id}" ${p.id === meta.activeId ? 'selected' : ''}>${p.avatar} ${p.name}</option>`
    ).join('');
  },

  onSwitchProfile(profileId) {
    if (typeof LumiGames !== 'undefined') LumiGames.endCurrentSession();
    LumiStorage.switchProfile(profileId);
    this.renderProfileSwitcher();
    this.applyVisualSettings();
    this.updateTopStats();
    this.showView('home-view');
    LumiAudio.sfxSuccess();
  },

  applyVisualSettings() {
    const state = LumiStorage.getState();
    const s = state.settings;
    document.body.style.filter = `brightness(${s.brightness}%)`;
    document.body.className = `theme-${s.theme}`;
  },

  updateTopStats() {
    const state = LumiStorage.getState();
    document.getElementById('top-stars').innerText = state.stars;

    let totalCompleted = 0;
    LumiDictionary.games.forEach(g => {
      totalCompleted += (state.progress[g.id] && state.progress[g.id].completed) || 0;
    });
    const pct = Math.min(100, Math.round((totalCompleted / (LumiDictionary.games.length * 20)) * 100));
    document.getElementById('overall-pct-text').innerText = `${pct}%`;
    document.getElementById('overall-fill-bar').style.width = `${pct}%`;
  },

  showView(viewId) {
    if (viewId !== 'game-view' && typeof LumiGames !== 'undefined') LumiGames.endCurrentSession();
    document.querySelectorAll('.view-section').forEach(v => v.classList.remove('active'));
    document.getElementById(viewId).classList.add('active');
    if (viewId === 'home-view') {
      this.updateTopStats();
      this.renderHomeGrid();
    }
  },

  renderHomeGrid() {
    const state = LumiStorage.getState();
    const grid = document.getElementById('games-grid');
    grid.innerHTML = '';

    LumiDictionary.games.forEach(g => {
      const isLocked = state.settings.lockedGames.includes(g.id);
      const prog = state.progress[g.id] || { level: 1, completed: 0 };
      const pct = Math.min(100, Math.round(((prog.completed || 0) / 20) * 100));

      const card = document.createElement('div');
      card.className = `game-card ${isLocked ? 'locked' : ''}`;
      card.style.setProperty('--card-color', g.color);
      card.innerHTML = `
        <span class="g-icon">${isLocked ? '🔒' : g.icon}</span>
        <div class="g-name-eg">${g.nameEg}</div>
        <div class="g-name-fr">${g.nameFr}</div>
        <div class="g-lvl-tag">مستوى ${prog.level}/10 (${pct}%)</div>
        <div class="g-mini-prog"><div class="g-mini-fill" style="width:${pct}%"></div></div>
      `;
      card.onclick = () => {
        if (isLocked) return;
        LumiAudio.sfxClick();
        this.showView('game-view');
        LumiGames.start(g.id, false);
      };
      grid.appendChild(card);
    });
  },


  openAdventureMap() {
    this.showView('adventure-view');
    const adv = LumiStorage.getDailyAdventure();
    const prof = LumiStorage.getActiveProfile();
    const allDone = adv.stations.every(s => s.done);
    const box = document.getElementById('adventure-container');

    box.innerHTML = `
      <div style="background:linear-gradient(135deg, #0EA5E9, #6366F1); color:white; padding:24px; border-radius:28px; text-align:center; margin-bottom:22px; box-shadow:var(--shadow);">
        <h2>🗺️ خريطة كنز ${prof.avatar} ${prof.name} لليوم</h2>
        <p style="margin-top:6px; opacity:0.95;">أكملي المحطات الأربع الذكية المصممة خصيصاً لتقوية مهاراتك وافتحي صندوق الكنز!</p>
      </div>

      <div style="display:flex; justify-content:center; align-items:center; gap:18px; flex-wrap:wrap; margin:20px 0;">
        ${adv.stations.map((st, idx) => {
          const g = LumiDictionary.games.find(x => x.id === st.gameId);
          if (!g) return '';
          return `
            <div class="game-card" style="--card-color:${st.done ? '#22C55E' : g.color}; width:210px; border:3px solid ${st.done ? '#22C55E' : 'transparent'};" onclick="LumiApp.startAdventureGame('${g.id}')">
              <div style="font-size:0.85rem; font-weight:bold; color:#64748B;">المحطة ${idx + 1}</div>
              <span class="g-icon">${st.done ? '✅' : g.icon}</span>
              <div class="g-name-eg">${g.nameEg}</div>
              <div class="g-name-fr">${g.nameFr}</div>
              <div class="g-lvl-tag" style="margin-top:8px;">${st.done ? 'تمت بنجاح! 🌟' : 'اضغطي للبدء ▶️'}</div>
            </div>
          `;
        }).join('')}
      </div>

      <div style="background:var(--surface); padding:24px; border-radius:28px; text-align:center; box-shadow:var(--shadow); max-width:460px; margin:24px auto;">
        <div style="font-size:4.5rem;">${adv.chestClaimed ? '👑' : allDone ? '🎁✨' : '🔒'}</div>
        <h3>صندوق الكنز اليومي (+10 نجوم إضافية)</h3>
        <button class="primary-btn" ${(!allDone || adv.chestClaimed) ? 'disabled style="opacity:0.5"' : ''} onclick="LumiApp.claimDailyChest()">
          ${adv.chestClaimed ? 'تم فتح الكنز اليوم! 🎉' : allDone ? 'افتحي صندوق الكنز الآن!' : 'أكملي المحطات الأربع لفتح الكنز'}
        </button>
      </div>
    `;
  },

  startAdventureGame(gameId) {
    LumiAudio.sfxClick();
    this.showView('game-view');
    LumiGames.start(gameId, false);
  },

  claimDailyChest() {
    const adv = LumiStorage.getDailyAdventure();
    if (adv.stations.every(s => s.done) && !adv.chestClaimed) {
      adv.chestClaimed = true;
      const state = LumiStorage.getState();
      state.dailyAdventure = adv;
      state.stars += 10;
      LumiStorage.saveState(state);
      this.updateTopStats();
      this.triggerConfetti();
      LumiAudio.sfxWin();
      this.openAdventureMap();
    }
  },

  openStickers() {
    this.showView('stickers-view');
    const state = LumiStorage.getState();
    const owned = state.stickers || [];
    const box = document.getElementById('stickers-container');
    box.innerHTML = `
      <div class="overall-bar-wrap">
        <b>🌟 ملصقاتي المجمعة: ${owned.length} / ${LumiDictionary.stickers.length}</b>
        <div class="overall-track"><div class="overall-fill" style="width:${Math.round((owned.length / LumiDictionary.stickers.length) * 100)}%"></div></div>
      </div>
      <div class="games-grid">
        ${LumiDictionary.stickers.map(s => {
          const isOwned = owned.includes(s.id);
          return `
            <div class="game-card ${isOwned ? '' : 'locked'}" style="--card-color:#EC4899" onclick="${isOwned ? `LumiAudio.speak('${s.id}', '${s.eg}', '${s.fr}')` : ''}">
              <span class="g-icon">${isOwned ? s.icon : '🎁'}</span>
              <div class="g-name-eg">${isOwned ? s.eg : 'ملصق سري'}</div>
              <div class="g-name-fr">${isOwned ? s.fr : 'اجتازي مستوى لفتحه'}</div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  },

  showStickerUnlockModal(sticker, onClose) {
    this.triggerConfetti();
    LumiAudio.sfxWin();
    const modal = document.getElementById('sticker-unlock-modal');
    document.getElementById('unlocked-sticker-icon').innerText = sticker.icon;
    document.getElementById('unlocked-sticker-title').innerText = `${sticker.eg} (${sticker.fr})`;
    modal.style.display = 'flex';
    document.getElementById('close-sticker-modal').onclick = () => {
      modal.style.display = 'none';
      if (onClose) onClose();
    };
  },

  openStories() {
    this.showView('stories-view');
    const list = document.getElementById('stories-container');
    list.innerHTML = `
      <div class="games-grid">
        ${LumiDictionary.stories.map((st, idx) => `
          <div class="game-card" style="--card-color:#8338EC" onclick="LumiApp.playStory(${idx}, 0)">
            <span class="g-icon">${st.cover}</span>
            <div class="g-name-eg">${st.titleEg}</div>
            <div class="g-name-fr">${st.titleFr}</div>
          </div>
        `).join('')}
      </div>
    `;
  },

  playStory(storyIdx, sceneIdx) {
    const story = LumiDictionary.stories[storyIdx];
    const scene = story.scenes[sceneIdx];
    const container = document.getElementById('stories-container');

    LumiAudio.speak(scene.id, scene.eg, scene.fr);
    const allObjs = [scene.targetIcon, ...scene.distractors].sort(() => Math.random() - 0.5);

    container.innerHTML = `
      <div class="story-scene-box" style="background:${scene.bg}">
        <div><h3>${story.titleEg} (${sceneIdx + 1}/${story.scenes.length})</h3></div>
        <div class="story-text">
          <p>🇪🇬 ${scene.eg}</p>
          <p style="color:#FDE047; margin-top:8px;">🇫🇷 ${scene.fr}</p>
          <button class="speak-btn" style="margin-top:10px;" onclick="LumiAudio.speak('${scene.id}', '${scene.eg.replace(/'/g, "\\'")}', '${scene.fr.replace(/'/g, "\\'")}')">🔊 اسمعي القصة تاني</button>
        </div>
        <div class="story-objects">
          ${allObjs.map(icon => `
            <button class="story-obj-btn" onclick="LumiApp.handleStoryTap(${storyIdx}, ${sceneIdx}, '${icon}', '${scene.targetIcon}')">${icon}</button>
          `).join('')}
        </div>
      </div>
    `;
  },

  handleStoryTap(storyIdx, sceneIdx, tapped, target) {
    if (tapped === target) {
      LumiAudio.sfxSuccess();
      this.triggerConfetti();
      const story = LumiDictionary.stories[storyIdx];
      if (sceneIdx + 1 < story.scenes.length) {
        setTimeout(() => this.playStory(storyIdx, sceneIdx + 1), 1000);
      } else {
        const state = LumiStorage.getState();
        state.stars += 5;
        LumiStorage.saveState(state);
        this.updateTopStats();
        alert('🎉 برافو عليكي! خلصتي القصة وكسبتي 5 نجوم!');
        this.openStories();
      }
    } else {
      LumiAudio.sfxError();
    }
  },

  openRewards() {
    this.showView('rewards-view');
    const state = LumiStorage.getState();
    const box = document.getElementById('rewards-container');
    box.innerHTML = `
      <div class="games-grid">
        ${state.settings.realRewards.map(r => {
          const canBuy = state.stars >= r.cost && !r.claimed;
          return `
            <div class="game-card" style="--card-color:#FF9F1C">
              <span class="g-icon">${r.claimed ? '✅' : '🎁'}</span>
              <div class="g-name-eg">${r.title}</div>
              <div class="g-lvl-tag">التكلفة: ${r.cost} ⭐</div>
              <button class="primary-btn" ${!canBuy ? 'disabled style="opacity:0.5"' : ''} onclick="LumiApp.claimReward(${r.id})">
                ${r.claimed ? 'تم الحصول عليها!' : canBuy ? 'استبدال النجوم الآن!' : 'اجمعي نجوم أكتر'}
              </button>
            </div>
          `;
        }).join('')}
      </div>
    `;
  },

  claimReward(id) {
    const state = LumiStorage.getState();
    const rew = state.settings.realRewards.find(r => r.id === id);
    if (rew && state.stars >= rew.cost && !rew.claimed) {
      state.stars -= rew.cost;
      rew.claimed = true;
      LumiStorage.saveState(state);
      this.updateTopStats();
      this.triggerConfetti();
      LumiAudio.sfxWin();
      this.openRewards();
    }
  },

  secretCheer() {
    LumiAudio.sfxWin();
    this.triggerConfetti();
    const pObj = LumiDictionary.psychology.find(p => p.id === 'praise_2');
    LumiAudio.speak('praise_2', pObj.eg, pObj.fr);
  },

  startEyeCareTimer() {
    const startMs = Date.now();
    setInterval(() => {
      const state = LumiStorage.getState();
      const limitMs = (state.settings.sessionMinutes || 20) * 60 * 1000;
      const elapsed = Date.now() - startMs;

      if (elapsed >= limitMs - 120000 && !this.warnedSleep) {
        this.warnedSleep = true;
        const wObj = LumiDictionary.psychology.find(p => p.id === 'sleep_warning');
        LumiAudio.speak('sleep_warning', wObj.eg, wObj.fr);
      }
      if (elapsed >= limitMs) {
        const sObj = LumiDictionary.psychology.find(p => p.id === 'sleep_now');
        LumiAudio.speak('sleep_now', sObj.eg, sObj.fr);
        document.getElementById('sleep-modal').style.display = 'flex';
      }
    }, 15000);
  },

  triggerConfetti() {
    const colors = ['#FF6B6B', '#4ECDC4', '#FFD166', '#8338EC', '#FF9F1C'];
    for (let i = 0; i < 28; i++) {
      const c = document.createElement('div');
      c.className = 'confetti-piece';
      c.style.left = Math.random() * 100 + 'vw';
      c.style.background = colors[Math.floor(Math.random() * colors.length)];
      c.style.animationDuration = (Math.random() * 1.2 + 1.2) + 's';
      document.body.appendChild(c);
      setTimeout(() => c.remove(), 2500);
    }
  }
};

window.addEventListener('DOMContentLoaded', () => LumiApp.init());
