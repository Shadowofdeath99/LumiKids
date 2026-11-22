const LumiCloud = {
  _syncTimer: null,
  _isSyncing: false,

  getConfig() {
    const base = {
      url: 'https://vokcnhuypwleqsrmyuof.supabase.co',
      key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZva2NuaHV5cHdsZXFzcm15dW9mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTUzNzU2OTIsImV4cCI6MjExMDk1MTY5Mn0.p7fee4EzK3faIE03cBArJ7D3tAOIC_b0tQGwSaxh7XI',
      familyId: 'mina_family_lumikids',
      autoSync: true,
      lastSync: null
    };
    try {
      const raw = localStorage.getItem('LumiKids_CloudConfig');
      if (!raw) return base;
      const parsed = JSON.parse(raw);
      return { ...base, ...parsed, url: parsed.url || base.url, key: parsed.key || base.key };
    } catch (e) {
      return base;
    }
  },

  saveConfig(cfg) {
    localStorage.setItem('LumiKids_CloudConfig', JSON.stringify(cfg));
  },

  isConfigured() {
    const c = this.getConfig();
    return !!(c.url && c.key && c.familyId);
  },

  scheduleAutoPush() {
    const c = this.getConfig();
    if (!c.autoSync || !this.isConfigured()) return;
    clearTimeout(this._syncTimer);
    this._syncTimer = setTimeout(() => this.pushToCloud(true), 2500);
  },

  async pushToCloud(silent = false) {
    const c = this.getConfig();
    if (!this.isConfigured() || this._isSyncing) return false;
    this._isSyncing = true;
    this.updateBadge('⏳ جاري الرفع للسحابة...');
    try {
      const backupData = await LumiStorage.exportFullBackup();
      const endpoint = `${c.url.replace(/\/$/, '')}/rest/v1/lumikids_sync?on_conflict=family_id`;
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'apikey': c.key,
          'Authorization': `Bearer ${c.key}`,
          'Content-Type': 'application/json',
          'Prefer': 'resolution=merge-duplicates'
        },
        body: JSON.stringify({
          family_id: c.familyId.trim(),
          payload: backupData,
          updated_at: new Date().toISOString()
        })
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      c.lastSync = new Date().toLocaleString('ar-EG');
      this.saveConfig(c);
      this.updateBadge(`☁️ محفوظ سحابياً (${c.lastSync})`);
      if (!silent) {
        if (typeof LumiAudio !== 'undefined') LumiAudio.sfxSuccess();
        alert('✅ تم حفظ جميع بيانات هيفن وهيلن في السحابة بنجاح!');
      }
      return true;
    } catch (e) {
      this.updateBadge('⚠️ وضع أوفلاين (محفوظ محلياً)');
      if (!silent) alert('❌ خطأ أثناء المزامنة:\n' + e.message);
      return false;
    } finally {
      this._isSyncing = false;
    }
  },

  async pullFromCloud(silent = false) {
    const c = this.getConfig();
    if (!this.isConfigured()) return false;
    try {
      const endpoint = `${c.url.replace(/\/$/, '')}/rest/v1/lumikids_sync?family_id=eq.${encodeURIComponent(c.familyId.trim())}&select=payload,updated_at`;
      const res = await fetch(endpoint, {
        headers: { 'apikey': c.key, 'Authorization': `Bearer ${c.key}` }
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const rows = await res.json();
      if (!rows || !rows.length || !rows[0].payload) return false;
      await LumiStorage.importFullBackup(rows[0].payload);
      c.lastSync = new Date().toLocaleString('ar-EG');
      this.saveConfig(c);
      if (typeof LumiApp !== 'undefined' && LumiApp.updateTopStats) LumiApp.updateTopStats();
      this.updateBadge(`☁️ متزامن (${c.lastSync})`);
      if (!silent) alert('✅ تم جلب ومزامنة أحدث البيانات من السحابة!');
      return true;
    } catch (e) {
      if (!silent) alert('❌ تعذر الجلب من السحابة:\n' + e.message);
      return false;
    }
  },

  updateBadge(text) {
    const el = document.getElementById('cloud-sync-status');
    if (el) el.innerText = text;
  }
};
window.LumiCloud = LumiCloud;
