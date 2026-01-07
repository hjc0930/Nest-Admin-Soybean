import { Module } from '@nestjs/common';
import { SmsLogController } from './sms-log.controller';
import { SmsLogService } from './sms-log.service';
import { SmsLogRepository } from './sms-log.repository';

@Module({
  controllers: [SmsLogController],
  providers: [SmsLogService, SmsLogRepository],
  exports: [SmsLogService, SmsLogRepository],
})
export class SmsLogModule {}
