const router = require('express').Router();
const {
  validateFood
} = require('./middleware');

router.post('/', validateFood, (req, res, next) => {
  next({
    status: 404,
    message: 'Not implemented'
  });
});

module.exports = router;
