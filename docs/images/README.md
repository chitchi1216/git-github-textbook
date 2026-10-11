# スクリーンショット撮影リスト

教材の画像枠に表示される画像です。ここに **同じファイル名** で PNG を置くと、教材に自動で表示されます（コードの修正は不要）。

## 撮り方（Windows 11）

1. `Windows` + `Shift` + `S` を押す
2. 範囲を選ぶ（画面の必要な部分だけ）
3. 撮った画像を「ペイント」などに貼り付け、PNG で `docs/images/` に保存する

## 気をつけること

- **メールアドレス、パスワード、確認コード、本名**が写っていないか確認し、写っていたら塗りつぶす
- 横幅は 1000px 前後に収める（大きすぎると読み込みが遅くなる）
- GitHub のアカウント名は `chitchi1216` を使う

## 一覧

| ファイル名 | 章 | 撮るもの |
|---|---|---|
| `ch00-github-signup.png` | 第0章 | https://github.com/signup の入力画面（入力前の状態でよい） |
| `ch00-github-profile.png` | 第0章 | `https://github.com/chitchi1216` のプロフィール画面 |
| `ch00-git-installer.png` | 第0章 | Git のインストーラー（最初の画面か、設定を選ぶ画面） |
| `ch00-powershell-open.png` | 第0章 | スタートメニューで「PowerShell」と入力した画面 |
| `ch00-git-config.png` | 第0章 | PowerShell で `git config --global --list` を実行した画面（メールは隠す） |
| `ch01-explorer-address-bar.png` | 第1章 | エクスプローラーのアドレスバーをクリックし、パスが文字で表示された画面 |
| `ch01-explorer-extension.png` | 第1章 | 「表示」メニューで「ファイル名拡張子」にチェックを入れる画面 |
| `ch02-explorer-vs-powershell.png` | 第2章 | 同じフォルダ（`practice`）を、エクスプローラーと PowerShell で並べた画面（アドレスバーとプロンプトが両方写るように） |
| `ch02-input-mode.png` | 第0章・第2章 | 画面右下の入力モード表示（「A」と「あ」の両方）。半角英数の確認に使う |
| `ch02-notepad.png` | 第2章 | PowerShell から `notepad memo.txt` を実行して、メモ帳が開いた画面（ターミナルとメモ帳が並ぶように） |
| `ch04-new-repo.png` | 第4章 | GitHub の「New repository」画面（名前 `my-notes`、Private、README にチェックなし） |
| `ch04-repo-after-push.png` | 第4章 | `git push` のあとの、GitHub のリポジトリ画面（`hello.txt` とコミット数が見える） |
| `ch04-browser-auth.png` | 第4章 | 初めて `git push` したときに開く、ログイン・許可の画面 |
| `ch04-edit-file.png` | 第4章 | GitHub の画面で `hello.txt` を編集して、「Commit changes」を押す画面 |

## 追加済みの画像

次の画像は、実機の画面から作成して、`docs/images/` に入っています。WSL のパス、メールアドレスは、黒く塗りつぶしてあります。

| ファイル名 | 内容 |
|---|---|
| `ch00-git-installer.png` | Git のインストーラーの最初の画面 |
| `ch00-github-profile.png` | GitHub のプロフィール画面（`chitchi1216`） |
| `ch00-git-config-ng.png` | `git config --global --list` で `user.email` の行がない状態の例（マスク済み） |
| `ch01-explorer-address-bar.png` | エクスプローラーのアドレスバー（パスが `¥` で表示される） |
| `ch01-folder-options.png` | 「フォルダー オプション」の「表示」タブ（拡張子の設定） |
| `ch02-input-mode.png` | 入力モード表示（「A」と「あ」） |
| `ch04-browser-auth.png` | ブラウザの GitHub サインイン画面（第4章の認証） |
| `ch03-commit-editmsg.png` | `-m` なしの `git commit` で開く、メモ帳の画面（メールアドレスは塗りつぶし） |

まだ必要な画像は、上の表の「`ch00-github-signup.png`」「`ch00-powershell-open.png`」「`ch00-git-config.png`（3行そろった正しい状態）」「`ch01-explorer-extension.png`」「`ch02-explorer-vs-powershell.png`」「`ch02-notepad.png`」と、第4章の4枚です。

