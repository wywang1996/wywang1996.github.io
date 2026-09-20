/* =========================================================
   site.js — wayione 个人主页全站共用脚本
   ---------------------------------------------------------
   包含：
     1  主题切换
     2  跨页面导航高亮
     3  锚点滚动高亮（含第三层 .nav-sub-2）
     4  flash 高亮动画
     5  移动端抽屉
     6  Prism 按需加载（含 15 种语言，按依赖顺序逐个加载）
     7  代码块复制按钮
     8  KaTeX 按需加载
     9  阅读进度条（页面有 #progress 时启用）
    10  文章 TOC 滚动高亮（页面有 .toc a 时启用）
   ========================================================= */
(function () {
  'use strict';

  /* =========================================================
     1. 主题切换按钮
     ========================================================= */
  var themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      var current = document.documentElement.getAttribute('data-theme');
      var next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      try { localStorage.setItem('theme', next); } catch (e) {}
    });
  }

  /* =========================================================
     2. 跨页面导航高亮（body[data-nav] + a[data-nav]）
     ========================================================= */
  var currentNav = document.body.getAttribute('data-nav');
  if (currentNav) {
    document.querySelectorAll('a[data-nav]').forEach(function (a) {
      if (a.getAttribute('data-nav') === currentNav) {
        a.classList.add('active');
        var li = a.closest('li');
        if (li && li.parentElement) {
          var prev = li.parentElement.previousElementSibling;
          if (prev && prev.classList && prev.classList.contains('nav-parent')) {
            prev.classList.add('active');
          }
        }
      }
    });
  }

  /* =========================================================
     3. 锚点滚动高亮（三层）
     ========================================================= */
  var navParents = Array.prototype.slice.call(
    document.querySelectorAll('.nav-parent[href^="#"]')
  );
  var navSubs = Array.prototype.slice.call(
    document.querySelectorAll('.nav-sub > li > a[href^="#"]')
  );
  var navSub2 = Array.prototype.slice.call(
    document.querySelectorAll('.nav-sub-2 a[href^="#"]')
  );

  var parentSections = navParents.map(function (a) {
    return document.querySelector(a.getAttribute('href'));
  });
  var subTargets = navSubs.map(function (a) {
    return document.querySelector(a.getAttribute('href'));
  });
  var sub2Targets = navSub2.map(function (a) {
    return document.querySelector(a.getAttribute('href'));
  });

  function highlightNav() {
    if (!parentSections.length && !subTargets.length && !sub2Targets.length) return;
    var pos = window.scrollY + 120;

    /* 第一层：.nav-parent */
    var currentParent = null;
    parentSections.forEach(function (sec) {
      if (sec && sec.offsetTop <= pos) currentParent = sec.id;
    });
    navParents.forEach(function (a) {
      a.classList.toggle('active', a.getAttribute('href') === '#' + currentParent);
    });

    /* 第二层：.nav-sub > li > a */
    var currentSub = null;
    subTargets.forEach(function (el) {
      if (el && el.offsetTop <= pos + 30) currentSub = el.id;
    });
    navSubs.forEach(function (a) {
      a.classList.toggle('active', a.getAttribute('href') === '#' + currentSub);
    });

    /* 第三层：.nav-sub-2 a */
    var currentSub2 = null;
    sub2Targets.forEach(function (el) {
      if (el && el.offsetTop <= pos + 30) currentSub2 = el.id;
    });
    navSub2.forEach(function (a) {
      a.classList.toggle('active', a.getAttribute('href') === '#' + currentSub2);
    });
  }

  if (parentSections.length || subTargets.length || sub2Targets.length) {
    window.addEventListener('scroll', highlightNav, { passive: true });
    window.addEventListener('resize', highlightNav);
    highlightNav();
  }

  /* =========================================================
     4. flash 高亮动画
     ========================================================= */
  function flashTarget(id) {
    if (!id || id.charAt(0) !== '#') return;
    var target = document.querySelector(id);
    if (target) {
      target.classList.remove('flash');
      void target.offsetWidth;
      target.classList.add('flash');
      setTimeout(function () { target.classList.remove('flash'); }, 1200);
    }
  }

  navSubs.concat(navSub2).forEach(function (a) {
    a.addEventListener('click', function () {
      var href = a.getAttribute('href') || '';
      if (href.charAt(0) === '#') flashTarget(href);
      if (window.innerWidth <= 820) {
        var sb = document.getElementById('sidebar');
        if (sb) sb.classList.remove('open');
      }
    });
  });

  document.querySelectorAll('.subnotes a').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var href = a.getAttribute('href') || '';
      if (href.charAt(0) === '#') {
        e.preventDefault();
        flashTarget(href);
      }
    });
  });

  /* =========================================================
     5. 移动端抽屉
     ========================================================= */
  var toggle = document.getElementById('menuToggle');
  var sidebar = document.getElementById('sidebar');
  if (toggle && sidebar) {
    toggle.addEventListener('click', function (e) {
      e.stopPropagation();
      sidebar.classList.toggle('open');
    });
    navParents.forEach(function (a) {
      a.addEventListener('click', function () {
        if (window.innerWidth <= 820) sidebar.classList.remove('open');
      });
    });
    document.addEventListener('click', function (e) {
      if (window.innerWidth <= 820 &&
          sidebar.classList.contains('open') &&
          !sidebar.contains(e.target) &&
          e.target !== toggle) {
        sidebar.classList.remove('open');
      }
    });
  }

  /* =========================================================
     6. Prism 按需加载（含 15 种语言，按依赖顺序逐个加载）
     ---------------------------------------------------------
     关键点：
       - prism.min.js 是核心，不含任何语言
       - clike 是类 C 语言的基础语法，必须最先加载
       - c 依赖 clike；cpp 依赖 c；r 依赖 clike
       - 按顺序逐个 <script> 加载，避免单个 combine URL 过长
       - 任一语言加载失败不阻塞后续语言
     ========================================================= */
  var PRISM_VERSION = '1.29.0';
  var PRISM_CDN_BASE = 'https://cdn.jsdelivr.net/npm/prismjs@' + PRISM_VERSION + '/';

  // 按依赖顺序排列：
  //   1) clike 基础（c / cpp / r 都依赖）
  //   2) c 在 cpp 之前
  //   3) 其它独立语言随意
  var PRISM_LANG_FILES = [
    'components/prism-clike.min.js',
    'components/prism-python.min.js',
    'components/prism-matlab.min.js',
    'components/prism-bash.min.js',
    'components/prism-shell-session.min.js',
    'components/prism-json.min.js',
    'components/prism-yaml.min.js',
    'components/prism-markdown.min.js',
    'components/prism-latex.min.js',
    'components/prism-c.min.js',      // 依赖 clike
    'components/prism-cpp.min.js',    // 依赖 c
    'components/prism-r.min.js',      // 依赖 clike
    'components/prism-julia.min.js',
    'components/prism-fortran.min.js',
    'components/prism-sql.min.js'
  ];

  function hasCodeBlock() {
    return !!document.querySelector('code[class*="language-"]');
  }

  function loadScriptSequential(urls, onDone) {
    if (!urls.length) {
      if (typeof onDone === 'function') onDone();
      return;
    }
    var s = document.createElement('script');
    s.src = urls[0];
    s.async = false;   // 保持执行顺序
    s.onload = function () {
      loadScriptSequential(urls.slice(1), onDone);
    };
    s.onerror = function () {
      if (window.console) {
        console.warn('[site.js] Prism 组件加载失败，跳过：', urls[0]);
      }
      // 单个组件失败不阻塞后续
      loadScriptSequential(urls.slice(1), onDone);
    };
    document.body.appendChild(s);
  }

  function loadPrism() {
    if (window.Prism || !hasCodeBlock()) return;

    var coreUrl = PRISM_CDN_BASE + 'prism.min.js';

    var core = document.createElement('script');
    core.src = coreUrl;
    core.async = false;
    core.onload = function () {
      // 核心加载完成，逐个加载语言组件
      var langUrls = PRISM_LANG_FILES.map(function (f) {
        return PRISM_CDN_BASE + f;
      });
      loadScriptSequential(langUrls, function () {
        if (window.Prism) {
          try {
            window.Prism.highlightAll();
          } catch (e) {
            if (window.console) {
              console.warn('[site.js] Prism.highlightAll 出错：', e);
            }
          }
        }
      });
    };
    core.onerror = function () {
      if (window.console) {
        console.warn('[site.js] Prism 核心加载失败：', coreUrl);
      }
    };
    document.body.appendChild(core);
  }

  /* =========================================================
     7. 代码块复制按钮
     ========================================================= */
  function initCopyButtons() {
    document.querySelectorAll('.copy-btn').forEach(function (btn) {
      if (btn.dataset.copyReady) return;
      btn.dataset.copyReady = '1';
      btn.addEventListener('click', function () {
        var block = btn.closest('.code-block');
        if (!block) return;
        var codeEl = block.querySelector('pre code') || block.querySelector('pre');
        if (!codeEl) return;
        var text = codeEl.innerText;

        function done() {
          if (!btn.getAttribute('data-label')) {
            btn.setAttribute('data-label', btn.textContent);
          }
          btn.textContent = '已复制 ✓';
          btn.classList.add('copied');
          setTimeout(function () {
            btn.textContent = btn.getAttribute('data-label') || '复制';
            btn.classList.remove('copied');
          }, 1600);
        }

        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(done).catch(function () {
            fallbackCopy(text, done);
          });
        } else {
          fallbackCopy(text, done);
        }
      });
    });
  }

  function fallbackCopy(text, cb) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); cb(); } catch (e) {}
    document.body.removeChild(ta);
  }

  /* =========================================================
     8. KaTeX 按需加载
     ========================================================= */
  var KATEX_VERSION = '0.16.9';
  var KATEX_CDN = 'https://cdn.jsdelivr.net/npm/katex@' + KATEX_VERSION + '/dist/';

  function hasMath() {
    var text = document.body.textContent || '';
    return /\\\(|\\\[|\\begin\{/.test(text) ||
           /\$\$/.test(text) ||
           /\$[^$\s][^$]*\$/.test(text);
  }

  function loadKaTeX() {
    if (window.renderMathInElement || !hasMath()) return;

    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = KATEX_CDN + 'katex.min.css';
    document.head.appendChild(link);

    var core = document.createElement('script');
    core.src = KATEX_CDN + 'katex.min.js';
    core.async = true;
    core.onload = function () {
      var auto = document.createElement('script');
      auto.src = KATEX_CDN + 'contrib/auto-render.min.js';
      auto.async = true;
      auto.onload = function () {
        if (typeof renderMathInElement !== 'function') return;
        renderMathInElement(document.body, {
          delimiters: [
            { left: '$$', right: '$$', display: true },
            { left: '$',  right: '$',  display: false },
            { left: '\\(', right: '\\)', display: false },
            { left: '\\[', right: '\\]', display: true }
          ],
          throwOnError: false,
          ignoredTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code']
        });
      };
      auto.onerror = function () {
        if (window.console) console.warn('[site.js] KaTeX auto-render 加载失败');
      };
      document.body.appendChild(auto);
    };
    core.onerror = function () {
      if (window.console) console.warn('[site.js] KaTeX 核心加载失败');
    };
    document.body.appendChild(core);
  }

  /* =========================================================
     9. 阅读进度条（页面有 #progress 时启用）
     ========================================================= */
  function initProgress() {
    var progress = document.getElementById('progress');
    if (!progress) return;

    function update() {
      var h = document.documentElement;
      var scrolled = h.scrollTop || document.body.scrollTop;
      var total = h.scrollHeight - h.clientHeight;
      progress.style.width = (total > 0 ? (scrolled / total) * 100 : 0) + '%';
    }
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  }

  /* =========================================================
     10. 文章 TOC 滚动高亮（页面有 .toc a 时启用）
     ========================================================= */
  function initTocHighlight() {
    var tocLinks = Array.prototype.slice.call(document.querySelectorAll('.toc a'));
    if (!tocLinks.length) return;

    var tocTargets = tocLinks.map(function (a) {
      var id = a.getAttribute('href');
      return id && id.charAt(0) === '#' ? document.querySelector(id) : null;
    });

    function highlight() {
      var pos = window.scrollY + 120;
      var current = null;
      tocTargets.forEach(function (el) {
        if (el && el.offsetTop <= pos) current = el.id;
      });
      tocLinks.forEach(function (a) {
        a.classList.toggle('active', a.getAttribute('href') === '#' + current);
      });
    }
    window.addEventListener('scroll', highlight, { passive: true });
    window.addEventListener('resize', highlight);
    highlight();
  }

  /* =========================================================
     11. 启动
     ========================================================= */
  function boot() {
    loadPrism();
    loadKaTeX();
    initCopyButtons();
    initProgress();
    initTocHighlight();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();