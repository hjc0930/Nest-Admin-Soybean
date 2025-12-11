@echo off
REM GitHub Actions 部署配置检查脚本 (Windows)
REM 使用方法: scripts\check-deploy-config.bat

echo.
echo 🔍 GitHub Actions 部署配置检查
echo ================================
echo.

echo 📁 检查配置文件...
echo.

if exist ".github\workflows\deploy.yml" (
    echo   ✅ .github\workflows\deploy.yml 存在
) else (
    echo   ❌ .github\workflows\deploy.yml 不存在
)

if exist ".github\workflows\deploy-advanced.yml" (
    echo   ✅ .github\workflows\deploy-advanced.yml 存在
) else (
    echo   ❌ .github\workflows\deploy-advanced.yml 不存在
)

if exist "server\ecosystem.config.cjs" (
    echo   ✅ server\ecosystem.config.cjs 存在
) else (
    echo   ❌ server\ecosystem.config.cjs 不存在
)

if exist "server\package.json" (
    echo   ✅ server\package.json 存在
) else (
    echo   ❌ server\package.json 不存在
)

echo.
echo 📝 需要在 GitHub 配置的 Secrets:
echo ================================
echo.
echo 进入 GitHub 仓库: Settings -^> Secrets and variables -^> Actions
echo.
echo 添加以下 Secrets:
echo.
echo 1. SSH_PRIVATE_KEY
echo    值: 粘贴 SSH 私钥的完整内容
echo.
echo 2. REMOTE_HOST
echo    值: 服务器 IP 地址 (如 123.456.78.90)
echo.
echo 3. REMOTE_USER
echo    值: SSH 用户名 (如 root 或 www)
echo.
echo 4. REMOTE_PORT
echo    值: SSH 端口 (默认 22)
echo.
echo 5. REMOTE_BACKEND_DIR
echo    值: 后端部署目录 (如 /www/wwwroot/nest-admin-server)
echo.
echo 6. REMOTE_FRONTEND_DIR
echo    值: 前端部署目录 (如 /www/wwwroot/nest-admin-frontend)
echo.
echo.
echo ✅ 配置检查完成！
echo.
echo 📚 查看详细文档:
echo   - docs\GITHUB_ACTIONS.md
echo   - docs\QUICK_START_DEPLOY.md
echo   - DEPLOYMENT_README.md
echo.

pause
