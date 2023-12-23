import {
    CanActivate,
    ExecutionContext,
    Inject,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import jwtConfig from '@__configuration__/jwt.config';
import { RedisService } from '@app/redis/redis.service';
import { CurrentUserData } from '@app/users/interfaces/current-user-data';
import { REQUEST_USER_KEY } from '@app/users/users.constants';

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(
        @Inject(jwtConfig.KEY)
        private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
        private readonly jwtService: JwtService,
        private readonly redisService: RedisService,
        private reflector: Reflector,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        if (this.isPublicRoute(context)) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const token = this.getToken(request);
        if (!token) {
            throw new UnauthorizedException('Токен авторизации обязателен');
        }

        try {
            const payload = await this.jwtService.verifyAsync<CurrentUserData>(
                token,
                this.jwtConfiguration,
            );

            const isValidToken = await this.redisService.validate(
                `user-${payload.id}`,
                payload.tokenId,
            );
            if (!isValidToken) {
                throw new UnauthorizedException('Пользователь не авторизован');
            }

            request[REQUEST_USER_KEY] = payload;
        } catch (error) {
            throw new UnauthorizedException(error.message);
        }

        return true;
    }

    private isPublicRoute = (context: ExecutionContext): boolean => {
        return this.reflector.getAllAndOverride<boolean>('isPublic', [
            context.getHandler(),
            context.getClass(),
        ]);
    };

    private getToken(request: Request) {
        const [_, token] = request.headers.authorization?.split(' ') ?? [];
        return token;
    }
}
