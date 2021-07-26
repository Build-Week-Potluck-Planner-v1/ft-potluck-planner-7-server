const jwt = require('jsonwebtoken');
const { jwtSecret } = require('./auth/secret');

exports.restricted = (req, res, next) => {
  if (req.headers.authorization) {
    jwt.verify(req.headers.authorization, jwtSecret, (err, decoded) => {
      if (err) {
        next({
          status: 401,
          message: err.message
        });
      } else {
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
