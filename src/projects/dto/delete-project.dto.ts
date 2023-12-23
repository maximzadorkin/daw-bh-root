import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class DeleteProjectDto {
    @ApiProperty({ description: 'UID проекта' })
    @IsNotEmpty()
    readonly id: string;
}
