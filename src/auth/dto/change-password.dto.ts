import { Match } from '@__decorators__/Match';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Matches, MaxLength, MinLength } from 'class-validator';

export class ChangePasswordDto {
    @ApiProperty({
        example: '1234',
        description: 'Новый пароль',
    })
    @IsNotEmpty()
    @MinLength(8, {
        message: 'Пароль слишком короткий',
    })
    @MaxLength(20, {
        message: 'Пароль слишком длинный',
    })
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'Пароль слишком слабый',
    })
    readonly newPassword: string;
    @ApiProperty({
        example: '1234',
        description: 'Новый пароль',
    })
    @IsNotEmpty()
    @Match('newPassword', { message: 'Пароли не совпадают' })
    readonly newPasswordConfirm: string;
    @ApiProperty({
        example: '1234',
        description: 'Текущий пароль',
    })
    @IsNotEmpty()
    readonly password: string;
}
