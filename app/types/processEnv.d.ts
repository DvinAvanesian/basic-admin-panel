declare namespace NodeJS {
  interface ProcessEnv {
    MONGO_URI: string
    REDIS_PORT
    DEFAULT_LANGUAGE: string
    AUTH_ALGORITHM: string
    AUTH_PRIVATE_KEY: string
    AUTH_PUBLIC_KEY: string
    LOGS_DIR: string
    MEDIA_DIR: string
    ADMIN_ID: string
  }
}
