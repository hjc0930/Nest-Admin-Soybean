#!/bin/bash

# GitHub Actions 部署配置检查脚本
# 使用方法: bash scripts/check-deploy-config.sh

set -e

echo "🔍 GitHub Actions 部署配置检查"
echo "================================"
echo ""

# 检查必需的文件
echo "📁 检查配置文件..."

check_file() {
    if [ -f "$1" ]; then
        echo "  ✅ $1 存在"
        return 0
    else
        echo "  ❌ $1 不存在"
        return 1
    fi
}

check_file ".github/workflows/deploy.yml"
check_file ".github/workflows/deploy-advanced.yml"
check_file "server/ecosystem.config.cjs"
check_file "server/package.json"

echo ""
echo "🔑 检查 SSH 密钥..."

# 检查 SSH 密钥
if [ -f ~/.ssh/github-actions ]; then
    echo "  ✅ SSH 私钥已生成 (~/.ssh/github-actions)"
    echo "  📋 私钥内容:"
    echo "  ---"
    cat ~/.ssh/github-actions | head -n 2
    echo "  ..."
    cat ~/.ssh/github-actions | tail -n 2
    echo "  ---"
else
    echo "  ⚠️  未找到 SSH 密钥，是否生成？(y/n)"
    read -r response
    if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
        ssh-keygen -t rsa -b 4096 -C "github-actions" -f ~/.ssh/github-actions -N ""
        echo "  ✅ SSH 密钥已生成"
        
        echo ""
        echo "  📋 请将以下公钥添加到服务器 ~/.ssh/authorized_keys:"
        echo "  ---"
        cat ~/.ssh/github-actions.pub
        echo "  ---"
    fi
fi

echo ""
echo "📝 需要在 GitHub 配置的 Secrets:"
echo "================================"
echo ""
echo "进入 GitHub 仓库: Settings -> Secrets and variables -> Actions"
echo ""
echo "添加以下 Secrets:"
echo ""
echo "1. SSH_PRIVATE_KEY"
echo "   值: 粘贴 ~/.ssh/github-actions 的完整内容"
echo ""
echo "2. REMOTE_HOST"
echo "   值: 服务器 IP 地址 (如 123.456.78.90)"
echo ""
echo "3. REMOTE_USER"
echo "   值: SSH 用户名 (如 root 或 www)"
echo ""
echo "4. REMOTE_PORT"
echo "   值: SSH 端口 (默认 22)"
echo ""
echo "5. REMOTE_BACKEND_DIR"
echo "   值: 后端部署目录 (如 /www/wwwroot/nest-admin-server)"
echo ""
echo "6. REMOTE_FRONTEND_DIR"
echo "   值: 前端部署目录 (如 /www/wwwroot/nest-admin-frontend)"
echo ""

echo ""
echo "🖥️  服务器需要执行的命令:"
echo "================================"
echo ""
cat << 'EOF'
# 安装 Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# 安装 pnpm 和 PM2
npm install -g pnpm pm2

# 创建部署目录
sudo mkdir -p /www/wwwroot/nest-admin-server
sudo mkdir -p /www/wwwroot/nest-admin-frontend
sudo mkdir -p /www/wwwlogs/pm2/nest_admin_server

# 设置权限
sudo chown -R $USER:$USER /www/wwwroot
sudo chown -R $USER:$USER /www/wwwlogs

# 配置环境变量
cd /www/wwwroot/nest-admin-server
cat > .env.production << 'ENVFILE'
NODE_ENV=production
PORT=3000
DATABASE_URL="postgresql://user:password@localhost:5432/nest_admin"
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your_password
REDIS_DB=2
JWT_SECRET=your_production_secret
ENVFILE

# 设置 PM2 开机自启
pm2 startup
pm2 save
EOF

echo ""
echo "✅ 配置检查完成！"
echo ""
echo "📚 查看详细文档:"
echo "  - docs/GITHUB_ACTIONS.md"
echo "  - docs/QUICK_START_DEPLOY.md"
echo "  - DEPLOYMENT_README.md"
echo ""
