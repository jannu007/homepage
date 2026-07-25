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

  function setLabel(btn, text) {
    const span = btn.querySelector('span');
    if (span) span.textContent = text; else btn.textContent = text;
  }

  function setButtonsState(state) {
    buttons().forEach((btn) => {
      btn.dataset.state = state;
      if (state === 'installed') {
        setLabel(btn, 'インストール済み ✓');
        btn.disabled = true;
      } else {
        setLabel(btn, 'アプリをインストール');
        btn.disabled = false;
      }
    });
  }

  function showSheet(bodyHtml) {
    if (document.getElementById('installSheet')) return;
    const overlay = document.createElement('div');
    overlay.id = 'installSheet';
    overlay.innerHTML = `
      <div class="ios-sheet-backdrop"></div>
      <div class="ios-sheet">
        <p class="ios-sheet-title">ホーム画面に追加する</p>
        ${bodyHtml}
        <button type="button" class="ios-sheet-close">閉じる</button>
      </div>
    `;
    document.body.appendChild(overlay);
    const close = () => overlay.remove();
    overlay.querySelector('.ios-sheet-backdrop').addEventListener('click', close);
    overlay.querySelector('.ios-sheet-close').addEventListener('click', close);
  }

  function showIOSSheet() {
    showSheet(`
      <ol>
        <li>画面下の <strong>共有ボタン</strong>(□に↑)をタップ</li>
        <li>メニューから <strong>「ホーム画面に追加」</strong> を選択</li>
        <li>右上の <strong>「追加」</strong> をタップして完了</li>
      </ol>
    `);
  }

  function showGenericSheet() {
    showSheet(`
      <ol>
        <li>ブラウザ右上の <strong>メニュー(⋮)</strong> を開く</li>
        <li><strong>「ホーム画面に追加」</strong> または <strong>「アプリをインストール」</strong> を選択</li>
        <li>表示に従って追加すれば完了です</li>
      </ol>
    `);
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

    if (isStandalone()) return;

    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      deferredPrompt = null;
      if (choice.outcome !== 'accepted') setButtonsState('idle');
      return;
    }
    if (isIOS) {
      showIOSSheet();
    } else {
      showGenericSheet();
    }
  });

  if (isStandalone()) setButtonsState('installed');
})();
