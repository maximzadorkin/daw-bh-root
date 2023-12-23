import { CurrentUser } from '@__decorators__/CurrentUser';
import { Body, Controller, Get, Put } from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiOkResponse,
    ApiTags,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @ApiUnauthorizedResponse({ description: 'Unauthorized' })
    @ApiOkResponse({
        description: 'Получить данные пользователя, вошедшего в систему',
        type: User,
    })
    @ApiBearerAuth()
    @Get('me')
    async getMe(@CurrentUser('id') userId: string): Promise<User> {
        return this.usersService.getMe(userId);
    }

    @ApiUnauthorizedResponse({ description: 'Unauthorized' })
    @ApiOkResponse({
        description: 'Обновить данные пользователя',
        type: User,
    })
    @ApiBearerAuth()
    @Put('me')
    async updateUser(
        @CurrentUser('id') userId: string,
        @Body() updateUserDto: UpdateUserDto,
    ): Promise<User> {
        return this.usersService.updateUser(userId, updateUserDto);
    }
}
