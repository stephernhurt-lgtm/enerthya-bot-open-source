import mongoose from 'mongoose';
import { Logger } from '@core/Logger.js';

export async function connectDb(uri: string): Promise<void> {
  try {
    await mongoose.connect(uri);
    Logger.green('MongoDB connected');
  } catch (err) {
    Logger.error('MongoDB connection error:', err);
    process.exit(1);
  }
}

export async function disconnectDb(): Promise<void> {
  await mongoose.disconnect();
  Logger.info('MongoDB disconnected');
}
