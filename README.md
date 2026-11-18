# AONA サンプルサイト

架空のデザインカンパニー「AONA」のコーポレートサイトです。フロントは Figma Make で作成し、バックエンドを追加しています。

> [!NOTE]
> 架空の企業を題材にしたサンプルです。企業情報・実績・人物・受賞歴などは、すべて架空のものです。
> 写真は [Unsplash](https://unsplash.com/) の素材です。説明に書かれた撮影地や被写体とは関係ありません。

## できること

- **公開ページ**：トップ、私たちについて、事業紹介、プロジェクト、サステナビリティ、ニュース、会社情報、採用情報、お問い合わせ、プライバシーポリシー
- **お問い合わせフォーム**：サーバー側で入力をチェックして SQLite に保存します。同じ IP からの送信は 10 分に 5 件まで（6 件目から HTTP 429）で、ボットが入力する隠し欄（ハニーポット）も設けています
- **ニュース・実績**：API から取得して表示します
- **管理画面**（`#/admin`）：パスワードでログインし、お問い合わせの一覧を見たり、ニュースを追加・編集・削除したりできます

## 技術スタック

| 区分 | 使っているもの |
|---|---|
| フロント | React 19、Vite 8、Tailwind CSS v4、TypeScript |
| バックエンド | [Hono](https://hono.dev/)、Node.js 標準の `node:sqlite` |
| テスト | Node.js 標準の `node:test` |

## 動かし方

### 必要なもの

- Node.js 22.18 以降（TypeScript を変換なしで実行し、`node:sqlite` を使うため）
- pnpm

### 手順

```sh
pnpm install
cp .env.example .env    # ADMIN_PASSWORD を好きな値に変える
pnpm dev:server         # API サーバー（http://localhost:8787）
pnpm dev                # フロント（http://localhost:8443）。別のターミナルで起動する
```

ブラウザで http://localhost:8443/ を開きます。管理画面は http://localhost:8443/#/admin です。

開発中は、Vite が `/api` へのリクエストを API サーバーに転送します。そのため、フロントと API サーバーの両方を起動してください。

### 環境変数

| 変数 | 既定値 | 内容 |
|---|---|---|
| `ADMIN_PASSWORD` | （なし） | 管理画面のパスワード。未設定のときは管理画面にログインできません |
| `API_PORT` | `8787` | API サーバーのポート |
| `DB_PATH` | `data/aona.db` | SQLite のデータベースファイル |

### コマンド

| コマンド | 内容 |
|---|---|
| `pnpm dev` | フロントの開発サーバーを起動する |
| `pnpm dev:server` | API サーバーを起動する（ファイルを変更すると自動で再起動） |
| `pnpm server` | API サーバーを起動する（自動再起動なし） |
| `pnpm test` | API のテストを実行する |
| `pnpm typecheck` | 型チェックをする |
| `pnpm build` | フロントをビルドする（出力先は `dist/`） |

## API

| メソッド | パス | 内容 | ログイン |
|---|---|---|---|
| `POST` | `/api/contact` | お問い合わせを送信する | 不要 |
| `GET` | `/api/news?limit=` | ニュースを新しい順に取得する | 不要 |
| `GET` | `/api/projects` | 実績を取得する | 不要 |
| `POST` | `/api/admin/login` | ログインする（`{ "password": "..." }`） | 不要 |
| `POST` | `/api/admin/logout` | ログアウトする | 不要 |
| `GET` | `/api/admin/me` | ログイン中かどうかを確認する | 必要 |
| `GET` | `/api/admin/inquiries` | お問い合わせの一覧を取得する | 必要 |
| `POST` | `/api/admin/news` | ニュースを追加する | 必要 |
| `PUT` | `/api/admin/news/:id` | ニュースを更新する | 必要 |
| `DELETE` | `/api/admin/news/:id` | ニュースを削除する | 必要 |

入力エラーのときは、HTTP 400 で `{ "errors": { "項目名": "メッセージ" } }` を返します。

## ディレクトリ構成

```
server/
  index.ts        API サーバーの起動
  app.ts          API のルーティングと入力チェック
  db.ts           テーブル定義と初期データ
  app.test.ts     API のテスト
src/
  api.ts          フロントから API を呼ぶ関数
  pages/          各ページ（AdminPage.tsx が管理画面）
  components/     共通レイアウト
.figma/           Figma Make 用の設定（Figma Make での取り込み・公開に使う）
```

## データの保存先

| データ | 保存先 |
|---|---|
| お問い合わせ・ニュース・実績 | SQLite（`DB_PATH`）。初めて起動したときに、ニュースと実績の初期データが入ります |
| 管理画面のログイン状態 | サーバーのメモリ（8 時間で失効し、再起動するとログアウト） |
| 送信回数の記録 | サーバーのメモリ（再起動でリセット） |

データを初期状態に戻すには、`data/aona.db` を削除してから API サーバーを起動し直します。

## 注意点

- Figma Make の公開機能は静的サイトとして公開するため、公開したサイトでは API が動きません（お問い合わせの送信、ニュース・実績の表示ができません）。全機能を確認するときは、手元で動かしてください。
- 送信回数の制限は、接続元の IP で判定しています。リバースプロキシの後ろに置くと全員が同じ IP に見えるため、サイト全体での制限になります。
- メール通知の機能はありません。

## クレジット

- 写真：[Unsplash](https://unsplash.com/)（[Unsplash License](https://unsplash.com/license)）
- フォント：[Noto Sans JP](https://fonts.google.com/noto/specimen/Noto+Sans+JP) / [Noto Serif JP](https://fonts.google.com/noto/specimen/Noto+Serif+JP)（SIL Open Font License）
