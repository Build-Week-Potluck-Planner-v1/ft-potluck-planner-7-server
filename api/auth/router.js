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
  res.status(201).json(req.newUser);
});

module.exports = router;
