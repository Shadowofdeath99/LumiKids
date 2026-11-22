const LumiStorage = {
  dbName: 'LumiKidsVoiceDB',
  dbVersion: 1,
  db: null,

  initDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);
      request.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains('voices')) {
          db.createObjectStore('voices', { keyPath: 'id' });
        }
      };
      request.onsuccess = (e) => {
        this.db = e.target.result;
        resolve(this.db);
      };
      request.onerror = (e) => reject(e);
    });
  },

  saveVoice(id, parent, audioBlob) {
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction('voices', 'readwrite');
      const store = tx.objectStore('voices');
      store.put({ id: `${parent}_${id}`, key: id, parent, blob: audioBlob, date: Date.now() });
      tx.oncomplete = () => resolve(true);
      tx.onerror = (e) => reject(e);
    });
  },

  getVoice(id, preferredParent = 'auto') {
    return new Promise((resolve) => {
      if (!this.db) return resolve(null);
      const tx = this.db.transaction('voices', 'readonly');
      const store = tx.objectStore('voices');
      const keysToTry = preferredParent === 'auto' 
        ? (Math.random() > 0.5 ? [`mom_${id}`, `dad_${id}`] : [`dad_${id}`, `mom_${id}`])
        : [`${preferredParent}_${id}`, `mom_${id}`, `dad_${id}`];

      let index = 0;
      const tryNext = () => {
        if (index >= keysToTry.length) return resolve(null);
        const req = store.get(keysToTry[index++]);
        req.onsuccess = () => {
          if (req.result && req.result.blob) resolve(req.result.blob);
          else tryNext();
        };
        req.onerror = () => tryNext();
      };
      tryNext();
    });
  },

  getAllVoicesList() {
    return new Promise((resolve) => {
      if (!this.db) return resolve([]);
      const tx = this.db.transaction('voices', 'readonly');
      const req = tx.objectStore('voices').getAllKeys();
      req.onsuccess = () => resolve(req.result || []);
    });
  },

  // حالة صفرية نقية بدون أي أرقام افتراضية

  getProfilesMeta() {
    const raw = localStorage.getItem('LumiKids_Profiles_Meta');
    if (!raw) {
      const def = {
        activeId: 'p1',
        list: [
          { id: 'p1', name: 'هيفن', avatar: '👸' },
          { id: 'p2', name: 'هيلن', avatar: '🦄' }
        ]
      };
      localStorage.setItem('LumiKids_Profiles_Meta', JSON.stringify(def));
      return def;
    }
    return JSON.parse(raw);
  },

  saveProfilesMeta(meta) {
    localStorage.setItem('LumiKids_Profiles_Meta', JSON.stringify(meta));
  },

  getActiveProfile() {
    const meta = this.getProfilesMeta();
    return meta.list.find(p => p.id === meta.activeId) || meta.list[0];
  },

  switchProfile(profileId) {
    const meta = this.getProfilesMeta();
    if (meta.list.some(p => p.id === profileId)) {
      meta.activeId = profileId;
      this.saveProfilesMeta(meta);
    }
  },

  addProfile(name, avatar = '🧚‍♀️') {
    const meta = this.getProfilesMeta();
    const id = 'p_' + Date.now();
    meta.list.push({ id, name: name.trim() || 'بطلة جديدة', avatar });
    meta.activeId = id;
    this.saveProfilesMeta(meta);
    return id;
  },

  deleteProfile(profileId) {
    const meta = this.getProfilesMeta();
    if (meta.list.length <= 1) return false;
    meta.list = meta.list.filter(p => p.id !== profileId);
    if (meta.activeId === profileId) meta.activeId = meta.list[0].id;
    this.saveProfilesMeta(meta);
    localStorage.removeItem(`LumiKids_State_${profileId}`);
    return true;
  },

  _stateKey() {
    const meta = this.getProfilesMeta();
    return `LumiKids_State_${meta.activeId}`;
  },


  getProfilesMeta() {
    const raw = localStorage.getItem('LumiKids_Profiles_Meta');
    if (!raw) {
      const def = {
        activeId: 'p1',
        list: [
          { id: 'p1', name: 'هيفن', avatar: '👸' },
          { id: 'p2', name: 'هيلن', avatar: '🦄' }
        ]
      };
      localStorage.setItem('LumiKids_Profiles_Meta', JSON.stringify(def));
      return def;
    }
    return JSON.parse(raw);
  },

  saveProfilesMeta(meta) {
    localStorage.setItem('LumiKids_Profiles_Meta', JSON.stringify(meta));
  },

  getActiveProfile() {
    const meta = this.getProfilesMeta();
    return meta.list.find(p => p.id === meta.activeId) || meta.list[0];
  },

  switchProfile(profileId) {
    const meta = this.getProfilesMeta();
    if (meta.list.some(p => p.id === profileId)) {
      meta.activeId = profileId;
      this.saveProfilesMeta(meta);
    }
  },

  addProfile(name, avatar = '🧚‍♀️') {
    const meta = this.getProfilesMeta();
    const id = 'p_' + Date.now();
    meta.list.push({ id, name: name.trim() || 'بطلة جديدة', avatar });
    meta.activeId = id;
    this.saveProfilesMeta(meta);
    return id;
  },

  deleteProfile(profileId) {
    const meta = this.getProfilesMeta();
    if (meta.list.length <= 1) return false;
    meta.list = meta.list.filter(p => p.id !== profileId);
    if (meta.activeId === profileId) meta.activeId = meta.list[0].id;
    this.saveProfilesMeta(meta);
    localStorage.removeItem(`LumiKids_State_${profileId}`);
    return true;
  },

  _stateKey() {
    const meta = this.getProfilesMeta();
    return `LumiKids_State_${meta.activeId}`;
  },

  getEmptyState() {
    return {
      childName: "بطلتي الجميلة",
      stars: 0,
      sessions: [],
      stickers: [],
      settings: {
        brightness: 100,
        theme: 'pastel',
        animSpeed: 1,
        langMode: 'both',
        preferredParent: 'auto',
        sessionMinutes: 20,
        lockedGames: [],
        realRewards: [
          { id: 1, title: "اختيار قصة قبل النوم 📖", cost: 20, claimed: false },
          { id: 2, title: "نزهة حلوة في النادي أو البحر 🌊", cost: 50, claimed: false },
          { id: 3, title: "مفاجأة لذيذة من اختيارك 🍦", cost: 35, claimed: false }
        ]
      },
      progress: {},
      cognitive: {
        memory: 0,
        logic: 0,
        french: 0,
        visual: 0,
        motor: 0,
        mistakeLog: {}
      }
    };
  },

  getState() {
    const saved = localStorage.getItem('LumiKids_State_v2');
    if (!saved) {
      const fresh = this.getEmptyState();
      this.saveState(fresh);
      return fresh;
    }
    return { ...this.getEmptyState(), ...JSON.parse(saved) };
  },

  saveState(state) {
    localStorage.setItem('LumiKids_State_v2', JSON.stringify(state));
  },





  getMailbox(profileId) {
    const id = profileId || this.getProfilesMeta().activeId;
    const raw = localStorage.getItem(`LumiKids_Mailbox_${id}`);
    return raw ? JSON.parse(raw) : [];
  },

  saveMailbox(profileId, list) {
    localStorage.setItem(`LumiKids_Mailbox_${profileId}`, JSON.stringify(list));
  },

  sendGiftMessage(toProfileId, stickerId, audioDataUrl, noteText) {
    const fromProf = this.getActiveProfile();
    const list = this.getMailbox(toProfileId);
    list.unshift({
      id: 'msg_' + Date.now(),
      fromId: fromProf.id,
      fromName: fromProf.name,
      fromAvatar: fromProf.avatar,
      stickerId: stickerId || null,
      audioData: audioDataUrl || null,
      note: noteText || 'هدية وتشجيع جميل ليكي! 💖',
      date: new Date().toLocaleString('ar-EG', { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' }),
      read: false
    });
    this.saveMailbox(toProfileId, list);
  },

  markMailboxRead(profileId) {
    const id = profileId || this.getProfilesMeta().activeId;
    const list = this.getMailbox(id).map(m => ({ ...m, read: true }));
    this.saveMailbox(id, list);
  },

  getDailyAdventure() {
    const state = this.getState();
    const today = new Date().toISOString().slice(0, 10);
    if (state.dailyAdventure && state.dailyAdventure.date === today) {
      return state.dailyAdventure;
    }

    // ترتيب المحاور الذهنية من الأقل نسبة (نقاط الضعف) إلى الأعلى لاختيار ألعاب مقوية لها
    const cog = state.cognitive || { memory: 0, logic: 0, french: 0, visual: 0, motor: 0 };
    const sortedDomains = Object.entries(cog)
      .filter(([k]) => ['memory', 'logic', 'french', 'visual', 'motor'].includes(k))
      .sort((a, b) => a[1] - b[1])
      .map(([k]) => k);

    const locked = state.settings.lockedGames || [];
    const availableGames = LumiDictionary.games.filter(g => !locked.includes(g.id));
    const chosenIds = [];

    for (const dom of sortedDomains) {
      if (chosenIds.length >= 4) break;
      const candidates = availableGames.filter(g => g.domain === dom && !chosenIds.includes(g.id));
      if (candidates.length > 0) {
        const pick = candidates[Math.floor(Math.random() * candidates.length)];
        chosenIds.push(pick.id);
      }
    }

    while (chosenIds.length < 4 && availableGames.length > chosenIds.length) {
      const rem = availableGames.filter(g => !chosenIds.includes(g.id));
      chosenIds.push(rem[Math.floor(Math.random() * rem.length)].id);
    }

    state.dailyAdventure = {
      date: today,
      stations: chosenIds.map(id => ({ gameId: id, done: false })),
      chestClaimed: false
    };
    this.saveState(state);
    return state.dailyAdventure;
  },

  markAdventureStationDone(gameId) {
    const adv = this.getDailyAdventure();
    const st = adv.stations.find(s => s.gameId === gameId && !s.done);
    if (st) {
      st.done = true;
      const state = this.getState();
      state.dailyAdventure = adv;
      this.saveState(state);
    }
  },

  unlockRandomSticker() {
    const state = this.getState();
    if (!state.stickers) state.stickers = [];
    const locked = LumiDictionary.stickers.filter(s => !state.stickers.includes(s.id));
    if (locked.length === 0) return null;
    const chosen = locked[Math.floor(Math.random() * locked.length)];
    state.stickers.push(chosen.id);
    this.saveState(state);
    return chosen;
  },




  getMailbox(profileId) {
    const id = profileId || this.getProfilesMeta().activeId;
    const raw = localStorage.getItem(`LumiKids_Mailbox_${id}`);
    return raw ? JSON.parse(raw) : [];
  },

  saveMailbox(profileId, list) {
    localStorage.setItem(`LumiKids_Mailbox_${profileId}`, JSON.stringify(list));
  },

  sendGiftMessage(toProfileId, stickerId, audioDataUrl, noteText) {
    const fromProf = this.getActiveProfile();
    const list = this.getMailbox(toProfileId);
    list.unshift({
      id: 'msg_' + Date.now(),
      fromId: fromProf.id,
      fromName: fromProf.name,
      fromAvatar: fromProf.avatar,
      stickerId: stickerId || null,
      audioData: audioDataUrl || null,
      note: noteText || 'هدية وتشجيع جميل ليكي! 💖',
      date: new Date().toLocaleString('ar-EG', { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' }),
      read: false
    });
    this.saveMailbox(toProfileId, list);
  },

  markMailboxRead(profileId) {
    const id = profileId || this.getProfilesMeta().activeId;
    const list = this.getMailbox(id).map(m => ({ ...m, read: true }));
    this.saveMailbox(id, list);
  },

  getDailyAdventure() {
    const state = this.getState();
    const today = new Date().toISOString().slice(0, 10);
    if (state.dailyAdventure && state.dailyAdventure.date === today) {
      return state.dailyAdventure;
    }

    // ترتيب المحاور الذهنية من الأقل نسبة (نقاط الضعف) إلى الأعلى لاختيار ألعاب مقوية لها
    const cog = state.cognitive || { memory: 0, logic: 0, french: 0, visual: 0, motor: 0 };
    const sortedDomains = Object.entries(cog)
      .filter(([k]) => ['memory', 'logic', 'french', 'visual', 'motor'].includes(k))
      .sort((a, b) => a[1] - b[1])
      .map(([k]) => k);

    const locked = state.settings.lockedGames || [];
    const availableGames = LumiDictionary.games.filter(g => !locked.includes(g.id));
    const chosenIds = [];

    for (const dom of sortedDomains) {
      if (chosenIds.length >= 4) break;
      const candidates = availableGames.filter(g => g.domain === dom && !chosenIds.includes(g.id));
      if (candidates.length > 0) {
        const pick = candidates[Math.floor(Math.random() * candidates.length)];
        chosenIds.push(pick.id);
      }
    }

    while (chosenIds.length < 4 && availableGames.length > chosenIds.length) {
      const rem = availableGames.filter(g => !chosenIds.includes(g.id));
      chosenIds.push(rem[Math.floor(Math.random() * rem.length)].id);
    }

    state.dailyAdventure = {
      date: today,
      stations: chosenIds.map(id => ({ gameId: id, done: false })),
      chestClaimed: false
    };
    this.saveState(state);
    return state.dailyAdventure;
  },

  markAdventureStationDone(gameId) {
    const adv = this.getDailyAdventure();
    const st = adv.stations.find(s => s.gameId === gameId && !s.done);
    if (st) {
      st.done = true;
      const state = this.getState();
      state.dailyAdventure = adv;
      this.saveState(state);
    }
  },

  unlockRandomSticker() {
    const state = this.getState();
    if (!state.stickers) state.stickers = [];
    const locked = LumiDictionary.stickers.filter(s => !state.stickers.includes(s.id));
    if (locked.length === 0) return null;
    const chosen = locked[Math.floor(Math.random() * locked.length)];
    state.stickers.push(chosen.id);
    this.saveState(state);
    return chosen;
  },

  // تسجيل جلسة لعب تفصيلية بالتاريخ والوقت والمدة
  logSession(sessionObj) {
    const state = this.getState();
    if (!state.sessions) state.sessions = [];
    state.sessions.unshift(sessionObj);
    if (state.sessions.length > 100) state.sessions = state.sessions.slice(0, 100);
    this.saveState(state);
  },

  // حساب الأداء والقدرات بناءً على المحاولات الحقيقية فقط
  recordAttempt(gameId, domain, isCorrect, responseTimeMs, itemKey = null) {
    const state = this.getState();
    if (!state.progress[gameId]) {
      state.progress[gameId] = { level: 1, completed: 0, correct: 0, wrong: 0, totalTime: 0 };
    }
    const p = state.progress[gameId];
    if (isCorrect) {
      p.correct++;
      state.stars += 1;
    } else {
      p.wrong++;
      if (itemKey) {
        state.cognitive.mistakeLog[itemKey] = (state.cognitive.mistakeLog[itemKey] || 0) + 1;
      }
    }
    p.totalTime += responseTimeMs;

    // إعادة احتساب نسبة كل محور ذهني من المحاولات الفعلية لألعاب هذا المحور
    const domainGames = LumiDictionary.games.filter(g => g.domain === domain).map(g => g.id);
    let dCorrect = 0, dWrong = 0, dLevels = 0;
    domainGames.forEach(gid => {
      const gp = state.progress[gid];
      if (gp) {
        dCorrect += gp.correct;
        dWrong += gp.wrong;
        dLevels += (gp.level - 1);
      }
    });
    const dTotal = dCorrect + dWrong;
    if (dTotal > 0) {
      const accRatio = dCorrect / dTotal;
      const lvlBonus = Math.min(20, dLevels * 2);
      state.cognitive[domain] = Math.min(100, Math.round((accRatio * 80) + lvlBonus));
    } else {
      state.cognitive[domain] = 0;
    }

    this.saveState(state);
    return state;
  },

  // تصفير كل الإحصائيات والتقدم والإعدادات (مع خيار الإبقاء على الأصوات أو مسحها)

  async,
exportFullBackup() {
    const lsData = {};
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith('LumiKids_')) {
        lsData[k] = localStorage.getItem(k);
      }
    }
    let audioRecords = [];
    if (this.db) {
      audioRecords = await new Promise((resolve) => {
        try {
          const tx = this.db.transaction('recordings', 'readonly');
          const req = tx.objectStore('recordings').getAll();
          req.onsuccess = () => resolve(req.result || []);
          req.onerror = () => resolve([]);
        } catch (e) { resolve([]); }
      });
    }
    return {
      app: 'LumiKids',
      version: '2.5',
      exportedAt: new Date().toISOString(),
      localStorage: lsData,
      recordings: audioRecords
    };
  },

  async importFullBackup(backupObj) {
    if (!backupObj || backupObj.app !== 'LumiKids' || !backupObj.localStorage) {
      throw new Error('ملف النسخة الاحتياطية غير صالح أو تالف.');
    }
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const k = localStorage.key(i);
      if (k && k.startsWith('LumiKids_')) localStorage.removeItem(k);
    }
    Object.entries(backupObj.localStorage).forEach(([k, v]) => {
      localStorage.setItem(k, v);
    });
    if (this.db && Array.isArray(backupObj.recordings)) {
      await new Promise((resolve) => {
        const tx = this.db.transaction('recordings', 'readwrite');
        const store = tx.objectStore('recordings');
        store.clear();
        backupObj.recordings.forEach(item => store.put(item));
        tx.oncomplete = () => resolve();
        tx.onerror = () => resolve();
      });
    }
  },

  async hardReset(deleteVoices = false) {
    const fresh = this.getEmptyState();
    this.saveState(fresh);
    if (deleteVoices && this.db) {
      await new Promise((resolve) => {
        const tx = this.db.transaction('voices', 'readwrite');
        tx.objectStore('voices').clear();
        tx.oncomplete = resolve;
      });
    }
    return fresh;
  },

  async exportBackup() {
    const state = this.getState();
    const tx = this.db.transaction('voices', 'readonly');
    const req = tx.objectStore('voices').getAll();
    return new Promise((resolve) => {
      req.onsuccess = async () => {
        const records = req.result || [];
        const serializedVoices = [];
        for (const rec of records) {
          const base64 = await new Promise((res) => {
            const reader = new FileReader();
            reader.onloadend = () => res(reader.result);
            reader.readAsDataURL(rec.blob);
          });
          serializedVoices.push({ id: rec.id, key: rec.key, parent: rec.parent, data: base64 });
        }
        resolve(JSON.stringify({ version: 2, state, voices: serializedVoices }));
      };
    });
  },

  async importBackup(jsonString) {
    const parsed = JSON.parse(jsonString);
    if (parsed.state) this.saveState(parsed.state);
    if (parsed.voices && Array.isArray(parsed.voices)) {
      for (const v of parsed.voices) {
        const res = await fetch(v.data);
        const blob = await res.blob();
        await this.saveVoice(v.key, v.parent, blob);
      }
    }
  },
  async getRecording(key) {
    if (typeof this.getVoiceNote === 'function') return await this.getVoiceNote(key);
    try { return localStorage.getItem('LumiRec_' + key); } catch (e) { return null; }
  },
  async saveRecording(key, dataUrl) {
    if (typeof this.saveVoiceNote === 'function') return await this.saveVoiceNote(key, dataUrl);
    try { localStorage.setItem('LumiRec_' + key, dataUrl); } catch (e) {}
  }
};
