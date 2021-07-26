const router = require('express').Router();
const {
  validateBody,
  validateType,
  checkUsernameFree,
  hashPassword,
  addUser
} = require('./middleware');

const registerMiddleware = [
  validateBody, validateType, checkUsernameFree,
  hashPassword, addUser
];

router.post('/register', registerMiddleware, (req, res, next) => {
  next({
    status: 404,
    message: 'Not implemented'
  });
});

module.exports = router;
