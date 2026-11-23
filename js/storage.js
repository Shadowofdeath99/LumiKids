const LumiStorage = {
  DB_NAME: 'LumiKids_VoiceDB',
  STORE_NAME: 'recordings',

  getDefaultProfiles() {
    return [
      { id: 'heaven', name: 'هيفن', age: 10, avatar: '👸', theme: 'purple' },
      { id: 'helen', name: 'هيلن', age: 3, avatar: '🦄', theme: 'pink' }
    ];
  },

  getProfiles() {
    try {
      const raw = localStorage.getItem('LumiKids_Profiles');
      if (raw) {
        const list = JSON.parse(raw);
        if (Array.isArray(list) && list.length > 0) return list;
      }
    } catch (e) {}
    const defs = this.getDefaultProfiles();
    localStorage.setItem('LumiKids_Profiles', JSON.stringify(defs));
    return defs;
  },

  saveProfiles(profiles) {
    localStorage.setItem('LumiKids_Profiles', JSON.stringify(profiles));
    if (typeof LumiCloud !== 'undefined') LumiCloud.scheduleAutoPush();
  },

  getActiveProfileId() {
    return localStorage.getItem('LumiKids_ActiveProfile') || this.getProfiles()[0].id;
  },

  setActiveProfile(id) {
    localStorage.setItem('LumiKids_ActiveProfile', id);
  },

  getActiveProfile() {
    const id = this.getActiveProfileId();
    const profs = this.getProfiles();
    return profs.find(p => p.id === id) || profs[0];
  },

  getWelcomeMessagesFor(profileId) {
    const today = new Date().toLocaleDateString('ar-EG');
    if (profileId === 'heaven') {
      return [{
        id: 'baba_mina_heaven_v25',
        from: 'بابا مينا ❤️',
        text: 'إلى أميرتي الكبيرة وبطلتي الذكية هيفن (10 سنوات) 👸✨.. فخور بيكِ وبشطارتك! جربي تحديات الأبطال +10، وسجلي الكلمات والقصص بصوتك الحلو في وضع المعلمة الصغيرة لأختك هيلن! بحبك قد الدنيا ❤️',
        date: today,
        read: false
      }];
    }
    return [{
      id: 'baba_mina_helen_v25',
      from: 'بابا مينا ❤️',
      text: 'إلى بنوتي الجميلة وسكرة البيت هيلن (3 سنوات) 🦄🎈.. أهلاً بيكِ في عالم LumiKids! العبي واتعلمي الحروف والألوان واسمعي القصص بصوت أختك هيفن! بحبك يا لولو ❤️',
      date: today,
      read: false
    }];
  },

  getDefaultState(profileId = 'helen') {
    const gamesList = (typeof LumiDictionary !== 'undefined' && Array.isArray(LumiDictionary.games))
      ? LumiDictionary.games
      : [];
    const progress = {};
    gamesList.forEach(g => {
      progress[g.id] = { level: 1, correct: 0, wrong: 0, completed: 0, stars: 0 };
    });

    return {
      stars: 15,
      stickers: ['🌟', '🎈', '🦄'],
      progress,
      cognitive: {
        memory: 10,
        logic: 10,
        french: 10,
        visual: 10,
        motor: 10,
        mistakeLog: {}
      },
      sessions: [],
      history: [],
      dailyHabitsDone: [],
      mailbox: this.getWelcomeMessagesFor(profileId),
      settings: {
        soundEnabled: true,
        darkMode: false,
        sessionMinutes: 20,
        bedtimeEnabled: false,
        bedtimeStart: '21:30',
        bedtimeEnd: '07:00',
        parentPin: '1234',
        lockedGames: [],
        realRewards: [
          { id: 1, title: 'قصة إضافية قبل النوم 📖', cost: 15, claimed: false },
          { id: 2, title: 'اختيار أكلة العشاء المفضلة 🍕', cost: 30, claimed: false },
          { id: 3, title: 'نزهة حلوة مع بابا وماما 🎡', cost: 50, claimed: false },
          { id: 4, title: 'هدية مفاجأة من بابا مينا 🎁', cost: 80, claimed: false }
        ]
      }
    };
  },

  getState(profileId = null) {
    const id = profileId || this.getActiveProfileId();
    const def = this.getDefaultState(id);
    try {
      const raw = localStorage.getItem(`LumiKids_State_${id}`);
      if (raw) {
        const parsed = JSON.parse(raw);
        const existingMail = Array.isArray(parsed.mailbox) ? parsed.mailbox : [];
        const targetId = id === 'heaven' ? 'baba_mina_heaven_v25' : 'baba_mina_helen_v25';
        if (!existingMail.some(m => m.id === targetId)) {
          existingMail.unshift(...this.getWelcomeMessagesFor(id));
        }
        const safeCog = { ...def.cognitive, ...(parsed.cognitive || {}) };
        ['memory', 'logic', 'french', 'visual', 'motor'].forEach(k => {
          if (typeof safeCog[k] !== 'number' || isNaN(safeCog[k])) safeCog[k] = 10;
        });
        if (!safeCog.mistakeLog || typeof safeCog.mistakeLog !== 'object') safeCog.mistakeLog = {};

        const safeSettings = { ...def.settings, ...(parsed.settings || {}) };
        if (!Array.isArray(safeSettings.realRewards) || safeSettings.realRewards.length === 0) {
          safeSettings.realRewards = def.settings.realRewards;
        }
        if (!Array.isArray(safeSettings.lockedGames)) safeSettings.lockedGames = [];

        return {
          ...def,
          ...parsed,
          progress: { ...def.progress, ...(parsed.progress || {}) },
          cognitive: safeCog,
          sessions: Array.isArray(parsed.sessions) ? parsed.sessions : [],
          history: Array.isArray(parsed.history) ? parsed.history : [],
          dailyHabitsDone: Array.isArray(parsed.dailyHabitsDone) ? parsed.dailyHabitsDone : [],
          mailbox: existingMail,
          settings: safeSettings
        };
      }
    } catch (e) {}
    localStorage.setItem(`LumiKids_State_${id}`, JSON.stringify(def));
    return def;
  },

  saveState(state, profileId = null) {
    const id = profileId || this.getActiveProfileId();
    localStorage.setItem(`LumiKids_State_${id}`, JSON.stringify(state));
    if (typeof LumiCloud !== 'undefined') LumiCloud.scheduleAutoPush();
  },

  getMailbox(profileId = null) {
    return this.getState(profileId).mailbox || [];
  },

  markAllMailRead(profileId = null) {
    const st = this.getState(profileId);
    (st.mailbox || []).forEach(m => m.read = true);
    this.saveState(st, profileId);
  },

  logSession(sessionObj, profileId = null) {
    try {
      const id = profileId || this.getActiveProfileId();
      const s = this.getState(id);
      s.sessions = Array.isArray(s.sessions) ? s.sessions : [];
      s.sessions.unshift(sessionObj);
      if (s.sessions.length > 100) s.sessions = s.sessions.slice(0, 100);
      this.saveState(s, id);
    } catch (e) {}
  },

  addStars(count, gameName = 'نشاط تعليمي', level = 1) {
    const st = this.getState();
    st.stars = (st.stars || 0) + count;
    st.history.unshift({ game: gameName, level, stars: count, date: new Date().toLocaleString('ar-EG') });
    this.saveState(st);
    return st.stars;
  },

  openDB() {
    return new Promise((resolve, reject) => {
      if (!window.indexedDB) return reject('No IndexedDB');
      const req = indexedDB.open(this.DB_NAME, 1);
      req.onupgradeneeded = e => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(this.STORE_NAME)) db.createObjectStore(this.STORE_NAME);
      };
      req.onsuccess = e => resolve(e.target.result);
      req.onerror = e => reject(e.target.error);
    });
  },

  async saveVoiceNote(key, dataUrl) {
    try {
      const db = await this.openDB();
      await new Promise((resolve, reject) => {
        const tx = db.transaction(this.STORE_NAME, 'readwrite');
        tx.objectStore(this.STORE_NAME).put(dataUrl, key);
        tx.oncomplete = () => resolve();
        tx.onerror = e => reject(e.target.error);
      });
    } catch (e) {
      try { localStorage.setItem('LumiRec_' + key, dataUrl); } catch (err) {}
    }
    if (typeof LumiCloud !== 'undefined') LumiCloud.scheduleAutoPush();
  },

  async getVoiceNote(key) {
    try {
      const db = await this.openDB();
      const val = await new Promise((resolve, reject) => {
        const tx = db.transaction(this.STORE_NAME, 'readonly');
        const req = tx.objectStore(this.STORE_NAME).get(key);
        req.onsuccess = () => resolve(req.result || null);
        req.onerror = e => reject(e.target.error);
      });
      if (val) return val;
    } catch (e) {}
    try { return localStorage.getItem('LumiRec_' + key); } catch (e) { return null; }
  },

  async getRecording(key) { return await this.getVoiceNote(key); },
  async saveRecording(key, dataUrl) { return await this.saveVoiceNote(key, dataUrl); },

  async getAllVoiceNotes() {
    const out = {};
    try {
      const db = await this.openDB();
      await new Promise((resolve) => {
        const tx = db.transaction(this.STORE_NAME, 'readonly');
        const store = tx.objectStore(this.STORE_NAME);
        const req = store.openCursor();
        req.onsuccess = e => {
          const cursor = e.target.result;
          if (cursor) { out[cursor.key] = cursor.value; cursor.continue(); }
          else resolve();
        };
        req.onerror = () => resolve();
      });
    } catch (e) {}
    return out;
  },

  async exportFullBackup() {
    const profiles = this.getProfiles();
    const states = {};
    profiles.forEach(p => { states[p.id] = this.getState(p.id); });
    const voiceNotes = await this.getAllVoiceNotes();
    return {
      version: '2.5',
      exportedAt: new Date().toISOString(),
      profiles,
      states,
      familyRewards: (typeof LumiRewards !== 'undefined') ? LumiRewards.getFamilyData() : null,
      teacherWords: JSON.parse(localStorage.getItem('LumiKids_TeacherWords') || '[]'),
      voiceNotes
    };
  },

  async importFullBackup(backup) {
    if (!backup) return;
    if (backup.profiles) this.saveProfiles(backup.profiles);
    if (backup.states) {
      Object.keys(backup.states).forEach(pid => {
        localStorage.setItem(`LumiKids_State_${pid}`, JSON.stringify(backup.states[pid]));
      });
    }
    if (backup.familyRewards) localStorage.setItem('LumiKids_FamilyRewards', JSON.stringify(backup.familyRewards));
    if (backup.teacherWords) localStorage.setItem('LumiKids_TeacherWords', JSON.stringify(backup.teacherWords));
    if (backup.voiceNotes) {
      for (const [k, v] of Object.entries(backup.voiceNotes)) await this.saveVoiceNote(k, v);
    }
  }
};
window.LumiStorage = LumiStorage;


