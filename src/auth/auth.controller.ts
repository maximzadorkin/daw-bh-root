import { CurrentUser } from '@__decorators__/CurrentUser';
import { Public } from '@__decorators__/Public';
import {
    Controller,
    Post,
    Body,
    HttpCode,
    HttpStatus,
    Put,
} from '@nestjs/common';
import {
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiConflictResponse,
    ApiCreatedResponse,
    ApiOkResponse,
    ApiTags,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { User } from '@app/users/entities/user.entity';
import { AuthService } from './auth.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @ApiBadRequestResponse({
        description: 'Ошибка заполнения',
    })
    @ApiOkResponse({ description: 'Пользователь успешно вошел в систему' })
    @HttpCode(HttpStatus.OK)
    @Public()
    @Post('sign-in')
    private signIn(
        @Body() signInDto: SignInDto,
    ): Promise<{ accessToken: string }> {
        return this.authService.signIn(signInDto);
    }

    @ApiOkResponse({ description: 'Пользователь успешно вышел из системы' })
    @ApiUnauthorizedResponse({ description: 'Пользователь не авторизован' })
    @ApiBearerAuth()
    @HttpCode(HttpStatus.OK)
    @Post('sign-out')
    private signOut(@CurrentUser('id') userId: string): Promise<void> {
        return this.authService.signOut(userId);
    }

    @ApiConflictResponse({
        description: 'Пользователь уже существует',
    })
    @ApiBadRequestResponse({
        description: 'Ошибка заполнения',
    })
    @ApiCreatedResponse({
        description: 'Пользователь успешно зарегистрировался',
    })
    @Public()
    @Post('sign-up')
    private signUp(@Body() signUpDto: SignUpDto): Promise<void> {
        return this.authService.signUp(signUpDto);
    }

    @ApiUnauthorizedResponse({ description: 'Unauthorized' })
    @ApiOkResponse({
        description: 'Изменить пароль пользователя',
        type: User,
    })
    @ApiBearerAuth()
    @Put('password')
    async changePassword(
        @CurrentUser('id') userId: string,
        @Body() changePasswordDto: ChangePasswordDto,
    ): Promise<void> {
        return this.authService.changePassword(userId, changePasswordDto);
    }
}
