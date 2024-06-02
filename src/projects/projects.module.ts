import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Audio } from '../project/entities/audio';
import { Track } from '../project/entities/track';
import { Project } from '@app/project/entities/project.entity';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { User } from '@app/users/entities/user.entity';
import { ProjectUser } from '@app/project/entities/project-user.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Project, ProjectUser, User, Track, Audio]),
    ],
    controllers: [ProjectsController],
    providers: [ProjectsService],
})
export class ProjectsModule {}
