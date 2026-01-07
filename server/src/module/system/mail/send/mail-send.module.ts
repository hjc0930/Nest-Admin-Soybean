import { Module } from '@nestjs/common';
import { MailSendService } from './mail-send.service';
import { MailSendController } from './mail-send.controller';
import { MailTemplateModule } from '../template/mail-template.module';
import { MailAccountModule } from '../account/mail-account.module';
import { MailLogRepository } from '../log/mail-log.repository';

@Module({
  imports: [MailTemplateModule, MailAccountModule],
  controllers: [MailSendController],
  providers: [MailSendService, MailLogRepository],
  exports: [MailSendService, MailLogRepository],
})
export class MailSendModule {}
