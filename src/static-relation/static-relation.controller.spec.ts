import { Test, TestingModule } from '@nestjs/testing';
import { StaticRelationController } from './static-relation.controller';
import { StaticRelationService } from './static-relation.service';

describe('StaticRelationController', () => {
  let controller: StaticRelationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StaticRelationController],
      providers: [StaticRelationService],
    }).compile();

    controller = module.get<StaticRelationController>(StaticRelationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
