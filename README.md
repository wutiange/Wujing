# Wujing 笔记

用于记录自己的学习记录、工作记录，以及在工作过程中遇到的问题、难点功能与解决方案。

## 架构说明

- 采用 [Next.js](https://nextjs.org) App Router 实现
- 内容以 Markdown 文件形式存放在 `content/` 目录
- 构建时由 Next.js 读取 Markdown 并生成静态页面

## 部署说明

本项目配置为**静态资源网站**（`output: "export"`），构建产物输出到 `out/` 目录。

推送到 `main` 后，GitHub Actions 会自动构建并发布到 GitHub Pages（`gh-pages` 分支）。也可在 Actions 页手动触发 **Deploy to GitHub Pages**。

本地也可手动发布：

```bash
npm run deploy
```

## 本地开发

```bash
npm install
npm run dev
```

浏览器访问 [http://localhost:3000](http://localhost:3000)。

## 在线访问

站点已部署到 GitHub Pages：

**https://wutiange.github.io/Wujing/**

页脚提供 **GitHub** 与 **网站** 两个入口，可从站点直接跳转到仓库或在线页面。

若希望在 GitHub 仓库页「About」旁也能一点进入网站，请在仓库 Settings → General → Website 填入：

`https://wutiange.github.io/Wujing/`

合并到 `main` 后会自动发布；若需本地立刻发布，仍可执行 `npm run deploy`。

## 添加笔记

在 `content/` 目录下新建 `.md` 文件，使用 frontmatter 定义元信息：

```markdown
---
title: 笔记标题
date: 2026-06-25
description: 简短描述
---

正文内容...
```

文件名即 URL 路径，例如 `content/my-note.md` 对应 `/notes/my-note`。

## 公司经历

各公司经历存放在 `content/companies/` 目录，直接编辑 Markdown 即可渲染：

| 文件 | 路由 |
|------|------|
| `yiyuan.md` | `/companies/yiyuan` |
| `dreame.md` | `/companies/dreame` |
| `boshi.md` | `/companies/boshi` |
| `xidi.md` | `/companies/xidi` |
| `yuanqi-senlin.md` | `/companies/yuanqi-senlin` |
| `tengwan-weigu.md` | `/companies/tengwan-weigu` |

公司 frontmatter 可用 `start` / `end` 表示在职区间（如 `2026-08`、`至今`），侧栏与列表会显示为 `2026年8月~至今`。

```markdown
---
title: 北京藤蔓微谷科技有限公司
---

在此直接写 Markdown 正文...
```

## 项目结构

```
content/
  companies/      # 公司经历 Markdown
  *.md            # 其他笔记
src/
  app/            # Next.js 页面
  lib/markdown.ts # Markdown 读取与解析
```
