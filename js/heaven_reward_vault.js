(function() {
  if (typeof LumiGames === 'undefined') return;

  const VAULT_KEY = 'lumikids_papa_reward_vault_v1';
  const CURRICULUM_IDS = new Set([
    'cm1_math_numbers', 'cm1_math_geom', 'cm1_sciences',
    'cm1_french_gram', 'cm1_arabic_nahw', 'cm1_social_egypt',
    'cm1_iq_master', 'algo_robot', 'clock_master',
    'english_smart', 'trilingual_vocab', 'fractions_pro',
    'world_capitals', 'sentence_order', 'science_lab', 'cipher_logic'
  ]);

  // مراحل سرية تصل إلى 500 جنيه دون كشف السقف النهائي مسبقاً
  const MILESTONES = [
    { req: 25,  cash: 25,  msg: 'بداية الأبطال! فتحتِ أول قفل في خزنة بابا 🌟' },
    { req: 60,  cash: 60,  msg: 'مستوى رائع في رابعة ابتدائي! هديتك بتكبر 💪' },
    { req: 110, cash: 120, msg: 'عبقرية اللغات والعلوم! قربتِ من المفاجأة 🚀' },
    { req: 175, cash: 200, msg: 'إنجاز مذهل! بابا مينا وماما ساندرا فخورين بيكي ❤️' },
    { req: 250, cash: 320, msg: 'أسطورة CM1! خطوة أخيرة على القفل الذهبي الكبير 🏆' },
    { req: 350, cash: 500, msg: 'مبروك يا ملكة! أتممتِ تحدي المنهج واستحقيتِ المفاجأة الكبرى 👑🎉' }
  ];

  function loadVault() {
    try {
      const raw = JSON.parse(localStorage.getItem(VAULT_KEY) || 'null');
      if (raw && typeof raw.solved === 'number') return raw;
    } catch (e) {}
    return { solved: 0, unlockedLevel: 0, cash: 0, paidOut: 0 };
  }

  function saveVault(v) {
    localStorage.setItem(VAULT_KEY, JSON.stringify(v));
  }

  function evaluateProgress(v) {
    let newlyUnlocked = null;
    for (let i = v.unlockedLevel; i < MILESTONES.length; i++) {
      if (v.solved >= MILESTONES[i].req) {
        v.unlockedLevel = i + 1;
        v.cash = MILESTONES[i].cash;
        newlyUnlocked = MILESTONES[i];
      } else {
        break;
      }
    }
    saveVault(v);
    return newlyUnlocked;
  }

  function getVaultBannerHtml() {
    const v = loadVault();
    const available = Math.max(0, v.cash - (v.paidOut || 0));
    const nextM = MILESTONES[v.unlockedLevel] || null;
    const prevReq = v.unlockedLevel > 0 ? MILESTONES[v.unlockedLevel - 1].req : 0;
    const pct = nextM
      ? Math.min(100, Math.round(((v.solved - prevReq) / (nextM.req - prevReq)) * 100))
      : 100;
    const remaining = nextM ? Math.max(0, nextM.req - v.solved) : 0;

    return `
      <div id="papa-vault-banner" style="
        max-width:780px;
        margin:0 auto 14px auto;
        padding:12px 16px;
        border-radius:18px;
        background:linear-gradient(135deg, #FEF3C7, #FDE68A);
        border:2px solid #F59E0B;
        color:#78350F;
        text-align:center;
        box-shadow:0 4px 12px rgba(245,158,11,0.18);
      ">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; margin-bottom:8px;">
          <span style="font-weight:900; font-size:1.08rem;">🎁 خزنة هدية بابا: <span style="background:#D97706; color:#fff; padding:2px 10px; border-radius:999px;">${available} جنيه</span></span>
          <span style="font-weight:800; font-size:0.9rem;">📚 إجابات المنهج الصحيحة: ${v.solved}</span>
        </div>
        <div style="width:100%; height:10px; background:rgba(120,53,15,0.15); border-radius:999px; overflow:hidden; margin-bottom:6px;">
          <div style="width:${pct}%; height:100%; background:linear-gradient(90deg, #F59E0B, #10B981); transition:width 0.4s;"></div>
        </div>
        <div style="font-size:0.86rem; font-weight:700;">
          ${nextM
            ? `🔒 القفل القادم (${nextM.cash} جنيه): متبقي ${remaining} إجابة صحيحة لفتحه!`
            : `👑 تم فتح جميع أقفال الخزنة بنجاح يا بطلة!`}
        </div>
      </div>
    `;
  }

  function showUnlockToast(milestone) {
    const toast = document.createElement('div');
    toast.style.cssText = `
      position:fixed; top:18px; left:50%; transform:translateX(-50%);
      z-index:99999; background:linear-gradient(135deg, #059669, #10B981);
      color:#fff; padding:16px 24px; border-radius:20px;
      font-weight:900; font-size:1.1rem; text-align:center;
      box-shadow:0 12px 30px rgba(0,0,0,0.3); max-width:90vw;
    `;
    toast.innerHTML = `🎉 مبروك يا هيفن! رصيدك في خزنة بابا أصبح ${milestone.cash} جنيه!<br><small style="font-weight:700;">${milestone.msg}</small>`;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 4500);
  }

  function recordCurriculumCorrect() {
    const v = loadVault();
    v.solved += 1;
    const unlocked = evaluateProgress(v);
    if (unlocked) showUnlockToast(unlocked);
  }

  // ربط عداد المكافأة مع الإجابات الصحيحة في ألعاب المنهج والموسوعة
  const origHandle = LumiGames.handleAnswer ? LumiGames.handleAnswer.bind(LumiGames) : null;
  LumiGames.handleAnswer = function(isCorrect, ...restArgs) {
    if (isCorrect && CURRICULUM_IDS.has(this.currentGameId)) {
      recordCurriculumCorrect();
    }
    if (origHandle) return origHandle(isCorrect, ...restArgs);
  };

  // ربط شريط الخزنة أعلى شاشة اللعب لأي نشاط دراسي
  const origRender = LumiGames.renderGameScreen.bind(LumiGames);
  LumiGames.renderGameScreen = function() {
    origRender();
    const stage = document.getElementById('game-stage');
    if (stage && CURRICULUM_IDS.has(this.currentGameId)) {
      if (!stage.querySelector('#papa-vault-banner')) {
        stage.insertAdjacentHTML('afterbegin', getVaultBannerHtml());
      }
      // مراقبة نقرات الإجابة الصحيحة في الموسوعة الثلاثية
      if (this.currentGameId === 'trilingual_vocab') {
        const optBox = stage.querySelector('#tri-options');
        if (optBox && !optBox.dataset.vaultBound) {
          optBox.dataset.vaultBound = '1';
          optBox.addEventListener('click', (e) => {
            const btn = e.target.closest('button');
            if (!btn) return;
            setTimeout(() => {
              if (btn.style.background === 'rgb(16, 185, 129)' || btn.style.background === '#10B981') {
                recordCurriculumCorrect();
              }
            }, 30);
          });
        }
      }
    }
  };

  // واجهة إدارة الخزنة للأب داخل LumiVault
  window.LumiVault = {
    getStatus: loadVault,
    payout(amount) {
      const v = loadVault();
      v.paidOut = Math.min(v.cash, (v.paidOut || 0) + Number(amount || 0));
      saveVault(v);
      return v;
    },
    reset() {
      saveVault({ solved: 0, unlockedLevel: 0, cash: 0, paidOut: 0 });
    }
  };
})();
