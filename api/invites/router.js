const router = require('express').Router();
const {
  validateInvite,
  validateType,
  addInvite
} = require('./middleware');

router.post('/', validateInvite, validateType, addInvite, (req, res, next) => {
  next({
    status: 404,
    message: 'Not Implemented'
  });
});

module.exports = router;
