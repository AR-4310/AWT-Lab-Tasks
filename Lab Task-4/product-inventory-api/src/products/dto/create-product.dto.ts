import {Type} from 'class-transformer';
import {
   IsString,
   IsNotEmpty,
   IsOptional,
   IsNumber,
   IsPositive,
   IsInt,
   Min,
   IsBoolean,
} from 'class-validator';

export class CreateProductDto{
    @IsString()
    @IsNotEmpty()
    name : string;

    @IsString()
    @IsOptional()
    description : string;

    @IsNumber()
    @IsPositive()
    @Type(()=> Number)
    price : number;

    @IsInt()
    @Min(0)
    @IsOptional()
    @Type(()=>Number)
    stock : number;

    @IsString()
    @IsNotEmpty()
    category : string;

    @IsBoolean()
    @IsOptional()
    isActive : boolean;



}