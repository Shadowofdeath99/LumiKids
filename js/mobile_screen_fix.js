(function() {
  // 1. ضبط وسم Viewport بدقة للموبايل والـ WebView
  let meta = document.querySelector('meta[name="viewport"]');
  if (!meta) {
    meta = document.createElement('meta');
    meta.name = 'viewport';
    document.head.appendChild(meta);
  }
  meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover';

  // 2. حقن تنسيقات التجاوب الكامل وحماية الحواف الآمنة (Safe Areas)
  const style = document.createElement('style');
  style.id = 'lumi-mobile-responsive-fix';
  style.textContent = `
    html, body {
      max-width: 100vw !important;
      overflow-x: hidden !important;
      box-sizing: border-box !important;
      padding-top: env(safe-area-inset-top, 12px) !important;
      padding-bottom: env(safe-area-inset-bottom, 16px) !important;
      padding-left: env(safe-area-inset-left, 4px) !important;
      padding-right: env(safe-area-inset-right, 4px) !important;
      -webkit-text-size-adjust: 100%;
    }
    *, *::before, *::after {
      box-sizing: border-box !important;
    }
    @media (max-width: 768px) {
      .app-header, header, nav, .top-bar {
        flex-wrap: wrap !important;
        gap: 6px !important;
        padding: 8px 10px !important;
      }
      #games-grid, .games-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
        gap: 10px !important;
        padding: 8px !important;
      }
      .game-card {
        padding: 12px 8px !important;
        min-height: auto !important;
      }
      #game-stage, .game-stage, .modal-content {
        width: 96vw !important;
        max-width: 96vw !important;
        margin: 0 auto !important;
        padding: 10px 8px !important;
      }
      button, select {
        max-width: 100% !important;
        font-size: clamp(0.85rem, 3.6vw, 1.1rem) !important;
      }
    }
  `;
  document.head.appendChild(style);
})();
