const router = require('express').Router();
const {
  validatePotluck,
  validateType,
  addPotluck
} = require ('./middleware');

router.post('/', validatePotluck, validateType, addPotluck, (req, res, next) => {
  next({
    status: 404,
    message: 'Not implemented'
  });
});

module.exports = router;
