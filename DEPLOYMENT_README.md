# GitHub Actions 自动化部署配置完成

## ✅ 已创建的文件

1. **`.github/workflows/deploy.yml`** - 简单部署工作流
2. **`.github/workflows/deploy-advanced.yml`** - 高级部署工作流（推荐）
3. **`docs/GITHUB_ACTIONS.md`** - 详细配置文档
4. **`docs/QUICK_START_DEPLOY.md`** - 快速开始指南

## 🚀 快速配置步骤

### 1. 生成 SSH 密钥

```bash
ssh-keygen -t rsa -b 4096 -C "github-actions" -f ~/.ssh/github-actions -N ""
ssh-copy-id -i ~/.ssh/github-actions.pub user@your-server-ip
cat ~/.ssh/github-actions  # 复制私钥内容
```

### 2. 配置 GitHub Secrets

进入仓库 `Settings` -> `Secrets and variables` -> `Actions`，添加：

- `SSH_PRIVATE_KEY` - SSH 私钥内容
- `REMOTE_HOST` - 服务器 IP
- `REMOTE_USER` - SSH 用户名
- `REMOTE_PORT` - SSH 端口（默认 22）
- `REMOTE_BACKEND_DIR` - 后端目录（如 `/www/wwwroot/nest-admin-server`）
- `REMOTE_FRONTEND_DIR` - 前端目录（如 `/www/wwwroot/nest-admin-frontend`）

### 3. 服务器准备

```bash
# 安装依赖
npm install -g pm2 pnpm

# 创建目录
mkdir -p /www/wwwroot/nest-admin-server
mkdir -p /www/wwwroot/nest-admin-frontend
mkdir -p /www/wwwlogs/pm2/nest_admin_server

# 配置环境变量
cd /www/wwwroot/nest-admin-server
nano .env.production

# 设置 PM2 开机自启
pm2 startup
pm2 save
```

### 4. 推送代码触发部署

```bash
git add .
git commit -m "chore: configure github actions"
git push origin main-soybean
```

## 📚 查看详细文档

- **完整配置指南**: [docs/GITHUB_ACTIONS.md](./docs/GITHUB_ACTIONS.md)
- **快速开始**: [docs/QUICK_START_DEPLOY.md](./docs/QUICK_START_DEPLOY.md)

## 🔧 PM2 常用命令

```bash
pm2 list                        # 查看应用列表
pm2 logs nest_admin_server      # 查看日志
pm2 restart nest_admin_server   # 重启应用
pm2 monit                       # 监控面板
```

## 🐛 故障排查

如果部署失败，检查：
1. GitHub Secrets 是否配置正确
2. 服务器 SSH 连接是否正常
3. PM2 日志：`pm2 logs nest_admin_server`
4. GitHub Actions 日志

## 📞 获取帮助

查看详细文档或提交 Issue 获取帮助。
