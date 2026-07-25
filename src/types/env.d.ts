declare namespace NodeJS {
  interface ProcessEnv {
    DISCORD_TOKEN: string;
    CLIENT_ID: string;
    MONGO_URI: string;
    GUILD_ID?: string;
  }
}
