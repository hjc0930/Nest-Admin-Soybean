import { Module } from '@nestjs/common';
import { SmsChannelModule } from './channel/sms-channel.module';
import { SmsTemplateModule } from './template/sms-template.module';
import { SmsSendModule } from './send/sms-send.module';
import { SmsLogModule } from './log/sms-log.module';

@Module({
  imports: [SmsChannelModule, SmsTemplateModule, SmsSendModule, SmsLogModule],
  exports: [SmsChannelModule, SmsTemplateModule, SmsSendModule, SmsLogModule],
})
export class SmsModule {}
