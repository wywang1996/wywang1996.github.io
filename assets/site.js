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
    11  全站搜索（放大镜按钮 + 快捷键 / 与 Ctrl+K）
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
     2. 跨页面导航高亮
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

    var currentParent = null;
    parentSections.forEach(function (sec) {
      if (sec && sec.offsetTop <= pos) currentParent = sec.id;
    });
    navParents.forEach(function (a) {
      a.classList.toggle('active', a.getAttribute('href') === '#' + currentParent);
    });

    var currentSub = null;
    subTargets.forEach(function (el) {
      if (el && el.offsetTop <= pos + 30) currentSub = el.id;
    });
    navSubs.forEach(function (a) {
      a.classList.toggle('active', a.getAttribute('href') === '#' + currentSub);
    });

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
     6. Prism 按需加载
     ========================================================= */
  var PRISM_VERSION = '1.29.0';
  var PRISM_CDN_BASE = 'https://cdn.jsdelivr.net/npm/prismjs@' + PRISM_VERSION + '/';

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
    'components/prism-c.min.js',
    'components/prism-cpp.min.js',
    'components/prism-r.min.js',
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
    s.async = false;
    s.onload = function () {
      loadScriptSequential(urls.slice(1), onDone);
    };
    s.onerror = function () {
      if (window.console) {
        console.warn('[site.js] Prism 组件加载失败，跳过：', urls[0]);
      }
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
     9. 阅读进度条
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
     10. 文章 TOC 滚动高亮
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


/* =========================================================
   12. 全站搜索（优化版）
   ---------------------------------------------------------
   特性：
     - 标题 / 关键词 / 描述 / 拼音首字母 多字段匹配
     - 位置加权：开头匹配 > 中间匹配
     - 结果片段截取，只显示匹配附近
     - 逐词高亮，长词优先
     - 输入防抖 80ms
     - 搜索历史（localStorage，最近 5 条）
     - 结果计数与分组显示
     - 无结果时给出建议
     - ↑↓ 导航、Enter 打开、Esc 关闭
     - 快捷键 / 与 Ctrl/Cmd+K
   ========================================================= */
(function () {
  'use strict';

  if (window.__SEARCH_INITED__) return;
  window.__SEARCH_INITED__ = true;

  /* =========================================================
     12.1 搜索索引
     ---------------------------------------------------------
     字段：
       t  标题
       u  相对路径
       c  类别（page / category / tool / project / note）
       d  描述
       k  关键词数组（中文 / 英文 / 缩写）
       py 标题拼音首字母（无空格）
     ========================================================= */
  var SEARCH_INDEX = [
    /* ---- 页面 ---- */
    { t: '主页', u: 'index.html', c: 'page',
      d: 'wayione 个人主页：工具、项目、笔记索引',
      k: ['home','index','主页','wayione','首页'],
      py: 'zy' },
    { t: '数学分类页', u: 'math-index.html', c: 'category',
      d: '数学笔记合集：线性代数、数值分析、概率统计、复变函数、偏微分方程',
      k: ['数学','math','笔记分类'],
      py: 'sxfly' },
    { t: '力学分类页', u: 'mechanics-index.html', c: 'category',
      d: '力学笔记合集：理论、材料、结构、弹性、振动、板壳、有限元',
      k: ['力学','mechanics','笔记分类'],
      py: 'lxfly' },
    { t: '计算机分类页', u: 'cs-index.html', c: 'category',
      d: '计算机笔记合集：DSP、数据结构、算法、机器学习、科学计算',
      k: ['计算机','cs','笔记分类'],
      py: 'jsjfly' },
    { t: '地震学分类页', u: 'seismology-index.html', c: 'category',
      d: '地震学笔记合集：谱分析、定量地震学、工程地震、场地评价',
      k: ['地震学','seismology','笔记分类'],
      py: 'dzxfly' },

    /* ---- 工具 ---- */
    { t: '地震动参数计算器', u: 'ground-motion-calc.html', c: 'tool',
      d: '上传 CSV / TXT 加速度时程，计算 PGA、PGV、PGD、Arias 强度、有效持时、卓越周期与 5% 阻尼反应谱',
      k: ['地震动','反应谱','PGA','PGV','PGD','Arias','持时','波形','加速度'],
      py: 'dzdcsjsq' },
    { t: '抗震规范谱生成器', u: 'design-response-spectrum.html', c: 'tool',
      d: '支持 7 部中国抗震规范的设计谱生成：建筑抗震、公路桥梁、城市桥梁、城轨结构、水运工程、建筑隔震与核电厂',
      k: ['设计谱','抗震','规范','反应谱','SVG','隔震','桥梁','核电'],
      py: 'kzgfpcsq' },
    { t: '震级能量换算器', u: 'magnitude.html', c: 'tool',
      d: '在 ML、mb、MS、Mw 之间经验换算，估算地震释放能量与地震矩',
      k: ['震级','能量','地震矩','ML','mb','MS','Mw','TNT','换算'],
      py: 'zjnlhsq' },
    { t: '波形格式转换器', u: 'waveform.html', c: 'tool',
      d: '上传 SAC、MiniSEED、ASCII 波形文件，在浏览器本地解析、预览并导出',
      k: ['波形','SAC','MiniSEED','ASCII','CSV','ObsPy','格式转换'],
      py: 'bxgzzhq' },

    /* ---- 项目 ---- */
    { t: '数据来源', u: 'data-sources.html', c: 'project',
      d: '强震动记录、波形与台站、地震目录、震源与构造、场地条件与项目内部数据',
      k: ['数据源','数据库','地震目录','台站','强震动','IRIS','USGS'],
      py: 'sjly' },
    { t: '地震学绘图', u: 'plotting.html', c: 'project',
      d: '波形时程、反应谱、震级-频度关系、震中分布与震源机制沙滩球绘图模板',
      k: ['绘图','Plotly','波形','震中分布','沙滩球','可视化'],
      py: 'dzxht' },
    { t: '地震动参数分析', u: 'ground-motion.html', c: 'project',
      d: '从地震动时程中提取 PGA、PGV、PGD、Arias 强度、有效持时与反应谱',
      k: ['地震动','参数分析','反应谱','Arias','持时'],
      py: 'dzdcsfx' },
    { t: '强震动数据处理', u: 'strong-motion.html', c: 'project',
      d: '强震动记录的基线校正、滤波、去尖峰、重采样与时程积分',
      k: ['强震动','基线校正','滤波','去噪','重采样','积分'],
      py: 'qzdsjcl' },
    { t: '地震危险性分析', u: 'seismic-hazard.html', c: 'project',
      d: '基于 PSHA 框架，计算危险性曲线与一致危险性反应谱（UHS）',
      k: ['PSHA','危险性','UHS','反应谱','概率'],
      py: 'dzxxfx' },

    /* ---- 数学 ---- */
    { t: '线性代数', u: 'math/linear-algebra.html', c: 'note',
      d: '矩阵运算、向量空间、线性变换、特征值分解、二次型与 SVD',
      k: ['矩阵','特征值','SVD','向量空间','二次型'],
      py: 'xxds' },
    { t: '数值分析', u: 'math/numerical-analysis.html', c: 'note',
      d: '误差、求根、插值、数值积分、常微分方程数值解、Newmark-β',
      k: ['数值','求根','插值','积分','ODE','Newmark'],
      py: 'szfx' },
    { t: '概率论与数理统计', u: 'math/probability-statistics.html', c: 'note',
      d: '随机变量、大数定律、参数估计、假设检验、蒙特卡洛',
      k: ['概率','统计','随机变量','蒙特卡洛','贝叶斯'],
      py: 'gllysljt' },
    { t: '复变函数与积分变换', u: 'math/complex-analysis.html', c: 'note',
      d: '复数、解析函数、柯西定理、留数、傅里叶变换、拉普拉斯变换',
      k: ['复变','傅里叶','拉普拉斯','留数','柯西'],
      py: 'fbhsyjfbh' },
    { t: '偏微分方程', u: 'math/pde.html', c: 'note',
      d: '一阶方程、波动方程、热传导、拉普拉斯方程、分离变量法',
      k: ['PDE','波动方程','热传导','分离变量','偏微分'],
      py: 'pwffc' },

    /* ---- 力学 ---- */
    { t: '理论力学', u: 'mechanics/theoretical-mechanics.html', c: 'note',
      d: '静力学、质点动力学、拉格朗日力学、哈密顿力学',
      k: ['理论力学','拉格朗日','哈密顿','牛顿','静力学'],
      py: 'lllx' },
    { t: '材料力学', u: 'mechanics/material-mechanics.html', c: 'note',
      d: '轴向拉压、圆轴扭转、弯曲、强度理论、压杆稳定',
      k: ['材料力学','弯曲','扭转','强度','稳定','拉压'],
      py: 'cllx' },
    { t: '流体力学', u: 'mechanics/fluid-mechanics.html', c: 'note',
      d: '流体静力学、伯努利方程、N-S 方程、边界层、量纲分析',
      k: ['流体','伯努利','N-S 方程','边界层','量纲分析'],
      py: 'ltlx' },
    { t: '结构力学', u: 'mechanics/structural-mechanics.html', c: 'note',
      d: '几何组成、虚功原理、力法、位移法、矩阵位移法',
      k: ['结构力学','力法','位移法','矩阵位移','虚功'],
      py: 'jglx' },
    { t: '弹性力学', u: 'mechanics/elasticity.html', c: 'note',
      d: '应力张量、平面问题、极坐标解法、能量原理、有限元基础',
      k: ['弹性力学','应力','变分','平面问题','极坐标'],
      py: 'txlx' },
    { t: '振动力学', u: 'mechanics/vibration.html', c: 'note',
      d: '单自由度、Duhamel 积分、多自由度、模态分析、连续系统',
      k: ['振动','单自由度','模态','Duhamel','多自由度'],
      py: 'zdlx' },
    { t: '结构动力学', u: 'mechanics/structural-dynamics.html', c: 'note',
      d: '反应谱、设计反应谱、振型分解、时程分析、Pushover',
      k: ['结构动力学','反应谱','时程','Pushover','振型'],
      py: 'jgdlx' },
    { t: '塑性力学', u: 'mechanics/plasticity.html', c: 'note',
      d: '屈服准则、加载与硬化、弹塑性本构、极限分析、抗震应用',
      k: ['塑性','屈服','本构','极限分析','硬化'],
      py: 'sxlx' },
    { t: '断裂力学', u: 'mechanics/fracture-mechanics.html', c: 'note',
      d: '裂纹尖端应力场、能量释放率、J 积分、疲劳扩展',
      k: ['断裂','J 积分','应力强度因子','疲劳','裂纹'],
      py: 'dllx' },
    { t: '板壳理论', u: 'mechanics/plate-shell.html', c: 'note',
      d: 'Kirchhoff 薄板、Mindlin 中厚板、板的振动、圆柱壳、板壳单元',
      k: ['板壳','薄板','中厚板','圆柱壳','Kirchhoff','Mindlin'],
      py: 'bkll' },
    { t: '有限元方法', u: 'mechanics/fem.html', c: 'note',
      d: '单元刚度矩阵、等参单元、板壳单元、动力学、非线性',
      k: ['FEM','有限元','等参元','非线性','单元'],
      py: 'yxyff' },

    /* ---- 计算机 ---- */
    { t: '数字信号处理', u: 'cs/dsp.html', c: 'note',
      d: '采样定理、Z 变换、DFT 与 FFT、数字滤波器、窗函数',
      k: ['DSP','FFT','滤波','采样','Z 变换','DFT'],
      py: 'szxhcl' },
    { t: '数据结构', u: 'cs/data-structures.html', c: 'note',
      d: '算法分析、线性结构、树、哈希表、堆、图与排序',
      k: ['数据结构','树','图','哈希','排序','堆'],
      py: 'sjjg' },
    { t: '算法设计与分析', u: 'cs/algorithm-design.html', c: 'note',
      d: '分治、贪心、动态规划、回溯、分支限界、NP 完全性',
      k: ['算法','动态规划','贪心','NP','分治','回溯'],
      py: 'sfsjyfx' },
    { t: '机器学习基础', u: 'cs/machine-learning.html', c: 'note',
      d: '监督学习、无监督学习、神经网络、模型评估、正则化',
      k: ['机器学习','神经网络','回归','聚类','监督学习'],
      py: 'jqxxjc' },
    { t: '科学计算与 Python', u: 'cs/scientific-computing-python.html', c: 'note',
      d: 'NumPy、SciPy、Matplotlib、Pandas、向量化与性能优化',
      k: ['Python','NumPy','SciPy','Pandas','Matplotlib','科学计算'],
      py: 'kxjsy' },
    { t: '科学计算与 MATLAB', u: 'cs/scientific-computing-matlab.html', c: 'note',
      d: 'MATLAB 语言特性、矩阵运算、数值计算、Simulink、工具箱',
      k: ['MATLAB','Simulink','矩阵','工具箱','科学计算'],
      py: 'kxjsm' },
    { t: '科学计算与 R', u: 'cs/scientific-computing-r.html', c: 'note',
      d: 'R 语言、tidyverse、统计建模、时间序列、ggplot2',
      k: ['R','tidyverse','统计','ggplot2','科学计算'],
      py: 'kxjsr' },
    { t: '数据库与数据工程', u: 'cs/database-data-engineering.html', c: 'note',
      d: '关系模型、SQL、索引、事务、时序数据库、数据管道',
      k: ['数据库','SQL','时序','数据工程','索引'],
      py: 'sjkysjgc' },
    { t: '并行与高性能计算', u: 'cs/parallel-high-performance-computing.html', c: 'note',
      d: 'OpenMP、MPI、CUDA、Python 并行、并行算法设计',
      k: ['并行','OpenMP','MPI','CUDA','GPU','高性能'],
      py: 'bxygxnjs' },

    /* ---- 地震学 ---- */
    { t: '地震动谱分析入门', u: 'seismology/spectral-analysis.html', c: 'note',
      d: '傅里叶谱、反应谱、谱加速度与谱速度、阻尼比影响',
      k: ['谱分析','反应谱','傅里叶谱','谱加速度','阻尼'],
      py: 'dzdpfxrm' },
    { t: '定量地震学', u: 'seismology/quant-seismo.html', c: 'note',
      d: '震源矩张量、辐射图型、震级标度、地震波衰减、波形反演',
      k: ['定量地震学','矩张量','震级','反演','辐射'],
      py: 'dldzx' },
    { t: '地震地质', u: 'seismology/earthquake-geology.html', c: 'note',
      d: '活动断层、古地震、滑动速率、复发间隔、构造地貌',
      k: ['地震地质','活动断层','古地震','复发','断层'],
      py: 'dzdz' },
    { t: '工程地震学', u: 'seismology/engineering-seismology.html', c: 'note',
      d: 'PSHA、GMPE、一致危险性谱、设计地震动选取',
      k: ['工程地震','PSHA','GMPE','UHS','危险性','设计地震动'],
      py: 'gcdzx' },
    { t: '场地地震安全性评价', u: 'seismology/site-seismic-safety-evaluation.html', c: 'note',
      d: '法规框架、工作流程、地震危险性、场地效应、设计地震动',
      k: ['场地评价','安全性评价','设计地震动','场地效应'],
      py: 'cddzaqxpj' },
    { t: '地震工程', u: 'seismology/earthquake-engineering.html', c: 'note',
      d: '地震动输入、反应谱、振型分解、抗震设计、隔震消能',
      k: ['地震工程','抗震设计','隔震','消能','振型'],
      py: 'dzgc' },
    { t: '强震动观测', u: 'seismology/strong-motion-observation.html', c: 'note',
      d: '台网与仪器、数据格式、质量控制、基线校正、滤波去噪',
      k: ['强震观测','台网','基线校正','滤波','强震仪'],
      py: 'qzdgc' },
    { t: '土动力学', u: 'seismology/soil-dynamics.html', c: 'note',
      d: '动剪切模量、阻尼比、场地地震反应、液化、土-结构相互作用',
      k: ['土动力学','液化','场地反应','SSI','剪切模量'],
      py: 'tdlx' },
    { t: '地震预警', u: 'seismology/earthquake-early-warning.html', c: 'note',
      d: '预警原理、台网与算法、震级快速估计、地震动预测',
      k: ['预警','P 波','实时','震级估计','地震动预测'],
      py: 'dzyj' }
  ];

  /* =========================================================
     12.2 常量与预处理
     ========================================================= */
  var CATEGORY_LABEL = {
    page: '页面',
    category: '分类',
    tool: '工具',
    project: '项目',
    note: '笔记'
  };
  var CATEGORY_ORDER = ['page', 'category', 'tool', 'project', 'note'];

  var HISTORY_KEY = 'site_search_history';
  var HISTORY_MAX = 5;

  var SUGGESTIONS = ['反应谱', 'PSHA', '有限元', 'Python', '地震动', '隔震', '蒙特卡洛', 'FFT'];

  /* 预计算小写字段，避免每次搜索都 toLowerCase */
  SEARCH_INDEX.forEach(function (it) {
    it._t = it.t.toLowerCase();
    it._d = (it.d || '').toLowerCase();
    it._k = (it.k || []).map(function (s) { return String(s).toLowerCase(); });
    it._py = (it.py || '').toLowerCase();
  });

  /* =========================================================
     12.3 注入样式
     ========================================================= */
  var style = document.createElement('style');
  style.textContent = [
    '.search-toggle {',
    '  width: 32px; height: 32px; padding: 0;',
    '  border: 1px solid var(--border);',
    '  background: var(--bg-solid);',
    '  color: var(--text-muted);',
    '  border-radius: 7px; cursor: pointer;',
    '  display: inline-flex; align-items: center; justify-content: center;',
    '  transition: all .15s; font-family: inherit; flex-shrink: 0;',
    '}',
    '.search-toggle:hover { color: var(--accent); border-color: rgba(219,39,119,0.4); }',
    '.search-toggle svg { width: 15px; height: 15px; stroke: currentColor; fill: none;',
    '  stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; }',

    '.search-overlay {',
    '  position: fixed; inset: 0;',
    '  background: rgba(15,23,42,.42);',
    '  -webkit-backdrop-filter: blur(4px); backdrop-filter: blur(4px);',
    '  z-index: 300; display: flex; align-items: flex-start;',
    '  justify-content: center; padding-top: 12vh;',
    '}',
    '.search-overlay[hidden] { display: none !important; }',

    '.search-panel {',
    '  width: 92%; max-width: 640px;',
    '  background: var(--bg-solid); border-radius: 14px;',
    '  box-shadow: 0 20px 60px -20px rgba(15,23,42,.45);',
    '  overflow: hidden; display: flex; flex-direction: column; max-height: 74vh;',
    '}',

    '.search-input-wrap {',
    '  display: flex; align-items: center; gap: 10px;',
    '  padding: 14px 18px; border-bottom: 1px solid var(--border-soft);',
    '}',
    '.search-input-wrap .ico { width: 18px; height: 18px; stroke: var(--text-dim);',
    '  fill: none; stroke-width: 2; flex: none; }',
    '.search-input-wrap input {',
    '  flex: 1; border: none; background: transparent; font-size: 15.5px;',
    '  font-family: inherit; color: var(--text); outline: none; padding: 0; min-width: 0;',
    '}',
    '.search-input-wrap input::placeholder { color: var(--text-dim); }',
    '.search-input-clear {',
    '  width: 22px; height: 22px; padding: 0; border: none; border-radius: 50%;',
    '  background: var(--bg-elevated); color: var(--text-dim); cursor: pointer;',
    '  display: none; align-items: center; justify-content: center;',
    '  font-size: 13px; line-height: 1; font-family: inherit; flex: none;',
    '  transition: background .15s, color .15s;',
    '}',
    '.search-input-clear:hover { background: var(--border); color: var(--text); }',
    '.search-input-wrap.has-value .search-input-clear { display: inline-flex; }',
    '.search-kbd { font-family: var(--mono); font-size: 11px; padding: 2px 7px;',
    '  border-radius: 5px; background: var(--bg-elevated);',
    '  border: 1px solid var(--border); color: var(--text-dim); flex: none; }',

    '.search-results { overflow-y: auto; padding: 6px; flex: 1; min-height: 80px; }',
    '.search-results::-webkit-scrollbar { width: 6px; }',
    '.search-results::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }',

    '.search-hint {',
    '  padding: 34px 20px; text-align: center;',
    '  color: var(--text-dim); font-size: 13.5px; line-height: 1.7;',
    '}',
    '.search-hint kbd {',
    '  font-family: var(--mono); font-size: 11px; padding: 1px 5px;',
    '  border-radius: 4px; background: var(--bg-elevated);',
    '  border: 1px solid var(--border); color: var(--text-muted);',
    '}',

    '.search-history-title {',
    '  padding: 10px 12px 4px; font-size: 10.5px;',
    '  font-family: var(--mono); text-transform: uppercase; letter-spacing: 1.2px;',
    '  color: var(--text-dim); font-weight: 650;',
    '  display: flex; justify-content: space-between; align-items: center;',
    '}',
    '.search-history-clear {',
    '  font-family: inherit; font-size: 10.5px; font-weight: 500;',
    '  letter-spacing: 0; text-transform: none; color: var(--text-dim);',
    '  background: transparent; border: none; cursor: pointer;',
    '  padding: 2px 6px; border-radius: 4px;',
    '}',
    '.search-history-clear:hover { color: var(--accent); background: var(--accent-dim); }',

    '.search-history {',
    '  display: flex; flex-wrap: wrap; gap: 6px; padding: 4px 12px 12px;',
    '}',
    '.search-history-item {',
    '  font-size: 12.5px; padding: 4px 10px; border-radius: 20px;',
    '  background: var(--bg-elevated); border: 1px solid var(--border-soft);',
    '  color: var(--text-muted); cursor: pointer;',
    '  font-family: inherit;',
    '  transition: background .12s, color .12s, border-color .12s;',
    '}',
    '.search-history-item:hover {',
    '  background: var(--accent-dim); color: var(--accent);',
    '  border-color: rgba(219,39,119,0.28);',
    '}',

    '.search-group { padding: 8px 12px 4px; font-size: 10.5px;',
    '  font-family: var(--mono); text-transform: uppercase; letter-spacing: 1.2px;',
    '  color: var(--text-dim); font-weight: 650; }',
    '.search-item {',
    '  display: block; padding: 9px 12px; border-radius: 8px;',
    '  text-decoration: none; color: inherit; transition: background .12s;',
    '  cursor: pointer; border: none; background: transparent; width: 100%;',
    '  text-align: left; font-family: inherit;',
    '}',
    '.search-item:hover, .search-item.active { background: var(--accent-dim); }',
    '.search-item .s-title { font-size: 13.5px; font-weight: 600; color: var(--text);',
    '  margin-bottom: 3px; line-height: 1.4; }',
    '.search-item.active .s-title { color: var(--accent); }',
    '.search-item .s-desc { font-size: 12px; color: var(--text-muted);',
    '  line-height: 1.5; display: -webkit-box; -webkit-line-clamp: 2;',
    '  -webkit-box-orient: vertical; overflow: hidden; }',
    '.search-item .s-desc mark, .search-item .s-title mark {',
    '  background: rgba(219,39,119,.18); color: var(--accent);',
    '  padding: 0 2px; border-radius: 3px; font-style: normal;',
    '}',
    '.search-item .s-cat { font-family: var(--mono); font-size: 10px;',
    '  color: var(--text-dim); letter-spacing: .8px; margin-left: 6px; }',

    '.search-count {',
    '  padding: 8px 18px 2px; font-size: 11.5px; color: var(--text-dim);',
    '  font-family: var(--mono); letter-spacing: .3px;',
    '}',

    '.search-footer {',
    '  display: flex; gap: 16px; padding: 9px 16px;',
    '  border-top: 1px solid var(--border-soft);',
    '  font-size: 11px; color: var(--text-dim);',
    '  background: var(--bg-elevated); font-family: var(--mono);',
    '  flex-wrap: wrap;',
    '}',
    '.search-footer kbd { font-family: inherit; font-size: 10.5px;',
    '  padding: 1px 5px; border-radius: 4px; background: var(--bg-solid);',
    '  border: 1px solid var(--border); color: var(--text-muted); margin: 0 2px; }',
    '.search-footer span { display: inline-flex; align-items: center; }',

    '@media (max-width: 620px) {',
    '  .search-panel { max-height: 84vh; }',
    '  .search-overlay { padding-top: 6vh; }',
    '  .search-footer { gap: 10px; font-size: 10.5px; }',
    '}'
  ].join('\n');
  document.head.appendChild(style);

  /* =========================================================
     12.4 注入 UI
     ========================================================= */
  var navRight = document.querySelector('.nav-right');
  var searchToggle = null;
  if (navRight) {
    searchToggle = document.createElement('button');
    searchToggle.className = 'search-toggle';
    searchToggle.type = 'button';
    searchToggle.title = '搜索（/ 或 Ctrl+K）';
    searchToggle.setAttribute('aria-label', '搜索');
    searchToggle.innerHTML =
      '<svg viewBox="0 0 24 24" aria-hidden="true">' +
        '<circle cx="11" cy="11" r="7"/>' +
        '<path d="m21 21-4.35-4.35"/>' +
      '</svg>';
    var themeBtn = navRight.querySelector('.theme-toggle');
    if (themeBtn) {
      navRight.insertBefore(searchToggle, themeBtn);
    } else {
      navRight.appendChild(searchToggle);
    }
  }

  var overlay = document.createElement('div');
  overlay.className = 'search-overlay';
  overlay.hidden = true;
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.innerHTML =
    '<div class="search-panel">' +
      '<div class="search-input-wrap" id="searchInputWrap">' +
        '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true">' +
          '<circle cx="11" cy="11" r="7"/>' +
          '<path d="m21 21-4.35-4.35"/>' +
        '</svg>' +
        '<input type="text" id="siteSearchInput" placeholder="搜索页面、工具、项目、笔记…" autocomplete="off" spellcheck="false">' +
        '<button class="search-input-clear" id="searchInputClear" type="button" title="清空" aria-label="清空">✕</button>' +
        '<kbd class="search-kbd">Esc</kbd>' +
      '</div>' +
      '<div class="search-results" id="siteSearchResults"></div>' +
      '<div class="search-footer">' +
        '<span><kbd>↑</kbd><kbd>↓</kbd> 选择</span>' +
        '<span><kbd>Enter</kbd> 打开</span>' +
        '<span><kbd>/</kbd> 或 <kbd>Ctrl</kbd>+<kbd>K</kbd> 打开</span>' +
      '</div>' +
    '</div>';
  document.body.appendChild(overlay);

  var inputWrap = overlay.querySelector('#searchInputWrap');
  var input = overlay.querySelector('#siteSearchInput');
  var clearBtn = overlay.querySelector('#searchInputClear');
  var resultsBox = overlay.querySelector('#siteSearchResults');
  var activeIndex = -1;
  var currentResults = [];
  var debounceTimer = null;

  /* =========================================================
     12.5 搜索历史
     ========================================================= */
  function getHistory() {
    try {
      var raw = localStorage.getItem(HISTORY_KEY);
      if (!raw) return [];
      var arr = JSON.parse(raw);
      return Array.isArray(arr) ? arr : [];
    } catch (e) {
      return [];
    }
  }

  function saveHistory(list) {
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(list));
    } catch (e) {}
  }

  function pushHistory(q) {
    q = String(q || '').trim();
    if (!q) return;
    var list = getHistory().filter(function (s) { return s !== q; });
    list.unshift(q);
    list = list.slice(0, HISTORY_MAX);
    saveHistory(list);
  }

  function clearHistory() {
    try { localStorage.removeItem(HISTORY_KEY); } catch (e) {}
  }

  /* =========================================================
     12.6 搜索核心
     ========================================================= */
  function escapeRegExp(s) {
    return String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  function escapeHTML(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c];
    });
  }

  /**
   * 判断字符串 s 中 term 出现的最高权重
   *  开头匹配 > 词边界匹配 > 中间匹配
   */
  function scoreIn(s, term, base) {
    if (!s || !term) return 0;
    var idx = s.indexOf(term);
    if (idx === -1) return 0;
    if (idx === 0) {
      // 开头匹配
      if (s === term) return base * 3;      // 完全相等
      return base * 2;                       // 前缀匹配
    }
    // 词边界匹配（空格、横线、点等分隔符之后）
    var prev = s.charAt(idx - 1);
    if (/[\s\-_./]/.test(prev)) return Math.round(base * 1.4);
    // 中间匹配
    return base;
  }

  function search(query) {
    var raw = String(query || '').trim();
    if (!raw) return [];

    var q = raw.toLowerCase();
    var terms = q.split(/\s+/).filter(Boolean);
    if (!terms.length) return [];

    // 拉丁字母输入时，去掉空格就是拼音首字母序列
    var pinyinSeq = /^[a-z\s]+$/.test(q) ? q.replace(/\s+/g, '') : null;

    var scored = [];

    SEARCH_INDEX.forEach(function (item) {
      var score = 0;

      // 1) 多词逐一匹配，每个词至少在某字段里出现
      var allTermsMatched = true;
      terms.forEach(function (term) {
        var s = 0;
        s = Math.max(s, scoreIn(item._t, term, 60));          // 标题
        s = Math.max(s, scoreIn(item._k.join(' '), term, 25)); // 关键词串
        s = Math.max(s, scoreIn(item._d, term, 8));            // 描述
        if (s === 0) allTermsMatched = false;
        score += s;
      });

      // 2) 拼音首字母匹配
      if (pinyinSeq && item._py) {
        if (item._py === pinyinSeq) {
          score += 100;
        } else if (item._py.indexOf(pinyinSeq) === 0) {
          score += 55;
        } else if (item._py.indexOf(pinyinSeq) > -1) {
          score += 20;
        }
      }

      // 3) 全查询串完全等于标题时，额外加分
      if (item._t === q) score += 200;

      if (allTermsMatched && score > 0) {
        scored.push({ item: item, score: score });
      }
    });

    scored.sort(function (a, b) {
      if (b.score !== a.score) return b.score - a.score;
      // 同分时按标题长度短者优先
      return a.item._t.length - b.item._t.length;
    });

    return scored.slice(0, 30).map(function (r) { return r.item; });
  }

  /* =========================================================
     12.7 渲染：高亮 + 片段截取
     ========================================================= */
  function highlight(text, terms) {
    var safe = escapeHTML(text);
    if (!terms || !terms.length) return safe;
    // 长词优先，避免短词把长词切碎
    var sorted = terms.slice().sort(function (a, b) { return b.length - a.length; });
    sorted.forEach(function (term) {
      if (!term) return;
      var re = new RegExp('(' + escapeRegExp(term) + ')', 'gi');
      safe = safe.replace(re, '<mark>$1</mark>');
    });
    return safe;
  }

  /**
   * 只显示匹配附近的一段文字
   *   desc 原始描述
   *   terms 搜索词
   *   maxLen 片段最大长度
   */
  function snippet(desc, terms, maxLen) {
    desc = desc || '';
    if (desc.length <= maxLen) return desc;

    var lower = desc.toLowerCase();
    var hit = -1;
    terms.forEach(function (t) {
      if (!t) return;
      var i = lower.indexOf(t);
      if (i > -1 && (hit === -1 || i < hit)) hit = i;
    });

    if (hit === -1) {
      return desc.slice(0, maxLen) + '…';
    }

    var head = Math.max(0, hit - Math.floor(maxLen * 0.4));
    var end = Math.min(desc.length, head + maxLen);
    var s = desc.slice(head, end);
    if (head > 0) s = '…' + s;
    if (end < desc.length) s = s + '…';
    return s;
  }

  function renderEmpty(history) {
    if (history && history.length) {
      var chips = history.map(function (h) {
        return '<button class="search-history-item" data-q="' +
          escapeHTML(h) + '" type="button">' + escapeHTML(h) + '</button>';
      }).join('');
      resultsBox.innerHTML =
        '<div class="search-history-title">' +
          '<span>最近搜索</span>' +
          '<button class="search-history-clear" id="searchHistoryClear" type="button">清除</button>' +
        '</div>' +
        '<div class="search-history">' + chips + '</div>' +
        '<div class="search-hint" style="padding-top:10px;">' +
          '试试：' + SUGGESTIONS.slice(0, 5).map(function (s) {
            return '<button class="search-history-item" data-q="' +
              escapeHTML(s) + '" type="button">' + escapeHTML(s) + '</button>';
          }).join(' ') +
        '</div>';
      return;
    }

    resultsBox.innerHTML =
      '<div class="search-hint">' +
        '输入关键词搜索：工具、项目、笔记、页面…<br>' +
        '<span style="font-size:12px;opacity:.75;">试试：</span> ' +
        SUGGESTIONS.map(function (s) {
          return '<button class="search-history-item" data-q="' +
            escapeHTML(s) + '" type="button">' + escapeHTML(s) + '</button>';
        }).join(' ') +
      '</div>';
  }

  function updateActive() {
    var items = resultsBox.querySelectorAll('.search-item');
    items.forEach(function (el, i) {
      el.classList.toggle('active', i === activeIndex);
      if (i === activeIndex) {
        var rect = el.getBoundingClientRect();
        var boxRect = resultsBox.getBoundingClientRect();
        if (rect.top < boxRect.top) {
          resultsBox.scrollTop -= (boxRect.top - rect.top);
        } else if (rect.bottom > boxRect.bottom) {
          resultsBox.scrollTop += (rect.bottom - boxRect.bottom);
        }
      }
    });
  }

  function render(query) {
    var raw = String(query || '').trim();
    currentResults = raw ? search(raw) : [];
    activeIndex = currentResults.length ? 0 : -1;

    if (!raw) {
      renderEmpty(getHistory());
      return;
    }

    if (!currentResults.length) {
      resultsBox.innerHTML =
        '<div class="search-hint">' +
          '未找到匹配 “' + escapeHTML(raw) + '” 的结果<br><br>' +
          '<span style="font-size:12px;opacity:.75;">试试：</span> ' +
          SUGGESTIONS.map(function (s) {
            return '<button class="search-history-item" data-q="' +
              escapeHTML(s) + '" type="button">' + escapeHTML(s) + '</button>';
          }).join(' ') +
        '</div>';
      return;
    }

    // 结果按类别分组
    var groups = {};
    currentResults.forEach(function (item, idx) {
      var c = item.c || 'note';
      if (!groups[c]) groups[c] = [];
      groups[c].push({ item: item, idx: idx });
    });

    var terms = raw.toLowerCase().split(/\s+/).filter(Boolean);

    var html = '<div class="search-count">找到 ' + currentResults.length + ' 条结果</div>';

    CATEGORY_ORDER.forEach(function (cat) {
      if (!groups[cat]) return;
      html += '<div class="search-group">' + CATEGORY_LABEL[cat] + '</div>';
      groups[cat].forEach(function (entry) {
        var it = entry.item;
        var descSnippet = snippet(it.d, terms, 88);
        html +=
          '<a class="search-item" data-idx="' + entry.idx + '" href="' + it.u + '">' +
            '<div class="s-title">' + highlight(it.t, terms) +
              '<span class="s-cat">' + CATEGORY_LABEL[cat] + '</span>' +
            '</div>' +
            '<div class="s-desc">' + highlight(descSnippet, terms) + '</div>' +
          '</a>';
      });
    });

    resultsBox.innerHTML = html;
    updateActive();
  }

  /* =========================================================
     12.8 打开 / 关闭
     ========================================================= */
  function updateClearVisibility() {
    if (input.value) inputWrap.classList.add('has-value');
    else inputWrap.classList.remove('has-value');
  }

  function openSearch() {
    overlay.hidden = false;
    input.value = '';
    updateClearVisibility();
    render('');
    setTimeout(function () { input.focus(); }, 20);
  }

  function closeSearch() {
    overlay.hidden = true;
    if (searchToggle) searchToggle.focus();
  }

  /* =========================================================
     12.9 事件绑定
     ========================================================= */
  if (searchToggle) {
    searchToggle.addEventListener('click', openSearch);
  }

  // 输入防抖
  input.addEventListener('input', function () {
    updateClearVisibility();
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(function () {
      render(input.value);
    }, 80);
  });

  // 清空按钮
  clearBtn.addEventListener('click', function () {
    input.value = '';
    updateClearVisibility();
    render('');
    input.focus();
  });

  // 键盘
  input.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!currentResults.length) return;
      activeIndex = (activeIndex + 1) % currentResults.length;
      updateActive();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (!currentResults.length) return;
      activeIndex = (activeIndex - 1 + currentResults.length) % currentResults.length;
      updateActive();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIndex >= 0 && currentResults[activeIndex]) {
        pushHistory(input.value);
        window.location.href = currentResults[activeIndex].u;
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      closeSearch();
    }
  });

  // 点击结果项：记录历史
  resultsBox.addEventListener('click', function (e) {
    // 历史 / 建议 chip
    var chip = e.target.closest('.search-history-item');
    if (chip) {
      e.preventDefault();
      var q = chip.getAttribute('data-q') || '';
      input.value = q;
      updateClearVisibility();
      render(q);
      input.focus();
      return;
    }
    // 清除历史
    if (e.target.closest('#searchHistoryClear')) {
      e.preventDefault();
      clearHistory();
      render('');
      return;
    }
    // 搜索结果链接
    var item = e.target.closest('.search-item');
    if (item) {
      pushHistory(input.value);
    }
  });

  // 点击遮罩空白处关闭
  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) closeSearch();
  });

  // 全局快捷键
  document.addEventListener('keydown', function (e) {
    var tag = (e.target && e.target.tagName) || '';
    var isTyping = tag === 'INPUT' || tag === 'TEXTAREA' ||
                   (e.target && e.target.isContentEditable);

    if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K')) {
      e.preventDefault();
      if (overlay.hidden) openSearch();
      else closeSearch();
      return;
    }

    if (e.key === '/' && !isTyping && overlay.hidden) {
      e.preventDefault();
      openSearch();
    }
  });
})();