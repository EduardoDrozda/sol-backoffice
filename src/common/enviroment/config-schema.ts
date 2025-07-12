import { z } from 'zod';

export const envSchema = z
  .object({
    APP_PORT: z.coerce.number().default(8081),
    NODE_ENV: z
      .enum(['development', 'production', 'test'])
      .default('development'),

    CORS_ORIGIN: z.string().default('*'),
    CORS_CREDENTIALS: z.string().transform((val) => val === 'true'),

    JWT_SECRET: z.string(),
    DATABASE_URL: z.string(),
    HASH_ROUNDS: z.coerce.number(),

    STORAGE_PROVIDER: z.enum(['local', 's3', 'gcs']).default('local'),
    STORAGE_ENDPOINT: z.string().default('http://localhost:9000'),
    STORAGE_ACCESS_KEY_ID: z.string(),
    STORAGE_SECRET_ACCESS_KEY: z.string(),
    STORAGE_BUCKET: z.string(),
    STORAGE_CREDENTIALS_FILE: z.string().optional(),

    COOKIE_NAME: z.string(),
    COOKIE_MAX_AGE: z.coerce.number().default(1000 * 60 * 60 * 24 * 20),
    COOKIE_HTTP_ONLY: z.string().transform((val) => val === 'true'),
    COOKIE_SECURE: z.string().transform((val) => val === 'true'),
    COOKIE_SAME_SITE: z.enum(['strict', 'lax', 'none']).default('strict'),
    COOKIE_PATH: z.string().default('/'),
    COOKIE_DOMAIN: z.string().default('localhost'),
  })
  .refine(
    (data) => {
      if (data.STORAGE_PROVIDER !== 'local' || data.NODE_ENV === 'production') {
        return !!data.STORAGE_CREDENTIALS_FILE;
      }

      return true;
    },
    {
      message:
        'STORAGE_CREDENTIALS_FILE is required for non-local storage providers in production',
      path: ['STORAGE_CREDENTIALS_FILE'],
    },
  );

export type EnvSchema = z.infer<typeof envSchema>;

export const validate = (config: Record<string, unknown>) =>
  envSchema.parse(config);
