import { request } from '@/service/request';

// ==================== 短信渠道 API ====================

/** 获取短信渠道列表 */
export function fetchGetSmsChannelList(params?: Api.System.SmsChannelSearchParams) {
  return request<Api.System.SmsChannelList>({
    url: '/system/sms/channel/list',
    method: 'get',
    params,
  });
}

/** 获取启用的短信渠道列表（用于下拉选择） */
export function fetchGetEnabledSmsChannels() {
  return request<Api.System.SmsChannel[]>({
    url: '/system/sms/channel/enabled',
    method: 'get',
  });
}

/** 获取短信渠道详情 */
export function fetchGetSmsChannelDetail(id: CommonType.IdType) {
  return request<Api.System.SmsChannel>({
    url: `/system/sms/channel/${id}`,
    method: 'get',
  });
}

/** 新增短信渠道 */
export function fetchCreateSmsChannel(data: Api.System.SmsChannelOperateParams) {
  return request<boolean>({
    url: '/system/sms/channel',
    method: 'post',
    data,
  });
}

/** 修改短信渠道 */
export function fetchUpdateSmsChannel(data: Api.System.SmsChannelOperateParams) {
  return request<boolean>({
    url: '/system/sms/channel',
    method: 'put',
    data,
  });
}

/** 批量删除短信渠道 */
export function fetchBatchDeleteSmsChannel(ids: CommonType.IdType[]) {
  return request<boolean>({
    url: `/system/sms/channel/${ids.join(',')}`,
    method: 'delete',
  });
}

// ==================== 短信模板 API ====================

/** 获取短信模板列表 */
export function fetchGetSmsTemplateList(params?: Api.System.SmsTemplateSearchParams) {
  return request<Api.System.SmsTemplateList>({
    url: '/system/sms/template/list',
    method: 'get',
    params,
  });
}

/** 获取短信模板详情 */
export function fetchGetSmsTemplateDetail(id: CommonType.IdType) {
  return request<Api.System.SmsTemplate>({
    url: `/system/sms/template/${id}`,
    method: 'get',
  });
}

/** 新增短信模板 */
export function fetchCreateSmsTemplate(data: Api.System.SmsTemplateOperateParams) {
  return request<boolean>({
    url: '/system/sms/template',
    method: 'post',
    data,
  });
}

/** 修改短信模板 */
export function fetchUpdateSmsTemplate(data: Api.System.SmsTemplateOperateParams) {
  return request<boolean>({
    url: '/system/sms/template',
    method: 'put',
    data,
  });
}

/** 批量删除短信模板 */
export function fetchBatchDeleteSmsTemplate(ids: CommonType.IdType[]) {
  return request<boolean>({
    url: `/system/sms/template/${ids.join(',')}`,
    method: 'delete',
  });
}

// ==================== 短信日志 API ====================

/** 获取短信日志列表 */
export function fetchGetSmsLogList(params?: Api.System.SmsLogSearchParams) {
  return request<Api.System.SmsLogList>({
    url: '/system/sms/log/list',
    method: 'get',
    params,
  });
}

/** 获取短信日志详情 */
export function fetchGetSmsLogDetail(id: CommonType.IdType) {
  return request<Api.System.SmsLog>({
    url: `/system/sms/log/${id}`,
    method: 'get',
  });
}

/** 根据手机号查询短信日志 */
export function fetchGetSmsLogByMobile(mobile: string) {
  return request<Api.System.SmsLog[]>({
    url: `/system/sms/log/mobile/${mobile}`,
    method: 'get',
  });
}

// ==================== 短信发送 API ====================

/** 发送单条短信 */
export function fetchSendSms(data: Api.System.SendSmsParams) {
  return request<boolean>({
    url: '/system/sms/send',
    method: 'post',
    data,
  });
}

/** 批量发送短信 */
export function fetchBatchSendSms(data: Api.System.BatchSendSmsParams) {
  return request<boolean>({
    url: '/system/sms/send/batch',
    method: 'post',
    data,
  });
}

/** 重发短信 */
export function fetchResendSms(logId: CommonType.IdType) {
  return request<boolean>({
    url: `/system/sms/send/resend/${logId}`,
    method: 'post',
  });
}
