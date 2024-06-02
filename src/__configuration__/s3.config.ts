import * as process from 'process';
import { registerAs } from '@nestjs/config';

export default registerAs('S3', () => ({
    host: process.env.S3_HOST,
    port: process.env.S3_PORT,
    username: process.env.S3_USERNAME,
    password: process.env.S3_PASSWORD,
}));
