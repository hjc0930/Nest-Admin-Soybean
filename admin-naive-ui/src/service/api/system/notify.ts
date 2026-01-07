import { request } from '@/service/request';

// ==================== 站内信模板 API ====================

/** 获取站内信模板列表 */
export function fetchGetNotifyTemplateList(params?: Api.System.NotifyTemplateSearchParams) {
  return request<Api.System.NotifyTemplateList>({
    url: '/system/notify/template/list',
    method: 'get',
    params,
  });
}

/** 获取启用的站内信模板列表（用于下拉选择） */
export function fetchGetNotifyTemplateSelect() {
  return request<Api.System.NotifyTemplateSelect[]>({
    url: '/system/notify/template/select',
    method: 'get',
  });
}

/** 获取站内信模板详情 */
export function fetchGetNotifyTemplateDetail(id: CommonType.IdType) {
  return request<Api.System.NotifyTemplate>({
    url: `/system/notify/template/${id}`,
    method: 'get',
  });
}

/** 新增站内信模板 */
export function fetchCreateNotifyTemplate(data: Api.System.NotifyTemplateOperateParams) {
  return request<boolean>({
    url: '/system/notify/template',
    method: 'post',
    data,
  });
}

/** 修改站内信模板 */
export function fetchUpdateNotifyTemplate(data: Api.System.NotifyTemplateOperateParams) {
  return request<boolean>({
    url: '/system/notify/template',
    method: 'put',
    data,
  });
}

/** 批量删除站内信模板 */
export function fetchBatchDeleteNotifyTemplate(ids: CommonType.IdType[]) {
  return request<boolean>({
    url: `/system/notify/template/${ids.join(',')}`,
    method: 'delete',
  });
}

// ==================== 站内信消息 API ====================

/** 获取站内信消息列表（管理员） */
export function fetchGetNotifyMessageList(params?: Api.System.NotifyMessageSearchParams) {
  return request<Api.System.NotifyMessageList>({
    url: '/system/notify/message/list',
    method: 'get',
    params,
  });
}

/** 获取我的站内信列表 */
export function fetchGetMyNotifyMessageList(params?: Api.System.MyNotifyMessageSearchParams) {
  return request<Api.System.NotifyMessageList>({
    url: '/system/notify/message/my-list',
    method: 'get',
    params,
  });
}

/** 获取站内信详情 */
export function fetchGetNotifyMessageDetail(id: string) {
  return request<Api.System.NotifyMessage>({
    url: `/system/notify/message/${id}`,
    method: 'get',
  });
}

/** 获取未读站内信数量 */
export function fetchGetUnreadCount() {
  return request<Api.System.UnreadCountResponse>({
    url: '/system/notify/message/unread-count',
    method: 'get',
  });
}

/** 获取最近的站内信列表（用于通知铃铛下拉） */
export function fetchGetRecentMessages(limit?: number) {
  return request<Api.System.NotifyMessage[]>({
    url: '/system/notify/message/recent',
    method: 'get',
    params: { limit },
  });
}

/** 发送站内信（单发/群发） */
export function fetchSendNotifyMessage(data: Api.System.SendNotifyMessageParams) {
  return request<boolean>({
    url: '/system/notify/message/send',
    method: 'post',
    data,
  });
}

/** 发送站内信给所有用户 */
export function fetchSendNotifyAll(data: Api.System.SendNotifyAllParams) {
  return request<boolean>({
    url: '/system/notify/message/send-all',
    method: 'post',
    data,
  });
}

/** 标记单条站内信为已读 */
export function fetchMarkAsRead(id: string) {
  return request<boolean>({
    url: `/system/notify/message/read/${id}`,
    method: 'put',
  });
}

/** 批量标记站内信为已读 */
export function fetchMarkAsReadBatch(ids: string[]) {
  return request<boolean>({
    url: `/system/notify/message/read-batch/${ids.join(',')}`,
    method: 'put',
  });
}

/** 标记所有站内信为已读 */
export function fetchMarkAllAsRead() {
  return request<boolean>({
    url: '/system/notify/message/read-all',
    method: 'put',
  });
}

/** 删除单条站内信（软删除） */
export function fetchDeleteNotifyMessage(id: string) {
  return request<boolean>({
    url: `/system/notify/message/${id}`,
    method: 'delete',
  });
}

/** 批量删除站内信（软删除） */
export function fetchBatchDeleteNotifyMessage(ids: string[]) {
  return request<boolean>({
    url: `/system/notify/message/batch/${ids.join(',')}`,
    method: 'delete',
  });
}
