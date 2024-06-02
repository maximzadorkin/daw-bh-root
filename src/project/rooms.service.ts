import { isArray, without } from 'lodash';
import { Injectable } from '@nestjs/common';
import * as process from 'process';
import { RedisService } from '../redis/redis.service';

const PROJECT_ROOM_PREFIX = 'project-room';

type UserId = string | number;
type SocketId = string | number;

@Injectable()
export class RoomsRedisService {
    constructor(private readonly redisService: RedisService) {}

    async clearAll() {
        const keys = await this.redisService.getKeys(`${process.env.id}-*`);

        for (const key of keys) {
            await this.redisService.delete(key);
        }
    }

    async getRoom(projectId: string): Promise<[UserId, SocketId][]> {
        const values = await this.redisService.get(
            `${process.env.id}-${PROJECT_ROOM_PREFIX}-${projectId}`,
        );

        return JSON.parse(values).map((value) => value.split(':'));
    }

    async insertToRoom(
        projectId: string,
        socketId: string | number,
        userId: string | number,
    ): Promise<void> {
        const project = await this.redisService.get(
            `${process.env.id}-${PROJECT_ROOM_PREFIX}-${projectId}`,
        );

        let users = JSON.parse(project);
        if (!isArray(users)) {
            users = [];
        }

        await this.redisService.insert(
            `${process.env.id}-${PROJECT_ROOM_PREFIX}-${projectId}`,
            JSON.stringify([...users, [socketId, userId].join(':')]),
        );
    }

    async removeFromRoom(
        projectId: string,
        socketId: string | number,
        userId: string | number,
    ): Promise<void> {
        const project = await this.redisService.get(
            `${process.env.id}-${PROJECT_ROOM_PREFIX}-${projectId}`,
        );

        const users = JSON.parse(project) as Array<string>;
        await this.redisService.insert(
            `${process.env.id}-${PROJECT_ROOM_PREFIX}-${projectId}`,
            JSON.stringify(without(users, [socketId, userId].join(':'))),
        );
    }
}
