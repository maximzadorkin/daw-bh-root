import { UsePipes, ValidationPipe } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
    ConnectedSocket,
    MessageBody,
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import { InjectS3, S3 } from 'nestjs-s3';
import { Server, Socket } from 'socket.io';
import { In, Repository } from 'typeorm';
import { CreateAudioDto } from './dto/create-audio.dto';
import { CreateTrackDto } from './dto/create-track.dto';
import { RemoveAudioDto } from './dto/remove-audio.dto';
import { RemoveTrackDto } from './dto/remove-track.dto';
import { UpdateAudioDto } from './dto/update-audio.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { Audio, AudioState } from './entities/audio';
import { ProjectUser } from './entities/project-user.entity';
import { Project } from './entities/project.entity';
import { Track } from './entities/track';
import { JwtSocketAuthGuard } from './jwt-auth.socket.guard';

@UsePipes(new ValidationPipe({ transform: true }))
@WebSocketGateway({ namespace: 'project', cors: '*' })
export class ProjectGateway
    implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
    @WebSocketServer()
    server: Server;

    constructor(
        @InjectS3() private readonly s3: S3,
        @InjectRepository(Project)
        private readonly projectRepository: Repository<Project>,
        @InjectRepository(Track)
        private readonly trackRepository: Repository<Track>,
        @InjectRepository(Audio)
        private readonly audioRepository: Repository<Audio>,
        @InjectRepository(ProjectUser)
        private readonly projectUserRepository: Repository<ProjectUser>,
        private readonly jwtAuthGuard: JwtSocketAuthGuard,
    ) {}

    public async afterInit(): Promise<void> {
        // this.server.sockets.sockets.clear();
    }

    public async handleConnection(socket: Socket): Promise<void> {
        try {
            await this.jwtAuthGuard.canActivate(socket);
            const projectId = this.jwtAuthGuard.getProject(socket.request);
            socket.join(projectId);
            console.log(`join to room ${projectId}`);
        } catch {
            socket.disconnect();
        }
        return;
    }

    public async handleDisconnect(socket: Socket): Promise<void> {
        const projectId = this.jwtAuthGuard.getProject(socket.request);
        socket.leave(projectId);
        console.log(`disconnect from room: ${projectId}`);
    }

    @SubscribeMessage('info')
    public async info(@ConnectedSocket() socket: Socket): Promise<Project> {
        const projectId = this.jwtAuthGuard.getProject(socket.request);

        return await this.projectRepository.findOne({
            where: { id: projectId },
            relations: {
                projectUsers: true,
                tracks: { audios: true },
            },
        });
    }

    @SubscribeMessage('create-track')
    public async createTrack(
        @ConnectedSocket() socket: Socket,
        @MessageBody() dto: CreateTrackDto,
    ): Promise<void> {
        const project = this.getProjectSimpleEntity(socket);
        const track = new Track();
        track.project = project;
        track.name = dto.name;
        track.mute = dto.mute;
        track.pan = dto.pan;
        track.volume = dto.volume;
        track.color = dto.color;

        const entity = await this.trackRepository.save(track);
        this.server.to(project.id).emit('create-track', entity);
    }

    @SubscribeMessage('update-track')
    public async updateTrack(
        @ConnectedSocket() socket: Socket,
        @MessageBody() dto: UpdateTrackDto,
    ): Promise<void> {
        const track = new Track();
        track.name = dto.name;
        track.color = dto.color;
        track.pan = dto.pan;
        track.volume = dto.volume;
        track.mute = dto.mute;

        await this.trackRepository.update(
            {
                id: dto.id,
                project: this.getProjectSimpleEntity(socket),
            },
            dto,
        );

        const project = this.getProjectSimpleEntity(socket);
        this.server
            .to(project.id)
            .emit('update-track', { id: dto.id, ...track });
    }

    @SubscribeMessage('remove-track')
    public async removeTrack(
        @ConnectedSocket() socket: Socket,
        @MessageBody() dto: RemoveTrackDto,
    ): Promise<void> {
        const track = new Track();
        track.project = this.getProjectSimpleEntity(socket);
        track.id = dto.id;

        const audio = new Audio();
        audio.track = track;
        await this.audioRepository.delete({ track: In([track.id]) });

        const project = this.getProjectSimpleEntity(socket);
        this.server.to(project.id).emit('remove-track', { id: dto.id });
    }

    @SubscribeMessage('create-audio')
    public async createAudio(
        @ConnectedSocket() socket: Socket,
        @MessageBody() dto: CreateAudioDto,
    ): Promise<void> {
        const track = new Track();
        track.id = dto.trackId;
        track.project = this.getProjectSimpleEntity(socket);

        const audio = new Audio();
        audio.track = track;
        audio.offset = dto.offset;
        audio.state = AudioState.PREPARED;

        const entity = await this.audioRepository.save(audio);

        const project = this.getProjectSimpleEntity(socket);
        this.server.to(project.id).emit('create-audio', entity);
    }

    @SubscribeMessage('update-audio')
    public async updateAudio(
        @ConnectedSocket() socket: Socket,
        @MessageBody() dto: UpdateAudioDto,
    ): Promise<void> {
        const audio = new Audio();
        audio.offset = dto.offset;

        if (dto.trackId) {
            const track = new Track();
            track.id = dto.trackId;
            track.project = this.getProjectSimpleEntity(socket);
            audio.track = track;
        }

        await this.audioRepository.update({ id: dto.id }, audio);

        const project = this.getProjectSimpleEntity(socket);
        this.server
            .to(project.id)
            .emit('update-audio', { id: dto.id, ...audio });
    }

    @SubscribeMessage('remove-audio')
    public async removeAudio(
        @ConnectedSocket() socket: Socket,
        @MessageBody() dto: RemoveAudioDto,
    ): Promise<void> {
        const audio = new Audio();
        audio.id = dto.id;
        await this.audioRepository.remove(audio);

        const project = this.getProjectSimpleEntity(socket);
        this.server.to(project.id).emit('remove-audio', { id: dto.id });
    }

    public getProjectSimpleEntity(socket: Socket): Project {
        const projectId = this.jwtAuthGuard.getProject(socket.request);
        const project = new Project();
        project.id = projectId;
        return project;
    }
}
