import pino from 'pino';
import { transport } from './transport';
import { config } from '../../config';

const pinoLogLevel = config.NODE_ENV === 'development' ? 'debug' : 'info';
const pinoTransport = pino.multistream([{ stream: transport }]);
const logger = pino({ level: pinoLogLevel }, pinoTransport);

export { logger, pinoLogLevel, pinoTransport };
