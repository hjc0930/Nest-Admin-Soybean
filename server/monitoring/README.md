# Nest-Admin 性能监控

本目录包含 Nest-Admin 项目的性能监控配置，包括 Prometheus 指标收集、Grafana 可视化仪表盘和告警规则。

## 目录结构

```
monitoring/
├── docker-compose.yml              # Docker Compose 一键启动
├── README.md                       # 本文档
├── alertmanager/
│   └── alertmanager.yml            # Alertmanager 告警配置
├── grafana/
│   ├── dashboards/
│   │   └── nest-admin-overview.json  # Grafana 仪表盘
│   └── provisioning/
│       ├── dashboards/
│       │   └── dashboards.yml      # 仪表盘自动配置
│       └── datasources/
│           └── prometheus.yml      # 数据源配置
└── prometheus/
    ├── prometheus.yml              # Prometheus 配置
    └── alerts/
        └── nest-admin-alerts.yml   # 告警规则
```

## 快速开始

### 1. 启动监控栈

```bash
cd server/monitoring
docker-compose up -d
```

### 2. 访问服务

| 服务 | 地址 | 默认账号 |
|------|------|----------|
| Grafana | http://localhost:3001 | admin / admin |
| Prometheus | http://localhost:9090 | - |
| Alertmanager | http://localhost:9093 | - |

### 3. 配置应用指标端点

确保 Nest-Admin 应用暴露了 `/metrics` 端点。在 `prometheus.yml` 中配置正确的应用地址：

```yaml
scrape_configs:
  - job_name: 'nest-admin'
    metrics_path: '/metrics'
    static_configs:
      - targets: ['host.docker.internal:3000']  # Docker 环境
      # - targets: ['localhost:3000']           # 本地环境
```

## 监控指标

### HTTP 请求指标

| 指标名 | 类型 | 说明 |
|--------|------|------|
| `nest_admin_http_requests_total` | Counter | HTTP 请求总数 |
| `nest_admin_http_request_duration_seconds` | Histogram | HTTP 请求延迟 |

### 缓存指标

| 指标名 | 类型 | 说明 |
|--------|------|------|
| `nest_admin_cache_hit_rate` | Gauge | 缓存命中率 |
| `nest_admin_cache_hits_total` | Counter | 缓存命中次数 |
| `nest_admin_cache_misses_total` | Counter | 缓存未命中次数 |

### 业务指标

| 指标名 | 类型 | 说明 |
|--------|------|------|
| `nest_admin_login_attempts_total` | Counter | 登录尝试次数 |
| `nest_admin_api_calls_by_tenant_total` | Counter | 按租户 API 调用次数 |

### 系统指标

| 指标名 | 类型 | 说明 |
|--------|------|------|
| `nest_admin_active_connections` | Gauge | 活跃连接数 |
| `nest_admin_queue_jobs_total` | Counter | 队列任务数 |
| `nest_admin_nodejs_heap_size_*` | Gauge | Node.js 内存使用 |
| `nest_admin_nodejs_eventloop_lag_seconds` | Gauge | 事件循环延迟 |

### 数据库指标

| 指标名 | 类型 | 说明 |
|--------|------|------|
| `nest_admin_db_query_total` | Counter | 数据库查询总数 |
| `nest_admin_db_query_duration_seconds` | Histogram | 数据库查询延迟 |
| `nest_admin_db_slow_query_total` | Counter | 慢查询总数 |

## Grafana 仪表盘

### 概览仪表盘 (nest-admin-overview)

包含以下面板：

1. **HTTP 请求监控**
   - HTTP 请求速率 (按方法)
   - HTTP 响应时间分位数 (P50/P95/P99)
   - HTTP 状态码分布
   - HTTP 错误率
   - 总请求数

2. **数据库性能监控**
   - 数据库查询速率 (按操作)
   - 数据库查询延迟分位数 (P50/P95/P99)
   - 慢查询数量
   - Node.js 内存使用
   - 活跃连接数

3. **缓存性能监控**
   - 缓存命中率
   - 缓存命中/未命中趋势

4. **租户监控**
   - 租户 API 调用量
   - 登录尝试统计

5. **系统资源监控**
   - 事件循环延迟
   - 队列任务统计

## 告警规则

### HTTP 告警

