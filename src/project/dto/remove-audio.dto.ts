import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class RemoveAudioDto {
    @IsString()
    @IsUUID()
    @IsNotEmpty()
    id: string;
}
