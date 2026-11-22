function createSafeProxy(obj) {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return obj;
  return new Proxy(obj, {
    get(target, prop) {
      if (prop in target) {
        const val = target[prop];
        return (val && typeof val === 'object' && !Array.isArray(val)) ? createSafeProxy(val) : val;
      }
      if (typeof prop === 'symbol' || prop === 'then' || prop === 'toJSON') return undefined;
      return createSafeProxy({ level: 1, highScore: 0, plays: 0, score: 0 });
    }
  });
}

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

  getDefaultState() {
    const cogMap = {
      memory: { level: 1, highScore: 0, plays: 0, score: 0 },
      attention: { level: 1, highScore: 0, plays: 0, score: 0 },
      logic: { level: 1, highScore: 0, plays: 0, score: 0 },
      language: { level: 1, highScore: 0, plays: 0, score: 0 },
      math: { level: 1, highScore: 0, plays: 0, score: 0 },
      creativity: { level: 1, highScore: 0, plays: 0, score: 0 }
    };
    return {
      stars: 10,
      stickers: ['🌟', '🎈'],
      cog: cogMap,
      progress: cogMap,
      history: [],
      dailyHabitsDone: [],
      sessions: [],
      mailbox: [
        {
          id: 'welcome_msg',
          from: 'بابا مينا ❤️',
          text: 'أهلاً يا أجمل بنات في الدنيا! استمتعوا باللعب والتعلم.',
          date: new Date().toLocaleDateString('ar-EG'),
          read: false
        }
      ],
      settings: {
        soundEnabled: true,
        darkMode: false,
        bedtimeEnabled: false,
        bedtimeStart: '21:30',
        bedtimeEnd: '07:00',
        parentPin: '1234',
        lockedGames: []
      }
    };
  },

  getState(profileId = null) {
    const id = profileId || this.getActiveProfileId();
    const def = this.getDefaultState();
    try {
      const raw = localStorage.getItem(`LumiKids_State_${id}`);
      if (raw) {
        const parsed = JSON.parse(raw);
        const merged = {
          ...def,
          ...parsed,
          cog: { ...def.cog, ...(parsed.cog || {}) },
          progress: { ...def.progress, ...(parsed.progress || {}) },
          settings: { ...def.settings, ...(parsed.settings || {}) }
        };
        return createSafeProxy(merged);
      }
    } catch (e) {}
    localStorage.setItem(`LumiKids_State_${id}`, JSON.stringify(def));
    return createSafeProxy(def);
  },

  saveState(state, profileId = null) {
    const id = profileId || this.getActiveProfileId();
    localStorage.setItem(`LumiKids_State_${id}`, JSON.stringify(state));
    if (typeof LumiCloud !== 'undefined') LumiCloud.scheduleAutoPush();
  },

  addStars(count, gameName = 'نشاط تعليمي', level = 1) {
    const st = this.getState();
    st.stars = (st.stars || 0) + count;
    st.history = st.history || [];
    st.history.unshift({
      game: gameName,
      level: level,
      stars: count,
      date: new Date().toLocaleString('ar-EG')
    });
    this.saveState(st);
    return st.stars;
  },

  openDB() {
    return new Promise((resolve, reject) => {
      if (!window.indexedDB) return reject('No IndexedDB');
      const req = indexedDB.open(this.DB_NAME, 1);
      req.onupgradeneeded = e => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(this.STORE_NAME)) {
          db.createObjectStore(this.STORE_NAME);
        }
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
          if (cursor) {
            out[cursor.key] = cursor.value;
            cursor.continue();
          } else {
            resolve();
          }
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
    if (backup.familyRewards) {
      localStorage.setItem('LumiKids_FamilyRewards', JSON.stringify(backup.familyRewards));
    }
    if (backup.teacherWords) {
      localStorage.setItem('LumiKids_TeacherWords', JSON.stringify(backup.teacherWords));
    }
    if (backup.voiceNotes) {
      for (const [k, v] of Object.entries(backup.voiceNotes)) {
        await this.saveVoiceNote(k, v);
      }
    }
  }
};
window.LumiStorage = LumiStorage;
