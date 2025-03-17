import { MongoClient, ServerApiVersion } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const client = new MongoClient(process.env.MONGO_URI, {
  serverApi: ServerApiVersion.v1,
});

let database;

export const connectDB = async () => {
  try {
    await client.connect();
    database = client.db("strabismusCareBD");
    console.log("Connected to MongoDB successfully");
    return database;
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

export const getDB = () => {
  return database;
};

export const closeDB = async () => {
  await client.close();
  console.log("MongoDB connection closed");
};
