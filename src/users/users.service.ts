import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    async getMe(userId: string): Promise<User> {
        const user = await this.userRepository.findOne({
            where: {
                id: userId,
            },
        });

        if (!user) {
            throw new BadRequestException('Пользователь не найден');
        }

        return user;
    }

    async updateUser(
        userId: string,
        updateUserDto: UpdateUserDto,
    ): Promise<User> {
        await this.getMe(userId);

        const user = new User();
        user.id = userId;
        user.username = updateUserDto.username;
        user.name = updateUserDto.name;
        user.surname = updateUserDto.surname;
        await this.userRepository.save(user);
        return this.getMe(userId);
    }

    async getByUsername(username: string): Promise<User> {
        const user = await this.userRepository.findOne({
            where: { username },
        });
        if (!user) {
            throw new BadRequestException('Пользователь не найден');
        }

        return user;
    }
}
