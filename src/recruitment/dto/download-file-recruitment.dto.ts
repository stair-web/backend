import { ApiConsumes, ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { DownloadFileTypeRecruitmentEnum } from '../enum/download-file-type-recruitment.enum';

export class DownloadFileRecruitmentDto {
  @ApiProperty({ enum: DownloadFileTypeRecruitmentEnum })
  type: DownloadFileTypeRecruitmentEnum;
}
