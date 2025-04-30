declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DATABASE_URL: string;

      PUSHER_ID: string;
      NEXT_PUBLIC_PUSHER_KEY: string;
      PUSHER_SECRET: string;
      NEXT_PUBLIC_PUSHER_CLUSTER: string;

      AUTH_SECRET: string;
      AUTH_GITHUB_ID: string;
      AUTH_GITHUB_SECRET: string;
    }
  }
}

export {};
