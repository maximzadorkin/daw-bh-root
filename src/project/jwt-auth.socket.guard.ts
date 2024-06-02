import {
    Inject,
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from '@__configuration__/jwt.config';
import { RedisService } from '@app/redis/redis.service';
import { CurrentUserData } from '@app/users/interfaces/current-user-data';
import { REQUEST_USER_KEY } from '@app/users/users.constants';
import { InjectRepository } from '@nestjs/typeorm';
import { IncomingMessage } from 'http';
import { Socket } from 'socket.io';
import { Repository } from 'typeorm';
import { ProjectUser } from './entities/project-user.entity';
import { Project } from './entities/project.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class JwtSocketAuthGuard {
    constructor(
        @Inject(jwtConfig.KEY)
        private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
        private readonly jwtService: JwtService,
        private readonly redisService: RedisService,
        private reflector: Reflector,
        @InjectRepository(ProjectUser)
        private readonly projectUserRepository: Repository<ProjectUser>,
    ) {}

    async canActivate(socket: Socket): Promise<boolean> {
        const token = this.getToken(socket.request);
        const project = this.getProject(socket.request);

        if (!token) {
            throw new UnauthorizedException('Токен авторизации обязателен');
        }

        if (!project) {
            throw new UnauthorizedException('ID проекта обязательно');
        }

        let payload;
        try {
            payload = await this.getUserData(token);

            const isValidToken = await this.redisService.validate(
                `user-${payload.id}`,
                payload.tokenId,
            );
            if (!isValidToken) {
                throw new UnauthorizedException('Пользователь не авторизован');
            }

            socket.request[REQUEST_USER_KEY] = payload;
        } catch (error) {
            throw new UnauthorizedException(error.message);
        }

        const projectEntity = new Project();
        projectEntity.id = project;
        const userEntity = new User();
        userEntity.id = payload.id;

        const canAccessToProject = await this.projectUserRepository.findOne({
            where: {
                project: projectEntity,
                user: userEntity,
            },
        });

        if (!canAccessToProject) {
            throw new NotFoundException('У пользователя нет этого проекта');
        }

        return true;
    }

    public async getUserData(token: string): Promise<CurrentUserData> {
        return await this.jwtService.verifyAsync<CurrentUserData>(
            token,
            this.jwtConfiguration,
        );
    }

    public getToken(request: IncomingMessage): string {
        return request.headers.authorization;
    }

    public getProject(request: IncomingMessage): string {
        return request.headers['project-id'] as string;
    }
}
