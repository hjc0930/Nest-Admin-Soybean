# 部署脚本快速开始

## 🚀 快速使用（3 步）

### 1. 安装依赖

```bash
cd admin-naive-ui
pnpm install
```

### 2. 配置服务器信息

复制配置文件模板：

```bash
cp deploy.config.example.cjs deploy.config.cjs
```

编辑 `deploy.config.cjs`，填写你的服务器信息：

```javascript
module.exports = {
  dev: {
    name: '开发环境',
    host: '192.168.1.100',              // 改成你的服务器 IP
    port: 22,
    username: 'root',
    privateKey: '/Users/you/.ssh/id_rsa', // 或使用 password
    distPath: 'dist',
    remotePath: '/var/www/html/admin',
    backupPath: '/var/www/backup/admin',
    isBackup: true,
  },
};
```

### 3. 执行部署

```bash
pnpm run deploy:dev
```

## 📦 支持的命令

```bash
pnpm run deploy:dev   # 部署到开发环境
pnpm run deploy:test  # 部署到测试环境
pnpm run deploy:prod  # 部署到生产环境
```

## 🔑 认证方式

### 推荐：使用 SSH 私钥

```javascript
{
  host: '192.168.1.100',
  username: 'root',
  privateKey: '/Users/yourusername/.ssh/id_rsa',
  passphrase: '', // 如果私钥有密码
}
```

### 备选：使用密码

```javascript
{
  host: '192.168.1.100',
  username: 'root',
  password: 'your_password',
}
```

## 📋 完整文档

查看 [DEPLOY_README.md](./DEPLOY_README.md) 了解更多详情。
