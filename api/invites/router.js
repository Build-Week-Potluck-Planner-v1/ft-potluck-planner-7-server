const router = require('express').Router();
const {
  validateInvite,
  validateType
} = require('./middleware');

router.post('/', validateInvite, validateType, (req, res, next) => {
  next({
    status: 404,
    message: 'Not Implemented'
  });
});

module.exports = router;
