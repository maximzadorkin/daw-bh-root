import { ViewColumn, ViewEntity } from 'typeorm';
import { User } from '@app/users/entities/user.entity';
import { Project } from './project.entity';

@ViewEntity()
export class ProjectWithOwner extends Project {
    @ViewColumn()
    owner: User;
}
