#!/bin/bash
# 更新生产环境 demo 账号密码
# 使用方法: ./update-demo-password.sh

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SERVER_DIR="$(dirname "$SCRIPT_DIR")"

echo "📝 准备更新生产环境 demo 账号密码..."

# 确保在 server 目录
cd "$SERVER_DIR"

# 检查环境变量
if [ ! -f .env.production ]; then
    echo "❌ .env.production 文件不存在"
    exit 1
fi

# 加载环境变量
source .env.production

# 构建数据库连接字符串
DB_URL="postgresql://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_DATABASE}?schema=${DB_SCHEMA}"

echo "🔄 正在连接到生产数据库..."
echo "数据库: ${DB_HOST}:${DB_PORT}/${DB_DATABASE}"

# 执行 SQL 更新
NODE_ENV=production npx prisma db execute --stdin < ./scripts/update-demo-password.sql

echo "✅ Demo 账号密码更新完成！"
echo ""
echo "📋 登录信息："
echo "  用户名: demo"
echo "  密码: demo123"
echo "  租户ID: 000000 (超级租户)"
echo ""
echo "🔗 请访问 https://www.linlingqin.top 测试登录"
