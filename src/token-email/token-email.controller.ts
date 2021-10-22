import { Controller } from '@nestjs/common';
import { TokenEmailService } from './token-email.service';

@Controller('token-email')
export class TokenEmailController {
  constructor(private readonly tokenEmailService: TokenEmailService) {}
}
