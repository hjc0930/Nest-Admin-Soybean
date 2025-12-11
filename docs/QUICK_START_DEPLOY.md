# GitHub Actions 自动化部署快速开始

## 第一步：配置 GitHub Secrets

1. 进入你的 GitHub 仓库
2. 点击 `Settings` -> `Secrets and variables` -> `Actions`
3. 点击 `New repository secret` 添加以下 secrets：

```
SSH_PRIVATE_KEY=你的SSH私钥内容
REMOTE_HOST=服务器IP地址
REMOTE_USER=SSH用户名（如 root 或 www）
REMOTE_PORT=22
REMOTE_BACKEND_DIR=/www/wwwroot/nest-admin-server
REMOTE_FRONTEND_DIR=/www/wwwroot/nest-admin-frontend
```

## 第二步：服务器准备

在服务器上执行：

```bash
# 1. 安装 PM2
npm install -g pm2

# 2. 创建部署目录
mkdir -p /www/wwwroot/nest-admin-server
mkdir -p /www/wwwroot/nest-admin-frontend
mkdir -p /www/wwwlogs/pm2/nest_admin_server

# 3. 配置环境变量
cd /www/wwwroot/nest-admin-server
nano .env.production

# 4. 设置 PM2 开机自启
pm2 startup
pm2 save
```

## 第三步：推送代码触发部署

```bash
git add .
git commit -m "chore: setup github actions"
git push origin main-soybean
```

## 完成！

访问 GitHub Actions 页面查看部署进度。
