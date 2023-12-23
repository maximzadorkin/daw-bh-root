import { ProjectUser } from '@app/project-user/entities/project-user.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import {
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'projects' })
export class Project {
    @PrimaryGeneratedColumn('uuid')
    @ApiProperty({
        description: 'ID проекта в формате uuid',
        example: '89c018cc-8a77-4dbd-94e1-dbaa710a2a9c',
    })
    id: string;

    @Column()
    @ApiProperty({ description: 'Название проекта' })
    @IsNotEmpty()
    @MaxLength(255)
    @IsString()
    name: string;

    @CreateDateColumn({ name: 'created_at' })
    @ApiProperty({ description: 'Дата создания проекта' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    @ApiProperty({ description: 'Дата обновления' })
    updatedAt: Date;

    @OneToMany(() => ProjectUser, (projectUser) => projectUser.project)
    projectUsers: ProjectUser[];
}
