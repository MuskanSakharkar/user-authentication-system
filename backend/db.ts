import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoMemoryServer: MongoMemoryServer | null = null;

export const connectDB = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGODB_URI?.trim();

    if (mongoUri) {
      console.log('Connecting to MongoDB Atlas / External Instance...');
      await mongoose.connect(mongoUri, {
        dbName: 'auth_system',
      });
      console.log('✅ Connected to MongoDB Atlas/External DB successfully!');
    } else {
      console.log('⚠️ No MONGODB_URI provided in .env. Initializing in-memory MongoDB server for preview/testing...');
      mongoMemoryServer = await MongoMemoryServer.create({
        instance: {
          dbName: 'auth_system',
        },
      });
      const uri = mongoMemoryServer.getUri();
      await mongoose.connect(uri);
      console.log('✅ Connected to In-Memory MongoDB Server successfully!');
    }
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error);
    // Don't kill process immediately so health checks can report error details
  }
};

export const closeDB = async (): Promise<void> => {
  await mongoose.disconnect();
  if (mongoMemoryServer) {
    await mongoMemoryServer.stop();
  }
};
