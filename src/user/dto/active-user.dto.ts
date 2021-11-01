import { IsNotEmpty, IsString } from 'class-validator';

export class AcitveUserDto {
  @IsString()
  @IsNotEmpty()
  token: string;
}
