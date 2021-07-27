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
  addFoodRequest,
  validateFoodPut,
  validateTypeFoodPut,
  checkFoodReqExistsPut,
  checkPotluckExistsFoodPut,
  updateFoodRequest
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

const foodPutMiddleware = [
  validateFoodPut, validateTypeFoodPut, checkPotluckExistsFoodPut, foodAuthorization, checkFoodReqExistsPut, updateFoodRequest
];
router.put('/:potluck_id/foods/:id', foodPutMiddleware, ({updated}, res, next) => {
  res.json(updated);
});

module.exports = router;
