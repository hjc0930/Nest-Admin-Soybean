<script setup lang="tsx">
import { ref } from 'vue';
import { NTag } from 'naive-ui';
import { fetchGetSmsLogList, fetchResendSms } from '@/service/api/system/sms';
import { useAppStore } from '@/store/modules/app';
import { useAuth } from '@/hooks/business/auth';
import { useTable, useTableProps } from '@/hooks/common/table';
import { $t } from '@/locales';
import ButtonIcon from '@/components/custom/button-icon.vue';
import LogSearch from './modules/log-search.vue';
import LogDetailModal from './modules/log-detail-modal.vue';

defineOptions({
  name: 'SmsLogList',
});

const appStore = useAppStore();
const { hasAuth } = useAuth();
const tableProps = useTableProps();

const sendStatusMap: Record<number, { label: string; type: NaiveUI.ThemeColor }> = {
  0: { label: '发送中', type: 'info' },
  1: { label: '成功', type: 'success' },
  2: { label: '失败', type: 'error' },
};

const receiveStatusMap: Record<number, { label: string; type: NaiveUI.ThemeColor }> = {
  0: { label: '未接收', type: 'warning' },
  1: { label: '已接收', type: 'success' },
};

const detailModalVisible = ref(false);
const currentRowData = ref<Api.System.SmsLog | null>(null);

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
  apiFn: fetchGetSmsLogList,
  apiParams: {
    pageNum: 1,
    pageSize: 10,
    mobile: null,
    channelId: null,
    templateId: null,
    sendStatus: null,
  },
  columns: () => [
    {
      key: 'id',
      title: 'ID',
      align: 'center',
      width: 80,
    },
    {
      key: 'mobile',
      title: '手机号',
      align: 'center',
      minWidth: 120,
    },
    {
      key: 'channelCode',
      title: '渠道编码',
      align: 'center',
      minWidth: 100,
    },
    {
      key: 'templateCode',
      title: '模板编码',
      align: 'center',
      minWidth: 120,
      ellipsis: {
        tooltip: true,
      },
    },
    {
      key: 'content',
      title: '短信内容',
      align: 'center',
      minWidth: 200,
      ellipsis: {
        tooltip: true,
      },
    },
    {
      key: 'sendStatus',
      title: '发送状态',
      align: 'center',
      minWidth: 100,
      render(row) {
        const statusInfo = sendStatusMap[row.sendStatus] || { label: '未知', type: 'default' };
        return <NTag size="small" type={statusInfo.type}>{statusInfo.label}</NTag>;
      },
    },
    {
      key: 'receiveStatus',
      title: '接收状态',
      align: 'center',
      minWidth: 100,
      render(row) {
        if (row.receiveStatus === undefined || row.receiveStatus === null) {
          return '-';
        }
        const statusInfo = receiveStatusMap[row.receiveStatus] || { label: '未知', type: 'default' };
        return <NTag size="small" type={statusInfo.type}>{statusInfo.label}</NTag>;
      },
    },
    {
      key: 'sendTime',
      title: '发送时间',
      align: 'center',
      minWidth: 160,
    },
    {
      key: 'operate',
      title: $t('common.operate'),
      align: 'center',
      width: 130,
      render: (row) => {
        const viewBtn = () => {
          if (!hasAuth('system:sms:log:query')) {
            return null;
          }
          return (
            <ButtonIcon
              text
              type="primary"
              icon="material-symbols:visibility-outline"
              tooltipContent="查看详情"
              onClick={() => handleViewDetail(row)}
            />
          );
        };

        const resendBtn = () => {
          if (!hasAuth('system:sms:send') || row.sendStatus !== 2) {
            return null;
          }
          return (
            <ButtonIcon
              text
              type="warning"
              icon="material-symbols:refresh-rounded"
              tooltipContent="重新发送"
              popconfirmContent="确定要重新发送这条短信吗？"
              onPositiveClick={() => handleResend(row.id!)}
            />
          );
        };

        return (
          <div class="flex-center gap-8px">
            {viewBtn()}
            {resendBtn()}
          </div>
        );
      },
    },
  ],
});

function handleViewDetail(row: Api.System.SmsLog) {
  currentRowData.value = row;
  detailModalVisible.value = true;
}

async function handleResend(logId: CommonType.IdType) {
  try {
    await fetchResendSms(logId);
    window.$message?.success('重发请求已提交');
    getData();
  } catch {
    // error handled by request interceptor
  }
}
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <LogSearch v-model:model="searchParams" @reset="resetSearchParams" @search="getDataByPage" />
    <NCard title="短信日志列表" :bordered="false" size="small" class="card-wrapper sm:flex-1-hidden">
      <template #header-extra>
        <TableHeaderOperation
          v-model:columns="columnChecks"
          :loading="loading"
          :show-add="false"
          :show-delete="false"
          :show-export="false"
          @refresh="getData"
        />
      </template>
      <NDataTable
        :columns="columns"
        :data="data"
        v-bind="tableProps"
        :flex-height="!appStore.isMobile"
        :scroll-x="1200"
        :loading="loading"
        remote
        :row-key="(row) => row.id"
        :pagination="mobilePagination"
        class="sm:h-full"
      />
      <LogDetailModal v-model:visible="detailModalVisible" :row-data="currentRowData" />
    </NCard>
  </div>
</template>

<style scoped></style>
