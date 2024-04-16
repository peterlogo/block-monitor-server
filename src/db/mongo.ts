import mongoose from 'mongoose';
import { config } from '../config';
import { processExitListeners } from '../utils';
import { logger } from '../services';

let isConnected = false;

const connectToMongoDB = async (): Promise<void> => {
  if (isConnected) {
    return;
  }

  try {
    await mongoose.connect(config.MONGO_URI, {
      autoIndex: config.NODE_ENV === 'development'
    });
    logger.info('MongoDB connected to server');
    isConnected = true;
  } catch (error) {
    logger.error({ error }, 'MongoDB connection error');
    throw error;
  }
};

const initializeMongoDBListeners = (): void => {
  mongoose.connection.on('connected', () => {
    logger.info('MongoDB connected to server');
  });

  mongoose.connection.on('error', (error) => {
    logger.error({ error }, 'MongoDB connection error');
  });

  mongoose.connection.on('disconnected', () => {
    logger.info('MongoDB disconnected from server');
    isConnected = false;
  });
};

const initializeProcessExitListener = (): void => {
  processExitListeners(async () => {
    if (isConnected) {
      await mongoose.connection.close();
      logger.info('MongoDB connection closed');
      process.exit(0);
    }
  });
};

const initializeMongoDB = async (): Promise<void> => {
  await connectToMongoDB();
  initializeMongoDBListeners();
  initializeProcessExitListener();
};

export { initializeMongoDB };
