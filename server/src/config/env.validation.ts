import { plainToInstance } from 'class-transformer';
import { IsBoolean, IsIn, IsNumber, IsOptional, IsString, Max, Min, validateSync } from 'class-validator';

class EnvironmentVariables {
  @IsIn(['development', 'test', 'production'])
  NODE_ENV: string;

  @IsString()
  DATABASE_URL: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(65535)
  APP_PORT?: number;

  @IsOptional()
  @IsString()
  APP_PREFIX?: string;

  @IsOptional()
  @IsString()
  LOG_DIR?: string;

  @IsOptional()
  @IsBoolean()
  FILE_IS_LOCAL?: boolean;

  @IsOptional()
  @IsString()
  FILE_UPLOAD_LOCATION?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(200)
  FILE_MAX_SIZE?: number;

  @IsOptional()
  @IsString()
  FILE_DOMAIN?: string;

  @IsOptional()
  @IsString()
  FILE_SERVE_ROOT?: string;

  @IsOptional()
  @IsString()
  DB_HOST?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(65535)
  DB_PORT?: number;

  @IsOptional()
  @IsString()
  DB_USERNAME?: string;

  @IsOptional()
  @IsString()
  DB_PASSWORD?: string;

  @IsOptional()
  @IsString()
  DB_DATABASE?: string;

  @IsOptional()
  @IsString()
  DB_SCHEMA?: string;

  @IsOptional()
  @IsBoolean()
  DB_SSL?: boolean;

  @IsOptional()
  @IsString()
  REDIS_HOST?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(65535)
  REDIS_PORT?: number;

  @IsOptional()
  @IsString()
  REDIS_PASSWORD?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(15)
  REDIS_DB?: number;

  @IsOptional()
  @IsString()
  REDIS_KEY_PREFIX?: string;

  @IsOptional()
  @IsString()
  JWT_SECRET?: string;

  @IsOptional()
  @IsString()
  JWT_EXPIRES_IN?: string;

  @IsOptional()
  @IsString()
  JWT_REFRESH_EXPIRES_IN?: string;

  @IsOptional()
  @IsString()
  COS_SECRET_ID?: string;

  @IsOptional()
  @IsString()
  COS_SECRET_KEY?: string;

  @IsOptional()
  @IsString()
  COS_BUCKET?: string;

  @IsOptional()
  @IsString()
  COS_REGION?: string;

  @IsOptional()
  @IsString()
  COS_DOMAIN?: string;

  @IsOptional()
  @IsString()
  COS_LOCATION?: string;

  @IsOptional()
  @IsString()
  PERM_WHITELIST?: string;

  @IsOptional()
  @IsString()
  GEN_AUTHOR?: string;

  @IsOptional()
  @IsString()
  GEN_PACKAGE_NAME?: string;

  @IsOptional()
  @IsString()
  GEN_MODULE_NAME?: string;

  @IsOptional()
  @IsBoolean()
  GEN_AUTO_REMOVE_PRE?: boolean;

  @IsOptional()
  @IsString()
  GEN_TABLE_PREFIX?: string;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    const messages = errors
      .map((error) => Object.values(error.constraints || {}).join(', '))
      .join('\n');

    throw new Error(`Environment validation failed:\n${messages}`);
  }

  return validatedConfig;
}
