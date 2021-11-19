import { ApiConsumes, ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { DownloadFileTypeCandidateEnum } from '../enum/DownloadFile.enum';

export class DownloadFileCandidateDto {
  @ApiProperty({ enum: DownloadFileTypeCandidateEnum })
  type: DownloadFileTypeCandidateEnum;
}
