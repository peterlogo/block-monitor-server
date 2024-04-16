import type { CookieSerializeOptions } from '@fastify/cookie';
import { COOKIE_EXPIRATION_TIME } from './constants';
import { config } from '../config';

/**
 * Server Cookies option.
 * @type {CookieSerializeOptions}
 */
export const cookieOptions: CookieSerializeOptions = {
  secure: config.NODE_ENV !== 'development',
  httpOnly: true,
  maxAge: COOKIE_EXPIRATION_TIME,
  sameSite: config.NODE_ENV === 'development' ? 'lax' : 'strict',
  path: '/'
};
