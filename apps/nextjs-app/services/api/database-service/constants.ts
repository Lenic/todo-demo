import 'dotenv/config';

const originalConnectString = process.env.DATABASE_URL;
if (!originalConnectString) {
  throw new Error("There doesn't exist the connect string.");
}
export const connectString = originalConnectString;
