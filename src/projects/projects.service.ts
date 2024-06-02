import {
    BadRequestException,
    HttpException,
    HttpStatus,
    Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Not, Repository } from 'typeorm';
import { Audio } from '@app/project/entities/audio';
import { Track } from '@app/project/entities/track';
import { AddUserToProjectDto } from './dto/add-user-to-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectWithOwner } from '@app/project/entities/project-with-owner.entity';
import { Project } from '@app/project/entities/project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { User } from '@app/users/entities/user.entity';
import { DeleteProjectDto } from './dto/delete-project.dto';
import {
    ProjectUser,
    USER_PROJECT_ROLE,
} from '@app/project/entities/project-user.entity';

@Injectable()
export class ProjectsService {
    private MAX_PROJECTS_PER_USER = 10;

    constructor(
        @InjectRepository(Project)
        private readonly projectRepository: Repository<Project>,
        @InjectRepository(Track)
        private readonly trackInfoRepository: Repository<Track>,
        @InjectRepository(Audio)
        private readonly audioInfoRepository: Repository<Audio>,
        @InjectRepository(ProjectUser)
        private readonly projectUserRepository: Repository<ProjectUser>,
    ) {}

    public async create(
        userId: string,
        createProjectDto: CreateProjectDto,
    ): Promise<void> {
        const user = new User();
        user.id = userId;

        const oldUserProjects = await this.getOwns(userId);
        if (oldUserProjects.length + 1 > this.MAX_PROJECTS_PER_USER) {
            const message = `Пользователь не может создать больше ${this.MAX_PROJECTS_PER_USER} проектов`;
            throw new HttpException(message, HttpStatus.METHOD_NOT_ALLOWED);
        }

        const newProject = new Project();
        newProject.name = createProjectDto.name;
        // newProject.tracks = [];
        const project = await this.projectRepository.save(newProject);

        const projectUser = new ProjectUser();
        projectUser.project = project;
        projectUser.user = user;
        projectUser.role = USER_PROJECT_ROLE.owner;
        await this.projectUserRepository.save(projectUser);
    }

    public async update(
        userId: string,
        updateProjectDto: UpdateProjectDto,
    ): Promise<Project> {
        const project = new Project();
        project.id = updateProjectDto.id;

        const user = new User();
        user.id = userId;

        const currentProject = await this.projectUserRepository.findOne({
            relations: { project: true },
            where: {
                role: USER_PROJECT_ROLE.owner,
                project,
                user,
            },
        });

        if (!currentProject) {
            throw new HttpException('Проект не найден', HttpStatus.BAD_REQUEST);
        }

        project.name = updateProjectDto.name;
        await this.projectRepository.save(project);

        const result = await this.projectUserRepository.findOne({
            relations: { project: true },
            where: { project, user, role: USER_PROJECT_ROLE.owner },
        });
        return result.project;
    }

    public async delete(
        userId: string,
        deleteProjectDto: DeleteProjectDto,
    ): Promise<void> {
        const user = new User();
        user.id = userId;

        const project = new Project();
        project.id = deleteProjectDto.id;

        // const projectEntity = await this.projectRepository.remove(project);
        // await this.projectUserRepository.delete({ user, project });

        // const trackInfos = await this.trackInfoRepository.remove(
        //     projectEntity.tracks,
        // );
        // await this.audioInfoRepository.remove(
        // trackInfos.map((trackInfo) => trackInfo.audios).flat(),
        // );
    }

    public async addUserToProject(
        activeUserId: string,
        addUserDto: AddUserToProjectDto,
    ): Promise<void> {
        const activeUser = new User();
        activeUser.id = activeUserId;

        const user = new User();
        user.id = addUserDto.userId;

        const project = new Project();
        project.id = addUserDto.projectId;

        const [savedProject] = await this.projectUserRepository.find({
            relations: {
                user: true,
            },
            where: {
                user: activeUser,
                project,
            },
        });
        if (savedProject?.user?.id !== activeUserId) {
            throw new BadRequestException(
                'Пользователь не может добавить другого участника в данный проект',
            );
        }

        const projects = await this.projectUserRepository.findBy({
            user,
            project,
        });
        if (projects.length > 0) {
            throw new BadRequestException('Пользователь уже добавлен в проект');
        }

        const projectUser = new ProjectUser();
        projectUser.user = user;
        projectUser.project = project;
        projectUser.role = addUserDto.role;
        await this.projectUserRepository.save(projectUser);
    }

    public async getOwns(userId: string): Promise<ProjectWithOwner[]> {
        const user = new User();
        user.id = userId;

        const userProjects = await this.projectUserRepository.find({
            relations: { project: true, user: true },
            where: {
                user,
                role: USER_PROJECT_ROLE.owner,
            },
        });

        return userProjects.map(({ project, user }) => {
            return {
                ...project,
                owner: user,
            };
        });
    }

    public async getOthers(userId: string): Promise<ProjectWithOwner[]> {
        const user = new User();
        user.id = userId;

        const userProjects = await this.projectUserRepository.find({
            relations: { project: true, user: true },
            where: {
                user,
                role: In([USER_PROJECT_ROLE.editor, USER_PROJECT_ROLE.viewer]),
            },
        });

        // fixme: Подозреваю, что это отвратительно
        const userProjectIDs = userProjects.map(({ project }) => project.id);
        const projectsWithOwner = await this.projectUserRepository.find({
            relations: { project: true, user: true },
            where: {
                role: USER_PROJECT_ROLE.owner,
                user: Not(user.id),
                project: In(userProjectIDs),
            },
        });

        return projectsWithOwner.map(({ user, project }) => ({
            ...project,
            owner: user,
        }));
    }

    public async getAll(userId: string): Promise<ProjectWithOwner[]> {
        const user = new User();
        user.id = userId;

        const userProjects = await this.projectUserRepository.find({
            relations: { project: true },
            where: { user },
        });

        const userProjectsIDs = userProjects.map(({ project }) => project.id);
        const projectsWithOwner = await this.projectUserRepository.find({
            relations: { project: true, user: true },
            where: {
                role: USER_PROJECT_ROLE.owner,
                project: In(userProjectsIDs),
            },
        });

        return projectsWithOwner.map(({ user, project }) => ({
            ...project,
            owner: user,
        }));
    }
}
