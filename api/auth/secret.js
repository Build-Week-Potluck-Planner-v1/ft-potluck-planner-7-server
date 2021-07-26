require('dotenv').config();

const jwtSecret = process.env.JWT_SECRET || 'SuperSecret';

module.exports = {
  jwtSecret
};
