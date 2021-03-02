import * as session from 'express-session';
import * as redis from 'redis';
import * as connectRedis from 'connect-redis';
import {AuthConfig, MiscConfig} from '../../config/config';

const RedisStore = connectRedis(session);
const redisClient = redis.createClient({
  host: 'localhost',
  port: MiscConfig.redisPort,
});
redisClient.on('error', (err) =>
  console.error('Failed to connect to redis. ' + err),
);
redisClient.on('connect', () => console.log('Connected to redis successfully'));

export const sessionMiddleware = session({
  store: new RedisStore({client: redisClient}),
  secret: AuthConfig.sessionSecret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // if true only transmit cookie over https
    httpOnly: false, // if true prevent client side JS from reading the cookie
    maxAge: 1000 * 60, // session max age in miliseconds
  },
});
