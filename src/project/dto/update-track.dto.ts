import {
    IsBoolean,
    IsEnum,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    IsUUID,
} from 'class-validator';
import { TrackColor } from '../entities/track';

export class UpdateTrackDto {
    @IsString()
    @IsUUID()
    @IsNotEmpty()
    id: string;

    @IsOptional()
    @IsString()
    name: string;

    @IsOptional()
    @IsEnum(TrackColor)
    color: TrackColor;

    @IsOptional()
    @IsBoolean()
    mute: boolean;

    @IsOptional()
    @IsNumber()
    // // todo: between -100 100
    pan: number;

    @IsOptional()
    @IsNumber()
    // // todo: between 0-1
    volume: number;
}
