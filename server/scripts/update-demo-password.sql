-- 更新 demo 账号的密码为 demo123
-- 执行此 SQL 脚本以修复生产环境的 demo 账号密码

UPDATE "sys_user" 
SET 
  "password" = '$2b$10$g3kM8fAzWz4LAb9bgBJAruofmfFL13xUw1QqOTdrLvouZCLbY7sVa',
  "update_time" = NOW(),
  "update_by" = 'system'
WHERE "user_name" = 'demo' AND "tenant_id" = '000000';

-- 验证更新
SELECT "user_id", "user_name", "nick_name", "remark", LEFT("password", 30) as "password_hash"
FROM "sys_user" 
WHERE "user_name" = 'demo';
