const jwt = require('jsonwebtoken');
const { jwtSecret } = require('./auth/secret');

exports.restricted = (req, res, next) => {
  if (req.headers.authorization) {
    jwt.verify(req.headers.authorization, jwtSecret, (err, decoded) => {
      if (err) {
        next({
          status: 401,
          message: 'Bad token given'
        });
      } else {
        req.user = {
          id: decoded.id,
          username: decoded.username
        };
        next();
      }
    });
  } else {
    next({
      status: 401,
      message: 'No token given'
    });
  }
};
