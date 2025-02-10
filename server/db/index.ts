import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

if (!process.env.DATABASE_URL) throw Error("DATABASE_URL not set.");
const client = postgres(process.env.DATABASE_URL, { prepare: false });
export const db = drizzle(client);

// async function testConnection() {
//     try {
//       // Run a simple query to check the connection
//       const result = await client`SELECT NOW()`;
//       console.log('Database connection successful:', result);
//     } catch (error) {
//       console.error('Database connection error:', error);
//     }
//   }

//   testConnection();
