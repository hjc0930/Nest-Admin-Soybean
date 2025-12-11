# 自动化部署快速开始

## 🎯 选择部署方式

根据你的需求选择合适的部署方式：

| 部署方式 | 适用场景 | 难度 | 推荐度 |
|---------|---------|------|--------|
| **GitHub Actions** | 自动化 CI/CD，代码推送自动部署 | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Docker Compose** | 本地开发，快速测试部署 | ⭐⭐ | ⭐⭐⭐⭐ |
| **传统部署** | 已有服务器环境，手动控制 | ⭐⭐⭐⭐ | ⭐⭐⭐ |

## 🚀 方案一：GitHub Actions（推荐）

### 适合场景
- ✅ 团队协作开发
- ✅ 需要自动化 CI/CD
- ✅ 代码提交自动部署
- ✅ 多环境管理（开发/测试/生产）

### 快速配置（5分钟）

#### 1️⃣ 生成 SSH 密钥

```bash
ssh-keygen -t ed25519 -C "github-deploy" -f ~/.ssh/github_deploy
```

#### 2️⃣ 配置服务器

```bash
# 将公钥添加到服务器
cat ~/.ssh/github_deploy.pub | ssh user@server "cat >> ~/.ssh/authorized_keys"
```

#### 3️⃣ 配置 GitHub Secrets

在 GitHub 仓库 → Settings → Secrets → Actions 添加：

> ⚠️ **注意**：密钥名称只能包含字母数字字符（[a-z]、[A-Z]、[0-9]）或下划线（_），不允许使用空格，必须以字母或下划线开头。

```
SERVER_HOST=106.55.138.243
SERVER_USERNAME=root
SSH_PRIVATE_KEY=SHA256:ROYXtJUAPBf2iFCBhU8NvhMP5aHubO4YwLnAUe0PB9Q github-deploy
DEPLOY_PATH=/www/wwwroot/nest-admin
SERVER_URL=https://api.example.com
WEB_URL=https://www.example.com
```

#### 4️⃣ 推送代码触发部署

```bash
git add .
git commit -m "feat: enable auto deployment"
git push origin main
```

✅ 完成！查看 GitHub Actions 页面监控部署进度

### 详细文档
📖 [GitHub Actions 完整配置指南](./GITHUB_ACTIONS.md)

---

## 🐳 方案二：Docker Compose

### 适合场景
- ✅ 本地开发测试
- ✅ 快速搭建环境
- ✅ 跨平台部署
- ✅ 一键启动所有服务

### 快速开始（3分钟）

#### 1️⃣ 配置环境变量

```bash
# 复制环境变量模板
cp .env.docker.example .env

# 编辑配置（修改密码！）
vim .env
```

#### 2️⃣ 一键启动

```bash
# 使用脚本（推荐）
./deploy-local.sh

# 或手动启动
docker-compose up -d
```

#### 3️⃣ 访问服务

- 前端：http://localhost
- 后端：http://localhost:3000

✅ 完成！所有服务已启动

### 详细文档
📖 [Docker 完整部署指南](./DOCKER.md)

---

## 🖥️ 方案三：传统服务器部署

### 适合场景
- ✅ 已有服务器环境
- ✅ 需要手动控制部署流程
- ✅ 使用 PM2 管理进程

### 快速部署（10分钟）

#### 1️⃣ 服务器环境准备

```bash
# 安装 Node.js 20+
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# 安装 pnpm
npm install -g pnpm

# 安装 PM2
npm install -g pm2

# 安装 PostgreSQL 和 Redis
sudo apt-get install -y postgresql redis-server
```

#### 2️⃣ 克隆项目

```bash
cd /www/wwwroot
git clone https://github.com/linlingqin77/Nest-Admin.git
cd Nest-Admin
```

#### 3️⃣ 配置环境变量

```bash
# 后端配置
cd server
cp .env.example .env
vim .env  # 修改数据库等配置

# 前端配置
cd ../ruoyi-plus-soybean
cp .env.production.example .env.production
vim .env.production  # 修改 API 地址
```

#### 4️⃣ 执行部署

```bash
# 使用部署脚本
./deploy-server.sh all

# 或手动部署
cd server
pnpm install
pnpm prisma generate
pnpm prisma migrate deploy
pnpm run build
pm2 start ecosystem.config.cjs

cd ../ruoyi-plus-soybean
pnpm install
pnpm run build
# 部署到 Nginx 目录
```

✅ 完成！服务已启动

### 详细文档
📖 [完整部署文档](./DEPLOYMENT.md)

---

## 🔄 部署后的操作

### 查看服务状态

```bash
# Docker 方式
docker-compose ps
docker-compose logs -f

# PM2 方式
pm2 status
pm2 logs

# Nginx
sudo systemctl status nginx
```

### 重启服务

```bash
# Docker 方式
docker-compose restart

# PM2 方式
pm2 reload all

# Nginx
sudo systemctl reload nginx
```

### 回滚版本

```bash
# 使用回滚脚本
./rollback.sh backend 20231209143000
./rollback.sh frontend 20231209143000
```

---

## 📊 对比总结

### GitHub Actions
**优势**：自动化程度高，无需手动干预
**劣势**：需要配置 GitHub Secrets
**推荐指数**：⭐⭐⭐⭐⭐

### Docker Compose
**优势**：环境一致，一键启动
**劣势**：需要 Docker 环境
**推荐指数**：⭐⭐⭐⭐

### 传统部署
**优势**：完全控制，灵活性高
**劣势**：手动操作多，容易出错
**推荐指数**：⭐⭐⭐

---

## 🆘 需要帮助？

1. 📖 查看详细文档：
   - [部署完整指南](./DEPLOYMENT.md)
   - [GitHub Actions 配置](./GITHUB_ACTIONS.md)
   - [Docker 使用指南](./DOCKER.md)
   - [Docker 构建问题修复](./DOCKER_BUILD_FIX.md) 🆕

2. 🐛 遇到问题：
   - 查看 [常见问题](./DEPLOYMENT.md#常见问题)
   - [Docker 构建失败？](./DOCKER_BUILD_FIX.md)
   - 提交 [GitHub Issue](https://github.com/linlingqin77/Nest-Admin/issues)

3. 💬 社区支持：
   - GitHub Discussions
   - 项目 Issues

---

## 📝 下一步

部署完成后，你可能需要：

1. ✅ 配置域名和 SSL 证书
2. ✅ 设置防火墙规则
3. ✅ 配置备份策略
4. ✅ 设置监控告警
5. ✅ 优化服务器性能

祝部署顺利！🎉
