import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import {
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { IsNotEmpty, MaxLength } from 'class-validator';
import { ProjectUser } from '@app/project-user/entities/project-user.entity';

@Entity({ name: 'users' })
export class User {
    @PrimaryGeneratedColumn('uuid')
    @ApiProperty({
        description: 'ID пользователя',
        example: '89c018cc-8a77-4dbd-94e1-dbaa710a2a9c',
    })
    id: string;

    @Column({ unique: true })
    @IsNotEmpty()
    @MaxLength(255)
    @ApiProperty({
        description: 'Логин пользователя',
        example: 'iAmACat',
    })
    username: string;

    @Column()
    @Exclude({ toPlainOnly: true })
    @ApiHideProperty()
    password: string;

    @Column()
    @MaxLength(255)
    @IsNotEmpty()
    @ApiProperty({
        description: 'Имя пользователя',
        example: 'Максим',
    })
    name: string;

    @Column()
    @MaxLength(255)
    @IsNotEmpty()
    @ApiProperty({
        description: 'Фамилия пользователя',
        example: 'Задоркин',
    })
    surname: string;

    @CreateDateColumn({ name: 'created_at' })
    @ApiProperty({
        description: 'Дата создания пользователя',
    })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    @ApiProperty({
        description: 'Последнее обновление',
    })
    updatedAt: Date;

    @OneToMany(() => ProjectUser, (projectUser) => projectUser.user)
    projectUsers: ProjectUser[];
}