// === PATCH: Ensure all required LumiStorage methods exist ===
(function() {
  if (typeof LumiStorage === 'undefined') return;
  if (typeof LumiStorage.initDB !== 'function') {
    LumiStorage.initDB = async function() { return true; };
  }
  if (typeof LumiStorage.recordAttempt !== 'function') {
    LumiStorage.recordAttempt = function(gameId, domain, isCorrect, elapsed, itemKey) {
      try {
        const state = typeof this.getState === 'function' ? this.getState() : { progress: {}, stars: 0 };
        state.progress = state.progress || {};
        if (!state.progress[gameId]) state.progress[gameId] = { level: 1, completed: 0, stars: 0 };
        if (isCorrect) {
          state.stars = (state.stars || 0) + 1;
          state.progress[gameId].stars = (state.progress[gameId].stars || 0) + 1;
        }
        if (typeof this.saveState === 'function') this.saveState(state);
      } catch (e) {}
      return true;
    };
  }
  if (typeof LumiStorage.markAdventureStationDone !== 'function') {
    LumiStorage.markAdventureStationDone = function() { return true; };
  }
  if (typeof LumiStorage.unlockRandomSticker !== 'function') {
    LumiStorage.unlockRandomSticker = function() { return null; };
  }
  if (typeof LumiStorage.getState === 'function') {
    const origGetState = LumiStorage.getState.bind(LumiStorage);
    LumiStorage.getState = function() {
      const s = origGetState() || {};
      s.progress = s.progress || {};
      if (typeof LumiDictionary !== 'undefined' && Array.isArray(LumiDictionary.games)) {
        LumiDictionary.games.forEach(g => {
          if (!s.progress[g.id]) s.progress[g.id] = { level: 1, completed: 0, stars: 0 };
        });
      }
      return s;
    };
  }
})();
