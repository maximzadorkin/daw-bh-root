import { IsBoolean, IsEnum, IsNumber, IsString } from 'class-validator';
import { TrackColor } from '../entities/track';

export class CreateTrackDto {
    @IsString()
    name: string;

    @IsEnum(TrackColor)
    color: TrackColor;

    @IsBoolean()
    mute: boolean;

    @IsNumber()
    // todo: between -100 100
    pan: number;

    @IsNumber()
    // todo: between 0-1
    volume: number;
}
