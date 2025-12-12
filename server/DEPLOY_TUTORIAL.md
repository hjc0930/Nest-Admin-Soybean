# Nest-Admin 后端部署教程（生产）

本教程基于已实现的 `server/deploy.cjs` 自动化脚本与 PM2，指导你从本地到服务器的完整部署、回滚与排障流程，并解释此前失败的根因与规避方案。

## 前置要求
- 服务器已安装 Node.js v24.x（面板路径：`/www/server/nodejs/v24.12.0/bin/node`）
- 全局 `pnpm` 在面板路径：`/www/server/nodejs/v24.12.0/bin/pnpm`
- PostgreSQL 与 Redis 已就绪（本项目默认：`127.0.0.1:5432`、`localhost:6379`）
- 服务器部署路径：`/www/wwwroot/nest-admin-server`

## 环境变量约定
- 生产环境文件名：`.env.production`（保留原文件名上传到服务器）
- 为避免 Prisma/数据库开启 TLS 导致握手失败，请在生产环境显式设置：
  - `NODE_ENV=production`
  - `DB_SSL=false`
  - `DATABASE_URL="postgresql://postgres:密码@127.0.0.1:5432/nest_admin?schema=public"`
  - 如需使应用生效，可在服务器侧复制一份：`cp .env.production .env`

## 一次性首次部署
1) 配置 `deploy.config.cjs`
   - 复制 `deploy.config.example.cjs` 为 `deploy.config.cjs`
   - 填写服务器信息（IP、密码、路径等）
   - 配置 `pnpmPath: '/www/server/nodejs/v24.12.0/bin/pnpm'`（宝塔面板路径）
   - 设置 `dbPush: true`（自动同步数据库结构）

2) 本地一键部署
   ```bash
   cd server
   pnpm run deploy:prod
   ```

3) 首次部署后初始化种子数据（可选）
   ```bash
   ssh root@<ip>
   cd /www/wwwroot/nest-admin-server
   /www/server/nodejs/v24.12.0/bin/pnpm run prisma:seed:only
   ```

4) 验证部署
   ```bash
   # 查看服务状态
   ssh root@<ip> "pm2 status"
   
   # 查看日志
   ssh root@<ip> "pm2 logs nest_admin_server --lines 50"
   
   # 健康检查
   curl http://<ip>:8080/api/health
   ```

## 常规二次部署（迭代）
只需一行命令：
```bash
pnpm run deploy:prod
```

部署脚本会自动执行：
- ✅ 构建项目
- ✅ 上传文件
- ✅ 安装依赖（包含 devDependencies，因为需要 prisma CLI）
- ✅ 生成 Prisma Client
- ✅ 同步数据库结构（prisma db push）
- ✅ 重启 PM2 服务
- ✅ 健康检查

## 回滚与备份
- 部署脚本会在 `backupPath`（默认 `/www/wwwroot/nest-admin-server.backups`）保留最近 N 次备份。
- 回滚（示例）：
  - 停止：`pm2 stop nest_admin_server`
  - 回滚：`rm -rf /www/wwwroot/nest-admin-server && tar -xzf <备份文件> -C /www/wwwroot/nest-admin-server`
  - 依赖+迁移：参考上文步骤
  - 启动：`pm2 start ecosystem.config.cjs`

## 配置说明

### deploy.config.cjs 关键配置项
```javascript
{
  pnpmPath: '/www/server/nodejs/v24.12.0/bin/pnpm',  // 宝塔面板 pnpm 路径（必须配置）
  dbPush: true,                                       // 自动同步数据库结构
  runMigration: false,                                // 是否运行迁移（通常不与 dbPush 同用）
  isBackup: true,                                     // 部署前备份
  keepBackups: 5,                                     // 保留最近 5 个备份
  includeEnvFile: true,                               // 上传 .env.production
}
```

### 为什么需要安装 devDependencies？
- Prisma CLI (`prisma`) 在 `devDependencies` 中
- 需要在服务器上运行 `prisma generate` 和 `prisma db push`
- 部署脚本使用 `pnpm install`（不带 `--prod`）来确保包含 Prisma CLI

## 失败根因与规避
- Prisma 版本不一致：
  - 服务器上用 `npx prisma@7.x` 会报错（P1012），务必用本项目锁定版本：`pnpm exec prisma`（5.22.0）。
- 环境文件名与加载差异：
  - 应用启动按 `ConfigModule.forRoot({ envFilePath: [`.env.${NODE_ENV}`, '.env'] })` 加载；服务器若只有 `.env.production`，建议复制为 `.env`，或保证 `.env.production` 同步并未被 `.env` 覆盖。
- 数据库 TLS 错误：
  - 未配置 SSL 的 PostgreSQL，Prisma 若尝试 TLS 会握手失败；用 `DB_SSL=false` 并保持 `DATABASE_URL` 为非 `sslmode=require`。
- 健康检查失败：
  - 常见因 DB 未建表或依赖缺失，手动执行“依赖安装 + db push + 种子 + 重启”。

## PM2 配置要点
- `ecosystem.config.cjs` 中 `script: 'src/main.js'`（部署后代码在服务器根的 `src/`）
- 推荐 `fork` 模式；如需 `cluster`，确认连接会话与有状态逻辑已适配。
- 常用命令：
  - `pm2 status`
  - `pm2 logs nest_admin_server --lines 100 --nostream`
  - `pm2 delete nest_admin_server && pm2 start ecosystem.config.cjs`

## 服务器一键收尾命令合集
**现在已不需要！** 部署脚本已自动执行所有步骤。

如果需要手动操作，可使用：
```bash
cd /www/wwwroot/nest-admin-server
/www/server/nodejs/v24.12.0/bin/pnpm install --frozen-lockfile=false
/www/server/nodejs/v24.12.0/bin/pnpm exec prisma db push --accept-data-loss
/www/server/nodejs/v24.12.0/bin/pnpm run prisma:seed:only
pm2 restart nest_admin_server
curl -s -o /dev/null -w '%{http_code}\n' http://localhost:8080/api/health
```

## 当前警告的修复建议
- Swagger 重复 DTO：`DeptTreeNodeVo`、`ChangeStatusDto`
  - 需要在各模块中统一类名，或对重复类使用 `@ApiExtraModels()` 并自定义 schema 名，避免生成冲突。
  - 建议在 `system`、`monitor` 等模块中梳理重复的 DTO 定义，抽取公共 DTO 到 `src/common/dto/`，模块内按需 import。
- Redis 默认用户无需密码却提供了密码
  - 若 Redis 未启用 ACL/password，请将 `.env.production` 中的 `REDIS_PASSWORD` 留空或删除；或在 Redis 启用密码并对应配置。

如需，我可以进一步在代码中定位并提交 Swagger DTO 的去重改动与 Redis 配置的防呆逻辑（例如基于 `REDIS_PASSWORD` 为空时跳过认证）。
