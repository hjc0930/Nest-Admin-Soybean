#!/bin/bash

# GitHub Secrets 配置助手脚本
# 此脚本帮助你收集和验证部署所需的配置信息

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  GitHub Secrets 配置助手${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# 检查 GitHub CLI 是否安装
if command -v gh &> /dev/null; then
    echo -e "${GREEN}✓${NC} 检测到 GitHub CLI (gh)"
    USE_GH_CLI=true
    
    # 检查是否已登录
    if gh auth status &> /dev/null; then
        echo -e "${GREEN}✓${NC} GitHub CLI 已登录"
    else
        echo -e "${YELLOW}⚠${NC} GitHub CLI 未登录"
        echo -e "  运行 ${BLUE}gh auth login${NC} 登录后可自动配置 Secrets"
        USE_GH_CLI=false
    fi
else
    echo -e "${YELLOW}⚠${NC} 未安装 GitHub CLI"
    echo -e "  安装后可自动配置 Secrets: ${BLUE}https://cli.github.com/${NC}"
    USE_GH_CLI=false
fi

echo ""
echo -e "${YELLOW}请按照提示输入配置信息...${NC}"
echo ""

# 收集信息
echo -e "${BLUE}1. 服务器信息${NC}"
read -p "   服务器 IP 或域名 (REMOTE_HOST): " REMOTE_HOST
read -p "   SSH 用户名 (REMOTE_USER): " REMOTE_USER
read -p "   SSH 端口 (REMOTE_PORT, 默认 22): " REMOTE_PORT
REMOTE_PORT=${REMOTE_PORT:-22}

echo ""
echo -e "${BLUE}2. 部署目录${NC}"
read -p "   前端部署目录 (REMOTE_FRONTEND_DIR): " REMOTE_FRONTEND_DIR
read -p "   后端部署目录 (REMOTE_BACKEND_DIR): " REMOTE_BACKEND_DIR

echo ""
echo -e "${BLUE}3. SSH 私钥${NC}"
echo "   请提供 SSH 私钥文件路径"
read -p "   SSH 私钥路径 (例: ~/.ssh/id_rsa): " SSH_KEY_PATH
SSH_KEY_PATH="${SSH_KEY_PATH/#\~/$HOME}"

# 验证私钥文件是否存在
if [ ! -f "$SSH_KEY_PATH" ]; then
    echo -e "${RED}✗${NC} 私钥文件不存在: $SSH_KEY_PATH"
    echo ""
    echo -e "${YELLOW}提示:${NC} 如果你还没有 SSH 密钥，可以使用以下命令生成:"
    echo -e "  ${BLUE}ssh-keygen -t rsa -b 4096 -C 'github-actions' -f ~/.ssh/github_actions${NC}"
    exit 1
fi

# 读取私钥内容
SSH_PRIVATE_KEY=$(cat "$SSH_KEY_PATH")

echo ""
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  配置摘要${NC}"
echo -e "${BLUE}========================================${NC}"
echo -e "REMOTE_HOST:          ${GREEN}$REMOTE_HOST${NC}"
echo -e "REMOTE_USER:          ${GREEN}$REMOTE_USER${NC}"
echo -e "REMOTE_PORT:          ${GREEN}$REMOTE_PORT${NC}"
echo -e "REMOTE_FRONTEND_DIR:  ${GREEN}$REMOTE_FRONTEND_DIR${NC}"
echo -e "REMOTE_BACKEND_DIR:   ${GREEN}$REMOTE_BACKEND_DIR${NC}"
echo -e "SSH_PRIVATE_KEY:      ${GREEN}已加载${NC}"
echo ""

# 测试 SSH 连接
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  测试 SSH 连接${NC}"
echo -e "${BLUE}========================================${NC}"
echo "正在测试连接到 $REMOTE_USER@$REMOTE_HOST:$REMOTE_PORT ..."

if ssh -i "$SSH_KEY_PATH" -p "$REMOTE_PORT" -o StrictHostKeyChecking=no -o ConnectTimeout=10 "$REMOTE_USER@$REMOTE_HOST" "echo '连接成功'" 2>/dev/null; then
    echo -e "${GREEN}✓${NC} SSH 连接测试成功"
else
    echo -e "${RED}✗${NC} SSH 连接测试失败"
    echo ""
    echo -e "${YELLOW}提示:${NC}"
    echo "  1. 确认服务器地址、用户名、端口是否正确"
    echo "  2. 确认 SSH 私钥有访问权限"
    echo "  3. 确认公钥已添加到服务器的 ~/.ssh/authorized_keys"
    echo ""
    read -p "是否继续配置 GitHub Secrets? (y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

echo ""

# 如果安装了 gh CLI 且已登录，自动配置 Secrets
if [ "$USE_GH_CLI" = true ]; then
    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE}  自动配置 GitHub Secrets${NC}"
    echo -e "${BLUE}========================================${NC}"
    
    read -p "是否使用 GitHub CLI 自动配置 Secrets? (Y/n) " -n 1 -r
    echo
    
    if [[ ! $REPLY =~ ^[Nn]$ ]]; then
        echo "正在配置 Secrets..."
        
        echo "$REMOTE_HOST" | gh secret set REMOTE_HOST
        echo "$REMOTE_USER" | gh secret set REMOTE_USER
        echo "$REMOTE_PORT" | gh secret set REMOTE_PORT
        echo "$REMOTE_FRONTEND_DIR" | gh secret set REMOTE_FRONTEND_DIR
        echo "$REMOTE_BACKEND_DIR" | gh secret set REMOTE_BACKEND_DIR
        echo "$SSH_PRIVATE_KEY" | gh secret set SSH_PRIVATE_KEY
        
        echo ""
        echo -e "${GREEN}✓${NC} GitHub Secrets 配置完成!"
        echo ""
        echo "你现在可以推送代码触发自动部署了。"
        exit 0
    fi
