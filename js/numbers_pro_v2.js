(function() {
  if (typeof LumiGames === 'undefined') return;

  const FARM_THEMES = {
    rabbit: { label: '🐰 الأرنب والجزر', animal: '🐰', food: '🥕', foodNameAr: 'جزرة', foodNameFr: 'carottes' },
    monkey: { label: '🐵 القرد والموز', animal: '🐵', food: '🍌', foodNameAr: 'موزة', foodNameFr: 'bananes' },
    panda:  { label: '🐼 الباندا والخيزران', animal: '🐼', food: '🎋', foodNameAr: 'عود خيزران', foodNameFr: 'bambous' },
    bear:   { label: '🐻 الدب والعسل', animal: '🐻', food: '🍯', foodNameAr: 'برطمان عسل', foodNameFr: 'pots de miel' }
  };

  LumiGames.numbersConfig = LumiGames.numbersConfig || {
    theme: 'rabbit',
    mode: 'count' // count | add | sub | cm1
  };

  LumiGames.buildNumbers = function(stage) {
    const cfg = this.numbersConfig;
    const th = FARM_THEMES[cfg.theme] || FARM_THEMES.rabbit;
    const lvl = this.currentLevel || 1;

    let targetNum = 3;
    let promptAr = '';
    let promptFr = '';

    if (cfg.mode === 'count') {
      targetNum = Math.min(12, Math.max(1, lvl + Math.floor(Math.random() * 3)));
      promptAr = `أعطي ${th.animal} عدد <b style="color:#d97706;font-size:1.5rem;">${targetNum}</b> ${th.food}`;
      promptFr = `Donne ${targetNum} ${th.foodNameFr} !`;
    } else if (cfg.mode === 'add') {
      const a = Math.floor(Math.random() * 7) + 2;
      const b = Math.floor(Math.random() * 7) + 1;
      targetNum = a + b;
      promptAr = `احسبي وأطعميه الناتج: <span dir="ltr" style="color:#d97706;font-size:1.5rem;">${a} + ${b} = ؟</span>`;
      promptFr = `Calcule : ${a} + ${b}`;
    } else if (cfg.mode === 'sub') {
      const b = Math.floor(Math.random() * 5) + 1;
      const a = b + Math.floor(Math.random() * 7) + 2;
      targetNum = a - b;
      promptAr = `احسبي الباقي وأطعميه: <span dir="ltr" style="color:#d97706;font-size:1.5rem;">${a} - ${b} = ؟</span>`;
      promptFr = `Calcule : ${a} - ${b}`;
    } else {
      const a = Math.floor(Math.random() * 5) + 2;
      const b = Math.floor(Math.random() * 5) + 2;
      targetNum = a * b;
      promptAr = `تحدي الضرب CM1: <span dir="ltr" style="color:#d97706;font-size:1.5rem;">${a} × ${b} = ؟</span>`;
      promptFr = `Multiplication : ${a} × ${b}`;
    }

    let currentCount = 0;

    stage.innerHTML = `
      <div style="max-width:700px;margin:0 auto;text-align:center;">
        <div style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center;align-items:center;background:#fff;padding:10px 14px;border-radius:16px;border:2px solid #fde68a;margin-bottom:12px;">
          <select id="num-theme-sel" style="padding:6px 10px;border-radius:10px;border:1.5px solid #fcd34d;font-weight:700;background:#fffbeb;">
            ${Object.entries(FARM_THEMES).map(([k, v]) => `<option value="${k}" ${cfg.theme === k ? 'selected' : ''}>${v.label}</option>`).join('')}
          </select>
          <select id="num-mode-sel" style="padding:6px 10px;border-radius:10px;border:1.5px solid #93c5fd;font-weight:700;background:#eff6ff;">
            <option value="count" ${cfg.mode === 'count' ? 'selected' : ''}>🥕 العدّ المباشر (مناسب لهيلن)</option>
            <option value="add" ${cfg.mode === 'add' ? 'selected' : ''}>➕ الجمع السريع</option>
            <option value="sub" ${cfg.mode === 'sub' ? 'selected' : ''}>➖ الطرح الذكي</option>
            <option value="cm1" ${cfg.mode === 'cm1' ? 'selected' : ''}>✖️ تحدي الضرب (مناسب لهيفن)</option>
          </select>
        </div>

        <div style="background:linear-gradient(135deg,#fffbeb,#fef3c7);border:2px solid #f59e0b;border-radius:20px;padding:16px;margin-bottom:14px;">
          <div style="font-size:4.2rem;line-height:1.1;">${th.animal}</div>
          <div style="font-size:1.25rem;font-weight:800;color:#78350f;margin:8px 0;">${promptAr}</div>
          <div style="font-size:0.95rem;font-weight:700;color:#b45309;">${promptFr}</div>
        </div>

        <div style="background:#fff;border:2px dashed #f59e0b;border-radius:18px;padding:12px;min-height:84px;margin-bottom:14px;">
          <div style="font-size:0.95rem;font-weight:800;color:#92400e;margin-bottom:6px;">
            🍽️ الطبق الآن: <span id="num-plate-val" style="font-size:1.3rem;color:#d97706;">0</span>
          </div>
          <div id="num-plate-icons" style="font-size:1.9rem;min-height:38px;word-wrap:break-word;"></div>
        </div>

        <div style="display:flex;flex-wrap:wrap;gap:10px;justify-content:center;margin-bottom:14px;">
          <button type="button" class="num-add-btn" data-step="1" style="background:#fef3c7;border:2px solid #f59e0b;border-radius:14px;padding:10px 18px;font-size:1.15rem;font-weight:900;color:#78350f;cursor:pointer;">+1 ${th.food}</button>
          <button type="button" class="num-add-btn" data-step="5" style="background:#fde68a;border:2px solid #d97706;border-radius:14px;padding:10px 18px;font-size:1.15rem;font-weight:900;color:#78350f;cursor:pointer;">+5 ${th.food}</button>
          <button type="button" id="num-clear-btn" style="background:#fee2e2;border:2px solid #ef4444;border-radius:14px;padding:10px 16px;font-size:1.05rem;font-weight:800;color:#991b1b;cursor:pointer;">🗑️ تفريغ</button>
        </div>

        <button type="button" id="num-feed-btn" style="background:linear-gradient(135deg,#16a34a,#15803d);color:#fff;border:none;border-radius:16px;padding:12px 28px;font-size:1.2rem;font-weight:900;cursor:pointer;box-shadow:0 4px 12px rgba(22,163,74,0.25);">
          ✅ قدّمي الطعام للـ ${th.animal}
        </button>
      </div>
    `;

    stage.querySelector('#num-theme-sel').onchange = (e) => { cfg.theme = e.target.value; this.buildNumbers(stage); };
    stage.querySelector('#num-mode-sel').onchange = (e) => { cfg.mode = e.target.value; this.buildNumbers(stage); };

    const valEl = stage.querySelector('#num-plate-val');
    const iconsEl = stage.querySelector('#num-plate-icons');

    const updatePlate = () => {
      valEl.innerText = currentCount;
      iconsEl.innerText = currentCount <= 25 ? th.food.repeat(currentCount) : `${th.food.repeat(20)} (+${currentCount - 20})`;
    };

    stage.querySelectorAll('.num-add-btn').forEach(btn => {
      btn.onclick = () => {
        const step = parseInt(btn.dataset.step, 10);
        if (currentCount + step <= 50) {
          currentCount += step;
          if (window.LumiAudio && LumiAudio.sfxClick) LumiAudio.sfxClick();
          updatePlate();
        }
      };
    });

    stage.querySelector('#num-clear-btn').onclick = () => {
      currentCount = 0;
      updatePlate();
    };

    stage.querySelector('#num-feed-btn').onclick = () => {
      if (currentCount === targetNum) {
        if (window.LumiAudio && LumiAudio.speak) LumiAudio.speak(`num_${targetNum}`, `${targetNum}`, `${targetNum}`);
        this.handleAnswer(true, `num_${targetNum}`, true);
      } else {
        this.handleAnswer(false, `num_${targetNum}`, false);
      }
    };
  };
})();
