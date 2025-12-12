# 后端服务部署指南

本文档介绍如何使用 Node 脚本将打包后的 NestJS 服务自动部署到服务器。

## 📋 目录

- [功能特性](#功能特性)
- [前置要求](#前置要求)
- [快速开始](#快速开始)
- [配置说明](#配置说明)
- [使用方法](#使用方法)
- [部署流程](#部署流程)
- [常见问题](#常见问题)

## ✨ 功能特性

- ✅ **自动化部署**：一键构建、打包、上传、部署
- ✅ **多环境支持**：支持 dev/test/prod 多环境配置
- ✅ **智能备份**：部署前自动备份，支持保留 N 个历史版本
- ✅ **安全认证**：支持密码和 SSH 私钥两种认证方式
- ✅ **依赖管理**：自动安装生产依赖和生成 Prisma Client
- ✅ **服务管理**：自动使用 PM2 重启服务
- ✅ **健康检查**：部署后自动验证服务状态
- ✅ **友好提示**：彩色输出，进度提示，错误处理

## 📦 前置要求

### 本地环境

- Node.js >= 18
- pnpm >= 8
- 已安装依赖：`pnpm install`

### 服务器环境

- Linux 系统（推荐 Ubuntu/CentOS）
- Node.js >= 20
- pnpm（全局安装）
- PM2（全局安装）
- PostgreSQL（已配置）
- Redis（已配置）

### 服务器准备

```bash
# 安装 pnpm
npm install -g pnpm

# 安装 PM2
npm install -g pm2

# 设置 PM2 开机自启
pm2 startup
pm2 save
```

## 🚀 快速开始

### 1. 复制配置文件

```bash
cd server
cp deploy.config.example.cjs deploy.config.cjs
```

### 2. 编辑配置文件

打开 `deploy.config.cjs`，修改生产环境配置：

```javascript
module.exports = {
  prod: {
    name: '生产环境',
    host: '106.55.138.243',           // 修改为你的服务器 IP
    port: 22,
    username: 'root',
    
    // 方式1: 使用密码
    password: 'your-password',
    
    // 方式2: 使用私钥（推荐）
    // privateKey: '/Users/username/.ssh/id_rsa',
    // passphrase: '',
    
    remotePath: '/www/wwwroot/nest-admin-server',
    backupPath: '/www/wwwroot/nest-admin-server/backup',
    isBackup: true,
    keepBackups: 5,
    pm2AppName: 'nest_admin_server',
    healthCheckUrl: 'http://localhost:8080/api/health',
  },
};
```

### 3. 确保服务器已配置 .env 文件

在服务器上创建 `.env` 文件：

```bash
# SSH 到服务器
ssh root@your-server-ip

# 创建部署目录
mkdir -p /www/wwwroot/nest-admin-server

# 创建 .env 文件
vim /www/wwwroot/nest-admin-server/.env
```

填写生产环境变量（参考项目中的 `.env.production`）。

### 4. 执行部署

```bash
# 部署到生产环境
pnpm run deploy:prod

# 或直接运行
node deploy.cjs prod
```

## ⚙️ 配置说明

### 配置文件结构

```javascript
{
  // 环境名称
  name: '生产环境',
  
  // ========== 服务器连接配置 ==========
  host: 'your-server-ip',        // 服务器 IP
  port: 22,                       // SSH 端口
  username: 'root',               // SSH 用户名
  
  // 认证方式（二选一）
  password: '',                   // 方式1: 密码
  privateKey: '',                 // 方式2: 私钥路径
  passphrase: '',                 // 私钥密码
  
  // ========== 部署路径配置 ==========
  remotePath: '/www/wwwroot/nest-admin-server',     // 部署目录
  backupPath: '/www/wwwroot/nest-admin-server/backup',  // 备份目录
  
  // ========== 部署选项 ==========
  isBackup: true,                 // 是否备份
  keepBackups: 5,                 // 保留备份数量
  includeEnvFile: false,          // 是否上传 .env 文件
  runMigration: false,            // 是否运行数据库迁移
  
  // ========== PM2 配置 ==========
  pm2AppName: 'nest_admin_server',  // PM2 应用名
  
  // ========== 健康检查 ==========
  healthCheckUrl: 'http://localhost:8080/api/health',
}
```

### 认证方式选择

#### 方式1：密码认证（简单）

```javascript
{
  username: 'root',
  password: 'your-password',
}
```

#### 方式2：私钥认证（推荐）

```javascript
{
  username: 'root',
  privateKey: '/Users/username/.ssh/id_rsa',
  passphrase: '',  // 如果私钥有密码
}
```

**如何生成 SSH 密钥：**

```bash
# 生成密钥对
ssh-keygen -t rsa -b 4096 -C "your-email@example.com"

# 复制公钥到服务器
ssh-copy-id root@your-server-ip

# 或手动复制
cat ~/.ssh/id_rsa.pub | ssh root@your-server-ip "mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys"
```

## 📖 使用方法

### 部署命令

```bash
# 部署到生产环境
pnpm run deploy:prod

# 部署到测试环境
pnpm run deploy:test

# 部署到开发环境
pnpm run deploy:dev
```

### 查看服务状态

```bash
# SSH 到服务器
ssh root@your-server-ip

# 查看 PM2 状态
pm2 status

# 查看服务日志
pm2 logs nest_admin_server

# 查看实时日志
pm2 logs nest_admin_server --lines 100

# 重启服务
pm2 restart nest_admin_server

# 停止服务
pm2 stop nest_admin_server
```

## 🔄 部署流程

脚本会自动执行以下步骤：

1. **清理旧构建** - 删除本地 `dist` 目录
2. **构建项目** - 执行 `pnpm run build:prod`
3. **检查文件** - 验证必要文件是否存在
4. **准备文件** - 复制 dist、prisma、package.json 等到临时目录
5. **压缩文件** - 使用 tar.gz 压缩
6. **连接服务器** - 通过 SSH 连接
7. **备份旧文件** - 备份服务器现有版本（可选）
8. **上传文件** - 上传压缩包到服务器 /tmp
9. **部署文件** - 解压到目标目录
10. **安装依赖** - 执行 `pnpm install --prod`
11. **生成 Prisma Client** - 执行 `pnpm run prisma:generate`
12. **数据库迁移** - 执行 `pnpm run prisma:deploy`（可选）
13. **启动服务** - 使用 PM2 重启服务
14. **健康检查** - 验证服务是否正常运行（可选）
15. **清理临时文件** - 删除本地压缩包

## 🎯 部署内容

脚本会上传以下文件到服务器：

```
server_deploy_*.tar.gz
├── dist/                    # 编译后的代码
│   └── src/
│       ├── main.js         # 入口文件
│       ├── config/*.yml    # 配置文件
│       └── ...
├── prisma/                  # Prisma 文件
│   ├── schema.prisma
│   └── seed.ts
├── package.json             # 依赖清单
├── pnpm-lock.yaml          # 锁定依赖版本
└── ecosystem.config.cjs     # PM2 配置
```

**不会上传：**
- `node_modules/` - 会在服务器重新安装
- `src/` - 已编译成 dist
- `test/` - 测试文件
- `.env` - 应预先在服务器配置

## ❓ 常见问题

### 1. 连接服务器失败

**错误信息：** `✗ 服务器连接失败`

**解决方法：**
- 检查服务器 IP 和端口是否正确
- 检查 SSH 凭证（密码或私钥）是否正确
- 检查服务器防火墙是否开放 22 端口
- 尝试手动 SSH 连接测试：`ssh root@your-server-ip`

### 2. 依赖安装失败

**错误信息：** `⚠ 依赖安装可能失败`

**解决方法：**
```bash
# SSH 到服务器
ssh root@your-server-ip

# 进入部署目录
cd /www/wwwroot/nest-admin-server

# 手动安装依赖
pnpm install --prod

# 查看错误日志
```

### 3. Prisma Client 生成失败

**解决方法：**
```bash
# 确保服务器有 DATABASE_URL 环境变量
cat /www/wwwroot/nest-admin-server/.env

# 手动生成
cd /www/wwwroot/nest-admin-server
pnpm run prisma:generate
```

### 4. PM2 启动失败

**解决方法：**
```bash
# 检查 PM2 是否安装
pm2 --version

# 如果未安装
npm install -g pm2

# 手动启动
cd /www/wwwroot/nest-admin-server
pm2 start ecosystem.config.cjs --env production

# 查看错误日志
pm2 logs nest_admin_server
```

### 5. 数据库连接失败

**解决方法：**
```bash
# 检查 .env 文件中的 DATABASE_URL
vim /www/wwwroot/nest-admin-server/.env

# 测试数据库连接
cd /www/wwwroot/nest-admin-server
pnpm run prisma:migrate status
```

### 6. 端口被占用

**解决方法：**
```bash
# 查看端口占用
lsof -i :8080

# 杀死占用进程
kill -9 <PID>

# 或修改 .env 中的 APP_PORT
```

### 7. 回滚到之前版本

```bash
# SSH 到服务器
ssh root@your-server-ip

# 查看备份文件
ls -lh /www/wwwroot/nest-admin-server/backup/

# 停止服务
pm2 stop nest_admin_server

# 清空当前目录
cd /www/wwwroot/nest-admin-server
rm -rf dist/ prisma/ package.json ecosystem.config.cjs

# 解压备份
tar -xzf backup/backup_20231211_143025.tar.gz -C .

# 安装依赖
pnpm install --prod
pnpm run prisma:generate

# 重启服务
pm2 restart nest_admin_server
```

## 🔧 高级配置

### 自定义部署后命令

编辑 `deploy.cjs`，在部署完成后添加自定义命令：

```javascript
// 在 步骤 13 之后添加
console.log('');
console.log(chalk.cyan('🔧 步骤 14: 执行自定义命令'));

await execRemoteCommand(`cd ${config.remotePath} && your-custom-command`);
```

### 部署前钩子

在构建前执行清理、测试等操作：

```javascript
// 在 步骤 1 之前添加
console.log(chalk.cyan('🧪 步骤 0: 运行测试'));
execCommand('pnpm run test', '正在运行测试...');
```

### 使用不同的 PM2 配置

```javascript
// 为不同环境使用不同的 ecosystem 文件
const pm2Config = env === 'prod' 
  ? 'ecosystem.config.cjs' 
  : `ecosystem.${env}.config.cjs`;
```

## 📝 最佳实践

1. **使用 SSH 私钥**：比密码更安全
2. **启用备份**：设置 `isBackup: true`
3. **不上传 .env**：在服务器预先配置
4. **谨慎使用迁移**：数据库迁移建议手动执行
5. **监控日志**：部署后检查 PM2 日志
6. **测试先行**：先部署到测试环境
7. **保持备份**：保留至少 5 个历史版本

## 🆘 获取帮助

- 查看服务日志：`pm2 logs nest_admin_server`
- 查看备份列表：`ls -lh /www/wwwroot/nest-admin-server/backup/`
- 测试服务：`curl http://localhost:8080/api/health`
- PM2 文档：https://pm2.keymetrics.io/docs/
- Prisma 文档：https://www.prisma.io/docs/

---

**祝部署顺利！** 🎉
