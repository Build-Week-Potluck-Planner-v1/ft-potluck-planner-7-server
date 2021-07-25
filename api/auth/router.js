const router = require('express').Router();
const {
  validateBody
} = require('./middleware');

router.post('/register', validateBody, (req, res, next) => {
  next({
    status: 404,
    message: 'Not implemented'
  });
});

module.exports = router;
