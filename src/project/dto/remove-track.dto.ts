import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class RemoveTrackDto {
    @IsString()
    @IsUUID()
    @IsNotEmpty()
    id: string;
}
