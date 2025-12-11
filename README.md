# Nest Admin - 企业级管理系统

基于 NestJS + Vue3 + Naive UI 的现代化企业级管理系统。

## 🚀 GitHub Actions 自动化部署

本项目已配置 GitHub Actions 自动化部署工作流，使用 PM2 进行进程管理。

### 快速开始

查看 [部署配置总结](.github/DEPLOYMENT_SETUP.md) 开始配置自动化部署。

### 相关文档

- 📖 [完整部署指南](docs/GITHUB_ACTIONS.md) - 详细的配置步骤和故障排查
- ⚡ [快速开始](docs/QUICK_START_DEPLOY.md) - 3 步完成配置
- 📋 [部署概览](DEPLOYMENT_README.md) - 部署配置总览

### 配置检查工具

```bash
# Linux/Mac
bash scripts/check-deploy-config.sh

# Windows
scripts\check-deploy-config.bat
```

## 项目结构

```
nest-admin/
├── admin-naive-ui/          # 前端项目 (Vue3 + Naive UI)
├── server/                  # 后端项目 (NestJS)
├── docs/                    # 项目文档
├── .github/
│   ├── workflows/          # GitHub Actions 工作流
│   │   ├── deploy.yml                 # 简单部署
│   │   └── deploy-advanced.yml        # 高级部署 ⭐
│   └── DEPLOYMENT_SETUP.md # 部署配置总结
└── scripts/                # 辅助脚本
    ├── check-deploy-config.sh         # 配置检查脚本
    └── check-deploy-config.bat        # Windows 配置检查
```

## 开发

### 前端开发

```bash
cd admin-naive-ui
pnpm install
pnpm dev
```

### 后端开发

```bash
cd server
pnpm install
pnpm run start:dev
```

## 部署

推送代码到 `main` 或 `main-soybean` 分支，GitHub Actions 将自动部署到服务器。

手动部署：访问 GitHub Actions 页面，选择工作流并点击 "Run workflow"。

## 技术栈

### 前端
- Vue 3
- Naive UI
- TypeScript
- Vite
- UnoCSS
- Pinia

### 后端
- NestJS
- Prisma
- PostgreSQL
- Redis
- JWT
- Swagger

### DevOps
- GitHub Actions
- PM2
- Nginx

## License

MIT

---

更多信息请查看 [部署文档](docs/GITHUB_ACTIONS.md)
