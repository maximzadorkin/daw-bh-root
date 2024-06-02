import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateAudioDto {
    @IsString()
    @IsNotEmpty()
    trackId: string;

    @IsNotEmpty()
    @IsNumber()
    offset: number;
}
