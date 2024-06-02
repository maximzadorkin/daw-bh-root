import jwtConfig from '@__configuration__/jwt.config';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { S3Module } from '../database/s3.module';
import { ProjectUser } from './entities/project-user.entity';
import { Project } from './entities/project.entity';
import { User } from '../users/entities/user.entity';
import { Audio } from './entities/audio';
import { Track } from './entities/track';
import { JwtSocketAuthGuard } from './jwt-auth.socket.guard';
import { ProjectGateway } from './project.gateway';
import { RoomsRedisService } from './rooms.service';

@Module({
    imports: [
        JwtModule.registerAsync(jwtConfig.asProvider()),
        S3Module,
        TypeOrmModule.forFeature([Project, ProjectUser, User, Track, Audio]),
    ],
    providers: [ProjectGateway, RoomsRedisService, JwtSocketAuthGuard],
})
export class ProjectModule {}
