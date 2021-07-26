const router = require('express').Router();
const {
  validateInvite
} = require('./middleware');

router.post('/', validateInvite, (req, res, next) => {
  next({
    status: 404,
    message: 'Not Implemented'
  });
});

module.exports = router;
