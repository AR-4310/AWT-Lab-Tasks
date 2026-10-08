import { Injectable } from '@nestjs/common';

@Injectable()
export class CourseService {
    getAllCourses():string{
        return `Get all courses from services`;
    }

    getCoursesByID(id:string):string{
        return `Get course by ID: ${id} from service`;
    }

    createCourse():string{
        return `Create course from service`;
    }

    updateCourse(id:string):string{
        return `update course ${id} from service`;
    }

    patchCourse(id:string):string{
        return `Patch course ${id} from service`;
    }

    deleteCourse(id:string):string{
        return `Delete course ${id} from service`;
    }
}
