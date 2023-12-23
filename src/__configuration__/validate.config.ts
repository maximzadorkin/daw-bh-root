import { plainToInstance } from 'class-transformer';
import {
    IsEnum,
    IsNotEmpty,
    IsNumber,
    IsString,
    validateSync,
} from 'class-validator';
import { Build } from './enums';

class Environment {
    @IsNumber()
    @IsNotEmpty()
    PORT: number;
    @IsEnum(Build)
    @IsNotEmpty()
    BUILD: Build;
    @IsString()
    @IsNotEmpty()
    CORS_ORIGIN: string;

    @IsString()
    @IsNotEmpty()
    JWT_SECRET: string;
    @IsString()
    @IsNotEmpty()
    JWT_ACCESS_TOKEN_TTL: string;

    @IsString()
    @IsNotEmpty()
    REDIS_HOST: string;
    @IsNumber()
    @IsNotEmpty()
    REDIS_PORT: number;
    @IsString()
    REDIS_USERNAME: string;
    @IsString()
    REDIS_PASSWORD: string;
    @IsString()
    @IsNotEmpty()
    REDIS_DATABASE: string;

    @IsString()
    @IsNotEmpty()
    MYSQL_HOST: string;
    @IsNumber()
    @IsNotEmpty()
    MYSQL_PORT: number;
    @IsString()
    @IsNotEmpty()
    MYSQL_USERNAME: string;
    @IsString()
    @IsNotEmpty()
    MYSQL_PASSWORD: string;
    @IsString()
    @IsNotEmpty()
    MYSQL_DATABASE: string;
}

const validate = (config: Record<string, unknown>): Environment => {
    const validated = plainToInstance(Environment, config, {
        enableImplicitConversion: true,
    });
    const errors = validateSync(validated, { skipMissingProperties: false });

    if (errors.length > 0) {
        throw new Error(errors.toString());
    }

    return validated;
};

export { validate };
