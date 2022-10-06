import { Controller } from '@nestjs/common';
import { UserLanguageService } from './user-language.service';

@Controller('user-language')
export class UserLanguageController {
  constructor(private readonly userLanguageService: UserLanguageService) {}
}
