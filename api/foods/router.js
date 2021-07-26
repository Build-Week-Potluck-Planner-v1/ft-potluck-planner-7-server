const router = require('express').Router();
const {
  validateFood,
  validateType,
  addFood
} = require('./middleware');

router.post('/', validateFood, validateType, addFood, (req, res, next) => {
  res.status(201).json(req.added);

});

module.exports = router;
