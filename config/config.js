import dotenv from 'dotenv';

dotenv.config();

export default {
  port: process.env.PORT || 3020,
  mongoUri: process.env.MONGO_URI,
  saltRounds: 10,
  jwtSecret: process.env.JWT_SECRET || 'strabismuscare-secret-key',
  jwtExpiration: '24h'
};
