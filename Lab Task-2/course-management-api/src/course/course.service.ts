import { Injectable } from '@nestjs/common';
import type { Express } from 'express';
import { promises as fs } from 'fs';
import { randomUUID } from 'crypto';
import { extname } from 'path';

import { CreateCourseDto } from './dto/create-course.dto.js';
import { UpdateCourseDto } from './dto/update-course.dto.js';

@Injectable()
export class CourseService {
  getAllCourses() {
    return {
      message: 'All courses fetched successfully',
      data: [],
    };
  }

  getCoursesById(id: string) {
    return {
      message: 'Course fetched successfully',
      id,
    };
  }

  createCourse(course: CreateCourseDto) {
    return {
      message: 'Course created successfully',
      data: course,
    };
  }

  updateCourse(id: string, course: UpdateCourseDto) {
    return {
      message: 'Course updated successfully',
      id,
      data: course,
    };
  }

  patchCourse(id: string, course: UpdateCourseDto) {
    return {
      message: 'Course patched successfully',
      id,
      updatedFields: Object.keys(course).filter(
        (key) => course[key as keyof UpdateCourseDto] !== undefined,
      ),
    };
  }

  deleteCourse(id: string) {
    return {
      message: 'Course deleted successfully',
      id,
    };
  }

  async uploadCourseMaterial(id: string, file: Express.Multer.File) {
    const folder = './src/uploads';

    await fs.mkdir(folder, { recursive: true });

    const extension = extname(file.originalname).toLowerCase();
    const fileName = randomUUID() + extension;
    const path = `${folder}/${fileName}`;

    await fs.writeFile(path, file.buffer);

    return {
      message: 'Material uploaded successfully',
      courseId: id,
      filename: fileName,
      path,
    };
  }
}