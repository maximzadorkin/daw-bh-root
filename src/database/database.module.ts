import { Build } from '@__configuration__/enums';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => {
                const isDevBuild =
                    configService.get<string>('app.build') ===
                    Build.development;
                return {
                    type: 'mysql',
                    host: configService.get<string>('mysql.host'),
                    port: configService.get<number>('mysql.port'),
                    username: configService.get<string>('mysql.username'),
                    password: configService.get<string>('mysql.password'),
                    database: configService.get<string>('mysql.database'),
                    autoLoadEntities: true,
                    synchronize: isDevBuild,
                };
            },
        }),
    ],
})
export class DatabaseModule {}
