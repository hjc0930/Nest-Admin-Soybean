# GitHub Actions 部署配置清单

使用此清单确保所有配置步骤都已完成。

## 📋 前置准备

- [ ] 拥有一台可以通过 SSH 访问的服务器
- [ ] 服务器已安装 Node.js (>= 20.x)
- [ ] 服务器已安装 PostgreSQL 或 MySQL
- [ ] 服务器已安装 Redis
- [ ] 拥有 GitHub 仓库的管理员权限

## 🔑 第一步：SSH 密钥配置

- [ ] 在本地生成 SSH 密钥对
  ```bash
  ssh-keygen -t rsa -b 4096 -C "github-actions" -f ~/.ssh/github-actions -N ""
  ```

- [ ] 将公钥添加到服务器
  ```bash
  ssh-copy-id -i ~/.ssh/github-actions.pub user@your-server-ip
  ```

- [ ] 测试 SSH 连接
  ```bash
  ssh -i ~/.ssh/github-actions user@your-server-ip
  ```

- [ ] 复制私钥内容（用于下一步）
  ```bash
  cat ~/.ssh/github-actions
  ```

## 🔐 第二步：GitHub Secrets 配置

进入 GitHub 仓库: `Settings` → `Secrets and variables` → `Actions`

- [ ] 添加 `SSH_PRIVATE_KEY`
  - 值：完整的 SSH 私钥内容

- [ ] 添加 `REMOTE_HOST`
  - 值：服务器 IP 地址（如 `123.456.78.90`）

- [ ] 添加 `REMOTE_USER`
  - 值：SSH 用户名（如 `root` 或 `www`）

- [ ] 添加 `REMOTE_PORT`
  - 值：SSH 端口（默认 `22`）

- [ ] 添加 `REMOTE_BACKEND_DIR`
  - 值：后端部署目录（如 `/www/wwwroot/nest-admin-server`）

- [ ] 添加 `REMOTE_FRONTEND_DIR`
  - 值：前端部署目录（如 `/www/wwwroot/nest-admin-frontend`）

## 🖥️ 第三步：服务器环境配置

SSH 登录到服务器后执行：

### 基础环境

- [ ] 安装 Node.js 20.x
  ```bash
  curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
  sudo apt-get install -y nodejs
  ```

- [ ] 安装 pnpm
  ```bash
  npm install -g pnpm
  ```

- [ ] 安装 PM2
  ```bash
  npm install -g pm2
  ```

- [ ] 验证安装
  ```bash
  node --version   # 应显示 v20.x.x
  pnpm --version   # 应显示 10.x.x
  pm2 --version    # 应显示版本号
  ```

### 目录结构

- [ ] 创建部署目录
  ```bash
  sudo mkdir -p /www/wwwroot/nest-admin-server
  sudo mkdir -p /www/wwwroot/nest-admin-frontend
  sudo mkdir -p /www/wwwlogs/pm2/nest_admin_server
  ```

- [ ] 设置目录权限
  ```bash
  sudo chown -R $USER:$USER /www/wwwroot
  sudo chown -R $USER:$USER /www/wwwlogs
  ```

### 环境变量

- [ ] 创建生产环境配置文件
  ```bash
  cd /www/wwwroot/nest-admin-server
  nano .env.production
  ```

- [ ] 填写环境变量（至少包括）：
  - `NODE_ENV=production`
  - `PORT=3000`
  - `DATABASE_URL`
  - `REDIS_HOST`, `REDIS_PORT`, `REDIS_PASSWORD`, `REDIS_DB`
  - `JWT_SECRET`

- [ ] 保存并退出（Ctrl+O, Enter, Ctrl+X）

### PM2 配置

- [ ] 设置 PM2 开机自启
  ```bash
  pm2 startup
  ```

- [ ] 执行返回的命令（如果有）

- [ ] 保存 PM2 配置
  ```bash
  pm2 save
  ```

### 数据库准备

- [ ] 创建数据库
  ```sql
  CREATE DATABASE nest_admin;
  ```

