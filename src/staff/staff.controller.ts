/*
https://docs.nestjs.com/controllers#controllers
*/

import { UseGuards } from '@nestjs/common';
import { Get } from '@nestjs/common';
import { Query } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RolesGuard } from 'src/guards/roles.guard';
import { Connection } from 'typeorm';
import { StaffService } from './staff.service';

@Controller()
export class StaffController {
    constructor(
        private connection: Connection,
        private readonly StaffServics: StaffService,
    ) {}
}
