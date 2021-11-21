import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { randomCharacter } from 'src/common/utils/random-character.util';

const code = randomCharacter(4);
export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({default:`Category ${code}`})
  categoryName: string;

  uuid:string;
}
