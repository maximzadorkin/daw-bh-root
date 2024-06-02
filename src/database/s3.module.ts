import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { S3Module as S3BaseModule, S3ModuleOptions } from 'nestjs-s3';

@Module({
    imports: [
        S3BaseModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (
                configService: ConfigService,
            ): Promise<S3ModuleOptions> => ({
                config: {
                    credentials: {
                        accessKeyId: configService.get<string>('S3.username'),
                        secretAccessKey:
                            configService.get<string>('S3.password'),
                    },
                    endpoint: [
                        configService.get<string>('S3.host'),
                        configService.get<string>('S3.port'),
                    ].join(':'),
                    forcePathStyle: true,
                },
            }),
        }),
    ],
})
export class S3Module {}
