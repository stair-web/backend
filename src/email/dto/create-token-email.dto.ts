import { IsNumber, IsString } from 'class-validator';
import { TokenEmailType } from 'src/common/enum/token-email-type.enum';

export class CreateTokenEmailDto {
  @IsNumber()
  userId: number;

  @IsString()
  token: string;

  @IsString()
  type: TokenEmailType;
}
