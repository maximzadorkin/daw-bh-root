import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength } from 'class-validator';

export class SignInDto {
    @ApiProperty({
        description: 'Пароль пользователя',
        example: '1234',
    })
    @IsNotEmpty()
    readonly password: string;
    @ApiProperty({
        description: 'Логин пользователя',
        example: 'iAmACat',
    })
    @MaxLength(255)
    @IsNotEmpty()
    readonly username: string;
}
