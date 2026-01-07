import { Module } from '@nestjs/common';
import { NotifyTemplateModule } from './template/notify-template.module';
import { NotifyMessageModule } from './message/notify-message.module';

@Module({
  imports: [NotifyTemplateModule, NotifyMessageModule],
  exports: [NotifyTemplateModule, NotifyMessageModule],
})
export class NotifyModule {}
