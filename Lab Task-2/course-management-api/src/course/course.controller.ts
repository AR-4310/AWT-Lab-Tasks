import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Patch,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  Query,
  Res,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';
import { promises as fs } from 'fs';
import { randomUUID } from 'crypto';
import { extname } from 'path';
import type { Express } from 'express';

import { CourseService } from './course.service.js';
import { CreateCourseDto } from './dto/create-course.dto.js';
import { UpdateCourseDto } from './dto/update-course.dto.js';
import type { Response } from 'express';

@Controller('course')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Get()
  getAllCourses() {
    return this.courseService.getAllCourses();
  }

  @Get(':id')
  getCourseById(@Param('id') id: string) {
    return this.courseService.getCoursesById(id);
  }

  @Post()
  createCourse(@Body() course: CreateCourseDto) {
    console.log(course);
    return this.courseService.createCourse(course);
  }

  @Put(':id')
  updateCourse(
    @Param('id') id: string,
    @Body() course: UpdateCourseDto,
  ) {
    console.log(course);
    return this.courseService.updateCourse(id, course);
  }

  @Patch(':id')
  updateCoursePartially(
    @Param('id') id: string,
    @Body() course: UpdateCourseDto,
  ) {
    console.log(course);
    return this.courseService.patchCourse(id, course);
  }

  @Delete(':id')
  deleteCourse(@Param('id') id: string) {
    return this.courseService.deleteCourse(id);
  }

  @Post(':id/upload')
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: (req, file, cb) => {
        const extension = extname(file.originalname).toLowerCase();
        const allowed = ['.jpg', '.jpeg', '.png', '.pdf'];

        if (!allowed.includes(extension)) {
          return cb(
            new BadRequestException(
              'Only .jpg, .jpeg, .png and .pdf files are allowed',
            ),
            false,
          );
        }

        cb(null, true);
      },
    }),
  )
  async uploadCourseMaterial(
    @Param('id') id: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 1024 * 1024 * 2,
          }),
          new FileTypeValidator({
            fileType: /^(image\/jpeg|image\/png|application\/pdf)$/,
          }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    const folder = './src/uploads';

    await fs.mkdir(folder, { recursive: true });

    const fileName =
      randomUUID() + extname(file.originalname).toLowerCase();

    const path = `${folder}/${fileName}`;

    await fs.writeFile(path, file.buffer);

    console.log(file.originalname);
    console.log(file.mimetype);
    console.log(file.size);

    return {
      message: 'Material uploaded successfully',
      courseId: id,
      filename: fileName,
      path,
    };
  }

@Get('file-download/download/download')
fileDownload(
  @Query('fileName') fileName: string,
  @Res() res: Response,
) {
  if (!fileName) {
    throw new BadRequestException('fileName is required');
  }

  return res.sendFile(fileName, { root: './src/uploads' });
}
}