import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  Min,
  Max,
} from 'class-validator';

export class CreateCourseDto {
  @IsString()
  @IsNotEmpty({
    message: 'Course name cannot be empty',
  })
  @Matches(/\S/, {
    message: 'Course name cannot contain only spaces',
  })
  name: string;

  @IsString()
  @IsNotEmpty({
    message: 'Course code cannot be empty',
  })
  code: string;

  @IsString()
  @IsNotEmpty({
    message: 'Instructor name cannot be empty',
  })
  @Matches(/\S/, {
    message: 'Instructor name cannot contain only spaces',
  })
  instructor: string;

  @IsNumber()
  @IsNotEmpty({
    message: 'Credits are required',
  })
  @Min(1)
  @Max(6)
  @Type(() => Number)
  credits: number;

  @IsOptional()
  @IsString()
  description?: string;
}