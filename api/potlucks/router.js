const router = require('express').Router();
const {
  validatePotluck,
  validateType,
  validateTypePut,
  addPotluck,
  getPotlucks,
  validatePut,
  checkPotluckExists,
  checkUserIsOwner,
  updatePotluck,
  getFoods,
  validateFood,
  validateFoodType,
  checkFoodExists,
  checkPotluckExistsFood,
  foodAuthorization,
  makeFoodIfNameUsed,
  addFoodRequest
} = require ('./middleware');

router.get('/', getPotlucks, (req, res, next) => {
  res.json(req.potlucks);
});

router.post('/', validatePotluck, validateType, addPotluck, (req, res, next) => {
  res.status(201).json(req.potluck);
});

const putMiddleware = [
  validatePut, validateTypePut, checkPotluckExists, checkUserIsOwner, updatePotluck
];

router.put('/:id', putMiddleware, (req, res, next) => {
  res.json(req.updated);
});

router.get('/:potluck_id/foods', getFoods, ({foods}, res, next) => {
  res.json(foods);
});


const foodPostMiddleware = [
  validateFood, validateFoodType, checkFoodExists, checkPotluckExistsFood,
  foodAuthorization, makeFoodIfNameUsed, addFoodRequest
];

router.post('/:potluck_id/foods', foodPostMiddleware, (req, res, next) => {
  res.json(req.added);
});

router.put('/:potluck_id/foods', (req, res, next) => {
  next({
    status: 404,
    message: 'Not implemented'
  });
});

module.exports = router;
