(function() {
  if (typeof LumiGames === 'undefined') return;

  const SHADOW_THEMES = {
    animals: {
      label: '🦁 الحيوانات',
      items: [
        { id: 'sh_lion', icon: '🦁', eg: 'أسد', fr: 'Lion' },
        { id: 'sh_giraffe', icon: '🦒', eg: 'زرافة', fr: 'Girafe' },
        { id: 'sh_elephant', icon: '🐘', eg: 'فيل', fr: 'Éléphant' },
        { id: 'sh_flamingo', icon: '🦩', eg: 'فلامنجو', fr: 'Flamant rose' },
        { id: 'sh_kangaroo', icon: '🦘', eg: 'كنغر', fr: 'Kangourou' },
        { id: 'sh_octopus', icon: '🐙', eg: 'أخطبوط', fr: 'Poulpe' },
        { id: 'sh_butterfly', icon: '🦋', eg: 'فراشة', fr: 'Papillon' },
        { id: 'sh_crab', icon: '🦀', eg: 'سلطعون', fr: 'Crabe' }
      ]
    },
    vehicles: {
      label: '🚀 المركبات والفضاء',
      items: [
        { id: 'sh_rocket', icon: '🚀', eg: 'صاروخ فضاء', fr: 'Fusée' },
        { id: 'sh_heli', icon: '🚁', eg: 'طائرة مروحية', fr: 'Hélicoptère' },
        { id: 'sh_ship', icon: '🚢', eg: 'سفينة كبيرة', fr: 'Bateau' },
        { id: 'sh_train', icon: '🚂', eg: 'قطار سريع', fr: 'Train' },
        { id: 'sh_bike', icon: '🚲', eg: 'دراجة', fr: 'Vélo' },
        { id: 'sh_ufo', icon: '🛸', eg: 'طبق طائر', fr: 'Soucoupe volante' },
        { id: 'sh_tractor', icon: '🚜', eg: 'جرار زراعي', fr: 'Tracteur' },
        { id: 'sh_plane', icon: '✈️', eg: 'طائرة ركاب', fr: 'Avion' }
      ]
    },
    nature: {
      label: '🦖 الطبيعة والديناصورات',
      items: [
        { id: 'sh_trex', icon: '🦖', eg: 'ديناصور تيريكس', fr: 'Tyrannosaure' },
        { id: 'sh_sauropod', icon: '🦕', eg: 'ديناصور طويل الرقبة', fr: 'Diplodocus' },
        { id: 'sh_palm', icon: '🌴', eg: 'نخلة', fr: 'Palmier' },
        { id: 'sh_cactus', icon: '🌵', eg: 'صبار', fr: 'Cactus' },
        { id: 'sh_mushroom', icon: '🍄', eg: 'فطر', fr: 'Champignon' },
        { id: 'sh_sunflower', icon: '🌻', eg: 'عباد الشمس', fr: 'Tournesol' },
        { id: 'sh_maple', icon: '🍁', eg: 'ورقة شجر', fr: 'Feuille d’érable' },
        { id: 'sh_pine', icon: '🌲', eg: 'شجرة صنوبر', fr: 'Sapin' }
      ]
    },
    objects: {
      label: '👑 أشياء وعجائب',
      items: [
        { id: 'sh_crown', icon: '👑', eg: 'تاج ملكي', fr: 'Couronne' },
        { id: 'sh_guitar', icon: '🎸', eg: 'جيتار', fr: 'Guitare' },
        { id: 'sh_umbrella', icon: '☂️', eg: 'مظلة', fr: 'Parapluie' },
        { id: 'sh_key', icon: '🗝️', eg: 'مفتاح ذهبي', fr: 'Clé' },
        { id: 'sh_trophy', icon: '🏆', eg: 'كأس البطولة', fr: 'Trophée' },
        { id: 'sh_camera', icon: '📷', eg: 'كاميرا', fr: 'Appareil photo' },
        { id: 'sh_anchor', icon: '⚓', eg: 'مرساة السفينة', fr: 'Ancre' },
        { id: 'sh_hourglass', icon: '⏳', eg: 'ساعة رملية', fr: 'Sablier' }
      ]
    }
  };

  LumiGames.shadowConfig = LumiGames.shadowConfig || {
    theme: 'animals',
    mode: 'classic', // classic | reverse | rotated
    choices: 'auto'  // auto | 3 | 4 | 6
  };

  LumiGames.shadowStreak = LumiGames.shadowStreak || 0;

  LumiGames.buildShadows = function(stage) {
    const cfg = this.shadowConfig;
    const themeObj = SHADOW_THEMES[cfg.theme] || SHADOW_THEMES.animals;
    const lvl = this.currentLevel || 1;

    const choiceCount = cfg.choices === 'auto'
      ? (lvl <= 3 ? 3 : lvl <= 7 ? 4 : 6)
      : parseInt(cfg.choices, 10);

    const pool = [...themeObj.items].sort(() => Math.random() - 0.5).slice(0, choiceCount);
    const target = pool[0];
    const options = [...pool].sort(() => Math.random() - 0.5);

    const isReverse = cfg.mode === 'reverse';
    const isRotated = cfg.mode === 'rotated';
    const rotAngles = [-35, -20, 20, 35, 45, -45];
    const targetRot = isRotated ? rotAngles[Math.floor(Math.random() * rotAngles.length)] : 0;

    stage.innerHTML = `
      <div style="max-width:720px;margin:0 auto;text-align:center;">
        <div style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center;align-items:center;background:#fff;padding:10px 14px;border-radius:16px;border:2px solid #99f6e4;margin-bottom:12px;">
          <select id="sh-theme-sel" style="padding:6px 10px;border-radius:10px;border:1.5px solid #5eead4;font-weight:700;background:#f0fdfa;">
            ${Object.entries(SHADOW_THEMES).map(([k, v]) => `<option value="${k}" ${cfg.theme === k ? 'selected' : ''}>${v.label}</option>`).join('')}
          </select>
          <select id="sh-mode-sel" style="padding:6px 10px;border-radius:10px;border:1.5px solid #93c5fd;font-weight:700;background:#eff6ff;">
            <option value="classic" ${cfg.mode === 'classic' ? 'selected' : ''}>👤 صورة ← ابحث عن ظلها</option>
            <option value="reverse" ${cfg.mode === 'reverse' ? 'selected' : ''}>🔮 ظل غامض ← اكتشف صورته</option>
            <option value="rotated" ${cfg.mode === 'rotated' ? 'selected' : ''}>🌀 ظل مائل (تحدي الذكاء)</option>
          </select>
          <select id="sh-count-sel" style="padding:6px 10px;border-radius:10px;border:1.5px solid #fde047;font-weight:700;background:#fefce8;">
            <option value="auto" ${cfg.choices === 'auto' ? 'selected' : ''}>🎯 حسب المستوى (${choiceCount} خيارات)</option>
            <option value="3" ${cfg.choices === '3' ? 'selected' : ''}>🌸 سهل (3 خيارات - هيلن)</option>
            <option value="4" ${cfg.choices === '4' ? 'selected' : ''}>⭐ متوسط (4 خيارات)</option>
            <option value="6" ${cfg.choices === '6' ? 'selected' : ''}>🔥 صعب (6 خيارات - هيفن)</option>
          </select>
        </div>

        <div style="background:linear-gradient(135deg,#ecfeff,#cffafe);border:2px solid #22d3ee;border-radius:20px;padding:16px;margin-bottom:14px;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;font-size:0.9rem;font-weight:800;color:#0e7490;">
            <span>🔥 سلسلة النجاح: ${LumiGames.shadowStreak}</span>
            <button type="button" id="sh-speak-btn" style="background:#0284c7;color:#fff;border:none;border-radius:10px;padding:5px 12px;font-weight:700;cursor:pointer;">🔊 اسمع الاسم</button>
          </div>
          <div style="font-size:4.4rem;line-height:1.1;margin:6px 0;display:inline-block;${isReverse ? 'filter:brightness(0);opacity:0.88;' : ''}transform:rotate(${targetRot}deg);transition:transform 0.3s;">
            ${target.icon}
          </div>
          <div style="font-size:1.15rem;font-weight:800;color:#155e75;margin-top:6px;">
            ${isReverse ? 'من صاحب هذا الظل الغامض؟' : `أين ظل: <span style="color:#0369a1;">${target.eg} (${target.fr})</span>؟`}
          </div>
        </div>

        <div id="sh-pro-grid" style="display:grid;grid-template-columns:repeat(${choiceCount <= 3 ? 3 : choiceCount === 4 ? 2 : 3}, 1fr);gap:12px;"></div>
      </div>
    `;

    stage.querySelector('#sh-theme-sel').onchange = (e) => { cfg.theme = e.target.value; this.buildShadows(stage); };
    stage.querySelector('#sh-mode-sel').onchange = (e) => { cfg.mode = e.target.value; this.buildShadows(stage); };
    stage.querySelector('#sh-count-sel').onchange = (e) => { cfg.choices = e.target.value; this.buildShadows(stage); };

    const speakTarget = () => {
      if (window.LumiAudio && LumiAudio.speak) {
        LumiAudio.speak(target.id, target.eg, target.fr);
      }
    };
    stage.querySelector('#sh-speak-btn').onclick = speakTarget;
    if (!isReverse) setTimeout(speakTarget, 220);

    const grid = stage.querySelector('#sh-pro-grid');
    options.forEach(opt => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'shadow-opt-btn';
      btn.style.cssText = 'background:#fff;border:3px solid #cbd5e1;border-radius:18px;padding:16px 10px;cursor:pointer;transition:all 0.2s;display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:110px;';
      const optRot = (isRotated && !isReverse) ? rotAngles[Math.floor(Math.random() * rotAngles.length)] : 0;
      btn.innerHTML = `
        <span style="font-size:3.5rem;line-height:1.1;display:inline-block;${!isReverse ? 'filter:brightness(0);opacity:0.86;' : ''}transform:rotate(${optRot}deg);">
          ${opt.icon}
        </span>
        ${isReverse ? `<small style="margin-top:6px;font-weight:800;color:#334155;">${opt.eg} • ${opt.fr}</small>` : ''}
      `;

      btn.onclick = () => {
        if (opt.id === target.id) {
          LumiGames.shadowStreak++;
          btn.style.background = '#dcfce7';
          btn.style.borderColor = '#16a34a';
          btn.innerHTML = `<span style="font-size:3.6rem;line-height:1.1;">${opt.icon}</span><small style="margin-top:6px;font-weight:800;color:#14532d;">${opt.eg} (${opt.fr})</small>`;
          speakTarget();
          this.handleAnswer(true, target.id, true);
        } else {
          LumiGames.shadowStreak = 0;
          btn.style.background = '#fee2e2';
          btn.style.borderColor = '#dc2626';
          btn.classList.add('shake');
          this.handleAnswer(false, target.id, false);
        }
      };
      grid.appendChild(btn);
    });
  };
})();
