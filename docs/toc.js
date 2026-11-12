/* 左サイドバーの目次（全章の一覧 ＋ 今の章の節の一覧 ＋ 今読んでいる節の強調）
 * 外部ライブラリなし・通信なし。画面の文字は textContent だけで作る（innerHTML は使わない）。
 * JavaScript が使えないときは、サイドバーが出ないだけで、ページはそのまま読める。
 * 章を増やしたら、下の CHAPTERS に1行足す（準備中の章は file を null にする）。
 * 公開したが、まだ書き足している章は tag: '作成中' を付ける（完成したら tag を消す）。
 */
(function () {
  'use strict';

  var CHAPTERS = [
    { no: '第0章', title: 'はじめに・準備', file: 'chapter-00.html' },
    { no: '第1章', title: 'パソコンの仕組み', file: 'chapter-01.html' },
    { no: '第2章', title: 'ターミナル入門', file: 'chapter-02.html' },
    { no: '第3章', title: 'Git の基本：記録をつくる', file: 'chapter-03.html' },
    { no: '第4章', title: 'GitHub と連携する：送る・受け取る', file: 'chapter-04.html' },
    { no: '第5章', title: '一人で使いこなす', file: 'chapter-05.html' },
    { no: '第6章', title: 'ブランチ：作業を枝分かれさせる', file: 'chapter-06.html' },
    { no: '第7章', title: 'Pull Request', file: 'chapter-07.html', tag: '作成中' },
    { no: '第8章', title: 'コンフリクトの解消', file: null },
    { no: '第9章', title: '共同開発演習', file: null }
  ];
  // サイドバーの最上部に、目立つカードで出す補足ページ
  var FEATURES = [
    { icon: '🖱', title: '動かして学ぶ', desc: 'ディレクトリと現在地（cd の動きが見える）', file: 'dir-demo.html' }
  ];
  var APPENDIX = [
    { no: '付録A', title: 'よく使うコマンド一覧', file: 'appendix-commands.html' }
  ];

  var main = document.querySelector('main');
  if (!main) return;

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text !== undefined) e.textContent = text;
    return e;
  }

  // 今のページのファイル名（例: chapter-02.html）
  var here = location.pathname.split('/').pop() || 'index.html';

  // 本文の見出し（h2）に、飛び先の id をつける（すでにあれば、そのまま使う）
  var heads = Array.prototype.slice.call(main.querySelectorAll('h2'));
  heads.forEach(function (h, i) { if (!h.id) h.id = 'sec-' + (i + 1); });

  var secLinks = [];   // 節のリンク（heads と同じ並び）

  function buildItem(c) {
    var li = el('li');
    if (!c.file) {
      li.className = 'soon';
      li.appendChild(el('span', 'no', c.no));
      li.appendChild(el('span', 'tt', c.title));
      li.appendChild(el('span', 'tag', '準備中'));
      return li;
    }
    var a = el('a', 'ch');
    a.setAttribute('href', c.file);
    a.appendChild(el('span', 'no', c.no));
    a.appendChild(el('span', 'tt', c.title));
    if (c.tag) a.appendChild(el('span', 'tag', c.tag));
    li.appendChild(a);
    if (c.file === here) {
      li.className = 'current';
      a.setAttribute('aria-current', 'page');
      var ul = el('ul', 'secs');
      heads.forEach(function (h) {
        var sl = el('li');
        var sa = el('a', 'sec', h.textContent.trim());
        sa.setAttribute('href', '#' + h.id);
        sl.appendChild(sa);
        ul.appendChild(sl);
        secLinks.push(sa);
      });
      li.appendChild(ul);
    }
    return li;
  }

  var nav = el('nav', 'sidenav');
  nav.id = 'sidenav';
  nav.setAttribute('aria-label', '目次');

  var top = el('a', 'sn-title', 'Git と GitHub 入門');
  top.setAttribute('href', 'index.html');
  nav.appendChild(top);

  FEATURES.forEach(function (f) {
    var a = el('a', 'sn-feature');
    a.setAttribute('href', f.file);
    if (f.file === here) { a.classList.add('current'); a.setAttribute('aria-current', 'page'); }
    a.appendChild(el('span', 'sf-tag', 'おすすめ'));
    a.appendChild(el('span', 'sf-title', f.icon + ' ' + f.title));
    a.appendChild(el('span', 'sf-desc', f.desc));
    nav.appendChild(a);
  });

  var ul1 = el('ul', 'chapters');
  CHAPTERS.forEach(function (c) { ul1.appendChild(buildItem(c)); });
  nav.appendChild(ul1);

  nav.appendChild(el('div', 'sn-label', '付録'));
  var ul2 = el('ul', 'chapters');
  APPENDIX.forEach(function (c) { ul2.appendChild(buildItem(c)); });
  nav.appendChild(ul2);

  // 狭い画面用の開閉ボタン（広い画面では CSS で隠す）
  var btn = el('button', 'sn-toggle', '☰ 目次');
  btn.type = 'button';
  btn.setAttribute('aria-controls', 'sidenav');
  btn.setAttribute('aria-expanded', 'false');

  function setOpen(open) {
    document.body.classList.toggle('sn-open', open);
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  }
  btn.addEventListener('click', function () { setOpen(!document.body.classList.contains('sn-open')); });
  nav.addEventListener('click', function (e) {
    var a = e.target && e.target.closest ? e.target.closest('a') : null;
    if (!a) return;
    var wasOpen = document.body.classList.contains('sn-open');
    setOpen(false);
    // 狭い画面で、閉じた目次の中にフォーカスが残らないよう、飛び先の見出しにフォーカスを移す
    var href = a.getAttribute('href') || '';
    if (wasOpen && href.charAt(0) === '#') {
      var target = document.getElementById(href.slice(1));
      if (target) { target.setAttribute('tabindex', '-1'); target.focus({ preventScroll: true }); }
    }
  });
  // Esc：開いているときだけ閉じる。目次の中にフォーカスがあれば、☰ ボタンに戻す
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape' || !document.body.classList.contains('sn-open')) return;
    var inside = nav.contains(document.activeElement);
    setOpen(false);
    if (inside) btn.focus();
  });

  // 「本文へ」スキップリンク ＋ ☰ ボタン ＋ 目次 の順で、ページの先頭に置く（Tab の順番が自然になる）
  main.id = main.id || 'main-content';
  var skip = el('a', 'sn-skip', '本文へ');
  skip.setAttribute('href', '#' + main.id);
  document.body.insertBefore(nav, document.body.firstChild);
  document.body.insertBefore(btn, nav);
  document.body.insertBefore(skip, btn);
  document.body.classList.add('has-sidenav');

  // ---- 今読んでいる節を強調する ----
  var activeIdx = -1;
  var ticking = false;

  function update() {
    ticking = false;
    var line = 140;   // 画面の上から、この位置を過ぎた最後の見出しを「今の節」とする
    var cur = -1;
    for (var i = 0; i < heads.length; i++) {
      if (heads[i].getBoundingClientRect().top <= line) cur = i; else break;
    }
    if (cur === activeIdx) return;
    if (activeIdx >= 0 && secLinks[activeIdx]) {
      secLinks[activeIdx].classList.remove('active');
      secLinks[activeIdx].removeAttribute('aria-current');
    }
    activeIdx = cur;
    if (cur >= 0 && secLinks[cur]) {
      var l = secLinks[cur];
      l.classList.add('active');
      l.setAttribute('aria-current', 'location');
      // 目次が長いときは、強調した項目が見える位置まで、目次の側をスクロールする
      if (l.offsetTop < nav.scrollTop + 60 || l.offsetTop + l.offsetHeight > nav.scrollTop + nav.clientHeight - 60) {
        nav.scrollTop = Math.max(0, l.offsetTop - nav.clientHeight / 2);
      }
    }
  }
  function onScroll() {
    if (!ticking) { ticking = true; window.requestAnimationFrame(update); }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  update();
})();
