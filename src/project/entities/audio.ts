import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Track } from './track';

export enum AudioState {
    PREPARED = 'PREPARED',
    STORAGE = 'STORAGE',
}

@Entity({ name: 'audio' })
export class Audio {
    @PrimaryGeneratedColumn('uuid')
    @ApiProperty({
        description: 'ID проекта в формате uuid',
        example: '89c018cc-8a77-4dbd-94e1-dbaa710a2a9c',
    })
    id: string;

    @Column({ default: AudioState.PREPARED })
    @IsEnum(AudioState)
    @IsNotEmpty()
    @ApiProperty({
        description: 'Состояние аудио. Создан или готов к использованию',
        example: AudioState.PREPARED,
    })
    state: AudioState;

    @CreateDateColumn({ name: 'created_at' })
    @ApiProperty({ description: 'Дата создания проекта' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    @ApiProperty({ description: 'Дата обновления' })
    updatedAt: Date;

    @ApiProperty({ description: 'Смещение относительно начала' })
    @IsNotEmpty()
    @IsNumber()
    @Column('decimal', { default: 0, precision: 20, scale: 5 })
    offset: number;

    @ApiProperty({ description: 'Трек для аудио' })
    @ManyToOne(() => Track, (track) => track.audios)
    @IsNotEmpty()
    track: Track;
}
