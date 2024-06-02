import { ConfigModule } from '@nestjs/config';
import app from './app.config';
import mysql from './mysql.config';
import jwt from './jwt.config';
import redis from './redis.config';
import S3 from './s3.config';
import { validate } from './validate.config';

const setupConfig = () =>
    ConfigModule.forRoot({
        cache: true,
        isGlobal: true,
        load: [app, mysql, redis, S3, jwt],
        validate,
    });

export { setupConfig };
