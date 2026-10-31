#!/usr/bin/env python3
"""全ページのヘッダーの「版・日付・作成者」を、VERSION ファイルの内容に合わせて書き換える。

使い方:
    python3 tools/set_version.py              # VERSION の版と、今日の日付で更新
    python3 tools/set_version.py 0.2.0         # 版を 0.2.0 に変えて更新（VERSION も書き換える）
    python3 tools/set_version.py 0.2.0 2026-11-01 --label ドラフト
"""
import argparse, datetime, glob, html, pathlib, re

ROOT = pathlib.Path(__file__).resolve().parent.parent
AUTHOR = "chitchi1216"
AUTHOR_URL = "https://github.com/chitchi1216"
CHANGELOG_URL = "https://github.com/chitchi1216/git-github-textbook/blob/main/CHANGELOG.md"

ap = argparse.ArgumentParser()
ap.add_argument("version", nargs="?")
ap.add_argument("date", nargs="?")
ap.add_argument("--label", default="ドラフト", help="版のあとに付ける表示（例: ドラフト）。空にもできる")
a = ap.parse_args()

VERSION_RE = re.compile(r"[0-9]+\.[0-9]+\.[0-9]+")   # 大.中.小（例: 0.5.17）。プレリリース表記は使わない
DATE_RE = re.compile(r"[0-9]{4}-[0-9]{2}-[0-9]{2}")  # YYYY-MM-DD の完全一致


def check_version(v):
    if not VERSION_RE.fullmatch(v):
        ap.error(f"版は 大.中.小 の形式（例: 0.5.17）で指定してください: {v!r}")
    return v


def check_date(d):
    # fromisoformat 単独だと別の形式も通るので、形式の完全一致と実在日の確認を両方行う
    if not DATE_RE.fullmatch(d):
        ap.error(f"日付は YYYY-MM-DD の形式で指定してください: {d!r}")
    try:
        datetime.date.fromisoformat(d)
    except ValueError:
        ap.error(f"実在しない日付です: {d!r}")
    return d


def check_label(s):
    if any(ord(c) < 0x20 or ord(c) == 0x7F for c in s):
        ap.error("--label に改行などの制御文字は使えません")
    return s


# ここまでで、ファイルへの書き込みはひとつも行わない。すべての入力を検証してから書く。
vfile = ROOT / "VERSION"
# 「未指定（None）」と「空文字を明示」を区別する（空文字は未指定扱いにせず、検証で拒否する）
version = check_version(a.version if a.version is not None else vfile.read_text(encoding="utf-8").strip())
date = check_date(a.date if a.date is not None else datetime.date.today().isoformat())
a.label = check_label(a.label)

# HTML に入れる値は、すべてエスケープする（VERSION ファイルには元の値を書く）
label = f"（{html.escape(a.label, quote=True)}）" if a.label else ""
text = (f'<a href="{CHANGELOG_URL}">版 {html.escape(version, quote=True)}{label}</a>'
        f' ・ {html.escape(date, quote=True)} ・ 作成者 <a href="{AUTHOR_URL}">{AUTHOR}</a>')

pat = re.compile(r"<!--ver-->.*?<!--/ver-->", re.S)
replacement = f"<!--ver-->{text}<!--/ver-->"
vfile.write_text(version + "\n", encoding="utf-8")
n = 0
for f in sorted(glob.glob(str(ROOT / "docs" / "*.html"))):
    p = pathlib.Path(f)
    s = p.read_text(encoding="utf-8")
    if not pat.search(s):
        print("マーカーなし:", p.name)
        continue
    # 置換文字列ではなく関数を渡す（label 内のバックスラッシュを置換テンプレートとして解釈させない）
    p.write_text(pat.sub(lambda _m: replacement, s), encoding="utf-8")
    n += 1
print(f"{n} ページを更新しました: 版 {version}{label} / {date}")
