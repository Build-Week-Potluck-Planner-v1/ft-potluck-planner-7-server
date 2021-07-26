const router = require('express').Router();
const {
  validateBody,
  validateType,
  checkUsernameFree
} = require('./middleware');

router.post('/register', validateBody, validateType, checkUsernameFree, (req, res, next) => {
  next({
    status: 404,
    message: 'Not implemented'
  });
});

module.exports = router;
