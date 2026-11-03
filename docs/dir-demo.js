/* 動かして学ぶ：ディレクトリと現在地
 * 外部ライブラリなし・通信なし。画面の文字は textContent だけで作る（innerHTML は使わない）。
 * 実際のファイルには一切さわらない。フォルダの木は、ここに書いた「見本」。
 */
(function () {
  'use strict';

  // ---- 見本のフォルダの木（第2章の C:\work と同じ形） ----
  function dir(name, dirs, files) {
    return { name: name, dirs: dirs || [], files: files || [] };
  }
  var ROOT = dir('C:\\', [
    dir('work', [
      dir('practice', [], ['memo.txt']),
      dir('my-notes')
    ]),
    dir('Users', [
      dir('taro', [dir('Documents')])
    ])
  ]);
  var START = ['work'];

  // ---- パスの計算 ----
  function pathStr(p) { return 'C:\\' + p.join('\\'); }
  function same(a, b) { return a.join('\\').toLowerCase() === b.join('\\').toLowerCase(); }

  function nodeAt(p) {
    var n = ROOT;
    for (var i = 0; i < p.length; i++) {
      var next = null;
      for (var j = 0; j < n.dirs.length; j++) {
        if (n.dirs[j].name.toLowerCase() === p[i].toLowerCase()) { next = n.dirs[j]; break; }
      }
      if (!next) return null;
      n = next;
    }
    return n;
  }

  // 戻り値: { ok: true, path: [...] } か { ok: false, tried: 'C:\...' }
  function resolve(cur, arg) {
    var s = arg.trim().replace(/\//g, '\\');
    var base = cur.slice();
    var m = /^([A-Za-z]):(.*)$/.exec(s);
    if (m) {
      if (m[1].toUpperCase() !== 'C') return { ok: false, tried: s };
      base = [];
      s = m[2];
    }
    if (s.charAt(0) === '\\') base = [];
    var parts = s.split('\\');
    for (var i = 0; i < parts.length; i++) {
      var seg = parts[i];
      if (seg === '' || seg === '.') continue;
      if (seg === '..') { base.pop(); continue; }
      var cand = base.concat([seg]);
      var node = nodeAt(cand);
      if (!node) return { ok: false, tried: pathStr(cand) };
      base = cand.map(function (_, k) { return nodeAt(cand.slice(0, k + 1)).name; });
    }
    return { ok: true, path: base };
  }

  // ---- 画面の部品 ----
  var treeBox = document.getElementById('tree');
  var term = document.getElementById('term');
  var explain = document.getElementById('explain');
  var status = document.getElementById('status');
  if (!treeBox || !term || !explain || !status) return;

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text !== undefined) e.textContent = text;
    return e;
  }

  var cur = START.slice();
  var prev = null;      // 直前にいた場所（木の上で、さっきまでいた印を出す）
  var log = [];         // 端末に出す行 { cls, text }
  var MAX_LOG = 60;

  function renderTree() {
    treeBox.textContent = '';
    var ul = el('ul', 'tree');
    ul.appendChild(buildNode(ROOT, [], true));
    treeBox.appendChild(ul);
  }

  function buildNode(node, path, isRoot) {
    var li = el('li');
    var row = el('div', 'node');
    var isHere = same(path, cur);
    if (isHere) row.classList.add('here');
    else if (prev && same(path, prev)) row.classList.add('left');
    row.appendChild(el('span', 'ico', isRoot ? '💽' : '📁'));
    row.appendChild(el('span', 'nm', node.name));
    if (isHere) row.appendChild(el('span', 'badge', '← 今ここ'));
    li.appendChild(row);
    if (node.dirs.length || node.files.length) {
      var ul = el('ul');
      node.dirs.forEach(function (d) { ul.appendChild(buildNode(d, path.concat([d.name]), false)); });
      node.files.forEach(function (f) {
        var fl = el('li');
        var fr = el('div', 'node file');
        fr.appendChild(el('span', 'ico', '📄'));
        fr.appendChild(el('span', 'nm', f));
        fl.appendChild(fr);
        ul.appendChild(fl);
      });
      li.appendChild(ul);
    }
    return li;
  }

  function renderTerm() {
    term.textContent = '';
    log.forEach(function (ln) {
      term.appendChild(el('span', ln.cls, ln.text + '\n'));
    });
    term.appendChild(el('span', 'ps', 'PS ' + pathStr(cur) + '> '));
    term.appendChild(el('span', 'caret', '▌'));
    term.scrollTop = term.scrollHeight;
  }

  function push(cls, text) {
    log.push({ cls: cls, text: text });
    while (log.length > MAX_LOG) log.shift();
  }

  function setExplain(kind, text) {
    explain.className = 'explain ' + kind;
    explain.textContent = text;
  }

  // ---- コマンドの実行（見本） ----
  function run(cmd) {
    var promptText = 'PS ' + pathStr(cur) + '> ' + cmd;
    push('ps', promptText);
    var parts = cmd.trim().split(/\s+/);
    var name = parts[0].toLowerCase();
    var arg = parts.slice(1).join(' ');
    prev = null;

    if (name === 'pwd') {
      push('out', 'Path');
      push('out', '----');
      push('out', pathStr(cur));
      push('out', '');
      setExplain('info', 'pwd は「今どこ？」と聞くコマンドです。左の木で「← 今ここ」と書いてある場所を、文字で答えてくれます。迷子になったら、まず pwd。');
      status.textContent = '今いる場所は ' + pathStr(cur) + ' です。';
    } else if (name === 'ls') {
      var node = nodeAt(cur);
      var empty = node.dirs.length + node.files.length === 0;
      // 空のフォルダでは、実際の PowerShell も何も表示せず、そのままプロンプトに戻る
      if (!empty) {
        push('out', '    Directory: ' + pathStr(cur));
        push('out', '');
        push('out', 'Mode    Name');
        push('out', '----    ----');
        node.dirs.forEach(function (d) { push('out', 'd-----  ' + d.name); });
        node.files.forEach(function (f) { push('out', '-a----  ' + f); });
        push('out', '');
      }
      setExplain('info', empty
        ? 'ls は「この部屋に何がある？」と聞くコマンドです。このフォルダは空なので、何も表示されません。'
        : 'ls は「この部屋に何がある？」と聞くコマンドです。表示されるのは、左の木で「今ここ」の直下にあるものだけ。d は「ディレクトリ（フォルダ）」の印です。');
      status.textContent = pathStr(cur) + ' の中身を一覧しました。';
    } else if (name === 'cd') {
      var r = resolve(cur, arg);
      if (r.ok) {
        var before = cur;
        cur = r.path;
        prev = same(before, cur) ? null : before;
        var isAbs = /^[A-Za-z]:|^\\|^\//.test(arg.trim());
        var stayed = same(before, cur);
        if (stayed && arg.trim() === '..') {
          setExplain('ok', 'ここが一番上（C:\\）なので、これより上のフォルダはありません。現在地は変わりません。');
        } else if (stayed) {
          setExplain('ok', 'もうその場所にいるので、現在地は変わりません。');
        } else if (arg.trim() === '..') {
          setExplain('ok', 'cd .. は「ひとつ上のフォルダへ戻る」です。.. は「ひとつ上」を表す記号です。木では、親のフォルダに移ります。');
        } else if (isAbs) {
          setExplain('ok', 'これは絶対パス（住所）です。ドライブ名 C: から全部書いているので、今どこにいても、同じ場所に行けます。');
        } else {
          setExplain('ok', 'これは相対パス（道案内）です。「今いる場所の中にある ' + arg.trim() + '」へ入りました。木では、今ここから下へ降りています。');
        }
        status.textContent = stayed
          ? '現在地は ' + pathStr(cur) + ' のままです。'
          : pathStr(before) + ' → ' + pathStr(cur) + ' に移動しました。';
      } else {
        push('err', 'cd : パス \'' + r.tried + '\' が存在しないため検出できません。');
        push('out', '');
        var isAbs2 = /^[A-Za-z]:|^\\|^\//.test(arg.trim());
        setExplain('ng', isAbs2
          ? 'その住所のフォルダは、見本の木にありません。'
          : 'エラーです。今いる場所（' + pathStr(cur) + '）の中に「' + arg.trim() + '」というフォルダがないためです。相対パスは「今いる場所」が変わると、行き先も変わります。住所（絶対パス）なら、どこからでも行けます。');
        status.textContent = '移動できませんでした。今いる場所は ' + pathStr(cur) + ' のままです。';
      }
    }
    renderTree();
    renderTerm();
  }

  function reset() {
    cur = START.slice();
    prev = null;
    log = [];
    setExplain('info', '下のボタンを押すと、左の木と右の画面が一緒に動きます。まずは ls や pwd を押してみましょう。');
    status.textContent = '最初の場所（' + pathStr(cur) + '）に戻しました。';
    renderTree();
    renderTerm();
  }

  // ---- ボタンの結びつけ ----
  Array.prototype.forEach.call(document.querySelectorAll('button[data-cmd]'), function (b) {
    b.addEventListener('click', function () { run(b.getAttribute('data-cmd')); });
  });
  var rb = document.getElementById('reset');
  if (rb) rb.addEventListener('click', reset);

  reset();
  status.textContent = '';
})();
