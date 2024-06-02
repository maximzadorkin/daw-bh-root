import { ApiProperty } from '@nestjs/swagger';
import {
    IsBoolean,
    IsEnum,
    IsNotEmpty,
    IsNumber,
    IsString,
} from 'class-validator';
import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Audio } from './audio';
import { Project } from './project.entity';

export enum TrackColor {
    brand = 'brand',
    success = 'success',
    secondary = 'secondary',
    info = 'info',
    warning = 'warning',
}

@Entity({ name: 'track' })
export class Track {
    @PrimaryGeneratedColumn('uuid')
    @ApiProperty({
        description: 'ID проекта в формате uuid',
        example: '89c018cc-8a77-4dbd-94e1-dbaa710a2a9c',
    })
    id: string;

    @CreateDateColumn({ name: 'created_at' })
    @ApiProperty({ description: 'Дата создания проекта' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    @ApiProperty({ description: 'Дата обновления' })
    updatedAt: Date;

    @IsString()
    @Column()
    @ApiProperty({ description: 'Наименование' })
    name: string;

    @IsEnum(TrackColor)
    @IsNotEmpty()
    @Column({ default: TrackColor.secondary })
    @ApiProperty({ description: 'Цветовая схема' })
    color: TrackColor;

    @IsNotEmpty()
    @IsBoolean()
    @Column({ default: false })
    @ApiProperty({ description: 'Mute трека' })
    mute: boolean;

    @IsNumber()
    @Column({ default: 0 })
    // todo: between -100 100
    @ApiProperty({ description: 'Панорама трека' })
    pan: number;

    @IsNumber()
    @Column('decimal', { default: 1, precision: 3, scale: 2 })
    // todo: between 0-1
    @ApiProperty({ description: 'Громкость трека' })
    volume: number;

    @ApiProperty({ description: 'Прикрепленные треки к проекту' })
    @OneToMany(() => Audio, (audio) => audio.track)
    @IsNotEmpty()
    audios: Audio[];

    @ApiProperty({ description: 'Проект трека' })
    @ManyToOne(() => Project, (project) => project.tracks)
    @IsNotEmpty()
    project: Project;
}
