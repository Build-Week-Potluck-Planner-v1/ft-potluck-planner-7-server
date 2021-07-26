const router = require('express').Router();
const {
  validateFood,
  validateType,
  addFood
} = require('./middleware');

router.post('/', validateFood, validateType, addFood, (req, res, next) => {
  next({
    status: 404,
    message: 'Not implemented'
  });
});

module.exports = router;
