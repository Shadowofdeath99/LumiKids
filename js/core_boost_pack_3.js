(function() {
  if (typeof LumiGames === 'undefined') return;

  const DICT_ITEMS_PRO = [
    { id: 'd_sun', icon: '☀️', eg: 'شمس', fr: 'Le Soleil' },
    { id: 'd_moon', icon: '🌙', eg: 'قمر', fr: 'La Lune' },
    { id: 'd_tree', icon: '🌳', eg: 'شجرة', fr: 'L’Arbre' },
    { id: 'd_flower', icon: '🌸', eg: 'زهرة', fr: 'La Fleur' },
    { id: 'd_house', icon: '🏠', eg: 'منزل', fr: 'La Maison' },
    { id: 'd_car', icon: '🚗', eg: 'سيارة', fr: 'La Voiture' },
    { id: 'd_plane', icon: '✈️', eg: 'طائرة', fr: 'L’Avion' },
    { id: 'd_ship', icon: '🚢', eg: 'سفينة', fr: 'Le Bateau' },
    { id: 'd_book', icon: '📘', eg: 'كتاب', fr: 'Le Livre' },
    { id: 'd_pen', icon: '✏️', eg: 'قلم رصاص', fr: 'Le Crayon' },
    { id: 'd_apple', icon: '🍎', eg: 'تفاحة', fr: 'La Pomme' },
    { id: 'd_water', icon: '💧', eg: 'ماء', fr: 'L’Eau' },
    { id: 'd_bread', icon: '🥖', eg: 'خبز', fr: 'Le Pain' },
    { id: 'd_cat', icon: '🐱', eg: 'قطة', fr: 'Le Chat' },
    { id: 'd_dog', icon: '🐶', eg: 'كلب', fr: 'Le Chien' },
    { id: 'd_bird', icon: '🐦', eg: 'عصفور', fr: 'L’Oiseau' },
    { id: 'd_fish', icon: '🐠', eg: 'سمكة', fr: 'Le Poisson' },
    { id: 'd_star', icon: '⭐', eg: 'نجمة', fr: 'L’Étoile' }
  ];

  LumiGames.buildDictionary = function(stage) {
    const pool = [...DICT_ITEMS_PRO].sort(() => Math.random() - 0.5).slice(0, 4);
    const target = pool[0];
    const opts = [...pool].sort(() => Math.random() - 0.5);
    stage.innerHTML = `<div style="max-width:680px;margin:0 auto;text-align:center;"><div style="background:linear-gradient(135deg,#e0f2fe,#bae6fd);border:2px solid #0284c7;border-radius:20px;padding:18px;margin-bottom:14px;"><div style="font-size:0.95rem;font-weight:800;color:#0369a1;">📖 القاموس المصور</div><div style="font-size:1.7rem;font-weight:900;color:#0c4a6e;margin:8px 0;" dir="ltr">${target.fr}</div><div style="font-size:1.15rem;font-weight:800;color:#0284c7;">(${target.eg})</div><button type="button" id="dict-listen-btn" style="margin-top:8px;background:#0284c7;color:#fff;border:none;border-radius:12px;padding:7px 16px;font-weight:800;cursor:pointer;">🔊 استمع للكلمة</button></div><div id="dict-grid" style="display:grid;grid-template-columns:repeat(2,1fr);gap:12px;"></div></div>`;
    const speakWord = () => { if (window.LumiAudio && LumiAudio.speak) LumiAudio.speak(target.id, target.eg, target.fr); };
    stage.querySelector('#dict-listen-btn').onclick = speakWord;
    setTimeout(speakWord, 220);
    const grid = stage.querySelector('#dict-grid');
    opts.forEach(item => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.style.cssText = 'background:#fff;border:3px solid #7dd3fc;border-radius:18px;padding:18px;cursor:pointer;display:flex;flex-direction:column;align-items:center;justify-content:center;';
      btn.innerHTML = `<span style="font-size:3.4rem;">${item.icon}</span>`;
      btn.onclick = () => {
        if (item.id === target.id) { btn.style.background = '#dcfce7'; btn.style.borderColor = '#16a34a'; speakWord(); this.handleAnswer(true, target.id, true); }
        else { btn.style.background = '#fee2e2'; btn.style.borderColor = '#dc2626'; this.handleAnswer(false, target.id, false); }
      };
      grid.appendChild(btn);
    });
  };

  LumiGames.buildWordHunt = function(stage) {
    const pool = [...DICT_ITEMS_PRO].sort(() => Math.random() - 0.5).slice(0, 4);
    const target = pool[0];
    const opts = [...pool].sort(() => Math.random() - 0.5);
    stage.innerHTML = `<div style="max-width:680px;margin:0 auto;text-align:center;"><div style="background:linear-gradient(135deg,#ffedd5,#fed7aa);border:2px solid #f97316;border-radius:20px;padding:18px;margin-bottom:14px;"><div style="font-size:3.8rem;">${target.icon}</div><div style="font-size:1.25rem;font-weight:800;color:#7c2d12;margin:6px 0;">ما اسم <b>${target.eg}</b> بالفرنسية؟</div><button type="button" id="wh-listen-btn" style="background:#ea580c;color:#fff;border:none;border-radius:12px;padding:7px 16px;font-weight:800;cursor:pointer;">🔊 تلميح صوتي</button></div><div id="wh-grid" style="display:grid;grid-template-columns:repeat(2,1fr);gap:12px;"></div></div>`;
    const speakTarget = () => { if (window.LumiAudio && LumiAudio.speak) LumiAudio.speak(target.id, '', target.fr); };
    stage.querySelector('#wh-listen-btn').onclick = speakTarget;
    const grid = stage.querySelector('#wh-grid');
    opts.forEach(item => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.style.cssText = 'background:#fff;border:3px solid #fdba74;border-radius:18px;padding:18px 10px;font-size:1.3rem;font-weight:900;color:#7c2d12;cursor:pointer;';
      btn.innerText = item.fr;
      btn.onclick = () => {
        if (item.id === target.id) { btn.style.background = '#dcfce7'; btn.style.borderColor = '#16a34a'; speakTarget(); this.handleAnswer(true, target.id, true); }
        else { btn.style.background = '#fee2e2'; btn.style.borderColor = '#dc2626'; this.handleAnswer(false, target.id, false); }
      };
      grid.appendChild(btn);
    });
  };
})();
