const router = require('express').Router();
const {
  validateFood,
  validateType,
  addFood,
  getFood
} = require('./middleware');

router.get('/', getFood, (req, res, next) => {
  res.json(req.foods);
});

router.post('/', validateFood, validateType, addFood, (req, res, next) => {
  res.status(201).json(req.added);
});

module.exports = router;
