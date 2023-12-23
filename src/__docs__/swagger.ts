import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';

const setupSwagger = (app: NestExpressApplication): void => {
    const config = new DocumentBuilder()
        .setTitle('DAW API')
        .setDescription('API для online daw')
        .setVersion('1.0.0')
        .addBearerAuth()
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('swagger', app, document, {
        jsonDocumentUrl: 'swagger/json',
        yamlDocumentUrl: 'swagger/yaml',
        swaggerOptions: { persistAuthorization: true },
    });
};

export { setupSwagger };
