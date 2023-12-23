import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { User } from '@app/users/entities/user.entity';
import { ProjectUser } from '@app/project-user/entities/project-user.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Project, ProjectUser, User])],
    controllers: [ProjectsController],
    providers: [ProjectsService],
})
export class ProjectsModule {}
