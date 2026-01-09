# 前端开发规范

## 技术栈

- **框架**: Vue 3 + TypeScript
- **UI 组件库**: Naive UI
- **状态管理**: Pinia
- **路由**: Vue Router
- **HTTP 客户端**: Axios
- **构建工具**: Vite
- **CSS 框架**: UnoCSS

## 目录结构

```
admin-naive-ui/src/
├── assets/              # 静态资源
│   ├── imgs/            # 图片
│   └── svg-icon/        # SVG 图标
├── components/          # 公共组件
│   ├── advanced/        # 高级组件
│   ├── common/          # 通用组件
│   ├── custom/          # 自定义组件
│   └── stateless/       # 无状态组件
├── constants/           # 常量定义
├── enum/                # 枚举定义
├── hooks/               # 组合式函数
│   ├── business/        # 业务 hooks
│   └── common/          # 通用 hooks
├── layouts/             # 布局组件
├── locales/             # 国际化
├── plugins/             # 插件
├── router/              # 路由配置
├── service/             # API 服务
│   ├── api/             # API 接口定义
│   └── request/         # 请求封装
├── store/               # 状态管理
│   └── modules/         # 状态模块
├── styles/              # 样式文件
├── theme/               # 主题配置
├── typings/             # 类型定义
├── utils/               # 工具函数
└── views/               # 页面视图
```

## 组件开发规范

### 单文件组件结构

```vue
<script setup lang="ts">
// 1. 导入
import { ref, computed, onMounted } from 'vue';
import { useMessage } from 'naive-ui';
import type { UserInfo } from '@/typings/api';

// 2. Props 定义
interface Props {
  userId: number;
  readonly?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  readonly: false,
});

// 3. Emits 定义
interface Emits {
  (e: 'update', user: UserInfo): void;
  (e: 'delete', id: number): void;
}

const emit = defineEmits<Emits>();

// 4. 响应式数据
const loading = ref(false);
const userInfo = ref<UserInfo | null>(null);

// 5. 计算属性
const displayName = computed(() => {
  return userInfo.value?.nickName || userInfo.value?.userName || '';
});

// 6. 方法
async function fetchUserInfo() {
  loading.value = true;
  try {
    const { data } = await getUserById(props.userId);
    userInfo.value = data;
  } finally {
    loading.value = false;
  }
}

function handleUpdate() {
  if (userInfo.value) {
    emit('update', userInfo.value);
  }
}

// 7. 生命周期
onMounted(() => {
  fetchUserInfo();
});
</script>

<template>
  <div class="user-card">
    <n-spin :show="loading">
      <n-card v-if="userInfo" :title="displayName">
        <template #header-extra>
          <n-button v-if="!readonly" @click="handleUpdate">
            编辑
          </n-button>
        </template>
        <n-descriptions :column="2">
          <n-descriptions-item label="用户名">
            {{ userInfo.userName }}
          </n-descriptions-item>
          <n-descriptions-item label="邮箱">
            {{ userInfo.email }}
          </n-descriptions-item>
        </n-descriptions>
      </n-card>
    </n-spin>
  </div>
</template>

<style scoped>
.user-card {
  padding: 16px;
}
</style>
```

### 组件命名规范

- 组件文件名: PascalCase (如 `UserCard.vue`)
- 组件名: PascalCase (如 `UserCard`)
- 在模板中使用: kebab-case 或 PascalCase (如 `<user-card>` 或 `<UserCard>`)

## API 服务规范

### API 定义

```typescript
// service/api/system/user.ts
import { request } from '@/service/request';
import type { UserInfo, UserListParams, UserListResult } from '@/typings/api';

/**
 * 获取用户列表
 */
export function getUserList(params: UserListParams) {
  return request.get<UserListResult>('/system/user/list', { params });
}

/**
 * 获取用户详情
 */
export function getUserById(userId: number) {
  return request.get<UserInfo>(`/system/user/${userId}`);
}

/**
 * 创建用户
 */
export function createUser(data: Partial<UserInfo>) {
  return request.post<UserInfo>('/system/user', data);
}

/**
 * 更新用户
 */
export function updateUser(userId: number, data: Partial<UserInfo>) {
  return request.put<UserInfo>(`/system/user/${userId}`, data);
}

/**
 * 删除用户
 */
export function deleteUser(userId: number) {
  return request.delete(`/system/user/${userId}`);
}
```

### 类型定义

```typescript
// typings/api/system.d.ts
declare namespace Api {
  namespace System {
    /** 用户信息 */
    interface UserInfo {
      userId: number;
      userName: string;
      nickName: string;
      email?: string;
      phone?: string;
      status: '0' | '1';
      createTime: string;
    }

    /** 用户列表查询参数 */
    interface UserListParams {
      pageNum?: number;
      pageSize?: number;
      userName?: string;
      status?: string;
    }

    /** 用户列表响应 */
    interface UserListResult {
      rows: UserInfo[];
      total: number;
      pageNum: number;
      pageSize: number;
      pages: number;
    }
  }
}
```

## 状态管理规范

### Store 定义

