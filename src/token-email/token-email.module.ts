import { Module } from '@nestjs/common';
import { TokenEmailService } from './token-email.service';
import { TokenEmailController } from './token-email.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokenEmailRepository } from './token-email.repository';

@Module({
  imports: [TypeOrmModule.forFeature([TokenEmailRepository])],
  controllers: [TokenEmailController],
  providers: [TokenEmailService],
  exports: [TokenEmailService],

})
export class TokenEmailModule {}
