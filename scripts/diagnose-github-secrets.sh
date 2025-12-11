#!/bin/bash

# GitHub Secrets 诊断脚本

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  GitHub Secrets 诊断工具${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# 获取仓库信息
REPO_URL=$(git config --get remote.origin.url 2>/dev/null || echo "")
if [ -z "$REPO_URL" ]; then
    echo -e "${RED}✗${NC} 未检测到 Git 仓库"
    exit 1
fi

# 解析仓库信息
if [[ $REPO_URL =~ github\.com[:/](.+)/(.+)(\.git)?$ ]]; then
    REPO_OWNER="${BASH_REMATCH[1]}"
    REPO_NAME="${BASH_REMATCH[2]%.git}"
else
    echo -e "${RED}✗${NC} 无法解析 GitHub 仓库信息"
    exit 1
fi

echo -e "仓库所有者: ${GREEN}$REPO_OWNER${NC}"
echo -e "仓库名称:   ${GREEN}$REPO_NAME${NC}"
echo ""

# 检查当前分支
CURRENT_BRANCH=$(git branch --show-current 2>/dev/null || echo "unknown")
echo -e "当前分支:   ${GREEN}$CURRENT_BRANCH${NC}"
echo ""

# 检查是否是 fork
echo -e "${BLUE}检查仓库类型...${NC}"
if git remote -v | grep -q "upstream"; then
    echo -e "${YELLOW}⚠${NC}  检测到 upstream 远程，这可能是一个 fork 仓库"
    echo -e "   ${YELLOW}注意: Fork 仓库默认无法访问原仓库的 secrets${NC}"
    echo -e "   你需要在 ${BLUE}https://github.com/$REPO_OWNER/$REPO_NAME/settings/secrets/actions${NC}"
    echo -e "   配置自己仓库的 secrets"
else
    echo -e "${GREEN}✓${NC} 这不是 fork 仓库"
fi
echo ""

# 生成配置链接
SECRETS_URL="https://github.com/$REPO_OWNER/$REPO_NAME/settings/secrets/actions"
ACTIONS_URL="https://github.com/$REPO_OWNER/$REPO_NAME/actions"
SETTINGS_URL="https://github.com/$REPO_OWNER/$REPO_NAME/settings"

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  配置检查清单${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

echo -e "${YELLOW}1. 检查 Secrets 配置位置${NC}"
echo -e "   访问: ${BLUE}$SECRETS_URL${NC}"
echo -e "   确认以下 secrets 已配置:"
echo -e "   • REMOTE_HOST"
echo -e "   • REMOTE_USER"
echo -e "   • SSH_PRIVATE_KEY"
echo -e "   • REMOTE_PORT (可选)"
echo -e "   • REMOTE_FRONTEND_DIR"
echo -e "   • REMOTE_BACKEND_DIR"
echo ""

echo -e "${YELLOW}2. 检查 Actions 权限${NC}"
echo -e "   访问: ${BLUE}$SETTINGS_URL/actions${NC}"
echo -e "   确认:"
echo -e "   • Actions permissions 设置为 'Allow all actions'"
echo -e "   • Workflow permissions 设置为 'Read and write permissions'"
echo ""

echo -e "${YELLOW}3. 检查分支保护规则${NC}"
echo -e "   访问: ${BLUE}$SETTINGS_URL/branches${NC}"
echo -e "   确认分支 '$CURRENT_BRANCH' 没有限制 Actions secrets 的访问"
echo ""

echo -e "${YELLOW}4. 查看 Actions 运行日志${NC}"
echo -e "   访问: ${BLUE}$ACTIONS_URL${NC}"
echo -e "   查看最近的 workflow 运行日志，确认具体错误信息"
echo ""

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  常见问题解决方案${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

echo -e "${GREEN}问题 1: Secrets 配置了但读取不到${NC}"
echo "解决方案:"
echo "  • 确认 secrets 配置在 ${YELLOW}Repository secrets${NC} 而不是 Environment secrets"
echo "  • 重新创建 secrets（删除后重新添加）"
echo "  • 检查 secret 名称是否完全匹配（区分大小写）"
echo ""

echo -e "${GREEN}问题 2: Fork 仓库无法使用原仓库 secrets${NC}"
echo "解决方案:"
echo "  • 在你的 fork 仓库中重新配置 secrets"
echo "  • Fork 仓库需要在 Settings > Actions 中启用 workflows"
echo ""

echo -e "${GREEN}问题 3: 私有仓库权限问题${NC}"
echo "解决方案:"
echo "  • 确认你有仓库的 Admin 或 Write 权限"
echo "  • 联系仓库管理员配置 secrets"
echo ""

echo -e "${GREEN}问题 4: workflow 文件语法错误${NC}"
echo "解决方案:"
echo "  • 检查 secrets 引用语法: \${{ secrets.SECRET_NAME }}"
echo "  • 确认没有拼写错误"
echo ""

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  快速测试${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# 检查 workflow 文件
WORKFLOW_FILE=".github/workflows/deploy-advanced.yml"
if [ -f "$WORKFLOW_FILE" ]; then
    echo -e "${GREEN}✓${NC} 找到 workflow 文件: $WORKFLOW_FILE"
    
    # 检查 secrets 引用
    echo ""
    echo "Workflow 中使用的 secrets:"
    grep -o '\${{ secrets\.[A-Z_]* }}' "$WORKFLOW_FILE" | sort -u | sed 's/\${{ secrets\.\(.*\) }}/  • \1/' || echo "  未找到 secrets 引用"
else
    echo -e "${YELLOW}⚠${NC}  未找到 workflow 文件"
fi

echo ""
echo -e "${BLUE}========================================${NC}"
echo ""
echo -e "需要配置 secrets？运行: ${GREEN}./scripts/setup-github-secrets.sh${NC}"
echo ""
