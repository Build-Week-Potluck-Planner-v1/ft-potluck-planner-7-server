const router = require('express').Router();
const {
  validatePotluck
} = require ('./middleware');

router.post('/', validatePotluck, (req, res, next) => {
  next({
    status: 404,
    message: 'Not implemented'
  });
});

module.exports = router;
