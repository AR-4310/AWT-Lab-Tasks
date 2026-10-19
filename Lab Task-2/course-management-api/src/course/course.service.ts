import { Injectable } from '@nestjs/common';
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
}