import { Module } from '@nestjs/common';
import { MailLogService } from './mail-log.service';
import { MailLogController } from './mail-log.controller';
import { MailLogRepository } from './mail-log.repository';

@Module({
  controllers: [MailLogController],
  providers: [MailLogService, MailLogRepository],
  exports: [MailLogService, MailLogRepository],
})
export class MailLogModule {}
