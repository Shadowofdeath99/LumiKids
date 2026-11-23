(function() {
  if (typeof LumiGames === 'undefined' || typeof LumiDictionary === 'undefined') return;

  const MEMORY_THEMES = {
    animals: {
      label: '🐾 الحيوانات',
      items: [
        { id: 'm_lion', icon: '🦁', eg: 'أسد', fr: 'Lion' },
        { id: 'm_cat', icon: '🐱', eg: 'قطة', fr: 'Chat' },
        { id: 'm_elephant', icon: '🐘', eg: 'فيل', fr: 'Éléphant' },
        { id: 'm_dolphin', icon: '🐬', eg: 'دولفين', fr: 'Dauphin' },
        { id: 'm_owl', icon: '🦉', eg: 'بومة', fr: 'Hibou' },
        { id: 'm_butterfly', icon: '🦋', eg: 'فراشة', fr: 'Papillon' },
        { id: 'm_rabbit', icon: '🐰', eg: 'أرنب', fr: 'Lapin' },
        { id: 'm_turtle', icon: '🐢', eg: 'سلحفاة', fr: 'Tortue' }
      ]
    },
    fruits: {
      label: '🍓 الفواكه',
      items: [
        { id: 'm_straw', icon: '🍓', eg: 'فراولة', fr: 'Fraise' },
        { id: 'm_banana', icon: '🍌', eg: 'موزة', fr: 'Banane' },
        { id: 'm_apple', icon: '🍏', eg: 'تفاحة', fr: 'Pomme' },
        { id: 'm_orange', icon: '🍊', eg: 'برتقالة', fr: 'Orange' },
        { id: 'm_melon', icon: '🍉', eg: 'بطيخة', fr: 'Pastèque' },
        { id: 'm_grape', icon: '🍇', eg: 'عنب', fr: 'Raisin' },
        { id: 'm_cherry', icon: '🍒', eg: 'كرز', fr: 'Cerise' },
        { id: 'm_pineapple', icon: '🍍', eg: 'أناناس', fr: 'Ananas' }
      ]
    },
    space: {
      label: '🪐 الفضاء',
      items: [
        { id: 'm_sun', icon: '☀️', eg: 'الشمس', fr: 'Soleil' },
        { id: 'm_moon', icon: '🌙', eg: 'القمر', fr: 'Lune' },
        { id: 'm_earth', icon: '🌍', eg: 'الأرض', fr: 'Terre' },
        { id: 'm_saturn', icon: '🪐', eg: 'زحل', fr: 'Saturne' },
        { id: 'm_rocket', icon: '🚀', eg: 'صاروخ', fr: 'Fusée' },
        { id: 'm_star', icon: '⭐', eg: 'نجمة', fr: 'Étoile' },
        { id: 'm_astronaut', icon: '👩‍🚀', eg: 'رائدة فضاء', fr: 'Astronaute' },
        { id: 'm_comet', icon: '☄️', eg: 'مذنب', fr: 'Comète' }
      ]
    },
    objects: {
      label: '🎒 المدرسة',
      items: [
        { id: 'm_book', icon: '📘', eg: 'كتاب', fr: 'Livre' },
        { id: 'm_pencil', icon: '✏️', eg: 'قلم', fr: 'Crayon' },
        { id: 'm_bag', icon: '🎒', eg: 'حقيبة', fr: 'Cartable' },
        { id: 'm_globe', icon: '🌐', eg: 'كرة أرضية', fr: 'Globe' },
        { id: 'm_clock', icon: '⏰', eg: 'ساعة', fr: 'Horloge' },
        { id: 'm_palette', icon: '🎨', eg: 'ألوان', fr: 'Palette' },
        { id: 'm_piano', icon: '🎹', eg: 'بيانو', fr: 'Piano' },
        { id: 'm_trophy', icon: '🏆', eg: 'كأس', fr: 'Trophée' }
      ]
    }
  };

  LumiGames.memoryConfig = LumiGames.memoryConfig || {
    theme: 'animals',
    mode: 'classic', // classic | word_match | flash
    gridSize: 'auto' // auto | 4 | 6 | 8
  };

  LumiGames.buildMemory = function(stage) {
    const cfg = this.memoryConfig;
    const themeObj = MEMORY_THEMES[cfg.theme] || MEMORY_THEMES.animals;
    const lvl = this.currentLevel || 1;

    let pairsCount = cfg.gridSize === 'auto'
      ? Math.min(8, Math.max(2, Math.floor((lvl + 3) / 2)))
      : parseInt(cfg.gridSize, 10);

    const pool = [...themeObj.items].sort(() => Math.random() - 0.5).slice(0, pairsCount);
    let deck = [];

    pool.forEach(item => {
      if (cfg.mode === 'word_match') {
        deck.push({ ...item, cardType: 'icon', uid: item.id + '_a' });
        deck.push({ ...item, cardType: 'word', uid: item.id + '_b' });
      } else {
        deck.push({ ...item, cardType: 'both', uid: item.id + '_a' });
        deck.push({ ...item, cardType: 'both', uid: item.id + '_b' });
      }
    });
    deck.sort(() => Math.random() - 0.5);

    let moves = 0;
    let combo = 0;
    let matched = 0;
    let flipped = [];
    let locked = false;

    stage.innerHTML = `
      <div style="max-width:740px;margin:0 auto;">
        <div style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center;align-items:center;background:#fff;padding:10px 14px;border-radius:16px;border:2px solid #fecaca;margin-bottom:12px;">
          <select id="mem-theme-sel" style="padding:6px 10px;border-radius:10px;border:1.5px solid #fca5a5;font-weight:700;background:#fff5f5;">
            ${Object.entries(MEMORY_THEMES).map(([k, v]) => `<option value="${k}" ${cfg.theme === k ? 'selected' : ''}>${v.label}</option>`).join('')}
          </select>
          <select id="mem-mode-sel" style="padding:6px 10px;border-radius:10px;border:1.5px solid #93c5fd;font-weight:700;background:#eff6ff;">
            <option value="classic" ${cfg.mode === 'classic' ? 'selected' : ''}>🃏 كلاسيك (صورة وصورة)</option>
            <option value="word_match" ${cfg.mode === 'word_match' ? 'selected' : ''}>🇫🇷 تحدي الكلمة والصورة</option>
            <option value="flash" ${cfg.mode === 'flash' ? 'selected' : ''}>⚡ ذاكرة خاطفة (3 ثوانٍ)</option>
          </select>
          <select id="mem-size-sel" style="padding:6px 10px;border-radius:10px;border:1.5px solid #6ee7b7;font-weight:700;background:#ecfdf5;">
            <option value="auto" ${cfg.gridSize === 'auto' ? 'selected' : ''}>🎯 حسب المستوى (${pairsCount} أزواج)</option>
            <option value="2" ${cfg.gridSize === '2' ? 'selected' : ''}>🌸 سهل جداً (4 كروت - هيلن)</option>
            <option value="4" ${cfg.gridSize === '4' ? 'selected' : ''}>⭐ متوسط (8 كروت)</option>
            <option value="6" ${cfg.gridSize === '6' ? 'selected' : ''}>🔥 متقدم (12 كارت)</option>
            <option value="8" ${cfg.gridSize === '8' ? 'selected' : ''}>👑 الأبطال (16 كارت)</option>
          </select>
          <button type="button" id="mem-peek-btn" style="padding:6px 12px;border-radius:10px;border:none;background:#f59e0b;color:#fff;font-weight:800;cursor:pointer;">👁️ نظرة خاطفة</button>
        </div>

        <div style="display:flex;justify-content:space-around;background:#fef2f2;padding:8px 14px;border-radius:12px;margin-bottom:12px;font-weight:800;color:#991b1b;font-size:0.95rem;">
          <span>🎯 التطابق: <b id="mem-matched-cnt">0</b> / ${pairsCount}</span>
          <span>👣 الحركات: <b id="mem-moves-cnt">0</b></span>
          <span>🔥 التتابع: <b id="mem-combo-cnt">0</b>x</span>
        </div>

        <div id="mem-pro-grid" class="memory-grid" style="display:grid;gap:12px;grid-template-columns:repeat(${pairsCount <= 2 ? 2 : pairsCount <= 4 ? 4 : 4}, 1fr);"></div>
      </div>
    `;

    stage.querySelector('#mem-theme-sel').onchange = (e) => { cfg.theme = e.target.value; this.buildMemory(stage); };
    stage.querySelector('#mem-mode-sel').onchange = (e) => { cfg.mode = e.target.value; this.buildMemory(stage); };
    stage.querySelector('#mem-size-sel').onchange = (e) => { cfg.gridSize = e.target.value; this.buildMemory(stage); };

    const grid = stage.querySelector('#mem-pro-grid');
    const cardEls = [];

    function renderFace(el, card) {
      el.classList.add('open');
      el.style.background = '#ffffff';
      el.style.borderColor = '#fb7185';
      el.style.transform = 'scale(1.03)';
      if (card.cardType === 'icon') {
        el.innerHTML = `<span style="font-size:2.9rem;line-height:1;">${card.icon}</span>`;
      } else if (card.cardType === 'word') {
        el.innerHTML = `<span style="font-size:1.15rem;font-weight:900;color:#1e3a8a;">${card.fr}</span><small style="color:#64748b;font-size:0.8rem;">${card.eg}</small>`;
      } else {
        el.innerHTML = `<span style="font-size:2.6rem;line-height:1.1;">${card.icon}</span><small style="font-weight:800;color:#334155;font-size:0.85rem;">${card.fr}</small>`;
      }
    }

    function hideFace(el) {
      el.classList.remove('open');
      el.style.background = 'linear-gradient(135deg,#ff6b6b,#f43f5e)';
      el.style.borderColor = '#e11d48';
      el.style.transform = 'scale(1)';
      el.innerHTML = '<span style="font-size:2rem;color:#fff;">❓</span>';
    }

    function flashAll(ms = 2200) {
      locked = true;
      cardEls.forEach(({ el, card }) => {
        if (!el.dataset.solved) renderFace(el, card);
      });
      setTimeout(() => {
        cardEls.forEach(({ el }) => {
          if (!el.dataset.solved) hideFace(el);
        });
        locked = false;
      }, ms);
    }

    stage.querySelector('#mem-peek-btn').onclick = () => {
      if (!locked) flashAll(1600);
    };

    deck.forEach(card => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'mem-card';
      btn.style.cssText = 'min-height:105px;border-radius:18px;border:3px solid #e11d48;background:linear-gradient(135deg,#ff6b6b,#f43f5e);display:flex;flex-direction:column;align-items:center;justify-content:center;cursor:pointer;transition:all 0.2s;box-shadow:0 4px 10px rgba(225,29,72,0.18);';
      hideFace(btn);
      cardEls.push({ el: btn, card });

      btn.onclick = () => {
        if (locked || btn.dataset.solved || btn.classList.contains('open') || flipped.length >= 2) return;
        if (window.LumiAudio && LumiAudio.sfxClick) LumiAudio.sfxClick();
        renderFace(btn, card);
        flipped.push({ el: btn, card });

        if (flipped.length === 2) {
          moves++;
          const mEl = stage.querySelector('#mem-moves-cnt');
          if (mEl) mEl.innerText = moves;

          const [a, b] = flipped;
          if (a.card.id === b.card.id) {
            a.el.dataset.solved = '1';
            b.el.dataset.solved = '1';
            a.el.style.background = '#dcfce7';
            b.el.style.background = '#dcfce7';
            a.el.style.borderColor = '#16a34a';
            b.el.style.borderColor = '#16a34a';
            combo++;
            matched++;
            const cEl = stage.querySelector('#mem-combo-cnt');
            const mtEl = stage.querySelector('#mem-matched-cnt');
            if (cEl) cEl.innerText = combo;
            if (mtEl) mtEl.innerText = matched;
            if (window.LumiAudio && LumiAudio.speak) LumiAudio.speak(a.card.id, a.card.eg, a.card.fr);
            flipped = [];

            if (matched === pairsCount) {
              setTimeout(() => this.handleAnswer(true, a.card.id, true), 450);
            }
          } else {
            combo = 0;
            const cEl = stage.querySelector('#mem-combo-cnt');
            if (cEl) cEl.innerText = '0';
            locked = true;
            setTimeout(() => {
              hideFace(a.el);
              hideFace(b.el);
              flipped = [];
              locked = false;
            }, 850);
          }
        }
      };
      grid.appendChild(btn);
    });

    if (cfg.mode === 'flash') {
      flashAll(2600);
    }
  };
})();
