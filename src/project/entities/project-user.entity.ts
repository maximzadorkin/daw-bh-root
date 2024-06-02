import { ApiProperty } from '@nestjs/swagger';
import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { User } from '@app/users/entities/user.entity';
import { Project } from './project.entity';

export enum USER_PROJECT_ROLE {
    owner = 'owner',
    editor = 'editor',
    viewer = 'viewer',
}

@Entity({ name: 'project_user' })
export class ProjectUser {
    @PrimaryGeneratedColumn('uuid')
    @ApiProperty({ description: 'projectUser id' })
    id: string;

    @ManyToOne(() => Project, (project) => project.projectUsers)
    @ApiProperty({ description: 'Проект' })
    project: Project;

    @ManyToOne(() => User, (user) => user.projectUsers)
    @ApiProperty({ description: 'Пользователь' })
    user: User;

    @Column({
        type: 'enum',
        enum: Object.keys(USER_PROJECT_ROLE),
        default: USER_PROJECT_ROLE.viewer,
    })
    @ApiProperty({ description: 'Права доступа пользователя к проекту' })
    role: string;

    @CreateDateColumn({ name: 'created_at' })
    @ApiProperty({ description: 'Дата создания проекта' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    @ApiProperty({ description: 'Дата обновления' })
    updatedAt: Date;
}