fi

# 手动配置说明
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  手动配置 GitHub Secrets${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""
echo "请访问以下地址配置 GitHub Secrets:"
echo -e "${BLUE}https://github.com/YOUR_USERNAME/YOUR_REPO/settings/secrets/actions${NC}"
echo ""
echo "需要添加以下 Secrets (复制以下内容):"
echo ""
echo -e "${YELLOW}名称: REMOTE_HOST${NC}"
echo "$REMOTE_HOST"
echo ""
echo -e "${YELLOW}名称: REMOTE_USER${NC}"
echo "$REMOTE_USER"
echo ""
echo -e "${YELLOW}名称: REMOTE_PORT${NC}"
echo "$REMOTE_PORT"
echo ""
echo -e "${YELLOW}名称: REMOTE_FRONTEND_DIR${NC}"
echo "$REMOTE_FRONTEND_DIR"
echo ""
echo -e "${YELLOW}名称: REMOTE_BACKEND_DIR${NC}"
echo "$REMOTE_BACKEND_DIR"
echo ""
echo -e "${YELLOW}名称: SSH_PRIVATE_KEY${NC}"
echo "(内容太长，请从文件读取: $SSH_KEY_PATH)"
echo ""

# 保存配置到文件方便复制
CONFIG_FILE="/tmp/github-secrets-config.txt"
cat > "$CONFIG_FILE" << EOF
GitHub Secrets 配置清单
========================

1. REMOTE_HOST
$REMOTE_HOST

2. REMOTE_USER
$REMOTE_USER

3. REMOTE_PORT
$REMOTE_PORT

4. REMOTE_FRONTEND_DIR
$REMOTE_FRONTEND_DIR

5. REMOTE_BACKEND_DIR
$REMOTE_BACKEND_DIR

6. SSH_PRIVATE_KEY
(请从以下文件复制内容: $SSH_KEY_PATH)

EOF

echo -e "${GREEN}✓${NC} 配置信息已保存到: ${BLUE}$CONFIG_FILE${NC}"
echo ""
echo "配置完成后，推送代码即可触发自动部署。"
echo ""
