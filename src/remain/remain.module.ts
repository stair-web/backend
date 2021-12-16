import { RemainService } from './remain.service';
import { RemainController } from './remain.controller';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';

@Module({
    imports: [],
    controllers: [
        RemainController, ],
    providers: [
        RemainService, ],
})
export class RemainModule {}
