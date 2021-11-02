import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsInt, IsNumber } from 'class-validator';
import { randomCharacter } from 'src/common/util/random-character';

const code = randomCharacter(4);
export class AddRoleDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({ default: `role_${code}` })
    roleCode: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ default: `Role ${code}` })
    roleName: string;

    @IsString()
    @ApiProperty({ default: `Description role ${code} ${Date.now()}` })
    roleDescription: string;

}