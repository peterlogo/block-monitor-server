import { logger } from '../services';
import type { CallBackFunction } from '../types/config';

/**
 * Set process exit listener
 * @param callback
 */
export const processExitListeners = (callback: CallBackFunction): void => {
  // Process exit
  process.on('beforeExit', callback);
  process.on('SIGINT', callback);
  process.on('SIGUSR1', callback);
  process.on('SIGUSR2', callback);
  process.on('SIGTERM', callback);

  // Uncaught exception
  process.on('uncaughtException', (error: Error) => {
    logger.error({ error }, `Uncaught Exception: ${error.message}`);
    callback();
    process.exit(1);
  });
  // Unhandled rejection
  process.on('unhandledRejection', (error: Error) => {
    logger.error({ error }, `Unhandled Rejection: ${error.message}`);
    callback();
    process.exit(1);
  });
};
