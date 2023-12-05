interface ENV {
    DATABASE_URL: string;
    DATABASE_LOGGING: boolean;
    DATABASE_SYNC: boolean;
}

export default {
    DATABASE_URL: process.env.DATABASE_URL, 
    DATABASE_LOGGING: true,
    DATABASE_SYNC: true,
}  as ENV