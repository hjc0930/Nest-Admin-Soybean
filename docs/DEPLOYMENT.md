# 自动化部署方案文档

## 📋 概述

本项目采用 **GitHub Actions + Docker + PM2** 的自动化部署方案，支持前端和后端的独立或联合部署。

## 🏗️ 架构说明

### 技术栈
- **CI/CD**: GitHub Actions
- **容器化**: Docker + Docker Compose
- **进程管理**: PM2
- **Web 服务器**: Nginx
- **数据库**: PostgreSQL
- **缓存**: Redis

### 部署流程
```
代码提交 → GitHub Actions 触发 → 构建测试 → 构建 Docker 镜像 → 部署到服务器 → 健康检查
```

## 📂 项目文件结构

```
nest-admin/
├── .github/
│   └── workflows/
│       ├── deploy-backend.yml      # 后端部署工作流
│       ├── deploy-frontend.yml     # 前端部署工作流
│       └── docker-deploy.yml       # Docker 容器部署
├── server/
│   ├── Dockerfile                  # 后端 Dockerfile
│   ├── .dockerignore              # Docker 忽略文件
│   └── ecosystem.config.cjs       # PM2 配置
├── ruoyi-plus-soybean/
│   ├── Dockerfile                  # 前端 Dockerfile
│   ├── .dockerignore              # Docker 忽略文件
│   └── nginx.conf                 # Nginx 配置
├── docker-compose.yml             # Docker Compose 编排
├── .env.docker.example            # Docker 环境变量示例
├── deploy-local.sh                # 本地部署脚本
├── deploy-server.sh               # 服务器部署脚本
└── rollback.sh                    # 回滚脚本
```

## 🚀 部署方式

### 方式一：GitHub Actions 自动部署（推荐）

#### 1. 配置 GitHub Secrets

在 GitHub 仓库设置中添加以下 Secrets：

```bash
# 服务器配置
SERVER_HOST          # 服务器 IP 地址
SERVER_USERNAME      # SSH 用户名
SERVER_PORT          # SSH 端口（默认 22）
SSH_PRIVATE_KEY      # SSH 私钥

# 部署路径
DEPLOY_PATH          # 项目部署路径，如 /www/wwwroot/nest-admin

# 健康检查 URL
SERVER_URL           # 后端 URL，如 https://api.example.com
WEB_URL              # 前端 URL，如 https://www.example.com
```

#### 2. 触发部署

**自动触发**：
- 推送代码到 `main` 或 `main-soybean` 分支
- 修改 `server/**` 触发后端部署
- 修改 `ruoyi-plus-soybean/**` 触发前端部署

**手动触发**：
1. 进入 GitHub Actions 页面
2. 选择对应的工作流
3. 点击 "Run workflow"
4. 选择部署环境（development/staging/production）

#### 3. 部署过程

- ✅ 代码检查和测试
- ✅ 构建 Docker 镜像（可选）
- ✅ 推送到容器仓库（可选）
- ✅ SSH 连接服务器
- ✅ 拉取最新代码
- ✅ 安装依赖和构建
- ✅ 重启服务
- ✅ 健康检查

### 方式二：Docker Compose 部署

#### 1. 准备环境

```bash
# 复制环境变量文件
cp .env.docker.example .env

# 编辑配置（重要！）
vim .env
```

#### 2. 本地部署

```bash
# 使用一键部署脚本
./deploy-local.sh

# 或手动执行
docker-compose up -d --build
```

#### 3. 查看状态

```bash
# 查看容器状态
docker-compose ps

# 查看日志
docker-compose logs -f

# 查看特定服务日志
docker-compose logs -f nest-admin-server
docker-compose logs -f nest-admin-web
```

#### 4. 停止服务

```bash
# 停止所有服务
docker-compose down

# 停止并删除数据卷
docker-compose down -v
```

### 方式三：传统服务器部署

#### 1. 服务器要求

- Node.js 20+
- pnpm 10+
- PM2
- Nginx
- PostgreSQL
- Redis

#### 2. 部署步骤

```bash
# 上传部署脚本到服务器
scp deploy-server.sh user@server:/path/to/project/

# SSH 连接服务器
ssh user@server

# 执行部署
cd /path/to/project
./deploy-server.sh all          # 部署全部
./deploy-server.sh backend      # 仅部署后端
./deploy-server.sh frontend     # 仅部署前端
```

## 🔄 回滚操作

### 查看可用备份

```bash
# 后端备份
./rollback.sh backend

# 前端备份
./rollback.sh frontend
```

### 回滚到指定版本

```bash
# 回滚后端（时间戳格式：20231209143000）
./rollback.sh backend 20231209143000

# 回滚前端
./rollback.sh frontend 20231209143000
```

## 🛠️ 环境配置

### 后端环境变量（server/.env）

```env
# 数据库配置
DATABASE_URL=postgresql://user:password@localhost:5432/nest_admin

# Redis 配置
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your_password

# JWT 配置
JWT_SECRET=your_jwt_secret_key

# 应用配置
PORT=3000
NODE_ENV=production
```

### 前端环境变量（ruoyi-plus-soybean/.env.production）

```env
# API 地址
VITE_API_URL=https://api.example.com

# 应用配置
VITE_APP_TITLE=Nest Admin
VITE_APP_BASE_URL=/
```

## 📊 监控和日志

### PM2 监控

```bash
# 查看进程状态
pm2 status

# 查看日志
pm2 logs

# 监控面板
pm2 monit

# 重启服务
pm2 reload ecosystem.config.cjs
```

### Docker 日志

```bash
# 实时查看所有日志
docker-compose logs -f

# 查看最近 100 行日志
docker-compose logs --tail=100

# 查看特定服务日志
docker-compose logs -f nest-admin-server
```

### Nginx 日志

```bash
# 访问日志
tail -f /var/log/nginx/access.log

# 错误日志
tail -f /var/log/nginx/error.log
```

## 🔒 安全建议

1. **环境变量安全**
   - 不要提交 `.env` 文件到版本控制
   - 使用强密码和复杂的密钥
   - 定期轮换密钥和密码

2. **服务器安全**
   - 使用 SSH 密钥认证
   - 配置防火墙规则
   - 定期更新系统和依赖

3. **应用安全**
   - 启用 HTTPS
   - 配置 CORS 策略
   - 实施速率限制

## 🐛 常见问题

### 1. GitHub Actions 部署失败

**问题**：SSH 连接超时
```bash
# 检查 SSH 密钥配置
# 确保 SERVER_HOST、SERVER_PORT、SSH_PRIVATE_KEY 配置正确
```

**问题**：权限不足
```bash
# 确保部署用户有足够的权限
sudo chown -R deploy_user:deploy_user /www/wwwroot/nest-admin
```

### 2. Docker 部署问题

**问题**：容器启动失败
```bash
# 查看详细日志
docker-compose logs nest-admin-server

# 检查环境变量
cat .env
```

**问题**：端口冲突
```bash
# 修改 .env 文件中的端口配置
# 或停止占用端口的进程
```

### 3. PM2 相关问题

**问题**：应用频繁重启
```bash
# 查看错误日志
pm2 logs --err

# 检查内存使用
pm2 monit
```

## 📚 相关文档

- [Docker 官方文档](https://docs.docker.com/)
- [GitHub Actions 文档](https://docs.github.com/actions)
- [PM2 文档](https://pm2.keymetrics.io/)
- [Nginx 文档](https://nginx.org/en/docs/)

## 📞 支持

如有问题，请：
1. 查看本文档的常见问题部分
2. 查看项目 Issues
3. 提交新的 Issue

---

**最后更新**: 2025年12月9日