- [ ] 创建数据库用户（如需要）
  ```sql
  CREATE USER nest_admin_user WITH PASSWORD 'your_password';
  GRANT ALL PRIVILEGES ON DATABASE nest_admin TO nest_admin_user;
  ```

### Redis 配置

- [ ] 确认 Redis 正在运行
  ```bash
  redis-cli ping  # 应返回 PONG
  ```

- [ ] 如果设置了密码，测试连接
  ```bash
  redis-cli -a your_password ping
  ```

## 📝 第四步：验证配置文件

- [ ] 确认工作流文件存在
  - `.github/workflows/deploy.yml`
  - `.github/workflows/deploy-advanced.yml`

- [ ] 确认 PM2 配置文件存在
  - `server/ecosystem.config.cjs`

- [ ] PM2 配置中的 `cwd` 路径与 `REMOTE_BACKEND_DIR` 一致

- [ ] PM2 配置中的日志路径已创建

## 🚀 第五步：首次部署

- [ ] 运行配置检查脚本（可选）
  ```bash
  bash scripts/check-deploy-config.sh
  ```

- [ ] 提交代码并推送
  ```bash
  git add .
  git commit -m "chore: configure github actions deployment"
  git push origin main-soybean
  ```

- [ ] 访问 GitHub Actions 查看部署进度
  - https://github.com/linlingqin77/Nest-Admin/actions

- [ ] 等待部署完成（通常 3-5 分钟）

## ✅ 第六步：验证部署

### 检查 GitHub Actions

- [ ] 工作流运行成功（绿色对勾）
- [ ] 没有错误日志

### 检查服务器

- [ ] SSH 登录到服务器

- [ ] 检查文件是否上传
  ```bash
  ls -la /www/wwwroot/nest-admin-server/dist
  ls -la /www/wwwroot/nest-admin-frontend/dist
  ```

- [ ] 检查 PM2 状态
  ```bash
  pm2 list
  ```
  应该看到 `nest_admin_server` 状态为 `online`

- [ ] 查看应用日志
  ```bash
  pm2 logs nest_admin_server --lines 50
  ```

- [ ] 测试应用访问
  ```bash
  curl http://localhost:3000/health
  # 或
  curl http://localhost:3000/api
  ```

### 检查前端

- [ ] 配置 Nginx（如果还没有）
- [ ] 访问前端地址
- [ ] 检查页面是否正常加载
- [ ] 测试 API 调用

## 🔧 可选配置

- [ ] 配置 Nginx 反向代理
- [ ] 配置 SSL 证书（Let's Encrypt）
- [ ] 配置域名解析
- [ ] 启用 Gzip 压缩
- [ ] 配置日志切割（logrotate）
- [ ] 设置监控告警（PM2 Plus 或其他）
- [ ] 配置数据库自动备份
- [ ] 配置 CDN 加速

## 📚 参考文档

- [ ] 已阅读 [完整部署指南](docs/GITHUB_ACTIONS.md)
- [ ] 已阅读 [快速开始](docs/QUICK_START_DEPLOY.md)
- [ ] 已阅读 [部署概览](DEPLOYMENT_README.md)
- [ ] 已阅读 [部署配置总结](.github/DEPLOYMENT_SETUP.md)

## 🐛 故障排查

如果遇到问题，请检查：

- [ ] GitHub Secrets 配置是否正确
- [ ] SSH 连接是否正常
- [ ] 服务器环境是否满足要求
- [ ] 环境变量是否配置完整
- [ ] 数据库连接是否正常
- [ ] Redis 连接是否正常
- [ ] 端口是否被占用
- [ ] 防火墙是否开放相应端口

查看日志：
```bash
# GitHub Actions 日志
在 GitHub Actions 页面查看

# PM2 日志
pm2 logs nest_admin_server

# 系统日志
tail -f /www/wwwlogs/pm2/nest_admin_server/err.log
```

## ✨ 完成！

如果所有步骤都已完成并打勾，恭喜你！GitHub Actions 自动化部署已配置完成。

每次推送代码到 `main-soybean` 分支时，系统将自动部署到服务器。

---

**下次部署时无需重复以上步骤，只需推送代码即可！** 🚀
