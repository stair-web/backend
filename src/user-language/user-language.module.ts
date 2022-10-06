import { Module } from '@nestjs/common';
import { UserLanguageService } from './user-language.service';
import { UserLanguageController } from './user-language.controller';

@Module({
  controllers: [UserLanguageController],
  providers: [UserLanguageService]
})
export class UserLanguageModule {}
