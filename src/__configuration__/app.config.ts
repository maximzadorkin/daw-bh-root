import * as process from 'process';
import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
    id: 'server-uuid-id',
    port: process.env.PORT,
    build: process.env.BUILD,
    cors: {
        origin: 'process.env.CORS_ORIGIN',
    },
    jwt: {
        secret: process.env.JWT_SECRET,
    },
}));
