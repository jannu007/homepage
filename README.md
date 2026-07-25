# YOUKOKU STUDIO — App Sales Homepage

作成したアプリを販売・紹介するための、完全無料で運用できるおしゃれなホームページです。
[tagboat.com](https://www.tagboat.com/) を参考に、大胆なタイポグラフィとスクロール演出を取り入れたデザインにしています。

フレームワークやビルドツールを一切使わない **素の HTML / CSS / JavaScript** で構成しているため、
サーバー費用もビルド費用もかからず、静的ホスティングサービスに置くだけで公開できます。

## 構成

```
.
├── index.html            # ページ本体
├── assets/
│   ├── css/style.css     # スタイル（デザインの中心）
│   └── js/main.js        # スクロール演出・ヘッダー制御などの挙動
└── README.md
```

## ローカルで確認する

ビルド不要です。`index.html` をブラウザで直接開くか、簡易サーバーを立てて確認してください。

```bash
# Python がある場合
python3 -m http.server 8000
# → http://localhost:8000 を開く
```

## 無料で公開する方法（おすすめ: GitHub Pages）

1. このリポジトリを GitHub にプッシュする
2. GitHub の `Settings` → `Pages` を開く
3. `Source` を `Deploy from a branch` にし、対象ブランチと `/ (root)` を選択して `Save`
4. 数分後、`https://<ユーザー名>.github.io/<リポジトリ名>/` で公開されます

他にも [Netlify](https://www.netlify.com/) や [Vercel](https://vercel.com/) の無料プランにこのフォルダをそのままドラッグ&ドロップ／連携するだけで公開できます。独自ドメインも無料プラン内で設定可能です。

## カスタマイズのポイント

- **サイト名・キャッチコピー**: `index.html` 内の `<h1 class="hero-title">` 付近
- **掲載アプリ**: `index.html` の `<section class="works">` 内、`.work-item` を複製して追加・編集
- **配色**: `assets/css/style.css` 冒頭の `:root` 変数（`--accent` などを変更するだけで全体の印象が変わります）
- **問い合わせ先**: `index.html` 内の `mailto:hello@youkokustudio.app` を実際のメールアドレスに変更
- **お知らせ**: `<section class="news">` 内の `<li class="news-item">` を編集

## ライセンス

このテンプレートは自由に改変・商用利用していただけます。
