import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { setupConfig } from './__configuration__';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { DatabaseModule } from './database/database.module';
import { S3Module } from './database/s3.module';
import { ProjectModule } from './project/project.module';
import { ProjectsModule } from './projects/projects.module';
import { RedisModule } from './redis/redis.module';
import { UsersModule } from './users/users.module';

@Module({
    imports: [
        setupConfig(),
        DatabaseModule,
        S3Module,
        RedisModule,
        AuthModule,
        UsersModule,
        ProjectsModule,
        ProjectModule,
    ],
    providers: [
        {
            provide: APP_GUARD,
            useClass: JwtAuthGuard,
        },
    ],
})
export class AppModule {}
