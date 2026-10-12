# git-github-textbook

Git と GitHub 入門（教材）

パソコンの基本から始めて、まず一人で Git と GitHub を使いこなし、そのあと、ほかの人と一緒に開発（共同開発）もできるようになるための教材です。一人でも、仲間と一緒でも学べます（人数の前提はありません）。
環境は Windows 11 の PowerShell とメモ帳を前提にしています（VS Code の導入は、今後の課題）。

- 教材は `docs/` にあります（GitHub Pages で公開）
- 公開 URL: https://chitchi1216.github.io/git-github-textbook/

## 教材を書くときのルール

- 新しいコマンドを教材に出したら、**付録A（`docs/appendix-commands.html`）にも追加する**。
- コマンドや画面の手順は Windows 11 の PowerShell を前提にする。実機で確認できていない箇所には `<!-- TODO: Win11実機で確認 -->` を残す。
- 演習は OneDrive の外の `C:\work` で行う。
- 各章に、時々「チャレンジ」（初学者〜初級者向けの力試し）を入れる。
- スクリーンショットは `docs/images/` に置く（撮影リストは `docs/images/README.md`）。

## 版の管理

- 現在の版は `VERSION` ファイルに書く。変更点は `CHANGELOG.md` に記録する。
- 版を上げるときは `python3 tools/set_version.py 新しい版` を実行する。全ページのヘッダー（版・日付・作成者）が、まとめて更新される。

