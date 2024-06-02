import { Build } from '@__configuration__/enums';
import * as process from 'process';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { TransformInterceptor } from './__interceptors__/transform.interceptor';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { setupSwagger } from './__docs__/swagger';

const setupDevelopersApps = (app: NestExpressApplication): void => {
    setupSwagger(app);
};

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    app.enableVersioning({ type: VersioningType.URI });

    app.useGlobalInterceptors(new TransformInterceptor());
    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
            whitelist: true,
            forbidUnknownValues: true,
            stopAtFirstError: true,
            validateCustomDecorators: true,
        }),
    );
    app.enableCors({
        credentials: true,
        // ToDo: Можно ли тут заюзать ConfigService?
        origin:
            process.env.BUILD === Build.development
                ? '*'
                : process.env.CORS_ORIGIN,
    });

    app.useWebSocketAdapter(new IoAdapter(app));

    setupDevelopersApps(app);

    await app.listen(process.env.PORT);
}

bootstrap().finally();
