import { UploadedFileCandidateDto } from './dto/upload-file-candidate.dto';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  Res,
  Query,
  Put,
} from '@nestjs/common';
import {
  FileFieldsInterceptor,
  FilesInterceptor,
} from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  editCandidateFileName,
  filterCandidateFile,
} from 'src/common/util/file-upload.util';
import { Connection } from 'typeorm';
import { CandidateService } from './candidate.service';
import { CreateCandidateDto } from './dto/create-candidate.dto';
import { UpdateCandidateDto } from './dto/update-candidate.dto';
import { diskStorage } from 'multer';
import { Express } from 'express';
import { GetAllCandidateDto } from './dto/get-all-candidate.dto';
import { DownloadFileCandidateDto } from './dto/download-file-candidate.dto';

@ApiTags('Candidate')
@Controller('candidate')
export class CandidateController {
  constructor(
    private candidateService: CandidateService,
    private connection: Connection,
  ) {}

  @Post()
  @ApiResponse({
    status: 500,
    description: 'Lỗi hệ thống trong quá trình tạo Candidate.',
  })
  @ApiOperation({ summary: 'Tạo Candidate.' })
  @ApiResponse({ status: 201, description: 'Tạo Candidate thành công' })
  async createCandidate(@Body() createCandidateDto: CreateCandidateDto) {
    return await this.connection.transaction((transactionManager) => {
      return this.candidateService.createCandidate(
        transactionManager,
        createCandidateDto,
      );
    });
  }

  @Post('upload-file')
  @ApiResponse({
    status: 500,
    description: 'Lỗi hệ thống trong quá trình upload file.',
  })
  @ApiOperation({ summary: 'Upload File.' })
  @ApiResponse({ status: 201, description: 'Upload File thành công' })
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        {
          name: 'coverletter',
        },
        {
          name: 'resume',
        },
      ],
      {
        storage: diskStorage({
          destination: process.env.UPLOAD_FILE_FOLDER,
          filename: editCandidateFileName,
        }),
        fileFilter: filterCandidateFile,
      },
    ),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        uuid: {
          type: 'string',
        },
        resume: {
          type: 'string',
          format: 'binary',
        },
        coverletter: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async uploadCandidateFile(
    @UploadedFiles()
    files: {
      coverletter?: Express.Multer.File;
      resume?: Express.Multer.File;
    },
    @Body() uploadedFileCandidateDto: UploadedFileCandidateDto,
  ) {
    return await this.connection.transaction((transactionManager) => {
      return this.candidateService.uploadCandidateFile(
        transactionManager,
        uploadedFileCandidateDto,
        files,
      );
    });
  }

  @Get('download/:uuid')
  async seeUploadedFile(@Param('uuid') uuid,@Query()downloadFileCandidateDto: DownloadFileCandidateDto, @Res() res) {
    return await this.connection.transaction((transactionManager) => {
      return this.candidateService.downloadCandidateFile(
        transactionManager,
        downloadFileCandidateDto,
        uuid,
        res
      );
    });
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Lấy danh sách ứng viên thành công.',
  })
  @ApiOperation({ summary: 'Danh sách Candidate' })
  async getAll(@Query() getAllCandidateDto: GetAllCandidateDto) {
    return await this.connection.transaction((transactionManager) => {
      return this.candidateService.getAll(transactionManager, getAllCandidateDto);
    });
  }
  
  @Put('/:uuid')
  @ApiResponse({
    status: 500,
    description: 'Lỗi hệ thống trong quá trình cập nhật ứng viên.',
  })
  @ApiOperation({ summary: 'Cập nhật bài viết.' })
  @ApiResponse({ status: 201, description: 'Cập nhật ứng viên thành công' })
  async update(@Body() updateCandidateDto: UpdateCandidateDto, @Param('uuid') uuid: string) {
    return await this.connection.transaction((transactionManager) => {
      return this.candidateService.updateCandidate(transactionManager, updateCandidateDto, uuid);
    });
  }

  @Delete('/:uuid')
  @ApiResponse({
    status: 500,
    description: 'Lỗi hệ thống trong quá trình xoá ứng viên.',
  })
  @ApiOperation({ summary: 'Xoá ứng viên.' })
  @ApiResponse({ status: 201, description: 'Xoá ứng viên thành công' })
  async delete( @Param('uuid') uuid: string) {
    return await this.connection.transaction((transactionManager) => {
      return this.candidateService.deleteCandidate(transactionManager, uuid);
    });
  }
}