import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateProjectDto {
    @ApiProperty({
        example: 'Тестовый проект',
        description: 'Наименование проекта',
    })
    @MaxLength(255)
    @IsString()
    @IsNotEmpty()
    readonly name: string;
}
