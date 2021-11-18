import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsInt, IsNumber, ValidateIf } from 'class-validator';

export class AddUserRoleDto {

    @ValidateIf(v => (!v.username && !v.staffId) || v.uuid)
    @IsString()
    uuid: string;

    @ValidateIf(v => (!v.uuid && !v.staffId) ||  v.username)
    @IsString()
    @ApiProperty({ default: `email_${Date.now()}@ari.com.vn` })
    username: string;

    @ValidateIf(v => (!v.username && !v.uuid) || v.staffId)
    @IsString()
    staffId: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ default: `ADMIN` })
    roleCode: string;

}