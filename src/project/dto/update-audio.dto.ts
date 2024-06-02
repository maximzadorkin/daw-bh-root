import {
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    IsUUID,
} from 'class-validator';

export class UpdateAudioDto {
    @IsNotEmpty()
    @IsUUID()
    @IsString()
    id: string;

    @IsOptional()
    @IsString()
    trackId: string;

    @IsOptional()
    @IsNumber()
    offset: number;
}
