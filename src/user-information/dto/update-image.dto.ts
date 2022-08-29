  import { ApiProperty } from '@nestjs/swagger';
  export class UpdateImageDto {
    
    @ApiProperty({ default: `https://picsum.photos/200` })
    profilePhotoKey: string;
  
  
  }
  