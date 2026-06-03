<<<<<<< HEAD
# 社交媒体内容审核系统（前端展示版）

> 基于 Vue 3 的内容审核中后台系统，包含 **用户端 + 管理端** 双角色。
> 本仓库为**纯前端静态演示版**：内置 mock 数据，无需后端、无需数据库，可直接部署到 GitHub Pages 在线访问。

## 🔗 在线预览

部署完成后访问： `https://<你的GitHub用户名>.github.io/<仓库名>/`

## 👤 演示账号（任意密码即可登录）

| 角色 | 用户名 | 密码 | 进入界面 |
| --- | --- | --- | --- |
| 管理员 | `admin` | 任意 | 管理端（用户管理、审核、报表…） |
| 普通用户 | `lixin` | 任意 | 用户端（发现、聊天、作品…） |

> 登录页提供「一键填充」按钮，点击即可快速体验两种角色。

## ✨ 功能模块

- **用户端**：发现（作品瀑布流 + 视频播放）、聊天室（消息发送实时敏感词拦截）、个人中心（资料编辑 / 头像 / 主题背景）、我的作品（发布、审核状态、申诉）。
- **管理端**：用户管理、AI 自动审核（文本 / 图像 / 视频抽帧）、人工审核（待审队列 / 审核记录）、敏感词库管理、审核数据报表（ECharts 柱状图 + 饼图）、审核阈值配置。
- **体验**：明暗主题切换、响应式布局、侧边栏折叠、面包屑导航。

> 💡 试试在「文本审核」或「聊天室」输入 `赌博`、`诈骗` 等词，会被审核规则实时拦截 —— 演示数据的敏感词检测是真实生效的。

## 🛠 技术栈

Vue 3 · Vite · Vue Router · Pinia · Element Plus · Tailwind CSS · ECharts · Axios

## 💻 本地运行

```sh
npm install      # 安装依赖
npm run dev      # 本地开发（默认 http://localhost:5173）
npm run build    # 生产构建，产物在 dist/
npm run preview  # 本地预览构建产物
```

## 🚀 部署到 GitHub Pages（已内置自动化）

本仓库已配置 GitHub Actions，推送代码后自动构建并发布：

1. 在 GitHub 新建仓库，将本项目推送上去（push 到 `main` 分支）。
2. 打开仓库 **Settings → Pages → Build and deployment**，**Source 选择「GitHub Actions」**。
3. 之后每次 push 到 `main`，`.github/workflows/deploy.yml` 会自动构建并部署。
4. 等待 Actions 跑完，即可通过 `https://<用户名>.github.io/<仓库名>/` 访问。

> 项目使用 **hash 路由 + 相对路径打包（`base: './'`）**，无论部署在哪个子路径都能正常运行、刷新不 404，无需手动修改配置。

手动部署也可：执行 `npm run build`，将 `dist/` 目录内容发布到任意静态托管即可。

## 📦 数据说明 / 切换真实后端

- 默认开启 mock（见 `.env` 中 `APP_USE_MOCK=true`），全部接口由 `src/mock/` 下的本地静态数据响应，图片为前端生成的 SVG，视频为公开样例地址。
- 如需对接真实后端：在 `.env` 中设 `APP_USE_MOCK=false`，并将 `APP_BASE_URL` 改为后端服务地址即可，业务代码无需改动。

```
src/mock/
├── index.js         # axios 适配器：拦截全部请求并返回静态数据
├── db.js            # 静态数据集（用户、作品、敏感词、审核记录、报表…）
└── placeholders.js  # SVG 头像 / 封面生成、样例视频地址
```
=======
# view-page
>>>>>>> 0b9e3efee06d3a87add433537856c5c60e5f9d22
