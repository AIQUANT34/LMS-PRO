import { IsOptional, IsString, IsNumber } from "class-validator";

export class SubmitAssessmentDto {

    @IsOptional()
    @IsString()
    fileUrl?:string;

    @IsOptional()
    @IsString()
    textAnswer?: string;

}

export class ReviewSubmissionDto {

    @IsNumber()
    score: number;

    @IsOptional()
    @IsString()
    feedback?: string;
    
}