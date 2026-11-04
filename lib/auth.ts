import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";

// Reuse one client across hot reloads in development
const globalForMongo = globalThis as unknown as { _mongo?: MongoClient };
const client =
  globalForMongo._mongo ?? new MongoClient(process.env.MONGODB_URI as string);
if (process.env.NODE_ENV !== "production") globalForMongo._mongo = client;

export const auth = betterAuth({
  database: mongodbAdapter(client.db("studiospace")),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
    autoSignIn: false, // after register, user goes to Login
  },
});