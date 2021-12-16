import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { CreateTeamDto } from './create-team.dto';

export class UpdateTeamDto extends PartialType(CreateTeamDto) {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ default: `${Date.now()}` })
    uuid: string;
    
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ default: `name${Date.now()}` })
    name: string;
}
