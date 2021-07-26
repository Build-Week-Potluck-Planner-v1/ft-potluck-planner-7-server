const router = require('express').Router();
const {
  validateBody,
  validateType,
  checkUsernameFree,
  checkUsernameExists,
  validateCredentials,
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


const loginMiddleware = [
  validateBody, validateType, checkUsernameExists,
  validateCredentials
];

router.post('/login', loginMiddleware, ({user}, res, next) => {
  res.json({
    message: `Welcome back ${user.username}!`
  });
});

module.exports = router;
