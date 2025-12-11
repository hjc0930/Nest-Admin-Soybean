# GitHub Secrets 配置问题快速解决指南

## ❓ 问题：配置了 Secrets 但读取不到

### 🔍 常见原因

#### 1. **Secrets 配置位置错误** ⭐ 最常见
- ❌ 错误：配置在了 **Environment secrets**
- ✅ 正确：应该配置在 **Repository secrets**

**解决方法：**
```
1. 访问: https://github.com/你的用户名/Nest-Admin/settings/secrets/actions
2. 确认在 "Repository secrets" 部分配置，而不是 "Environment secrets"
3. 如果配置错了，删除后重新添加到正确位置
```

#### 2. **Fork 仓库的限制** ⭐ 第二常见
- Fork 的仓库在处理 Pull Request 时，出于安全考虑，不会暴露 secrets
- 这是 GitHub 的安全机制

**解决方法：**
```
• 如果是你自己的 fork：
  在你的 fork 仓库中配置 secrets（不是原仓库）
  
• 如果是提交 PR：
  不能使用部署功能，只能由仓库所有者合并后部署
```

#### 3. **分支限制**
- 某些分支可能没有权限访问 secrets

**解决方法：**
```
1. 访问: https://github.com/你的用户名/Nest-Admin/settings/branches
2. 检查 main-soybean 分支是否有限制
3. 如果有分支保护规则，确保允许 Actions 访问 secrets
```

#### 4. **Actions 权限未开启**
- 仓库可能禁用了 GitHub Actions

**解决方法：**
```
1. 访问: https://github.com/你的用户名/Nest-Admin/settings/actions
2. 在 "Actions permissions" 中选择 "Allow all actions and reusable workflows"
3. 在 "Workflow permissions" 中选择 "Read and write permissions"
```

#### 5. **Secret 名称拼写错误**
- Secret 名称区分大小写，必须完全匹配

**解决方法：**
```
检查 secret 名称是否准确：
✅ REMOTE_HOST
❌ remote_host
❌ REMOTEHOST
❌ Remote_Host
```

---

## 🛠️ 诊断步骤

### Step 1: 运行诊断脚本
```bash
./scripts/diagnose-github-secrets.sh
```

### Step 2: 运行测试 Workflow
1. 访问: https://github.com/你的用户名/Nest-Admin/actions
2. 在左侧找到 "Test GitHub Secrets"
3. 点击 "Run workflow" 按钮
4. 查看运行结果，会显示哪些 secrets 配置成功/失败

### Step 3: 检查配置清单

访问这个链接查看你的 secrets：
```
https://github.com/linlingqin77/Nest-Admin/settings/secrets/actions
```

确认以下 secrets 都在 **Repository secrets** 列表中：

- [ ] REMOTE_HOST
- [ ] REMOTE_USER  
- [ ] SSH_PRIVATE_KEY
- [ ] REMOTE_FRONTEND_DIR
- [ ] REMOTE_BACKEND_DIR
- [ ] REMOTE_PORT (可选)

---

## ✅ 重新配置 Secrets

### 方法 1: 使用配置脚本 (推荐)
```bash
./scripts/setup-github-secrets.sh
```

### 方法 2: 手动配置

1. **访问配置页面**
   ```
   https://github.com/你的用户名/Nest-Admin/settings/secrets/actions
   ```

2. **点击 "New repository secret"**

3. **逐个添加以下 secrets：**

   **REMOTE_HOST**
   ```
   值: 你的服务器 IP 或域名
   示例: 192.168.1.100 或 example.com
   ```

   **REMOTE_USER**
   ```
   值: SSH 登录用户名
   示例: root 或 ubuntu
   ```

   **SSH_PRIVATE_KEY**
   ```
   值: SSH 私钥的完整内容
   获取方式: cat ~/.ssh/id_rsa
   
   必须包含:
   -----BEGIN OPENSSH PRIVATE KEY-----
   [私钥内容]
   -----END OPENSSH PRIVATE KEY-----
   ```

   **REMOTE_FRONTEND_DIR**
   ```
   值: 前端部署目录的绝对路径
   示例: /var/www/nest-admin-frontend
   ```

   **REMOTE_BACKEND_DIR**
   ```
   值: 后端部署目录的绝对路径
   示例: /opt/nest-admin-server
   ```

   **REMOTE_PORT** (可选)
   ```
   值: SSH 端口号
   默认: 22
   ```

---

## 🧪 验证配置

### 方法 1: 通过 Test Workflow
1. 访问: https://github.com/你的用户名/Nest-Admin/actions/workflows/test-secrets.yml
2. 点击 "Run workflow"
3. 等待运行完成
4. 查看日志，应该显示所有 secrets 都 ✅

### 方法 2: 推送代码触发部署
```bash
git add .
git commit -m "test: verify secrets configuration"
git push origin main-soybean
```

然后访问 Actions 页面查看运行日志

---

## 📞 还是不行？

如果以上方法都试过了还是不行，请检查：

1. **你的账户权限**
   - 确认你是仓库的所有者或管理员
   - 协作者可能没有配置 secrets 的权限

2. **浏览器缓存**
   - 清除浏览器缓存后重试
   - 或使用隐身模式访问 GitHub

3. **Secrets 更新延迟**
   - GitHub 有时需要几分钟同步 secrets
   - 等待 5-10 分钟后重新运行 workflow

4. **查看详细日志**
   - 在 Actions 运行页面，点击具体的 job
   - 展开 "Check required secrets" 步骤
   - 查看具体哪个 secret 读取失败

---

## 📚 相关文档

- [完整配置指南](./GITHUB_SECRETS_SETUP.md)
- [快速部署指南](./QUICK_START_DEPLOY.md)
- [本地部署方案](./LOCAL_DEPLOYMENT.md)

---

## 🎯 快速测试命令

```bash
# 1. 诊断配置
./scripts/diagnose-github-secrets.sh

# 2. 手动触发测试 workflow (需要 gh CLI)
gh workflow run test-secrets.yml

# 3. 查看最近的 workflow 运行
gh run list --limit 5
```
