import { Body, Controller, Delete, Get, Post, Put } from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiOkResponse,
    ApiTags,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CurrentUser } from '@__decorators__/CurrentUser';
import { AddUserToProjectDto } from '../project-user/dto/add-user-to-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectWithOwner } from './entities/project-with-owner.entity';
import { Project } from './entities/project.entity';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { DeleteProjectDto } from './dto/delete-project.dto';

@ApiTags('projects')
@Controller('projects')
export class ProjectsController {
    constructor(private readonly projectsService: ProjectsService) {}

    @ApiBearerAuth()
    @Get('')
    @ApiUnauthorizedResponse({ description: 'Unauthorized' })
    @ApiOkResponse({
        description: 'Получить данные о всех проектах пользователя',
        type: ProjectWithOwner,
        isArray: true,
    })
    async getInfoOfAllUserProjects(
        @CurrentUser('id') userId: string,
    ): Promise<ProjectWithOwner[]> {
        return await this.projectsService.getAll(userId);
    }

    @ApiBearerAuth()
    @Get('own')
    @ApiUnauthorizedResponse({ description: 'Unauthorized' })
    @ApiOkResponse({
        description: 'Получить данные о собственных проектах пользователя',
        type: ProjectWithOwner,
        isArray: true,
    })
    async getInfoOfOwnProjects(
        @CurrentUser('id') userId: string,
    ): Promise<ProjectWithOwner[]> {
        return await this.projectsService.getOwns(userId);
    }

    @ApiBearerAuth()
    @Get('others')
    @ApiUnauthorizedResponse({ description: 'Unauthorized' })
    @ApiOkResponse({
        description: 'Получить данные о чужих проектах пользователя',
        type: ProjectWithOwner,
    })
    async getInfoOfOtherUserProjects(
        @CurrentUser('id') userId: string,
    ): Promise<ProjectWithOwner[]> {
        return await this.projectsService.getOthers(userId);
    }

    @ApiBearerAuth()
    @Post()
    @ApiUnauthorizedResponse({ description: 'Unauthorized' })
    @ApiOkResponse({ description: 'Создать новый проект' })
    async createProject(
        @CurrentUser('id') userId: string,
        @Body() createProjectDto: CreateProjectDto,
    ): Promise<void> {
        return await this.projectsService.create(userId, createProjectDto);
    }

    @ApiBearerAuth()
    @Put()
    @ApiUnauthorizedResponse({ description: 'Unauthorized' })
    @ApiOkResponse({ description: 'Изменить проект' })
    async updateProject(
        @CurrentUser('id') userId: string,
        @Body() updateProjectDto: UpdateProjectDto,
    ): Promise<Project> {
        return await this.projectsService.update(userId, updateProjectDto);
    }

    @ApiBearerAuth()
    @Delete()
    @ApiUnauthorizedResponse({ description: 'Unauthorized' })
    @ApiOkResponse({ description: 'Удалить проект' })
    async deleteProject(
        @CurrentUser('id') userId: string,
        @Body() deleteProjectDto: DeleteProjectDto,
    ): Promise<void> {
        return await this.projectsService.delete(userId, deleteProjectDto);
    }

    @ApiBearerAuth()
    @Post('add-user')
    @ApiUnauthorizedResponse({ description: 'Unauthorized' })
    @ApiOkResponse({
        description: 'Добавить пользователя в проект',
        type: Array<Project>,
    })
    async addUserToProject(
        @CurrentUser('id') activeUserId: string,
        @Body() addUserDto: AddUserToProjectDto,
    ): Promise<void> {
        return this.projectsService.addUserToProject(activeUserId, addUserDto);
    }
}
