import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailController } from './email.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  controllers: [EmailController],
  providers: [EmailService,ConfigService],
  exports:[EmailService,
  ]
})
export class EmailModule {}
