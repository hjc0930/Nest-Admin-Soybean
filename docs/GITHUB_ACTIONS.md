# GitHub Actions 部署配置指南

## 🔧 配置步骤

### 1. 生成 SSH 密钥对

在本地生成用于部署的 SSH 密钥：

```bash
# 生成新的 SSH 密钥对（不要设置密码）
ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.ssh/github_deploy_key

# 这将生成两个文件：
# - ~/.ssh/github_deploy_key       (私钥)
# - ~/.ssh/github_deploy_key.pub   (公钥)
```

### 2. 配置服务器

将公钥添加到服务器：

```bash
# 复制公钥内容
cat ~/.ssh/github_deploy_key.pub

# SSH 连接到服务器
ssh user@your-server.com

# 将公钥添加到 authorized_keys
echo "公钥内容" >> ~/.ssh/authorized_keys

# 设置正确的权限
chmod 600 ~/.ssh/authorized_keys
chmod 700 ~/.ssh
```

### 3. 配置 GitHub Secrets

进入 GitHub 仓库设置：`Settings` → `Secrets and variables` → `Actions` → `New repository secret`

> ⚠️ **重要提示**：
> - 密钥名称只能包含字母数字字符（[a-z]、[A-Z]、[0-9]）或下划线（_）
> - 不允许使用空格或特殊字符
> - 必须以字母（[a-z]、[A-Z]）或下划线（_）开头
> - 示例：✅ `SERVER_HOST`、`SSH_PRIVATE_KEY`  ❌ `Server Host`、`ssh-key`

添加以下 Secrets：

| Secret 名称 | 说明 | 示例值 |
|------------|------|--------|
| `SERVER_HOST` | 服务器 IP 或域名 | `123.45.67.89` 或 `server.example.com` |
| `SERVER_USERNAME` | SSH 用户名 | `www` 或 `deploy` |
| `SERVER_PORT` | SSH 端口 | `22` |
| `SSH_PRIVATE_KEY` | SSH 私钥内容 | 粘贴 `~/.ssh/github_deploy_key` 的全部内容 |
| `DEPLOY_PATH` | 项目在服务器上的路径 | `/www/wwwroot/nest-admin` |
| `SERVER_URL` | 后端 API 地址 | `https://api.example.com` |
| `WEB_URL` | 前端访问地址 | `https://www.example.com` |

### 4. 配置 GitHub Environments（可选）

为不同环境配置不同的变量：

1. 进入 `Settings` → `Environments`
2. 创建环境（如 `production`, `staging`）
3. 添加环境特定的 Secrets 和变量
4. 设置部署保护规则（需要审批等）

## 🎯 工作流说明

### 后端部署工作流 (deploy-backend.yml)

**触发条件**：
- 推送到 `main` 或 `main-soybean` 分支
- 修改 `server/**` 目录下的文件
- 手动触发

**工作流程**：
1. **Test**: 代码检查和测试
   - 运行 ESLint
   - 运行单元测试
   
2. **Build**: 构建 Docker 镜像
   - 构建并推送到 GitHub Container Registry
   - 使用缓存优化构建速度
   
3. **Deploy**: 部署到服务器
   - SSH 连接服务器
   - 拉取最新代码
   - 安装依赖
   - 运行数据库迁移
   - 构建并重启服务

### 前端部署工作流 (deploy-frontend.yml)

**触发条件**：
- 推送到 `main` 或 `main-soybean` 分支
- 修改 `ruoyi-plus-soybean/**` 目录下的文件
- 手动触发

**工作流程**：
1. **Test**: 代码检查和构建测试
   - 运行 ESLint
   - 测试构建过程
   
2. **Build**: 构建 Docker 镜像
   - 构建并推送到 GitHub Container Registry
   
3. **Deploy**: 部署到服务器
   - SSH 连接服务器
   - 拉取最新代码
   - 构建项目
   - 部署到 Web 目录
   - 重启 Nginx

### Docker 部署工作流 (docker-deploy.yml)

**触发条件**：
- 推送到 `main` 或 `main-soybean` 分支
- 手动触发（可选择部署服务）

**工作流程**：
1. 连接服务器
2. 拉取最新代码
3. 使用 Docker Compose 构建并启动服务
4. 清理旧镜像
5. 健康检查

## 🔍 手动触发部署

### 通过 GitHub Web 界面

1. 进入仓库的 `Actions` 页面
2. 选择要运行的工作流
3. 点击 `Run workflow` 按钮
4. 选择分支和环境
5. 点击 `Run workflow` 确认

### 通过 GitHub CLI

```bash
# 安装 GitHub CLI
brew install gh

# 登录
gh auth login

# 触发后端部署
gh workflow run "Deploy Backend Server" \
  --ref main \
  -f environment=production

# 触发前端部署
gh workflow run "Deploy Frontend Web" \
  --ref main \
  -f environment=production

# 触发 Docker 部署
gh workflow run "Docker Build and Deploy" \
  --ref main \
  -f services=all
```

