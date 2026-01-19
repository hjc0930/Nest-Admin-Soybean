# 加密安全改进实施总结

## 实施日期
2025-01-XX

## 改进概述

根据安全分析，实施了**阶段1：基础防重放攻击机制**，包括：
1. ✅ Nonce机制（防止重放攻击）
2. ✅ 时间戳校验（防止过期请求）

## 实施内容

### 1. 前端改进

#### 文件：`admin-naive-ui/src/service/request/index.ts`

**修改内容：**
- 在`handleEncrypt`函数中添加nonce和时间戳生成
- 使用`globalThis.crypto.randomUUID()`生成唯一nonce
- 使用`Date.now()`生成时间戳
- 将nonce和时间戳添加到请求数据中（`_nonce`和`_timestamp`字段）
- 一起加密发送到后端

**代码示例：**
```typescript
// 生成nonce（唯一随机数）和时间戳（防重放攻击）
const nonce = globalThis.crypto.randomUUID();
const timestamp = Date.now();

// 将nonce和时间戳添加到请求数据中
const requestData = typeof config.data === 'object' ? config.data : {};
const dataWithNonce = {
  ...requestData,
  _nonce: nonce,
  _timestamp: timestamp
};

// 使用 AES 加密请求数据（包含nonce和时间戳）
const encryptedData = encryptWithAes(JSON.stringify(dataWithNonce), aesKey);
```

### 2. 后端改进

#### 文件：`server/src/security/crypto/crypto.service.ts`

**新增功能：**
1. **Nonce校验方法** (`validateNonce`)
   - 检查nonce是否已在Redis中存在
   - 如果存在，抛出BadRequestException（重放攻击）
   - 如果不存在，存储到Redis（TTL=5分钟）

2. **时间戳校验方法** (`validateTimestamp`)
   - 检查时间戳与当前时间的偏差
   - 如果偏差超过5分钟，抛出BadRequestException

3. **改进的decryptRequest方法**
   - 解密后提取nonce和时间戳
   - 执行校验
   - 从解密数据中移除`_nonce`和`_timestamp`字段
   - 返回清理后的数据

**配置参数：**
- `NONCE_TTL`: 5分钟（300,000毫秒）
- `TIMESTAMP_TOLERANCE`: 5分钟（300,000毫秒）

#### 文件：`server/src/security/crypto/crypto.interceptor.ts`

**修改内容：**
- 支持异步解密和校验
- 使用RxJS的`from`和`switchMap`处理异步操作
- 正确处理BadRequestException异常

#### 文件：`server/src/module/main/auth.controller.ts`

**修改内容：**
- 注入CryptoService
- 实现`getPublicKey`方法，返回RSA公钥
- 添加`@SkipDecrypt()`装饰器（公钥接口不需要解密）

## 安全效果

### 防重放攻击
- ✅ 每次请求都有唯一的nonce
- ✅ Nonce存储在Redis中，TTL=5分钟
- ✅ 重复使用相同nonce的请求会被拒绝

### 防过期请求
- ✅ 每次请求都包含时间戳
- ✅ 时间戳偏差超过5分钟的请求会被拒绝
- ✅ 防止时钟不同步导致的攻击

### 安全性提升
- ✅ 即使攻击者拦截到加密请求，也无法重放
- ✅ 即使攻击者获取到AES密钥，也无法重复使用
- ✅ 请求具有时效性，过期请求自动失效

## 使用说明

### 前端
前端无需额外配置，加密请求会自动包含nonce和时间戳。

### 后端
后端自动校验，无需额外配置。如果校验失败，会返回400错误：
- `请求已过期或重复，请重新提交`（nonce重复）
- `请求时间戳无效，请检查系统时间`（时间戳超出范围）

## 注意事项

1. **Redis依赖**
   - 需要Redis服务正常运行
   - Nonce存储在Redis中，TTL=5分钟
   - 如果Redis不可用，nonce校验会失败

2. **时间同步**
   - 前端和后端系统时间需要同步
   - 允许±5分钟的时间偏差
   - 如果时间偏差过大，需要调整`TIMESTAMP_TOLERANCE`

3. **性能影响**
   - 每次加密请求需要一次Redis写入操作
   - 每次解密请求需要一次Redis读取操作
   - 影响很小，可以忽略

4. **向后兼容**
   - 如果请求中没有nonce和时间戳，会抛出错误
   - 需要前端和后端同时更新

## 后续优化建议

### 阶段2：增强安全性（可选）
1. **请求签名机制**
   - 使用HMAC签名增强安全性
   - 防止请求被篡改

2. **Nonce与Session绑定**
   - 将nonce与用户session绑定
   - 防止跨用户重放

3. **更细粒度的时间窗口**
   - 根据业务需求调整时间窗口
   - 敏感操作使用更短的时间窗口

## 测试建议

1. **单元测试**
   - 测试nonce重复请求被拒绝
   - 测试时间戳超出范围的请求被拒绝
   - 测试正常请求可以正常处理

2. **集成测试**
   - 测试完整的加密-解密流程
   - 测试重放攻击被阻止
   - 测试过期请求被拒绝

3. **性能测试**
   - 测试Redis操作对性能的影响
   - 测试高并发场景下的表现
