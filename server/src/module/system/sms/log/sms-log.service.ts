import { Injectable } from '@nestjs/common';
import { SmsLogRepository } from './sms-log.repository';
import { ListSmsLogDto } from './dto';
import { Result } from 'src/shared/response';

@Injectable()
export class SmsLogService {
  constructor(private readonly smsLogRepository: SmsLogRepository) {}

  /**
   * 分页查询短信日志列表
   */
  async findAll(query: ListSmsLogDto) {
    const { pageNum = 1, pageSize = 10, mobile, channelId, templateId, sendStatus, beginTime, endTime } = query;

    const where: Record<string, any> = {};

    if (mobile) {
      where.mobile = { contains: mobile };
    }
    if (channelId) {
      where.channelId = channelId;
    }
    if (templateId) {
      where.templateId = templateId;
    }
    if (sendStatus !== undefined) {
      where.sendStatus = sendStatus;
    }
    if (beginTime || endTime) {
      where.sendTime = {};
      if (beginTime) {
        where.sendTime.gte = new Date(beginTime);
      }
      if (endTime) {
        where.sendTime.lte = new Date(endTime);
      }
    }

    const skip = (pageNum - 1) * pageSize;
    const { list, total } = await this.smsLogRepository.findPageWithFilter(where, skip, pageSize);

    return Result.ok({
      rows: list,
      total,
    });
  }

  /**
   * 根据ID查询短信日志详情
   */
  async findOne(id: bigint) {
    const log = await this.smsLogRepository.findById(id);
    return Result.ok(log);
  }

  /**
   * 根据手机号查询日志
   */
  async findByMobile(mobile: string, limit: number = 10) {
    const logs = await this.smsLogRepository.findByMobile(mobile, limit);
    return Result.ok(logs);
  }
}
