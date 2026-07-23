(() => {
  'use strict';
  let toastTimer;
  let blurTimer;

  function showToast(message) {
    let toast = document.querySelector('.security-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'security-toast';
      toast.setAttribute('role', 'status');
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2600);
  }

  function createCurtain() {
    const curtain = document.createElement('div');
    curtain.className = 'privacy-curtain';
    curtain.innerHTML = '<div><b>Presentación iPath</b><span>Vuelve a la ventana del catálogo para continuar.</span></div>';
    document.body.appendChild(curtain);
    return curtain;
  }

  function repeatWatermark(text) {
    const grid = document.createElement('div');
    grid.className = 'security-watermark-grid';
    grid.setAttribute('aria-hidden', 'true');
    for (let i = 0; i < 4; i += 1) {
      const row = document.createElement('span');
      row.textContent = `${text}   ·   ${text}   ·   ${text}`;
      grid.appendChild(row);
    }
    document.body.appendChild(grid);
  }

  function protectInteractions(curtain) {
    document.addEventListener('contextmenu', (event) => {
      if (event.target.closest('img,video,canvas,svg,.map-canvas,.texture-board,.app-detail-media')) {
        event.preventDefault();
        showToast('Contenido visual de presentación.');
      }
    });
    document.addEventListener('dragstart', (event) => {
      if (event.target.closest('img,video,canvas,svg')) event.preventDefault();
    });
    document.addEventListener('keydown', (event) => {
      const key = event.key.toLowerCase();
      const blocked = key === 'f12' ||
        ((event.ctrlKey || event.metaKey) && ['s', 'p', 'u'].includes(key)) ||
        ((event.ctrlKey || event.metaKey) && event.shiftKey && ['i', 'j', 'c'].includes(key));
      if (blocked) {
        event.preventDefault();
        showToast('Acción deshabilitada en esta presentación.');
      }
    });
    document.addEventListener('keyup', (event) => {
      if (event.key === 'PrintScreen') showToast('El documento incorpora una marca visual de CUEVA.');
    });
    document.addEventListener('visibilitychange', () => {
      curtain.classList.toggle('open', document.hidden);
    });
    window.addEventListener('blur', () => {
      clearTimeout(blurTimer);
      blurTimer = setTimeout(() => curtain.classList.add('open'), 220);
    });
    window.addEventListener('focus', () => {
      clearTimeout(blurTimer);
      curtain.classList.remove('open');
    });
  }

  function init() {
    const date = new Intl.DateTimeFormat('es-ES', { dateStyle: 'short' }).format(new Date());
    repeatWatermark(`CUEVA · CATÁLOGO MUNICIPAL IPATH · ${date}`);
    protectInteractions(createCurtain());
    document.documentElement.classList.add('public-catalog');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
