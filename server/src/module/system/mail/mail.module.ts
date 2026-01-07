import { Module } from '@nestjs/common';
import { MailAccountModule } from './account/mail-account.module';
import { MailTemplateModule } from './template/mail-template.module';
import { MailSendModule } from './send/mail-send.module';
import { MailLogModule } from './log/mail-log.module';

@Module({
  imports: [MailAccountModule, MailTemplateModule, MailSendModule, MailLogModule],
  exports: [MailAccountModule, MailTemplateModule, MailSendModule, MailLogModule],
})
export class MailModule {}
