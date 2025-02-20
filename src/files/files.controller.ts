import { Controller, Get, Param, Post, Response, UploadedFiles } from '@nestjs/common';
import { FilesService } from './files.service';
import { ResponseEntity } from 'src/lib/response/response-entity';
import { S3Service } from 'src/aws/s3/s3.service';
import { FILE_SIZE } from 'src/constants/file';
import { FileValidationPipe } from 'src/pipes/file.validator.pipe';
import { ApiTags } from '@nestjs/swagger';
import { FileGet, FileLocalPost, FileS3Post } from './doc/files.doc';

@ApiTags('File')
@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly s3Service: S3Service,
  ) {}

  @Post('/upload-local')
  @FileLocalPost()
  async uploadLocal(
    @UploadedFiles(new FileValidationPipe(FILE_SIZE, 3, /image\/(jpeg|png)|application\/pdf/))
    files: Array<Express.Multer.File>,
  ): Promise<ResponseEntity<string[]>> {
    const result = await this.filesService.uploadLocal(files);

    return ResponseEntity.OK(result);
  }

  @Post('/upload-s3')
  @FileS3Post()
  async uploadS3(
    @UploadedFiles(new FileValidationPipe(FILE_SIZE, 3, /image\/(jpeg|png)|application\/pdf/))
    files: Array<Express.Multer.File>,
  ): Promise<ResponseEntity<string[]>> {
    const result = await this.filesService.uploadS3(files);

    return ResponseEntity.OK(result);
  }

  @FileGet()
  @Get('/local/:filename')
  async getLocalFile(@Param('filename') filename: string, @Response() res) {
    const fileStream = await this.filesService.getFile(filename);
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    fileStream.pipe(res);
  }

  @FileGet()
  @Get('/s3/:filename')
  async getS3File(@Param('filename') filename: string, @Response() res) {
    const fileStream = await this.s3Service.getItemInBucket(filename);
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    fileStream.pipe(res);
  }
}
