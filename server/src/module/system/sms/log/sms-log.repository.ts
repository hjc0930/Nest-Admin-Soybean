import { Injectable } from '@nestjs/common';
import { Prisma, SysSmsLog } from '@prisma/client';
import { PrismaService } from 'src/infrastructure/prisma';

/**
 * 短信日志仓储层
 */
@Injectable()
export class SmsLogRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 创建短信日志
   */
  async create(data: Prisma.SysSmsLogCreateInput): Promise<SysSmsLog> {
    return this.prisma.sysSmsLog.create({ data });
  }

  /**
   * 更新短信日志
   */
  async update(id: bigint, data: Prisma.SysSmsLogUpdateInput): Promise<SysSmsLog> {
    return this.prisma.sysSmsLog.update({
      where: { id },
      data,
    });
  }

  /**
   * 根据ID查询
   */
  async findById(id: bigint): Promise<SysSmsLog | null> {
    return this.prisma.sysSmsLog.findUnique({
      where: { id },
    });
  }

  /**
   * 分页查询短信日志列表
   */
  async findPageWithFilter(
    where: Prisma.SysSmsLogWhereInput,
    skip: number,
    take: number,
  ): Promise<{ list: SysSmsLog[]; total: number }> {
    const [list, total] = await this.prisma.$transaction([
      this.prisma.sysSmsLog.findMany({
        where,
        skip,
        take,
        orderBy: { sendTime: 'desc' },
      }),
      this.prisma.sysSmsLog.count({ where }),
    ]);

    return { list, total };
  }

  /**
   * 根据手机号查询日志
   */
  async findByMobile(mobile: string, limit: number = 10): Promise<SysSmsLog[]> {
    return this.prisma.sysSmsLog.findMany({
      where: { mobile },
      orderBy: { sendTime: 'desc' },
      take: limit,
    });
  }

  /**
   * 根据API发送编码查询
   */
  async findByApiSendCode(apiSendCode: string): Promise<SysSmsLog | null> {
    return this.prisma.sysSmsLog.findFirst({
      where: { apiSendCode },
    });
  }

  /**
   * 统计发送状态
   */
  async countByStatus(sendStatus: number): Promise<number> {
    return this.prisma.sysSmsLog.count({
      where: { sendStatus },
    });
  }
}
