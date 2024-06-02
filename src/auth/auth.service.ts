import {
    BadRequestException,
    ConflictException,
    Inject,
    Injectable,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';
import { Repository } from 'typeorm';
import jwtConfig from '@app/__configuration__/jwt.config';
import { MysqlErrorCode } from '@app/database/error-codes.enum';
import { RedisService } from '@app/redis/redis.service';
import { User } from '@app/users/entities/user.entity';
import { CurrentUserData } from '@app/users/interfaces/current-user-data';
import { BcryptService } from './bcrypt.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';

@Injectable()
export class AuthService {
    constructor(
        @Inject(jwtConfig.KEY)
        private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
        private readonly bcryptService: BcryptService,
        private readonly jwtService: JwtService,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly redisService: RedisService,
    ) {}

    public async changePassword(
        userId: string,
        changePasswordDto: ChangePasswordDto,
    ): Promise<void> {
        const { password, newPassword } = changePasswordDto;
        const user = await this.userRepository.findOne({
            where: { id: userId },
        });

        if (!user) {
            throw new BadRequestException('Пользователя не существует');
        }

        const isCurrentPasswordMatch = await this.bcryptService.compare(
            password,
            user.password,
        );
        if (!isCurrentPasswordMatch) {
            throw new BadRequestException('Неверный пароль');
        }

        try {
            const user = new User();
            user.id = userId;
            user.password = await this.bcryptService.hash(newPassword);
            await this.userRepository.save(user);
        } catch (error) {
            if (error.code === MysqlErrorCode.UniqueViolation) {
                throw new ConflictException(`Что-то пошло не так`);
            }
            throw error;
        }
    }

    async generateAccessToken(
        user: Partial<User>,
    ): Promise<{ accessToken: string }> {
        const tokenId = randomUUID();
        await this.redisService.insert(`user-${user.id}`, tokenId);

        const accessToken = await this.jwtService.signAsync(
            {
                id: user.id,
                username: user.username,
                tokenId,
            } as CurrentUserData,
            {
                secret: this.jwtConfiguration.secret,
                expiresIn: this.jwtConfiguration.accessTokenTtl,
            },
        );

        return { accessToken };
    }

    async signIn(signInDto: SignInDto): Promise<{ accessToken: string }> {
        const { username, password } = signInDto;

        const user = await this.userRepository.findOne({
            where: {
                username,
            },
        });

        if (!user) {
            throw new BadRequestException(
                'Неправильное имя пользователя или пароль',
            );
        }

        const isPasswordMatch = await this.bcryptService.compare(
            password,
            user.password,
        );
        if (!isPasswordMatch) {
            throw new BadRequestException(
                'Неправильное имя пользователя или пароль',
            );
        }

        return await this.generateAccessToken(user);
    }

    async signOut(userId: string): Promise<void> {
        this.redisService.delete(`user-${userId}`);
    }

    async signUp(signUpDto: SignUpDto): Promise<void> {
        const { username, password } = signUpDto;

        try {
            const user = new User();
            user.username = username;
            user.password = await this.bcryptService.hash(password);
            user.name = signUpDto.name;
            user.surname = signUpDto.surname;
            await this.userRepository.save(user);
        } catch (error) {
            if (error.code === MysqlErrorCode.UniqueViolation) {
                throw new ConflictException(
                    `Пользователь [${username}] уже существует`,
                );
            }
            throw error;
        }
    }
}
