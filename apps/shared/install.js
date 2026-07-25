(() => {
  'use strict';

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('sw.js').catch(() => {});
    });
  }

  const buttons = () => document.querySelectorAll('.install-btn');
  const isStandalone = () =>
    window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
  const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);

  let deferredPrompt = null;

  function setButtonsState(state) {
    buttons().forEach((btn) => {
      btn.dataset.state = state;
      if (state === 'installed') {
        btn.textContent = 'インストール済み ✓';
        btn.disabled = true;
      } else {
        btn.textContent = 'インストール';
        btn.disabled = false;
      }
    });
  }

  function showIOSSheet() {
    if (document.getElementById('iosInstallSheet')) return;
    const overlay = document.createElement('div');
    overlay.id = 'iosInstallSheet';
    overlay.innerHTML = `
      <div class="ios-sheet-backdrop"></div>
      <div class="ios-sheet">
        <p class="ios-sheet-title">ホーム画面に追加する</p>
        <ol>
          <li>画面下の <strong>共有ボタン</strong>(□に↑)をタップ</li>
          <li>メニューから <strong>「ホーム画面に追加」</strong> を選択</li>
          <li>右上の <strong>「追加」</strong> をタップして完了</li>
        </ol>
        <button type="button" class="ios-sheet-close">閉じる</button>
      </div>
    `;
    document.body.appendChild(overlay);
    const close = () => overlay.remove();
    overlay.querySelector('.ios-sheet-backdrop').addEventListener('click', close);
    overlay.querySelector('.ios-sheet-close').addEventListener('click', close);
  }

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    setButtonsState('ready');
  });

  window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    setButtonsState('installed');
  });

  document.addEventListener('click', async (e) => {
    const btn = e.target.closest('.install-btn');
    if (!btn) return;
    e.preventDefault();

    if (isStandalone()) {
      window.location.href = 'app/';
      return;
    }
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      deferredPrompt = null;
      if (choice.outcome !== 'accepted') setButtonsState('idle');
      return;
    }
    if (isIOS) {
      showIOSSheet();
      return;
    }
    // Browser without install support (e.g. desktop Safari/Firefox): open the app directly.
    window.location.href = 'app/';
  });

  if (isStandalone()) setButtonsState('installed');
})();
