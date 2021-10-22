import { Test, TestingModule } from '@nestjs/testing';
import { TokenEmailService } from './token-email.service';

describe('TokenEmailService', () => {
  let service: TokenEmailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TokenEmailService],
    }).compile();

    service = module.get<TokenEmailService>(TokenEmailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