## 📊 监控工作流状态

### 查看工作流运行记录

```bash
# 列出最近的工作流运行
gh run list

# 查看特定运行的详情
gh run view <run-id>

# 查看运行日志
gh run view <run-id> --log

# 监控当前运行
gh run watch
```

### 工作流状态徽章

在 README.md 中添加状态徽章：

```markdown
![Backend Deploy](https://github.com/linlingqin77/Nest-Admin/actions/workflows/deploy-backend.yml/badge.svg)
![Frontend Deploy](https://github.com/linlingqin77/Nest-Admin/actions/workflows/deploy-frontend.yml/badge.svg)
```

## 🛡️ 安全最佳实践

### 1. SSH 密钥管理

- ✅ 为 CI/CD 创建专用的 SSH 密钥
- ✅ 不要在密钥上设置密码（CI/CD 需要）
- ✅ 定期轮换密钥
- ✅ 限制密钥的使用权限

### 2. Secrets 管理

- ✅ 不要在日志中打印敏感信息
- ✅ 使用环境特定的 Secrets
- ✅ 定期审查和更新 Secrets
- ✅ 使用 GitHub Environments 保护生产环境

### 3. 服务器安全

```bash
# 创建专用部署用户
sudo useradd -m -s /bin/bash deploy

# 设置目录权限
sudo chown -R deploy:deploy /www/wwwroot/nest-admin

# 配置 sudo 权限（如果需要）
echo "deploy ALL=(ALL) NOPASSWD: /usr/sbin/nginx, /usr/bin/systemctl restart nginx" | sudo tee /etc/sudoers.d/deploy
```

### 4. 工作流权限

在工作流文件中设置最小权限：

```yaml
permissions:
  contents: read
  packages: write
  actions: read
```

## 🐛 故障排除

### 问题 1: SSH 连接失败

```bash
# 测试 SSH 连接
ssh -i ~/.ssh/github_deploy_key -p 22 user@server "echo 'Connection OK'"

# 检查服务器 SSH 配置
sudo vim /etc/ssh/sshd_config
# 确保以下配置已启用：
# PubkeyAuthentication yes
# AuthorizedKeysFile .ssh/authorized_keys
```

### 问题 2: 权限不足

```bash
# 检查文件所有权
ls -la /www/wwwroot/nest-admin

# 修正权限
sudo chown -R deploy:deploy /www/wwwroot/nest-admin
chmod -R 755 /www/wwwroot/nest-admin
```

### 问题 3: 构建缓存问题

```yaml
# 在工作流中清除缓存
- name: Clear cache
  run: |
    rm -rf node_modules
    rm -rf .pnpm-store
```

### 问题 4: 环境变量未生效

```bash
# 在服务器上检查环境变量
cd /www/wwwroot/nest-admin/server
cat .env

# 重启 PM2 并更新环境变量
pm2 reload ecosystem.config.cjs --update-env
```

## 📈 性能优化

### 1. 使用缓存加速构建

工作流已配置 pnpm 缓存和 Docker 缓存：

```yaml
# pnpm 缓存
- uses: actions/cache@v4
  with:
    path: ${{ steps.pnpm-cache.outputs.STORE_PATH }}
    key: ${{ runner.os }}-pnpm-store-${{ hashFiles('**/pnpm-lock.yaml') }}

# Docker 缓存
- uses: docker/build-push-action@v5
  with:
    cache-from: type=gha
    cache-to: type=gha,mode=max
```

### 2. 并行执行任务

```yaml
jobs:
  test-backend:
    runs-on: ubuntu-latest
  
  test-frontend:
    runs-on: ubuntu-latest
  
  deploy:
    needs: [test-backend, test-frontend]
```

### 3. 条件执行

```yaml
# 仅在特定文件变更时执行
on:
  push:
    paths:
      - 'server/**'
      - '.github/workflows/deploy-backend.yml'
```

## 📝 自定义工作流

### 添加通知功能

```yaml
- name: Send notification
  if: always()
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

### 添加代码质量检查

```yaml
- name: Run SonarQube scan
  uses: sonarsource/sonarcloud-github-action@master
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
    SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
```

### 添加性能测试

```yaml
- name: Run performance tests
  run: |
    pnpm install -g lighthouse
    lighthouse ${{ secrets.WEB_URL }} --output json --output-path ./lighthouse.json
```

---

**参考资源**：
- [GitHub Actions 文档](https://docs.github.com/actions)
- [SSH Action 文档](https://github.com/appleboy/ssh-action)
- [Docker Build Push Action](https://github.com/docker/build-push-action)
