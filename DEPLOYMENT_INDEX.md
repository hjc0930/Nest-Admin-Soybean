# 部署文档索引

欢迎使用 GitHub Actions 自动化部署！以下是所有相关文档的索引。

## 📖 文档导航

### 🚀 快速开始
适合想要快速配置部署的用户。

- **[部署配置总结](.github/DEPLOYMENT_SETUP.md)** ⭐ 推荐首选
  - 包含完整的配置流程
  - 可视化流程图
  - 快速命令参考
  
- **[快速开始指南](docs/QUICK_START_DEPLOY.md)**
  - 3 步完成基础配置
  - 精简的步骤说明

- **[配置清单](.github/DEPLOYMENT_CHECKLIST.md)**
  - 逐步检查清单
  - 确保不遗漏任何步骤

### 📚 详细文档
适合需要深入了解配置细节的用户。

- **[完整部署指南](docs/GITHUB_ACTIONS.md)**
  - 详细的配置步骤
  - PM2 配置说明
  - Nginx 配置示例
  - 故障排查指南
  - 最佳实践
  - 安全建议

- **[部署概览](DEPLOYMENT_README.md)**
  - 项目部署概览
  - 常用命令参考

### 🔧 配置文件

- **[Secrets 配置示例](.github/secrets.example)**
  - GitHub Secrets 配置模板
  - 服务器环境变量示例

- **[PM2 配置](server/ecosystem.config.cjs)**
  - PM2 进程管理配置

### 🛠️ 工作流文件

- **[简单部署工作流](.github/workflows/deploy.yml)**
  - 基础部署流程
  - 适合小型项目

- **[高级部署工作流](.github/workflows/deploy-advanced.yml)** ⭐ 推荐
  - 包含备份、健康检查
  - 生产环境推荐使用

### 🔍 辅助工具

- **[配置检查脚本](scripts/check-deploy-config.sh)** (Linux/Mac)
  - 自动检查配置文件
  - 生成配置指南

- **[配置检查脚本](scripts/check-deploy-config.bat)** (Windows)
  - Windows 版本的配置检查

## 🎯 推荐阅读顺序

### 初次配置用户

1. 📋 [配置清单](.github/DEPLOYMENT_CHECKLIST.md)
2. 🚀 [部署配置总结](.github/DEPLOYMENT_SETUP.md)
3. 📖 [完整部署指南](docs/GITHUB_ACTIONS.md) - 遇到问题时查阅

### 快速上手用户

1. ⚡ [快速开始指南](docs/QUICK_START_DEPLOY.md)
2. 🚀 [部署配置总结](.github/DEPLOYMENT_SETUP.md)
3. 🔧 运行配置检查脚本

### 深度用户

1. 📖 [完整部署指南](docs/GITHUB_ACTIONS.md)
2. 🔍 查看工作流文件源码
3. 🛠️ 根据需求自定义配置

## 🆘 遇到问题？

### 按问题类型查找

| 问题类型 | 查看文档 |
|---------|----------|
| SSH 连接失败 | [完整部署指南 - 故障排查](docs/GITHUB_ACTIONS.md#-故障排查) |
| GitHub Actions 失败 | [完整部署指南 - 故障排查](docs/GITHUB_ACTIONS.md#-故障排查) |
| PM2 启动失败 | [完整部署指南 - PM2 配置](docs/GITHUB_ACTIONS.md#-pm2-配置说明) |
| 数据库连接问题 | [完整部署指南 - 故障排查](docs/GITHUB_ACTIONS.md#-故障排查) |
| Nginx 配置 | [完整部署指南 - Nginx 配置](docs/GITHUB_ACTIONS.md#-nginx-配置) |
| 回滚操作 | [完整部署指南 - 回滚操作](docs/GITHUB_ACTIONS.md#-回滚操作) |

### 检查清单

1. ✅ 运行配置检查脚本
   ```bash
   bash scripts/check-deploy-config.sh
   ```

2. ✅ 检查 GitHub Secrets 配置

3. ✅ 查看 GitHub Actions 日志

4. ✅ 查看服务器 PM2 日志
   ```bash
   pm2 logs nest_admin_server
   ```

5. ✅ 检查环境变量配置

## 📊 文档概览

```
部署文档结构
├── README.md                               # 项目主文档
├── DEPLOYMENT_README.md                     # 部署概览
├── DEPLOYMENT_INDEX.md                      # 本文档（索引）
│
├── .github/
│   ├── DEPLOYMENT_SETUP.md                 # 部署配置总结 ⭐
│   ├── DEPLOYMENT_CHECKLIST.md             # 配置清单
│   ├── secrets.example                     # Secrets 示例
│   └── workflows/
│       ├── deploy.yml                      # 简单部署
│       └── deploy-advanced.yml             # 高级部署 ⭐
│
├── docs/
│   ├── GITHUB_ACTIONS.md                   # 完整部署指南 📖
│   └── QUICK_START_DEPLOY.md               # 快速开始
│
├── scripts/
│   ├── check-deploy-config.sh              # Linux/Mac 检查脚本
│   └── check-deploy-config.bat             # Windows 检查脚本
│
└── server/
    └── ecosystem.config.cjs                # PM2 配置
```

## 🔗 外部资源

- [GitHub Actions 官方文档](https://docs.github.com/actions)
- [PM2 官方文档](https://pm2.keymetrics.io/docs/)
- [Prisma 部署指南](https://www.prisma.io/docs/guides/deployment)
- [Nginx 官方文档](https://nginx.org/en/docs/)
- [Let's Encrypt](https://letsencrypt.org/)

## 💡 提示

- 🌟 标记的文档是推荐优先阅读的
- 📖 标记的是详细技术文档
- ⚡ 标记的是快速参考指南
- 🔧 标记的是配置文件和工具

## 🎉 开始使用

选择适合你的文档开始配置自动化部署：

1. **新手用户** → 从 [配置清单](.github/DEPLOYMENT_CHECKLIST.md) 开始
2. **有经验用户** → 直接查看 [部署配置总结](.github/DEPLOYMENT_SETUP.md)
3. **遇到问题** → 查阅 [完整部署指南](docs/GITHUB_ACTIONS.md)

---

祝你部署顺利！🚀
