interface ENV {
    DATABASE_URL: string;
    DATABASE_LOGGING: boolean;
    DATABASE_SYNC: boolean;
    PORT: number;
}

export default {
    DATABASE_URL: process.env.DATABASE_URL, 
    DATABASE_LOGGING: true,
    DATABASE_SYNC: true,
    PORT: process.env.PORT ? +process.env.PORT : 8080,
}  as ENV