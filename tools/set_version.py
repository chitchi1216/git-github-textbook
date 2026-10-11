#!/usr/bin/env python3
"""全ページのヘッダーの「版・日付・作成者」を、VERSION ファイルの内容に合わせて書き換える。

使い方:
    python3 tools/set_version.py              # VERSION の版と、今日の日付で更新
    python3 tools/set_version.py 0.2.0         # 版を 0.2.0 に変えて更新（VERSION も書き換える）
    python3 tools/set_version.py 0.2.0 2026-11-01 --label ドラフト
"""
import argparse, datetime, glob, pathlib, re

ROOT = pathlib.Path(__file__).resolve().parent.parent
AUTHOR = "chitchi1216"
AUTHOR_URL = "https://github.com/chitchi1216"
CHANGELOG_URL = "https://github.com/chitchi1216/git-github-textbook/blob/main/CHANGELOG.md"

ap = argparse.ArgumentParser()
ap.add_argument("version", nargs="?")
ap.add_argument("date", nargs="?")
ap.add_argument("--label", default="ドラフト", help="版のあとに付ける表示（例: ドラフト）。空にもできる")
a = ap.parse_args()

vfile = ROOT / "VERSION"
version = a.version or vfile.read_text(encoding="utf-8").strip()
date = a.date or datetime.date.today().isoformat()
vfile.write_text(version + "\n", encoding="utf-8")

label = f"（{a.label}）" if a.label else ""
text = (f'<a href="{CHANGELOG_URL}">版 {version}{label}</a>'
        f' ・ {date} ・ 作成者 <a href="{AUTHOR_URL}">{AUTHOR}</a>')

pat = re.compile(r"<!--ver-->.*?<!--/ver-->", re.S)
n = 0
for f in sorted(glob.glob(str(ROOT / "docs" / "*.html"))):
    p = pathlib.Path(f)
    s = p.read_text(encoding="utf-8")
    if not pat.search(s):
        print("マーカーなし:", p.name)
        continue
    p.write_text(pat.sub(f"<!--ver-->{text}<!--/ver-->", s), encoding="utf-8")
    n += 1
print(f"{n} ページを更新しました: 版 {version}{label} / {date}")
