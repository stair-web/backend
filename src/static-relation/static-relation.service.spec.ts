import { Test, TestingModule } from '@nestjs/testing';
import { StaticRelationService } from './static-relation.service';

describe('StaticRelationService', () => {
  let service: StaticRelationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StaticRelationService],
    }).compile();

    service = module.get<StaticRelationService>(StaticRelationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
