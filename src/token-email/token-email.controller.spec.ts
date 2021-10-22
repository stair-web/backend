import { Test, TestingModule } from '@nestjs/testing';
import { TokenEmailController } from './token-email.controller';
import { TokenEmailService } from './token-email.service';

describe('TokenEmailController', () => {
  let controller: TokenEmailController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TokenEmailController],
      providers: [TokenEmailService],
    }).compile();

    controller = module.get<TokenEmailController>(TokenEmailController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
