const router = require('express').Router();
const {
  validatePotluck,
  validateType,
  addPotluck,
  getPotlucks,
  validatePut
} = require ('./middleware');

router.get('/', getPotlucks, (req, res, next) => {
  res.json(req.potlucks);
});

router.post('/', validatePotluck, validateType, addPotluck, (req, res, next) => {
  res.status(201).json(req.potluck);
});

router.put('/:id', validatePut, (req, res, next) => {
  next({
    status: 404,
    message: 'Not implemented'
  });
});

module.exports = router;
