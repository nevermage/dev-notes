import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateUpdateNoteDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(100)
    title: string;

    @IsString()
    @IsNotEmpty()
    content: string;
}
