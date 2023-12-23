import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID, MaxLength } from 'class-validator';

export class UpdateProjectDto {
    @ApiProperty({
        description: 'ID проекта в формате uuid',
        example: '89c018cc-8a77-4dbd-94e1-dbaa710a2a9c',
    })
    @IsNotEmpty()
    @IsString()
    @IsUUID()
    id: string;

    @ApiProperty({ description: 'Название проекта' })
    @IsNotEmpty()
    @MaxLength(255)
    @IsString()
    name: string;
}
