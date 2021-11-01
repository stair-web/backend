import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsInt, IsNumber } from 'class-validator';

export class AddUserRoleDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({ default: `email_${Date.now()}@ari.com.vn` })
    username: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ default: `ADMIN` })
    roleCode: string;

}