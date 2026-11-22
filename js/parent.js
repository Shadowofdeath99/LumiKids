const LumiParent = {
  gateAnswer: 0,
  activeParentTab: 'dashboard',
  recordingParent: 'mom',
  currentlyRecordingId: null,

  openGate() {
    const a = Math.floor(Math.random() * 8) + 4;
    const b = Math.floor(Math.random() * 7) + 3;
    this.gateAnswer = a + b;
    document.getElementById('gate-question').innerText = `${a} + ${b} = ؟`;
    document.getElementById('gate-input').value = '';
    document.getElementById('parent-gate-modal').style.display = 'flex';
  },

  verifyGate() {
    const val = parseInt(document.getElementById('gate-input').value, 10);
    if (val === this.gateAnswer) {
      document.getElementById('parent-gate-modal').style.display = 'none';
      LumiApp.showView('parent-view');
      this.renderParentArea();
    } else {
      alert('إجابة غير صحيحة، حاول مرة أخرى!');
      this.openGate();
    }
  },

  switchTab(tab) {
    this.activeParentTab = tab;
    document.querySelectorAll('.p-tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelector(`[data-ptab="${tab}"]`).classList.add('active');
    this.renderParentArea();
  },

  renderParentArea() {
    const container = document.getElementById('parent-content');
    if (this.activeParentTab === 'dashboard') this.renderDashboard(container);
    else if (this.activeParentTab === 'studio') this.renderVoiceStudio(container);
    else if (this.activeParentTab === 'settings') this.renderSettings(container);
  },

  renderDashboard(container) {
    const state = LumiStorage.getState();
    const cog = state.cognitive;

    let totalCorrect = 0, totalWrong = 0, totalCompleted = 0;
    LumiDictionary.games.forEach(g => {
      const p = state.progress[g.id] || { level: 1, correct: 0, wrong: 0, completed: 0 };
      totalCorrect += p.correct;
      totalWrong += p.wrong;
      totalCompleted += (p.completed || 0);
    });

    const totalAttempts = totalCorrect + totalWrong;
    const accuracy = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0;
    const overallProgress = Math.min(100, Math.round((totalCompleted / (LumiDictionary.games.length * 20)) * 100));
    const domainAvg = (cog.memory + cog.logic + cog.french + cog.visual + cog.motor) / 5;
    const smartIQ = totalAttempts > 0 ? Math.round(75 + (domainAvg * 0.45) + (accuracy * 0.25)) : 0;

    const domains = [
      { key: 'memory', label: 'الذاكرة والتركيز', val: cog.memory, color: '#FF6B6B' },
      { key: 'logic', label: 'المنطق والحساب والبرمجة', val: cog.logic, color: '#FFD166' },
      { key: 'french', label: 'اللغة الفرنسية والتعبير', val: cog.french, color: '#1982C4' },
      { key: 'visual', label: 'الانتباه البصري والتناظر', val: cog.visual, color: '#4ECDC4' },
      { key: 'motor', label: 'التآزر الحركي والفني', val: cog.motor, color: '#FF9F1C' }
    ];
    const sorted = [...domains].sort((a, b) => b.val - a.val);
    const mistakes = Object.entries(cog.mistakeLog || {}).sort((a, b) => b[1] - a[1]).slice(0, 6);

    container.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; margin-bottom:18px; background:var(--surface); padding:16px 22px; border-radius:var(--radius); box-shadow:var(--shadow);">
        <div>
          <h3 style="margin:0;">📈 التقرير التربوي ومؤشرات الذكاء</h3>
          <small style="color:#64748B;">متابعة حية للأداء، المهارات الذهنية، وسجل الجلسات</small>
        </div>
        <button class="primary-btn" style="margin:0; background:#1982C4;" onclick="LumiParent.printDetailedReport()">🖨️ طباعة / تصدير تقرير PDF مفصل</button>
      </div>

      <div class="dash-cards-grid">
        <div class="stat-card highlight-iq">
          <div class="stat-label">🧠 مؤشر الذكاء والأداء العام (Smart Index)</div>
          <div class="stat-value">${smartIQ} <small>نقطة</small></div>
          <div class="stat-sub">تقييم: ${totalAttempts === 0 ? 'بانتظار أول لعبة ⏳' : smartIQ >= 120 ? 'متفوق جداً 🌟' : smartIQ >= 105 ? 'ذكي ونشيط 👍' : 'في تطور مستمر 🌱'}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">🎯 نسبة الدقة (الصح إلى الخطأ)</div>
          <div class="stat-value">${accuracy}%</div>
          <div class="stat-sub">✅ صح: ${totalCorrect} | ❌ خطأ: ${totalWrong}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">🚀 التقدم العام في التطبيق</div>
          <div class="stat-value">${overallProgress}%</div>
          <div class="stat-sub">⭐ النجوم: ${state.stars} | 🦄 الملصقات: ${(state.stickers || []).length}/24</div>
        </div>
      </div>

      <div class="dash-split">
        <div class="dash-box">
          <h3>📊 تحليل القدرات الذهنية الخمس</h3>
          <div class="bars-list">
            ${domains.map(d => `
              <div class="bar-item">
                <div class="bar-header"><span>${d.label}</span><b>${Math.round(d.val)}%</b></div>
                <div class="bar-track"><div class="bar-fill" style="width:${d.val}%; background:${d.color}"></div></div>
              </div>
            `).join('')}
          </div>
          <div class="ai-advice-box">
            💡 <b>التوصية التربوية:</b> ${totalAttempts > 0 ? `نقطة قوة ابنتك الحالية هي <b>(${sorted[0].label})</b>، وننصح بتشجيعها أكثر في ألعاب <b>(${sorted[sorted.length - 1].label})</b>.` : 'ابدئي أول لعبة مع ابنتك لتظهر التوصيات التربوية الدقيقة هنا.'}
          </div>
        </div>

        <div class="dash-box">
          <h3>📈 تقدم كل لعبة (20 لعبة × 10 مستويات)</h3>
          <div class="games-prog-list" style="max-height:300px; overflow-y:auto; padding-left:6px;">
            ${LumiDictionary.games.map(g => {
              const p = state.progress[g.id] || { level: 1, completed: 0 };
              const pct = Math.min(100, Math.round(((p.completed || 0) / 20) * 100));
              return `
                <div class="g-prog-row">
                  <span>${g.icon} ${g.nameEg}</span>
                  <span>المستوى ${p.level}/10 (${pct}%)</span>
                </div>
              `;
            }).join('')}
          </div>
          ${mistakes.length > 0 ? `
            <h4 style="margin-top:15px;">⚠️ مفاهيم تحتاج لمراجعة وتكرار:</h4>
            <div style="margin-top:6px;">${mistakes.map(m => `<span class="v-badge" style="margin:2px; display:inline-block;">${m[0]} (${m[1]} أخطاء)</span>`).join('')}</div>
          ` : ''}
        </div>
      </div>

      <div class="dash-box" style="margin-top:20px;">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; margin-bottom:12px;">
          <h3>🕒 سجل جلسات اللعب التفصيلي (التاريخ، الوقت، والمدة)</h3>
          <span class="pill-badge" style="font-size:0.9rem;">إجمالي وقت اللعب: ${Math.round((state.sessions || []).reduce((acc, s) => acc + s.durationSec, 0) / 60)} دقيقة</span>
        </div>
        ${(state.sessions && state.sessions.length > 0) ? `
          <div style="overflow-x:auto;">
            <table style="width:100%; border-collapse:collapse; text-align:right;">
              <thead>
                <tr style="background:var(--bg); border-bottom:2px solid #CBD5E1;">
                  <th style="padding:10px;">اللعبة</th>
                  <th style="padding:10px;">التاريخ</th>
                  <th style="padding:10px;">الساعة</th>
                  <th style="padding:10px;">المدة</th>
                  <th style="padding:10px;">المستوى</th>
                  <th style="padding:10px;">الأداء (صح / خطأ)</th>
                </tr>
              </thead>
              <tbody>
                ${state.sessions.map(s => {
                  const mins = Math.floor(s.durationSec / 60);
                  const secs = s.durationSec % 60;
                  const durText = mins > 0 ? `${mins} د و ${secs} ث` : `${secs} ثانية`;
                  return `
                    <tr style="border-bottom:1px solid #E2E8F0;">
                      <td style="padding:10px; font-weight:bold;">${s.gameName}</td>
                      <td style="padding:10px;">${s.dateStr}</td>
                      <td style="padding:10px;">${s.timeStr}</td>
                      <td style="padding:10px; color:#1982C4; font-weight:bold;">⏱️ ${durText}</td>
                      <td style="padding:10px;">مستوى ${s.level}</td>
                      <td style="padding:10px;">✅ ${s.correct} &nbsp;|&nbsp; ❌ ${s.wrong}</td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        ` : '<p style="color:#64748B; padding:12px 0;">لم يتم تسجيل أي جلسات لعب بعد. سيظهر هنا سجل كل لعبة بمجرد الخروج منها.</p>'}
      </div>
    `;
  },

  printDetailedReport() {
    const state = LumiStorage.getState();
    const cog = state.cognitive;
    let totalCorrect = 0, totalWrong = 0, totalCompleted = 0;

    LumiDictionary.games.forEach(g => {
      const p = state.progress[g.id] || { level: 1, correct: 0, wrong: 0, completed: 0 };
      totalCorrect += p.correct;
      totalWrong += p.wrong;
      totalCompleted += (p.completed || 0);
    });

    const totalAttempts = totalCorrect + totalWrong;
    const accuracy = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0;
    const overallProgress = Math.min(100, Math.round((totalCompleted / (LumiDictionary.games.length * 20)) * 100));
    const domainAvg = (cog.memory + cog.logic + cog.french + cog.visual + cog.motor) / 5;
    const smartIQ = totalAttempts > 0 ? Math.round(75 + (domainAvg * 0.45) + (accuracy * 0.25)) : 0;
    const totalMinutes = Math.round((state.sessions || []).reduce((acc, s) => acc + s.durationSec, 0) / 60);

    const domains = [
      { label: 'الذاكرة والتركيز', val: Math.round(cog.memory) },
      { label: 'المنطق والحساب والبرمجة', val: Math.round(cog.logic) },
      { label: 'اللغة الفرنسية والتعبير', val: Math.round(cog.french) },
      { label: 'الانتباه البصري والتناظر', val: Math.round(cog.visual) },
      { label: 'التآزر الحركي والفني', val: Math.round(cog.motor) }
    ];
    const sorted = [...domains].sort((a, b) => b.val - a.val);
    const mistakes = Object.entries(cog.mistakeLog || {}).sort((a, b) => b[1] - a[1]).slice(0, 8);
    const reportDate = new Date().toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    const reportHtml = `
      <!DOCTYPE html>
      <html lang="ar" dir="rtl">
      <head>
        <meta charset="UTF-8">
        <title>تقرير أداء LumiKids - ${reportDate}</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, sans-serif; color: #1E293B; padding: 30px; line-height: 1.6; }
          .header { text-align: center; border-bottom: 3px solid #FF6B6B; padding-bottom: 16px; margin-bottom: 24px; }
          .header h1 { color: #FF6B6B; margin: 0 0 6px 0; }
          .kpi-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 24px; }
          .kpi { border: 1px solid #CBD5E1; border-radius: 12px; padding: 14px; text-align: center; background: #F8FAFC; }
          .kpi strong { display: block; font-size: 1.6rem; color: #1982C4; margin-top: 4px; }
          h2 { color: #334155; border-right: 5px solid #4ECDC4; padding-right: 10px; margin-top: 26px; }
          table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 0.95rem; }
          th, td { border: 1px solid #CBD5E1; padding: 9px 12px; text-align: right; }
          th { background: #F1F5F9; }
          .advice { background: #FEF3C7; border: 1px solid #F59E0B; padding: 14px; border-radius: 10px; margin-top: 16px; }
          @media print { body { padding: 10px; } }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🌟 تقرير التقييم الذهني والتعليمي - ${LumiStorage.getActiveProfile().avatar} ${LumiStorage.getActiveProfile().name}</h1>
          <div>تاريخ إصدار التقرير: ${reportDate} | إجمالي وقت اللعب المسجل: ${totalMinutes} دقيقة</div>
        </div>
        <div class="kpi-grid">
          <div class="kpi">مؤشر الذكاء العام<strong>${smartIQ} نقطة</strong></div>
          <div class="kpi">نسبة الدقة (الصح/الخطأ)<strong>${accuracy}%</strong></div>
          <div class="kpi">التقدم العام<strong>${overallProgress}%</strong></div>
          <div class="kpi">النجوم والملصقات<strong>${state.stars} ⭐ | ${(state.stickers || []).length}/24 🦄</strong></div>
        </div>
        <h2>1. تقييم المحاور الذهنية والمهارات الخمس</h2>
        <table>
          <thead><tr><th>المحور الذهني</th><th>النسبة المحققة</th><th>التقييم</th></tr></thead>
          <tbody>
            ${domains.map(d => `
              <tr>
                <td><b>${d.label}</b></td>
                <td>${d.val}%</td>
                <td>${d.val >= 75 ? 'ممتاز 🌟' : d.val >= 40 ? 'جيد جداً 👍' : d.val > 0 ? 'في بداية التطور 🌱' : 'لم يُختبر بعد'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        <div class="advice">
          <b>💡 التوصية التربوية للأسرة:</b>
          ${totalAttempts > 0
            ? `تُظهر المؤشرات تميزاً واضحاً في <b>(${sorted[0].label})</b> بنسبة ${sorted[0].val}%، بينما يُنصح بتكثيف الألعاب المرتبطة بـ <b>(${sorted[sorted.length - 1].label})</b> لتعزيز التوازن الذهني.`
            : 'لم تبدأ جلسات اللعب الفعلية بعد؛ بمجرد اللعب ستظهر التوصيات التربوية الدقيقة هنا.'}
        </div>
        <h2>2. تفصيل الأداء حسب كل لعبة (20 لعبة تعليمية)</h2>
        <table>
          <thead><tr><th>اللعبة</th><th>المستوى الحالي</th><th>إجابات صحيحة</th><th>محاولات خاطئة</th><th>نسبة الإنجاز</th></tr></thead>
          <tbody>
            ${LumiDictionary.games.map(g => {
              const p = state.progress[g.id] || { level: 1, correct: 0, wrong: 0, completed: 0 };
              const pct = Math.min(100, Math.round(((p.completed || 0) / 20) * 100));
              return `<tr><td>${g.icon} ${g.nameEg} (${g.nameFr})</td><td>${p.level} / 10</td><td>${p.correct}</td><td>${p.wrong}</td><td>${pct}%</td></tr>`;
            }).join('')}
          </tbody>
        </table>
        ${mistakes.length > 0 ? `<h2>3. المفاهيم التي تحتاج لمراجعة وتكرار</h2><p>${mistakes.map(m => `<b>${m[0]}</b> (${m[1]} أخطاء)`).join(' &nbsp;•&nbsp; ')}</p>` : ''}
        <h2>${mistakes.length > 0 ? '4' : '3'}. سجل جلسات اللعب التفصيلي (آخر 30 جلسة)</h2>
        ${(state.sessions && state.sessions.length > 0) ? `
          <table>
            <thead><tr><th>اللعبة</th><th>التاريخ</th><th>الساعة</th><th>المدة</th><th>المستوى</th><th>النتيجة (صح / خطأ)</th></tr></thead>
            <tbody>
              ${state.sessions.slice(0, 30).map(s => {
                const mins = Math.floor(s.durationSec / 60);
                const secs = s.durationSec % 60;
                const dur = mins > 0 ? `${mins} د ${secs} ث` : `${secs} ث`;
                return `<tr><td>${s.gameName}</td><td>${s.dateStr}</td><td>${s.timeStr}</td><td>${dur}</td><td>مستوى ${s.level}</td><td>${s.correct} صح / ${s.wrong} خطأ</td></tr>`;
              }).join('')}
            </tbody>
          </table>
        ` : '<p>لا توجد جلسات مسجلة حتى الآن.</p>'}
      </body>
      </html>
    `;

    const win = window.open('', '_blank');
    if (!win) {
      alert('يرجى السماح بفتح النوافذ المنبثقة (Pop-ups) لطباعة التقرير.');
      return;
    }
    win.document.write(reportHtml);
    win.document.close();
    win.focus();
    setTimeout(() => win.print(), 400);
  },

  async renderVoiceStudio(container) {
    const savedKeys = await LumiStorage.getAllVoicesList();
    const allItems = [
      ...LumiDictionary.psychology.map(x => ({ id: x.id, group: '1️⃣ الدعم النفسي والتشجيع (أولوية قصوى)', textEg: x.eg, textFr: x.fr })),
      ...LumiDictionary.gameInstructions.map(x => ({ id: x.id, group: '1️⃣ توجيهات شرح الألعاب (20 لعبة)', textEg: x.eg, textFr: x.fr })),
      ...LumiDictionary.alphabet.map(x => ({ id: x.id, group: '2️⃣ الحروف الفرنسية', textEg: `حرف ${x.letter} زي ${x.wordEg}`, textFr: `${x.letter} comme ${x.wordFr}` })),
      ...LumiDictionary.colors.map(x => ({ id: x.id, group: '2️⃣ الألوان', textEg: x.eg, textFr: x.fr })),
      ...LumiDictionary.numbers.map(x => ({ id: x.id, group: '2️⃣ الأرقام', textEg: x.eg, textFr: x.fr })),
      ...LumiDictionary.words.map(x => ({ id: x.id, group: '3️⃣ قاموس الأشياء والجمل اليومية', textEg: x.eg, textFr: x.fr })),
      ...LumiDictionary.stories.flatMap(s => s.scenes.map((sc, i) => ({
        id: sc.id, group: `4️⃣ قصة: ${s.titleEg} (مشهد ${i + 1})`, textEg: sc.eg, textFr: sc.fr
      })))
    ];

    const momCount = savedKeys.filter(k => k.startsWith('mom_')).length;
    const dadCount = savedKeys.filter(k => k.startsWith('dad_')).length;

    container.innerHTML = `
      <div class="studio-header">
        <div>
          <h3>🎙️ استوديو تسجيل صوت العائلة</h3>
          <p>سجّل الجمل بصوتك الدافئ (مصري + فرنسي معاً أو حسب اختيارك) وسيستخدمها التطبيق تلقائياً أثناء لعب طفلتك!</p>
        </div>
        <div class="parent-selector">
          <button class="who-btn ${this.recordingParent === 'mom' ? 'active' : ''}" onclick="LumiParent.setRecorder('mom')">👩 تسجيل بصوت ماما (${momCount}/${allItems.length})</button>
          <button class="who-btn ${this.recordingParent === 'dad' ? 'active' : ''}" onclick="LumiParent.setRecorder('dad')">👨 تسجيل بصوت بابا (${dadCount}/${allItems.length})</button>
        </div>
      </div>

      <div class="studio-list">
        ${allItems.map(item => {
          const isRecorded = savedKeys.includes(`${this.recordingParent}_${item.id}`);
          return `
            <div class="voice-row ${isRecorded ? 'recorded' : ''}">
              <div class="v-info">
                <span class="v-badge">${item.group}</span>
                <div class="v-eg">🇪🇬 ${item.textEg}</div>
                <div class="v-fr">🇫🇷 ${item.textFr}</div>
              </div>
              <div class="v-actions">
                <button class="rec-btn" id="rec-${item.id}" onclick="LumiParent.toggleRecord('${item.id}')">🎙️ تسجيل</button>
                <button class="play-btn" onclick="LumiAudio.speak('${item.id}', '${item.textEg.replace(/'/g, "\\'")}', '${item.textFr.replace(/'/g, "\\'")}')">▶️ سماع</button>
                ${isRecorded ? '<span class="done-check">✅ مسجل</span>' : ''}
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  },

  setRecorder(who) {
    this.recordingParent = who;
    this.renderParentArea();
  },

  async toggleRecord(itemId) {
    const btn = document.getElementById(`rec-${itemId}`);
    if (this.currentlyRecordingId === itemId) {
      const blob = await LumiAudio.stopRecording();
      this.currentlyRecordingId = null;
      if (blob) {
        await LumiStorage.saveVoice(itemId, this.recordingParent, blob);
        LumiAudio.sfxSuccess();
        this.renderParentArea();
      }
    } else {
      if (this.currentlyRecordingId) await LumiAudio.stopRecording();
      try {
        await LumiAudio.startRecording();
        this.currentlyRecordingId = itemId;
        btn.classList.add('recording-pulse');
        btn.innerText = '⏹️ إيقاف وحفظ';
      } catch (e) {
        alert('يرجى السماح للمتصفح باستخدام الميكروفون للتسجيل.');
      }
    }
  },

  renderSettings(container) {
    const state = LumiStorage.getState();
    const s = state.settings;

    container.innerHTML = `
      <div class="settings-grid">

        <div class="set-box">
          <h3>👧 إدارة ملفات الأطفال (Profiles)</h3>
          <p style="font-size:0.9rem; color:#64748B;">لكل طفلة نجومها ومستوياتها وتقرير ذكائها المستقل تماماً:</p>
          <div style="margin:10px 0;">
            ${LumiStorage.getProfilesMeta().list.map(pr => `
              <div class="lock-row">
                <span>${pr.avatar} <b>${pr.name}</b></span>
                <div>
                  <button class="play-btn" style="padding:5px 10px; font-size:0.85rem;" onclick="LumiParent.renameProfile('${pr.id}')">✏️ تعديل الاسم</button>
                  ${LumiStorage.getProfilesMeta().list.length > 1 ? `<button class="danger-btn" style="padding:5px 10px; font-size:0.85rem;" onclick="LumiParent.removeProfile('${pr.id}')">🗑️</button>` : ''}
                </div>
              </div>
            `).join('')}
          </div>
          <div style="display:flex; gap:8px; margin-top:10px;">
            <select id="new-prof-avatar" style="width:75px;">
              <option value="👸">👸</option>
              <option value="🦄">🦄</option>
              <option value="🧚‍♀️">🧚‍♀️</option>
              <option value="🦋">🦋</option>
              <option value="🐱">🐱</option>
            </select>
            <input type="text" id="new-prof-name" placeholder="اسم الطفلة الجديدة...">
            <button class="primary-btn" style="margin:0; white-space:nowrap;" onclick="LumiParent.createNewProfile()">➕ إضافة</button>
          </div>
        </div>


        <div class="set-box">
          <h3>👧 إدارة ملفات الأطفال (Profiles)</h3>
          <p style="font-size:0.9rem; color:#64748B;">لكل طفلة نجومها ومستوياتها وتقرير ذكائها المستقل تماماً:</p>
          <div style="margin:10px 0;">
            ${LumiStorage.getProfilesMeta().list.map(pr => `
              <div class="lock-row">
                <span>${pr.avatar} <b>${pr.name}</b></span>
                <div>
                  <button class="play-btn" style="padding:5px 10px; font-size:0.85rem;" onclick="LumiParent.renameProfile('${pr.id}')">✏️ تعديل الاسم</button>
                  ${LumiStorage.getProfilesMeta().list.length > 1 ? `<button class="danger-btn" style="padding:5px 10px; font-size:0.85rem;" onclick="LumiParent.removeProfile('${pr.id}')">🗑️</button>` : ''}
                </div>
              </div>
            `).join('')}
          </div>
          <div style="display:flex; gap:8px; margin-top:10px;">
            <select id="new-prof-avatar" style="width:75px;">
              <option value="👸">👸</option>
              <option value="🦄">🦄</option>
              <option value="🧚‍♀️">🧚‍♀️</option>
              <option value="🦋">🦋</option>
              <option value="🐱">🐱</option>
            </select>
            <input type="text" id="new-prof-name" placeholder="اسم الطفلة الجديدة...">
            <button class="primary-btn" style="margin:0; white-space:nowrap;" onclick="LumiParent.createNewProfile()">➕ إضافة</button>
          </div>
        </div>

        <div class="set-box">
          <h3>🎨 التحكم الجرافيكي والإضاءة</h3>
          <label>سطوع الشاشة لحماية العين (${s.brightness}%):</label>
          <input type="range" min="40" max="100" value="${s.brightness}" oninput="LumiParent.updateSetting('brightness', this.value)">

          <label>مظهر الألوان (Theme):</label>
          <select onchange="LumiParent.updateSetting('theme', this.value)">
            <option value="pastel" ${s.theme === 'pastel' ? 'selected' : ''}>🌸 باستيل ناعم (مريح للعين)</option>
            <option value="bright" ${s.theme === 'bright' ? 'selected' : ''}>☀️ نهاري مشرق</option>
            <option value="night" ${s.theme === 'night' ? 'selected' : ''}>🌙 ليلي دافئ (قبل النوم)</option>
          </select>

          <label>لغة النطق الأساسية:</label>
          <select onchange="LumiParent.updateSetting('langMode', this.value)">
            <option value="both" ${s.langMode === 'both' ? 'selected' : ''}>🇪🇬 + 🇫🇷 مزدوج (مصري + فرنسي معاً)</option>
            <option value="fr" ${s.langMode === 'fr' ? 'selected' : ''}>🇫🇷 فرنسي فقط (انغماس لغوي)</option>
            <option value="eg" ${s.langMode === 'eg' ? 'selected' : ''}>🇪🇬 عامية مصرية فقط</option>
          </select>

          <label>الصوت المفضل للدعم:</label>
          <select onchange="LumiParent.updateSetting('preferredParent', this.value)">
            <option value="auto" ${s.preferredParent === 'auto' ? 'selected' : ''}>👨‍👩‍👧 تنويع تلقائي بين بابا وماما</option>
            <option value="mom" ${s.preferredParent === 'mom' ? 'selected' : ''}>👩 صوت ماما أولاً</option>
            <option value="dad" ${s.preferredParent === 'dad' ? 'selected' : ''}>👨 صوت بابا أولاً</option>
          </select>

          <label>مؤقت اللعب الهادئ (بالدقائق):</label>
          <input type="number" min="5" max="90" value="${s.sessionMinutes}" onchange="LumiParent.updateSetting('sessionMinutes', parseInt(this.value))">
        </div>

        <div class="set-box">
          <h3>🔒 قفل وفتح الألعاب والتحكم بالمستويات</h3>
          <div class="locks-list" style="max-height:380px; overflow-y:auto;">
            ${LumiDictionary.games.map(g => {
              const isLocked = s.lockedGames.includes(g.id);
              const curLvl = (state.progress[g.id] && state.progress[g.id].level) || 1;
              return `
                <div class="lock-row">
                  <span>${g.icon} ${g.nameEg}</span>
                  <div>
                    <select onchange="LumiParent.setGameLevel('${g.id}', parseInt(this.value))">
                      ${Array.from({ length: 10 }, (_, i) => `<option value="${i + 1}" ${curLvl === i + 1 ? 'selected' : ''}>مستوى ${i + 1}</option>`).join('')}
                    </select>
                    <button class="lock-toggle ${isLocked ? 'locked' : 'unlocked'}" onclick="LumiParent.toggleGameLock('${g.id}')">
                      ${isLocked ? '🔒 مقفولة' : '🔓 مفتوحة'}
                    </button>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <div class="set-box">
          <h3>💾 النسخ الاحتياطي والتصفير الشامل</h3>
          <p>احفظ نسخة احتياطية من تسجيلات صوت بابا وماما وتقدم الطفلة في ملف واحد:</p>
          <button class="primary-btn" onclick="LumiParent.downloadBackup()">⬇️ تصدير نسخة احتياطية (Backup)</button>
          <label class="file-upload-btn">
            ⬆️ استعادة نسخة احتياطية (Restore)
            <input type="file" accept=".json" style="display:none" onchange="LumiParent.uploadBackup(event)">
          </label>
          <hr style="margin:15px 0;">
          <div style="display:flex; flex-direction:column; gap:10px;">
            <button class="danger-btn" onclick="LumiParent.resetProgress()">🔄 تصفير الإحصائيات والتقدم والإعدادات (مع حفظ الأصوات)</button>
            <button class="danger-btn" style="background:#991B1B;" onclick="LumiParent.factoryResetAll()">⚠️ تصفير شامل لكل شيء (حذف التقدم + الإعدادات + الأصوات)</button>
          </div>
        </div>
      </div>
    `;
  },


  createNewProfile() {
    const name = document.getElementById('new-prof-name').value;
    const avatar = document.getElementById('new-prof-avatar').value;
    if (!name.trim()) return alert('يرجى كتابة اسم الطفلة أولاً.');
    LumiStorage.addProfile(name, avatar);
    LumiApp.renderProfileSwitcher();
    LumiApp.updateTopStats();
    this.renderParentArea();
  },

  renameProfile(id) {
    const meta = LumiStorage.getProfilesMeta();
    const prof = meta.list.find(p => p.id === id);
    if (!prof) return;
    const newName = prompt('أدخل الاسم الجديد:', prof.name);
    if (newName && newName.trim()) {
      prof.name = newName.trim();
      LumiStorage.saveProfilesMeta(meta);
      LumiApp.renderProfileSwitcher();
      this.renderParentArea();
    }
  },

  removeProfile(id) {
    if (confirm('هل أنت متأكد من حذف ملف هذه الطفلة وجميع بياناتها؟')) {
      LumiStorage.deleteProfile(id);
      LumiApp.renderProfileSwitcher();
      LumiApp.updateTopStats();
      this.renderParentArea();
    }
  },


  createNewProfile() {
    const name = document.getElementById('new-prof-name').value;
    const avatar = document.getElementById('new-prof-avatar').value;
    if (!name.trim()) return alert('يرجى كتابة اسم الطفلة أولاً.');
    LumiStorage.addProfile(name, avatar);
    LumiApp.renderProfileSwitcher();
    LumiApp.updateTopStats();
    this.renderParentArea();
  },

  renameProfile(id) {
    const meta = LumiStorage.getProfilesMeta();
    const prof = meta.list.find(p => p.id === id);
    if (!prof) return;
    const newName = prompt('أدخل الاسم الجديد:', prof.name);
    if (newName && newName.trim()) {
      prof.name = newName.trim();
      LumiStorage.saveProfilesMeta(meta);
      LumiApp.renderProfileSwitcher();
      this.renderParentArea();
    }
  },

  removeProfile(id) {
    if (confirm('هل أنت متأكد من حذف ملف هذه الطفلة وجميع بياناتها؟')) {
      LumiStorage.deleteProfile(id);
      LumiApp.renderProfileSwitcher();
      LumiApp.updateTopStats();
      this.renderParentArea();
    }
  },

  updateSetting(key, val) {
    const state = LumiStorage.getState();
    state.settings[key] = val;
    LumiStorage.saveState(state);
    LumiApp.applyVisualSettings();
  },

  toggleGameLock(gameId) {
    const state = LumiStorage.getState();
    const idx = state.settings.lockedGames.indexOf(gameId);
    if (idx > -1) state.settings.lockedGames.splice(idx, 1);
    else state.settings.lockedGames.push(gameId);
    LumiStorage.saveState(state);
    this.renderParentArea();
  },

  setGameLevel(gameId, lvl) {
    const state = LumiStorage.getState();
    if (!state.progress[gameId]) state.progress[gameId] = { level: lvl, completed: 0, correct: 0, wrong: 0, totalTime: 0 };
    else state.progress[gameId].level = lvl;
    LumiStorage.saveState(state);
  },

  async downloadBackup() {
    const json = await LumiStorage.exportBackup();
    const blob = new Blob([json], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `LumiKids_Backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
  },

  async uploadBackup(e) {
    const file = e.target.files[0];
    if (!file) return;
    const text = await file.text();
    await LumiStorage.importBackup(text);
    alert('✅ تم استعادة الأصوات والتقدم بنجاح!');
    this.renderParentArea();
  },

  async resetProgress() {
    if (confirm('هل أنت متأكد من تصفير كل الأرقام والنجوم والإعدادات لتبدأ من الصفر الحقيقي (ستبقى تسجيلات بابا وماما الصوتية محفوظة)؟')) {
      await LumiStorage.hardReset(false);
      LumiApp.applyVisualSettings();
      LumiApp.updateTopStats();
      this.renderParentArea();
      alert('✅ تم التصفير بنجاح! جميع الأرقام الآن 0 وجاهزة للقياس الحقيقي.');
    }
  },

  async factoryResetAll() {
    if (confirm('تحذير: سيتم مسح جميع الأرقام، الإعدادات، والتسجيلات الصوتية والعودة للصفر التام! هل تريد المتابعة؟')) {
      await LumiStorage.hardReset(true);
      LumiApp.applyVisualSettings();
      LumiApp.updateTopStats();
      this.renderParentArea();
      alert('✅ تم التصفير الشامل بنجاح.');
    }
  }
};
