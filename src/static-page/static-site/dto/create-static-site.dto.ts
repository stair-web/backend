import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { StaticSection } from 'src/static-section/static-section.entity';
export class CreateStaticSiteDto {
  uuid?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  title: string;

  listSection:StaticSection[];

}
