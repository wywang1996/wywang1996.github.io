# wayione · 个人主页与笔记库

工程力学与地震工程方向的个人站点：主页、项目页、笔记库、小工具与联系信息。
纯静态站点，无构建步骤，直接部署到任意静态托管即可运行。

- **作者**：wayione
- **邮箱**：wayionelove@outlook.com
- **GitHub**：[@wywang1996](https://github.com/wywang1996)
- **更新年份**：2026

---

## 特性

- 🎨 **深浅色主题**：自动跟随系统，手动切换后通过 `localStorage` 持久化
- 🗂️ **侧栏索引**：项目 / 笔记 / 工具 / 关于 / 联系，锚点滚动自动高亮
- 📝 **笔记库**：数学、力学、计算机、地震学四大分类，统一排版
- 📊 **项目页**：功能编号卡、工作流程、方法与公式、代码示例
- 🧰 **小工具**：震级能量换算、波形格式转换、地震动参数计算
- 💻 **代码高亮**：Prism 按需加载，支持 15 种语言（Python / MATLAB / R / C / C++ / SQL / Bash / LaTeX 等）
- 📐 **公式渲染**：KaTeX 按需加载，支持 `$...$`、`$$...$$`、`\(...\)`、`\[...\]`
- 📋 **代码复制**：代码块右上角一键复制
- 📱 **响应式**：桌面端侧栏固定，移动端抽屉式索引
- 🖨️ **打印友好**：打印时自动隐藏导航与侧栏，保留正文

---

## 技术栈

| 层 | 使用 |
|----|------|
| 结构 | 原生 HTML5 |
| 样式 | 原生 CSS3（CSS 变量、Grid、Flexbox） |
| 脚本 | 原生 JavaScript（无框架、无依赖） |
| 代码高亮 | [Prism.js](https://prismjs.com/)（CDN，按需加载） |
| 公式渲染 | [KaTeX](https://katex.org/)（CDN，按需加载） |
| 主题持久化 | `localStorage` |
| 部署 | 任意静态托管（GitHub Pages / Vercel / Netlify / Cloudflare Pages） |

**无构建工具、无 npm 依赖、无打包步骤。** 打开即用。

---

## 目录结构

```
my-homepage/
├── index.html                          # 主页
├── avatar.jpg                          # 头像（首页 + 侧栏共用）
│
├── # ── 项目 ───────────────────────────────
├── strong-motion.html                  # 强震动数据处理
├── ground-motion.html                  # 地震动参数分析
├── seismic-hazard.html                 # 地震危险性分析
│
├── # ── 工具 ───────────────────────────────
├── magnitude.html                      # 震级能量换算器
├── waveform.html                       # 波形格式转换器
│
├── # ── 笔记：数学 ──────────────────────────
├── linear-algebra.html                 # 线性代数
├── numerical-analysis.html             # 数值分析
├── probability-statistics.html         # 概率论与数理统计
├── complex-analysis.html               # 复变函数与积分变换
├── pde.html                            # 偏微分方程
│
├── # ── 笔记：力学 ──────────────────────────
├── theoretical-mechanics.html          # 理论力学
├── material-mechanics.html             # 材料力学
├── fluid-mechanics.html                # 流体力学
├── structural-mechanics.html           # 结构力学
├── elasticity.html                     # 弹性力学
├── vibration.html                      # 振动力学
├── structural-dynamics.html            # 结构动力学
├── plasticity.html                     # 塑性力学
├── fracture-mechanics.html             # 断裂力学
├── plate-shell.html                    # 板壳理论
├── fem.html                            # 有限元方法
│
├── # ── 笔记：计算机 ────────────────────────
├── dsp.html                            # 数字信号处理
├── data-structures.html                # 数据结构
├── algorithm-design.html               # 算法设计与分析
├── machine-learning.html               # 机器学习基础
├── scientific-computing-python.html    # 科学计算与 Python
├── scientific-computing-matlab.html    # 科学计算与 MATLAB
├── scientific-computing-r.html         # 科学计算与 R
├── database-data-engineering.html      # 数据库与数据工程
├── parallel-high-performance-computing.html  # 并行与高性能计算
│
├── # ── 笔记：地震学 ────────────────────────
├── spectral-analysis.html              # 地震动谱分析入门
├── quant-seismo.html                   # 定量地震学
├── earthquake-geology.html             # 地震地质
├── engineering-seismology.html         # 工程地震学
├── site-seismic-safety-evaluation.html # 场地地震安全性评价
├── earthquake-engineering.html         # 地震工程
├── strong-motion-observation.html      # 强震动观测
├── soil-dynamics.html                  # 土动力学
├── earthquake-early-warning.html       # 地震预警
│
└── assets/
    ├── site.css                        # 全站基础样式（主题变量 / 导航 / 侧栏 / 卡片 / 代码块 / 打印）
    ├── pages.css                       # 内页增量样式（项目页 / 文章页 / 工具页 / 通用补充）
    └── site.js                         # 全站功能脚本（主题 / 导航 / 复制 / Prism / KaTeX / 进度条 / TOC）
```

---

## 页面架构

站点包含三类页面，样式与脚本严格分层。

### 1. 主页 `index.html`

| 项 | 值 |
|----|----|
| `<html>` | 无 `data-page` |
| `<body>` | `data-nav="home"` |
| 引用 | `assets/site.css` + `assets/site.js` |
| 布局 | 顶部导航 + 侧栏索引 + 主内容（Hero / 项目 / 笔记 / 工具 / 关于 / 联系） |

### 2. 项目页 `strong-motion.html` 等

| 项 | 值 |
|----|----|
| `<html data-page>` | `strong-motion` / `ground-motion` / `seismic-hazard` |
| `<body data-nav>` | 与 `data-page` 一致 |
| 引用 | `assets/site.css` + `assets/pages.css` + `assets/site.js` |
| 布局 | 顶部导航（含右上角返回链接）+ 侧栏目录 + 正文 |
| 正文结构 | `page-head` / `feature-list` / `steps` / `formula` / `callout` / `code-block` / `chips` / `refs` |

### 3. 笔记页（文章）

| 项 | 值 |
|----|----|
| `<html data-page>` | `note` |
| `<body data-nav>` | 对应侧栏 `data-nav`，如 `linear-algebra` |
| 引用 | `assets/site.css` + `assets/pages.css` + `assets/site.js` |
| 布局 | `dsp-wrap`（内容 + 右侧 TOC） |
| 正文结构 | `article-header` / `article-body` / `keypoints` / `back-link` |

---

## 核心脚本说明

`assets/site.js` 提供 11 项功能，**按页面 DOM 自动触发**：

| # | 功能 | 触发条件 |
|---|------|----------|
| 1 | 主题切换 | 存在 `#themeToggle` |
| 2 | 跨页导航高亮 | `body[data-nav]` + `a[data-nav]` |
| 3 | 锚点滚动高亮（三层） | `.nav-parent[href^="#"]` 等 |
| 4 | flash 高亮动画 | 点击侧栏锚点 |
| 5 | 移动端抽屉 | `#menuToggle` + `#sidebar` |
| 6 | Prism 按需加载 | 存在 `code[class*="language-"]` |
| 7 | 代码块复制按钮 | `.copy-btn` |
| 8 | KaTeX 按需加载 | 正文含 `$...$` / `$$...$$` 等 |
| 9 | 阅读进度条 | 存在 `#progress` |
| 10 | 文章 TOC 高亮 | `.toc a` |
| 11 | 启动调度 | DOM 就绪后统一初始化 |

**Prism 语言列表**（按依赖顺序逐个加载）：

```
clike → python → matlab → bash → shell-session → json → yaml → markdown → latex
      → c → cpp → r → julia → fortran → sql
```

> 关键点：`clike` 是类 C 语言的基础语法，必须最先加载，否则 `c` / `cpp` / `r` 会静默失败。

---

## 新增页面模板

### 新增一篇笔记

1. 复制任意已有笔记页（推荐 `linear-algebra.html`）为新文件。
2. 修改 `<head>`：

```html
<html lang="zh-CN" data-page="note">
<title>新笔记 · wayione</title>
```

3. 修改 `<body data-nav="新笔记标识">`，标识建议用文件名去扩展名，如 `new-note`。
4. 修改 TOC、文章头、正文内容。
5. 在 `index.html` 对应分类下加卡片：

```html
<div class="card card-parent" id="n-new-note">
  <div class="card-head">
    <h3><a href="new-note.html">新笔记</a></h3>
  </div>
  <p class="desc">一句话简介。</p>
  <div class="subnotes">
    <a href="new-note.html#sec1">章节一</a>
    <a href="new-note.html#sec2">章节二</a>
  </div>
  <div class="tags">
    <span class="tag">标签</span>
    <span class="tag blue">标签</span>
  </div>
</div>
```

6. 在侧栏对应分类下加链接：

```html
<li><a href="new-note.html" data-nav="new-note">新笔记</a></li>
```

### 新增一个项目页

参照 `strong-motion.html` 或 `seismic-hazard.html` 的骨架：
- `<html data-page="项目标识">`
- `<body data-nav="项目标识">`
- 顶部导航含 `<a href="index.html" class="nav-back">← 返回主页</a>`
- 正文使用 `page-head` / `feature-list` / `steps` / `formula` / `code-block` / `refs` 结构

---

## 内容模块一览

### 项目（3）

- 强震动数据处理
- 地震动参数分析
- 地震危险性分析

### 笔记（34）

| 分类 | 已有 | 说明 |
|------|------|------|
| 数学 | 5 | 线性代数、数值分析、概率统计、复变函数、偏微分方程 |
| 力学 | 11 | 理论、材料、流体、结构、弹性、振动、结构动力学、塑性、断裂、板壳、有限元 |
| 计算机 | 9 | DSP、数据结构、算法、机器学习、Python、MATLAB、R、数据库、并行计算 |
| 地震学 | 9 | 谱分析、定量地震学、地震地质、工程地震学、场地评价、地震工程、强震动观测、土动力学、地震预警 |
| **合计** | **34** | — |

### 小工具（3）

- 震级能量换算器
- 波形格式转换器
- 地震动参数计算器（占位）

---

## 常见问题

### Q1：页面样式全乱、导航栏/侧栏无样式

检查 `<head>` 是否**同时**加载了两个样式表：

```html
<link rel="stylesheet" href="assets/site.css">
<link rel="stylesheet" href="assets/pages.css">
```

`site.css` 提供所有 CSS 变量与基础结构，`pages.css` 只是增量覆盖。**顺序不能反。**

### Q2：R / C / C++ 代码块没有高亮

原因：`assets/site.js` 中的 Prism 加载列表缺少 `components/prism-clike.min.js`。
修复：在 `prism.min.js` 之后、其它语言之前加入：

```javascript
'components/prism-clike.min.js',
```

### Q3：控制台报 `Unsafe attempt to load URL file:///...`

原因：用 `file://` 协议打开了页面。浏览器把每个 `file://` 页面当作独立安全源，会拦截动态创建的 `<script>`、`fetch`、ES Module 等。

解决：改用本地 HTTP 服务器访问，例如：

```bash
cd my-homepage
python -m http.server 8000
# 访问 http://localhost:8000/index.html
```

或用 VS Code 的 Live Server 扩展直接打开。

### Q4：头像裂图

确认 `avatar.jpg` 与 `index.html` 同级，且文件确实存在。

### Q5：深色模式下某些颜色不对

检查 `site.css` 里 `[data-theme="dark"]` 是否覆盖了对应的变量；
`pages.css` 里如新增颜色，需同时提供深色版本。

### Q6：右上角没有「← 返回主页」

检查内页的 `.nav-right` 是否包含：

```html
<a href="index.html" class="nav-back">← 返回主页</a>
```

并且 `pages.css` 里有 `.nav-back` 样式（第 14 节）。

### Q7：`.kicker` 小标签没有样式

确认 `pages.css` 末尾定义了 `.kicker`。所有项目页共用同一份定义，页面里**不要**内联重复。

---

## 部署

### GitHub Pages

1. 推到 GitHub 仓库。
2. Settings → Pages → Source 选 `main` 分支根目录。
3. 访问 `https://<用户名>.github.io/<仓库名>/`。

### Vercel / Netlify

- Framework Preset 选 **Other**。
- Build Command 留空，Output Directory 留空（或填 `.`）。
- 直接部署即可。

### Cloudflare Pages

- Build command 留空。
- Build output directory 填 `/`。

---

## 维护约定

- **样式分层**：基础样式进 `site.css`；内页增量进 `pages.css`；页面独有的极少数样式才用内联 `<style>`。
- **不重复定义**：新增页面不再内联 `.kicker`、`.nav-back` 等公共类，直接从 `pages.css` 取。
- **命名一致**：`<body data-nav>`、卡片 `id="n-xxx"`、文件名 `xxx.html` 三者保持一致，便于跨页高亮。
- **纯静态优先**：不引入构建工具、不引入 npm 依赖，保持“打开即用”。
- **代码可复现**：文中所有示例均可在 Python 3.10+ / NumPy / SciPy 环境下运行。

---

## 许可

个人学习与研究用途。内容与代码可自由参考，转载或引用请注明来源。

---

<p align="center">© 2026 wayione · Built with ❤️ and Python</p>