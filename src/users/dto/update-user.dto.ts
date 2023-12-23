import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateUserDto {
    @ApiProperty({
        description: 'Логин пользователя',
        example: 'iAmACat',
    })
    @IsOptional()
    @IsString()
    @MaxLength(255)
    readonly username: string;

    @ApiProperty({
        description: 'Имя пользователя',
        example: 'Максим',
    })
    @IsOptional()
    @IsString()
    @MaxLength(255)
    readonly name: string;

    @ApiProperty({
        description: 'Фамилия пользователя',
        example: 'Задоркин',
    })
    @IsOptional()
    @IsString()
    @MaxLength(255)
    readonly surname: string;
}
