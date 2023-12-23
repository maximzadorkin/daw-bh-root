import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Matches, MaxLength, MinLength } from 'class-validator';
import { Match } from '@__decorators__/match';
import { Column } from 'typeorm';

export class SignUpDto {
    @ApiProperty({
        description: 'Логин пользователя',
        example: 'iAmACat',
    })
    @MaxLength(255)
    @IsNotEmpty()
    readonly username: string;

    @ApiProperty({
        description: 'Пароль пользователя',
        example: '1234',
    })
    @MinLength(8, {
        message: 'Пароль слишком короткий',
    })
    @MaxLength(20, {
        message: 'Пароль слишком длинный',
    })
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'Пароль слишком слабый',
    })
    @IsNotEmpty()
    readonly password: string;

    @ApiProperty({
        description: 'Повторите то же значение, что и в поле пароль',
        example: '1234',
    })
    @Match('password')
    @IsNotEmpty()
    readonly passwordConfirm: string;

    @Column()
    @MaxLength(255)
    @IsNotEmpty()
    @ApiProperty({
        description: 'Имя пользователя',
        example: 'Максим',
    })
    name: string;

    @Column()
    @MaxLength(255)
    @IsNotEmpty()
    @ApiProperty({
        description: 'Имя пользователя',
        example: 'Задоркин',
    })
    surname: string;
}
