# wayione · 个人主页

工程力学与地震工程方向的个人站点。

- **主页**：<https://wywang1996.github.io/index.html>

---

## 内容

### 小工具（4）

**在线工具**

- 地震动参数计算器：上传 CSV / TXT 加速度时程，计算 PGA、PGV、PGD、Arias 强度、有效持时、卓越周期与 5% 阻尼反应谱
- 抗震规范谱生成器：支持 7 部中国抗震规范的设计谱生成（建筑抗震、公路桥梁、城市桥梁、城轨结构、水运工程、建筑隔震、核电厂），可导出 SVG 矢量图与 CSV
- 震级能量换算器：在 ML、mb、MS、Mw 之间经验换算，估算释放能量与地震矩，含震级饱和预警
- 波形格式转换器：在 SAC、MiniSEED、ASCII / CSV 之间本地转换

**离线工具**

- 即将上线

### 项目（5）

- 数据来源
- 地震学绘图
- 地震动参数分析
- 强震动数据处理
- 地震危险性分析

### 笔记（34）

| 分类 | 数量 | 内容 |
|---|---|---|
| **数学** | 5 | 线性代数、数值分析、概率论与数理统计、复变函数与积分变换、偏微分方程 |
| **力学** | 11 | 理论力学、材料力学、流体力学、结构力学、弹性力学、振动力学、结构动力学、塑性力学、断裂力学、板壳理论、有限元方法 |
| **计算机** | 9 | 数字信号处理、数据结构、算法设计与分析、机器学习基础、科学计算与 Python、科学计算与 MATLAB、科学计算与 R、数据库与数据工程、并行与高性能计算 |
| **地震学** | 9 | 地震动谱分析入门、定量地震学、地震地质、工程地震学、场地地震安全性评价、地震工程、强震动观测、土动力学、地震预警 |

每个分类都有独立的分类页（`math-index.html`、`mechanics-index.html`、`cs-index.html`、`seismology-index.html`），列出该分类下所有笔记卡片。

---

## 功能

### 全站

- **深浅色主题**：一键切换，跟随系统偏好，状态持久化
- **全站搜索**：导航栏放大镜按钮，或快捷键 `/` 与 `Ctrl/Cmd + K`
  - 支持标题、关键词、描述多字段匹配
  - 支持中文拼音首字母（如 `xxds` → 线性代数）
  - 匹配位置加权、结果片段截取、逐词高亮
  - 搜索历史（localStorage，最近 5 条）
  - 结果按类别分组，↑↓ 选择，Enter 打开，Esc 关闭
- **响应式布局**：桌面侧栏 + 移动端抽屉

### 笔记页

- 右侧浮动目录 TOC，滚动高亮当前章节
- 顶部阅读进度条
- 代码块高亮 + 一键复制
- KaTeX 数学公式渲染
- 锚点跳转 + flash 高亮动画

### 工具页

- 左侧本页目录，随面板显隐自动增减
- 结果一键导出 CSV 或 SVG 矢量图

### 交互细节

- 侧栏笔记分类：可折叠面板，未展开时预览 2 个条目
- 主页笔记卡片：标题可点击进入分类页，词条直接跳转到对应笔记

---

## 技术

原生 HTML / CSS / JavaScript，无构建步骤，无外部框架。

- **代码高亮**：Prism.js（按需加载，含 15 种语言）
- **公式渲染**：KaTeX（按需加载）
- **主题切换**：CSS 变量 + localStorage
- **部署**：GitHub Pages

### 目录结构
/
├── index.html 主页
├── math-index.html 数学分类页
├── mechanics-index.html 力学分类页
├── cs-index.html 计算机分类页
├── seismology-index.html 地震学分类页
├── ground-motion-calc.html 地震动参数计算器
├── design-response-spectrum.html 抗震规范谱生成器
├── magnitude.html 震级能量换算器
├── waveform.html 波形格式转换器
├── data-sources.html 数据来源
├── plotting.html 地震学绘图
├── ground-motion.html 地震动参数分析
├── strong-motion.html 强震动数据处理
├── seismic-hazard.html 地震危险性分析
├── assets/
│ ├── site.css 全站通用样式
│ ├── site.js 全站通用脚本（含搜索）
│ ├── pages.css 笔记与分类页样式
│ └── tools.css 工具页样式
├── math/ 数学笔记（5）
├── mechanics/ 力学笔记（11）
├── cs/ 计算机笔记（9）
└── seismology/ 地震学笔记（9）

---

## 本地预览

直接用浏览器打开 `index.html` 即可，无需任何构建或服务器。

如需本地服务器（推荐，避免部分浏览器的跨域限制）：

```bash
# Python 3
python -m http.server 8000

# 或 Node.js
npx serve