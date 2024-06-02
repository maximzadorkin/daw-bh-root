import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsUUID } from 'class-validator';
import { USER_PROJECT_ROLE } from '@app/project/entities/project-user.entity';

export class AddUserToProjectDto {
    @ApiProperty({ description: 'Проект, в который добавляем пользователя' })
    @IsUUID()
    readonly projectId: string;

    @ApiProperty({ description: 'Добавляемый пользователь' })
    @IsUUID()
    readonly userId: string;

    @ApiProperty({ description: 'Роль пользователя' })
    @IsEnum([USER_PROJECT_ROLE.viewer, USER_PROJECT_ROLE.editor])
    readonly role: string;
}
