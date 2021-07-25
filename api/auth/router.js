const router = require('express').Router();
const {
  validateBody,
  validateType
} = require('./middleware');

router.post('/register', validateBody, validateType, (req, res, next) => {
  next({
    status: 404,
    message: 'Not implemented'
  });
});

module.exports = router;
