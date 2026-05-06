import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class SearchNotesDto{
    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    query: string;
}