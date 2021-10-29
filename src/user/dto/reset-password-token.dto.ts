import {
    IsEmail,
    IsNotEmpty,
    IsString,
    Length,
    Matches,
} from 'class-validator';
import { TokenEmailType } from 'src/common/enum/token-email-type.enum';


export class ResetPasswordTokenDto {
    @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  timeStamp: string;

  @IsNotEmpty()
  isActive: boolean;

  @IsNotEmpty()
  uuid: string;

  type: TokenEmailType;
}

