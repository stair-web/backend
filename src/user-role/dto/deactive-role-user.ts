import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsInt, IsNumber, ValidateIf } from 'class-validator';

export class DeactiveRoleUser {

    @IsString()
    @ApiProperty({ default: `1` })
    id: number;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ default: `ADMIN` })
    roleCode: string;

}