import pino from 'pino';

/**
 * Creates a pino transport for development.
 * This transport is used to log pretty printed logs to the console.
 */
export const transport = pino.transport({
  target: 'pino-pretty',
  options: {
    colorize: true,
    prettyPrint: true
  }
});