| 告警名 | 严重级别 | 触发条件 |
|--------|----------|----------|
| HighHttpErrorRate | critical | 5xx 错误率 > 5% |
| HighHttpLatencyP95 | warning | P95 延迟 > 1s |
| HighHttpLatencyP99 | critical | P99 延迟 > 2s |
| HttpRequestSpike | warning | 请求量突增 3 倍 |
| NoHttpRequests | critical | 5 分钟无请求 |

### 缓存告警

| 告警名 | 严重级别 | 触发条件 |
|--------|----------|----------|
| LowCacheHitRate | warning | 命中率 < 70% |
| VeryLowCacheHitRate | critical | 命中率 < 50% |

### 安全告警

| 告警名 | 严重级别 | 触发条件 |
|--------|----------|----------|
| HighLoginFailureRate | warning | 登录失败率 > 30% |
| LoginFailureSpike | critical | 登录失败 > 10次/秒 |

### 资源告警

| 告警名 | 严重级别 | 触发条件 |
|--------|----------|----------|
| HighMemoryUsage | warning | 堆内存使用 > 85% |
| CriticalMemoryUsage | critical | 堆内存使用 > 95% |
| HighEventLoopLag | warning | 事件循环延迟 > 100ms |
| CriticalEventLoopLag | critical | 事件循环延迟 > 500ms |

### 队列告警

| 告警名 | 严重级别 | 触发条件 |
|--------|----------|----------|
| HighQueueFailureRate | warning | 任务失败率 > 10% |

### 租户告警

| 告警名 | 严重级别 | 触发条件 |
|--------|----------|----------|
| TenantHighApiUsage | warning | API 调用 > 100次/秒 |

### 数据库告警

| 告警名 | 严重级别 | 触发条件 |
|--------|----------|----------|
| HighSlowQueryRate | warning | 慢查询 > 1次/秒 |
| HighDbQueryLatencyP95 | warning | P95 延迟 > 500ms |
| HighDbQueryErrorRate | critical | 查询错误率 > 5% |

## 配置告警通知

编辑 `alertmanager/alertmanager.yml` 配置告警接收器：

### 邮件通知

```yaml
global:
  smtp_smarthost: 'smtp.example.com:587'
  smtp_from: 'alertmanager@example.com'
  smtp_auth_username: 'alertmanager@example.com'
  smtp_auth_password: 'password'

receivers:
  - name: 'email-receiver'
    email_configs:
      - to: 'ops-team@example.com'
        send_resolved: true
```

### Slack 通知

```yaml
receivers:
  - name: 'slack-receiver'
    slack_configs:
      - api_url: 'https://hooks.slack.com/services/xxx/xxx/xxx'
        channel: '#alerts'
        send_resolved: true
```

### 钉钉通知

```yaml
receivers:
  - name: 'dingtalk-receiver'
    webhook_configs:
      - url: 'https://oapi.dingtalk.com/robot/send?access_token=xxx'
        send_resolved: true
```

## 生产环境部署

### 1. 修改 Prometheus 配置

```yaml
scrape_configs:
  - job_name: 'nest-admin-prod'
    metrics_path: '/metrics'
    static_configs:
      - targets: ['nest-admin-1:3000', 'nest-admin-2:3000']
        labels:
          env: 'production'
```

### 2. 配置持久化存储

确保 Docker volumes 映射到持久化存储：

```yaml
volumes:
  prometheus_data:
    driver: local
    driver_opts:
      type: none
      o: bind
      device: /data/prometheus
```

### 3. 配置告警通知

根据团队需求配置邮件、Slack、钉钉等告警通知渠道。

### 4. 配置 Grafana 认证

```yaml
environment:
  - GF_SECURITY_ADMIN_PASSWORD=your-secure-password
  - GF_AUTH_ANONYMOUS_ENABLED=false
```

## 常见问题

### Q: Prometheus 无法抓取指标？

1. 检查应用是否暴露了 `/metrics` 端点
2. 检查网络连通性
3. 检查 Prometheus 配置中的 targets 地址

### Q: Grafana 仪表盘无数据？

1. 检查 Prometheus 数据源配置
2. 检查 Prometheus 是否正常抓取指标
3. 检查时间范围设置

### Q: 告警不触发？

1. 检查 Prometheus 告警规则是否加载
2. 检查 Alertmanager 配置
3. 检查告警路由规则

## 参考链接

- [Prometheus 文档](https://prometheus.io/docs/)
- [Grafana 文档](https://grafana.com/docs/)
- [Alertmanager 文档](https://prometheus.io/docs/alerting/latest/alertmanager/)
