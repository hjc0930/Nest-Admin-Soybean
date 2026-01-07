<script setup lang="tsx">
import { NDivider } from 'naive-ui';
import { fetchBatchDeleteSmsChannel, fetchGetSmsChannelList } from '@/service/api/system/sms';
import { useAppStore } from '@/store/modules/app';
import { useAuth } from '@/hooks/business/auth';
import { useTable, useTableOperate, useTableProps } from '@/hooks/common/table';
import { useDict } from '@/hooks/business/dict';
import { $t } from '@/locales';
import DictTag from '@/components/custom/dict-tag.vue';
import ButtonIcon from '@/components/custom/button-icon.vue';
import ChannelOperateDrawer from './modules/channel-operate-drawer.vue';
import ChannelSearch from './modules/channel-search.vue';

defineOptions({
  name: 'SmsChannelList',
});

useDict('sys_normal_disable');
const appStore = useAppStore();
const { hasAuth } = useAuth();
const tableProps = useTableProps();

const channelCodeMap: Record<string, string> = {
  aliyun: '阿里云',
  tencent: '腾讯云',
  huawei: '华为云',
  qiniu: '七牛云',
  yunpian: '云片',
};

const {
  columns,
  columnChecks,
  data,
  getData,
  getDataByPage,
  loading,
  mobilePagination,
  searchParams,
  resetSearchParams,
} = useTable({
  apiFn: fetchGetSmsChannelList,
  apiParams: {
    pageNum: 1,
    pageSize: 10,
    name: null,
    code: null,
    status: null,
  },
  columns: () => [
    {
      type: 'selection',
      align: 'center',
      width: 48,
    },
    {
      key: 'id',
      title: 'ID',
      align: 'center',
      width: 60,
    },
    {
      key: 'name',
      title: '渠道名称',
      align: 'center',
      minWidth: 120,
      ellipsis: {
        tooltip: true,
      },
    },
    {
      key: 'code',
      title: '渠道编码',
      align: 'center',
      minWidth: 100,
      render(row) {
        return channelCodeMap[row.code] || row.code;
      },
    },
    {
      key: 'signature',
      title: '短信签名',
      align: 'center',
      minWidth: 100,
      ellipsis: {
        tooltip: true,
      },
    },
    {
      key: 'apiKey',
      title: 'API Key',
      align: 'center',
      minWidth: 120,
      ellipsis: {
        tooltip: true,
      },
    },
    {
      key: 'status',
      title: '状态',
      align: 'center',
      minWidth: 80,
      render(row) {
        return <DictTag size="small" value={row.status} dictCode="sys_normal_disable" />;
      },
    },
    {
      key: 'createTime',
      title: '创建时间',
      align: 'center',
      minWidth: 160,
    },
    {
      key: 'operate',
      title: $t('common.operate'),
      align: 'center',
      width: 130,
      render: (row) => {
        const divider = () => {
          if (!hasAuth('system:sms:channel:edit') || !hasAuth('system:sms:channel:remove')) {
            return null;
          }
          return <NDivider vertical />;
        };

        const editBtn = () => {
          if (!hasAuth('system:sms:channel:edit')) {
            return null;
          }
          return (
            <ButtonIcon
              text
              type="primary"
              icon="material-symbols:drive-file-rename-outline-outline"
              tooltipContent={$t('common.edit')}
              onClick={() => edit(row.id!)}
            />
          );
        };

        const deleteBtn = () => {
          if (!hasAuth('system:sms:channel:remove')) {
            return null;
          }
          return (
            <ButtonIcon
              text
              type="error"
              icon="material-symbols:delete-outline"
              tooltipContent={$t('common.delete')}
              popconfirmContent={$t('common.confirmDelete')}
              onPositiveClick={() => handleDelete(row.id!)}
            />
          );
        };

        return (
          <div class="flex-center gap-8px">
            {editBtn()}
            {divider()}
            {deleteBtn()}
          </div>
        );
      },
    },
  ],
});

const { drawerVisible, operateType, editingData, handleAdd, handleEdit, checkedRowKeys, onBatchDeleted, onDeleted } =
  useTableOperate(data, getData);

async function handleBatchDelete() {
  try {
    await fetchBatchDeleteSmsChannel(checkedRowKeys.value);
    onBatchDeleted();
  } catch {
    // error handled by request interceptor
  }
}

async function handleDelete(id: CommonType.IdType) {
  try {
    await fetchBatchDeleteSmsChannel([id]);
    onDeleted();
  } catch {
    // error handled by request interceptor
  }
}

async function edit(id: CommonType.IdType) {
  handleEdit('id', id);
}
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <ChannelSearch v-model:model="searchParams" @reset="resetSearchParams" @search="getDataByPage" />
    <NCard title="短信渠道列表" :bordered="false" size="small" class="card-wrapper sm:flex-1-hidden">
      <template #header-extra>
        <TableHeaderOperation
          v-model:columns="columnChecks"
          :disabled-delete="checkedRowKeys.length === 0"
          :loading="loading"
          :show-add="hasAuth('system:sms:channel:add')"
          :show-delete="hasAuth('system:sms:channel:remove')"
          :show-export="false"
          @add="handleAdd"
          @delete="handleBatchDelete"
          @refresh="getData"
        />
      </template>
      <NDataTable
        v-model:checked-row-keys="checkedRowKeys"
        :columns="columns"
        :data="data"
        v-bind="tableProps"
        :flex-height="!appStore.isMobile"
        :scroll-x="962"
        :loading="loading"
        remote
        :row-key="(row) => row.id"
        :pagination="mobilePagination"
        class="sm:h-full"
      />
      <ChannelOperateDrawer
        v-model:visible="drawerVisible"
        :operate-type="operateType"
        :row-data="editingData"
        @submitted="getData"
      />
    </NCard>
  </div>
</template>

<style scoped></style>
