const router = require('express').Router();
const {
  validatePotluck,
  validateType
} = require ('./middleware');

router.post('/', validatePotluck, validateType, (req, res, next) => {
  next({
    status: 404,
    message: 'Not implemented'
  });
});

module.exports = router;
