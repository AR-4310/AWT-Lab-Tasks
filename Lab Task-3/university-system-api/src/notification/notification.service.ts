import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { EnrollmentService } from '../enrollment/enrollment.service.js';

type WrapperType<T> = T;

@Injectable()
export class NotificationService {
  constructor(
    @Inject(forwardRef(() => EnrollmentService))
    private readonly enrollmentService: WrapperType<EnrollmentService>,
  ) {}

  sendNotification(studentName: string, message: string) {
    return {
      message: 'Notification sent successfully',
      data: {
        studentName,
        message,
      },
    };
  }

  checkEnrollmentAndNotify(studentName: string, courseId: string) {
    const enrollments = this.enrollmentService.getEnrollments();

    const notification = this.sendNotification(
      studentName,
      `Enrollment information requested for course ${courseId}.`,
    );

    return {
      message: 'Enrollment information fetched and notification sent',
      student: studentName,
      courseId,
      enrollments,
      notification,
    };
  }
}