```typescript
// store/modules/user.ts
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { getUserInfo, login, logout } from '@/service/api';
import type { UserInfo } from '@/typings/api';

export const useUserStore = defineStore('user', () => {
  // State
  const userInfo = ref<UserInfo | null>(null);
  const token = ref<string>('');

  // Getters
  const isLoggedIn = computed(() => !!token.value);
  const userName = computed(() => userInfo.value?.userName || '');

  // Actions
  async function loginAction(username: string, password: string) {
    const { data } = await login({ username, password });
    token.value = data.token;
    await fetchUserInfo();
  }

  async function fetchUserInfo() {
    const { data } = await getUserInfo();
    userInfo.value = data;
  }

  async function logoutAction() {
    await logout();
    token.value = '';
    userInfo.value = null;
  }

  function resetState() {
    token.value = '';
    userInfo.value = null;
  }

  return {
    // State
    userInfo,
    token,
    // Getters
    isLoggedIn,
    userName,
    // Actions
    loginAction,
    fetchUserInfo,
    logoutAction,
    resetState,
  };
}, {
  persist: {
    key: 'user-store',
    paths: ['token'],
  },
});
```

## Hooks 开发规范

### 通用 Hook

```typescript
// hooks/common/useLoading.ts
import { ref } from 'vue';

export function useLoading(initialValue = false) {
  const loading = ref(initialValue);

  function startLoading() {
    loading.value = true;
  }

  function endLoading() {
    loading.value = false;
  }

  async function withLoading<T>(fn: () => Promise<T>): Promise<T> {
    startLoading();
    try {
      return await fn();
    } finally {
      endLoading();
    }
  }

  return {
    loading,
    startLoading,
    endLoading,
    withLoading,
  };
}
```

### 业务 Hook

```typescript
// hooks/business/useUserList.ts
import { ref, reactive } from 'vue';
import { getUserList, deleteUser } from '@/service/api';
import { useMessage } from 'naive-ui';
import type { UserInfo, UserListParams } from '@/typings/api';

export function useUserList() {
  const message = useMessage();
  const loading = ref(false);
  const userList = ref<UserInfo[]>([]);
  const pagination = reactive({
    page: 1,
    pageSize: 10,
    total: 0,
  });

  async function fetchList(params?: Partial<UserListParams>) {
    loading.value = true;
    try {
      const { data } = await getUserList({
        pageNum: pagination.page,
        pageSize: pagination.pageSize,
        ...params,
      });
      userList.value = data.rows;
      pagination.total = data.total;
    } finally {
      loading.value = false;
    }
  }

  async function handleDelete(userId: number) {
    try {
      await deleteUser(userId);
      message.success('删除成功');
      await fetchList();
    } catch (error) {
      message.error('删除失败');
    }
  }

  function handlePageChange(page: number) {
    pagination.page = page;
    fetchList();
  }

  return {
    loading,
    userList,
    pagination,
    fetchList,
    handleDelete,
    handlePageChange,
  };
}
```

## 表单处理规范

### 表单验证

```typescript
// 使用 Naive UI 的表单验证
import type { FormRules, FormInst } from 'naive-ui';

const formRef = ref<FormInst | null>(null);

const formData = reactive({
  userName: '',
  email: '',
  phone: '',
});

const rules: FormRules = {
  userName: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 2, max: 20, message: '用户名长度为 2-20 个字符', trigger: 'blur' },
  ],
  email: [
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' },
  ],
  phone: [
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' },
  ],
};

async function handleSubmit() {
  try {
    await formRef.value?.validate();
    // 提交表单
  } catch (errors) {
    // 验证失败
  }
}
```

## 样式规范

### UnoCSS 使用

```vue
<template>
  <!-- 使用 UnoCSS 原子类 -->
  <div class="flex items-center justify-between p-4 bg-white rounded-lg shadow">
    <span class="text-lg font-bold text-gray-800">标题</span>
    <n-button type="primary" size="small">
      操作
    </n-button>
  </div>
</template>
```

### Scoped 样式

```vue
<style scoped>
/* 组件私有样式 */
.custom-class {
  /* 使用 CSS 变量保持主题一致性 */
  color: var(--n-text-color);
  background-color: var(--n-color);
}

/* 深度选择器 */
:deep(.n-card-header) {
  padding: 12px 16px;
}
</style>
```

## 国际化规范

### 使用 i18n

```typescript
// 在组件中使用
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

// 模板中使用
// {{ $t('common.confirm') }}
// {{ t('user.createSuccess') }}
```

### 语言文件

```typescript
// locales/langs/zh-cn.ts
export default {
  common: {
    confirm: '确认',
    cancel: '取消',
    save: '保存',
    delete: '删除',
    edit: '编辑',
    search: '搜索',
    reset: '重置',
  },
  user: {
    userName: '用户名',
    nickName: '昵称',
    createSuccess: '用户创建成功',
    deleteConfirm: '确定要删除该用户吗？',
  },
};
```

## 错误处理规范

### 全局错误处理

```typescript
// 在请求拦截器中处理
request.interceptors.response.use(
  (response) => {
    const { code, msg, data } = response.data;
    
    if (code === 200) {
      return data;
    }
    
    // 业务错误
    if (code === 401) {
      // 未授权，跳转登录
      router.push('/login');
    }
    
    message.error(msg || '请求失败');
    return Promise.reject(new Error(msg));
  },
  (error) => {
    // 网络错误
    message.error('网络错误，请稍后重试');
    return Promise.reject(error);
  }
);
```

### 组件级错误处理

```typescript
async function handleSubmit() {
  try {
    await createUser(formData);
    message.success('创建成功');
    emit('success');
  } catch (error) {
    // 错误已在拦截器中处理
    console.error('创建用户失败:', error);
  }
}
```
