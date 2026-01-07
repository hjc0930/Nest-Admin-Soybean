import { Injectable } from '@nestjs/common';
import { Prisma, SysMailLog } from '@prisma/client';
import { PrismaService } from 'src/infrastructure/prisma';

/**
 * 邮件日志仓储层
 */
@Injectable()
export class MailLogRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 创建邮件日志
   */
  async create(data: Prisma.SysMailLogCreateInput): Promise<SysMailLog> {
    return this.prisma.sysMailLog.create({ data });
  }

  /**
   * 更新邮件日志
   */
  async update(id: bigint, data: Prisma.SysMailLogUpdateInput): Promise<SysMailLog> {
    return this.prisma.sysMailLog.update({
      where: { id },
      data,
    });
  }

  /**
   * 根据ID查询
   */
  async findById(id: bigint): Promise<SysMailLog | null> {
    return this.prisma.sysMailLog.findUnique({
      where: { id },
    });
  }

  /**
   * 分页查询邮件日志列表
   */
  async findPageWithFilter(
    where: Prisma.SysMailLogWhereInput,
    skip: number,
    take: number,
  ): Promise<{ list: SysMailLog[]; total: number }> {
    const [list, total] = await this.prisma.$transaction([
      this.prisma.sysMailLog.findMany({
        where,
        skip,
        take,
        orderBy: { sendTime: 'desc' },
      }),
      this.prisma.sysMailLog.count({ where }),
    ]);

    return { list, total };
  }

  /**
   * 根据收件人邮箱查询日志
   */
  async findByToMail(toMail: string, limit: number = 10): Promise<SysMailLog[]> {
    return this.prisma.sysMailLog.findMany({
      where: { toMail },
      orderBy: { sendTime: 'desc' },
      take: limit,
    });
  }

  /**
   * 根据模板编码查询日志
   */
  async findByTemplateCode(templateCode: string, limit: number = 10): Promise<SysMailLog[]> {
    return this.prisma.sysMailLog.findMany({
      where: { templateCode },
      orderBy: { sendTime: 'desc' },
      take: limit,
    });
  }

  /**
   * 统计发送状态
   */
  async countByStatus(sendStatus: number): Promise<number> {
    return this.prisma.sysMailLog.count({
      where: { sendStatus },
    });
  }
}
