import { UploadFileRecruitmentDto } from './dto/upload-file-recruitment.dto';
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
} from 'src/common/utils/file-upload.util';
import { Connection } from 'typeorm';
import { RecruitmentService } from './recruitment.service';
import { CreateRecruitmentDto } from './dto/create-recruitment.dto';
import { diskStorage } from 'multer';
import { Express } from 'express';
import { DownloadFileRecruitmentDto } from './dto/download-file-recruitment.dto';
import { GetAllRecruitmentDto } from './dto/get-all-recruitment.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Recruitment')
@Controller('recruitment')
export class RecruitmentController {
  constructor(
    private recruitmentService: RecruitmentService,
    private connection: Connection,
  ) {}

  @Post()
  @ApiResponse({
    status: 500,
    description: 'Lỗi hệ thống trong quá trình tạo Recruitment.',
  })
  @ApiOperation({ summary: 'Tạo Recruitment.' })
  @ApiResponse({ status: 201, description: 'Tạo Recruitment thành công' })
  @UseInterceptors(
    FileFieldsInterceptor(
      [
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
        firstName: {
          type: 'string',
        },
        lastName: {
          type: 'string',
        },
        email: {
          type: 'string',
        },
        phoneNumber: {
          type: 'string',
        },
        position: {
          type: 'string',
        },
        address: {
          type: 'string',
        },
        resume: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async createRecruitment(
    @UploadedFiles()
    files: {
      resume?: Express.Multer.File;
    },
    @Body() createRecruitmentDto: CreateRecruitmentDto,
  ) {
    return await this.connection.transaction((transactionManager) => {
      return this.recruitmentService.createRecruitment(
        transactionManager,
        createRecruitmentDto,
        files,
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
  // @UseInterceptors(
  //   FileInterceptor('file', {
  //     storage: diskStorage({
  //       destination: process.env.UPLOAD_FILE_FOLDER,
  //       filename: editCandidateFileName,
  //     }),
  //     fileFilter: filterCandidateFile,
  //   }),
  // )
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
      },
    },
  })
  async uploadRecruitmentFile(
    @UploadedFiles()
    files: {
      resume?: Express.Multer.File;
    },
    @Body() uploadFileRecruitmentDto: UploadFileRecruitmentDto,
    // @Param('uuid') uuid: string,
  ) {
    return await this.connection.transaction((transactionManager) => {
      return this.recruitmentService.uploadRecruitemntFile(
        transactionManager,
        uploadFileRecruitmentDto,
        files,
      );
    });
  }

  @Get('download/:uuid')
  @ApiOperation({ summary: 'Tải file của ứng viên.' })
  @ApiResponse({
    status: 500,
    description: 'Lỗi hệ thống trong quá trình lấy thông tin ứng viên.',
  })
  async seeUploadedFile(
    @Param('uuid') uuid: string,
    @Query() downloadFileRecruitmentDto: DownloadFileRecruitmentDto,
    @Res() res,
  ) {
    return await this.connection.transaction((transactionManager) => {
      return this.recruitmentService.downloadRecruitmentFile(
        transactionManager,
        downloadFileRecruitmentDto,
        uuid,
        res,
      );
    });
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Lấy danh sách ứng tuyển thành công.',
  })
  @ApiOperation({ summary: 'Danh sách Recruitment' })
  async getAll(@Query() getAllRecruitmentDto: GetAllRecruitmentDto) {
    return await this.connection.transaction((transactionManager) => {
      return this.recruitmentService.getAll(
        transactionManager,
        getAllRecruitmentDto,
      );
    });
  }

  //   @Get('/:uuid')
  //   @ApiResponse({
  //     status: 500,
  //     description: 'Lỗi hệ thống trong quá trình lấy thông tin ứng viên.',
  //   })
  //   @ApiOperation({ summary: 'Lấy thông tin ứng viên.' })
  //   @ApiResponse({ status: 201, description: 'Lấy thông tin ứng viên thành công' })
  //   async getDetail(@Param('uuid') uuid: string) {
  //     return await this.connection.transaction((transactionManager) => {
  //       return this.candidateService.getDetailCandidate(transactionManager, uuid);
  //     });
  //   }

  //   @Put('/:uuid')
  //   @ApiResponse({
  //     status: 500,
  //     description: 'Lỗi hệ thống trong quá trình cập nhật ứng viên.',
  //   })
  //   @ApiOperation({ summary: 'Cập nhật ứng viên.' })
  //   @ApiResponse({ status: 201, description: 'Cập nhật ứng viên thành công' })
  //   async update(@Body() updateCandidateDto: UpdateCandidateDto, @Param('uuid') uuid: string) {
  //     return await this.connection.transaction((transactionManager) => {
  //       return this.candidateService.updateCandidate(transactionManager, updateCandidateDto, uuid);
  //     });
  //   }

  @Delete('/:uuid')
  @ApiResponse({
    status: 500,
    description: 'Lỗi hệ thống trong quá trình xoá ứng viên.',
  })
  @ApiOperation({ summary: 'Xoá ứng viên.' })
  @ApiResponse({ status: 201, description: 'Xoá ứng viên thành công' })
  async delete(@Param('uuid') uuid: string) {
    return await this.connection.transaction((transactionManager) => {
      return this.recruitmentService.deleteRecruitment(
        transactionManager,
        uuid,
      );
    });
  }
}
