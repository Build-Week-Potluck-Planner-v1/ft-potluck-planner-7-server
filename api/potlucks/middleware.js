const Potlucks = require('./model');
const Foods = require('../foods/model');

const isString = (obj) => typeof obj === 'string';

exports.validatePotluck = (req, res, next) => {
  const {body: {name, date, time, location}} = req;
  if (name && date && time && location) {
    req.body = {name, date, time, location};
    next();
  } else {
    next({
      status: 400,
      message: 'Please provide a name, date, time and location for the potluck'
    });
  }
};

exports.validatePut = (req, res, next) => {
  const {body: {date, time, location}} = req;
  if (date && time && location) {
    req.body = {date, time, location};
    next();
  } else {
    next({
      status: 400,
      message: 'Please provide a date, time and location for the potluck'
    });
  }
};

exports.validateType = (req, res, next) => {
  const {body: {name, date, time, location}} = req;
  if ([name, date, time, location].map(isString).every(elem => !!elem)){
    next();
  } else {
    next({
      status: 400,
      message: 'name, date, time and location should all be strings'
    });
  }
};

exports.validateTypePut = (req, res, next) => {
  const {body: {date, time, location}} = req;
  if([date, time, location].map(isString).every(elem => !!elem)) {
    next();
  } else {
    next({
      status: 400,
      message: 'date, time and location should all be strings'
    });
  }
};

exports.addPotluck = (req, res, next) => {
  const potluck = {
    ...req.body,
    owner_id: req.user.id,
  };

  Potlucks.add(potluck)
    .then(added => {
      req.potluck = added;
      next();
    })
    .catch(next);
};

exports.getPotlucks = (req, res, next) => {
  Potlucks.getByOwner(req.user.id)
    .then(potlucks => {
      req.potlucks = potlucks;
      next();
    })
    .catch(next);
};

exports.checkPotluckExists = (req, res, next) => {
  Potlucks.getById(req.params.id)
    .then(potluck => {
      if (potluck) {
        next();
      } else {
        next({
          status: 400,
          message: 'Potluck with given id does not exist'
        });
      }
    })
    .catch(next);
};

exports.checkUserIsOwner = (req, res, next) => {
  Potlucks.getByIdAndOwner(req.params.id, req.user.id)
    .then(potluck => {
      if (potluck) {
        next();
      } else {
        next({
          status: 401,
          message: 'Only the owner of the potluck is allowed to update it'
        });
      }
    })
    .catch(next);
};

exports.updatePotluck = (req, res, next) => {
  Potlucks.update(req.params.id, req.body)
    .then(([updated]) => {
      req.updated = updated;
      next();
    })
    .catch(next);
};

exports.deletePotluck = (req, res, next) => {
  Potlucks.delete(req.params.id)
    .then(deleted => {
      req.deleted = deleted;
      next();
    })
    .catch(next);
};

exports.getFoods = (req, res, next) => {
  const {params: {potluck_id}} = req;
  Potlucks.getFoods(potluck_id)
    .then(foods => {
      req.foods = foods;
      next();
    })
    .catch(next);
};

exports.validateFood = (req, res, next) => {
  const {body: {food_id, quantity, name}} = req;
  const foodIdXORName = !!(!!food_id ^ !!name);
  if (quantity && foodIdXORName) {
    if (food_id) {
      req.body = {food_id, quantity};
    } else {
      req.body = {name, quantity};
    }
    next();
  } else {
    next({
      status: 400,
      message: 'Please provide a quantity and either a food_id or a name, but not both'
    });
  }
};

exports.validateFoodType = ({body: {food_id, quantity, name}}, res, next) => {
  const food_idValid = ((!food_id) ||
                        ((typeof food_id === 'number') &&
                         (Math.floor(food_id) === food_id) &&
                         (food_id > 0)));
  const quantityValid = (typeof quantity === 'string');
  const nameValid = ((!name) ||
                     (typeof name === 'string'));
  if (food_idValid && quantityValid && nameValid) {
    next();
  } else {
    next({
      status: 400,
      message: 'quantity and name should be strings and food_id should be a positive integer if included'
    });
  }
};

exports.checkFoodExists = (req, res, next) => {
  if (req.body.food_id) {
    Foods.getById(req.body.food_id)
      .then(food => {
        if (food) {
          next();
        } else {
          next({
            status: 404,
            message: 'Food with specified id does not exist'
          });
        }
      })
      .catch(next);
  } else {
    next();
  }
};

exports.checkPotluckExistsFood = (req, res, next) => {
  Potlucks.getById(req.params.potluck_id)
    .then(potluck => {
      if (potluck) {
        next();
      } else {
        next({
          status: 400,
          message: 'Potluck with given id does not exist'
        });
      }
    })
    .catch(next);
};

exports.foodAuthorization = (req, res, next) => {
  Potlucks.getOwnerAndGuest(req.params.potluck_id)
    .then(returnSet => {
      if (returnSet.has(req.user.id)) {
        next();
      } else {
        next({
          status: 403,
          message: 'Only the owner and guests of a potluck are authorized to request food, or update or delete food requests'
        });
      }
    })
    .catch(next);
  // the owner and guests should be allowed to make food requests
};

exports.makeFoodIfNameUsed = (req, res, next) => {
  const {body: {name}} = req;
  if (name) {
    Foods.add({name})
      .then(added => {
        req.body.food_id = added.id;
        next();
      })
      .catch(err => {
        // res.status(500).json(err);
        if (err.code === '23505') { // lets unique constraint errors through
          Foods.getByName(name)
            .then(food => {
              req.body.food_id = food.id;
              next();
            })
            .catch(next);
        } else {
          next(err);
        }
      });
  } else {
    next();
  }
};

exports.addFoodRequest = (req, res, next) => {
  const food_request = {
    food_id: req.body.food_id,
    potluck_id: req.params.potluck_id,
    quantity: req.body.quantity
  };
  Potlucks.addFoodRequest(food_request)
    .then(added => {
      req.added = added;
      next();
    })
    .catch(next);
};

exports.validateFoodPut = (req, res, next) => {
  const {body: {bringing}} = req;
  if (bringing !== undefined) {
    req.body = {bringing};
    next();
  } else {
    next({
      status: 400,
      message: 'Please provide bringing for the food request'
    });
  }
};

exports.validateTypeFoodPut = ({body: {bringing}}, res, next) => {
  if (typeof bringing === 'boolean') {
    next();
  } else {
    next({
      status: 400,
      message: 'bringing must be a boolean'
    });
  }
};

exports.checkPotluckExistsFoodPut = (req, res, next) => {
  Potlucks.getById(req.params.potluck_id)
    .then(potluck => {
      if (potluck) {
        next();
      } else {
        next({
          status: 404,
          message: 'Potluck does not exist'
        });
      }
    })
    .catch(next);
};

exports.checkFoodReqExistsPut = (req, res, next) => {
  Potlucks.getFoodReqById(req.params.id)
    .then(food => {
      if (food && req.params.potluck_id === food.potluck_id) {
        req.food = food;
        next();
      } else {
        next({
          status: 404,
          message: 'Food request does not exist or is not attached to specified potluck'
        });
      }
    })
    .catch(next);
};

exports.updateFoodRequest = (req, res, next) => {
  const user_id = (req.body.bringing) ? req.user.id : null;
  const argObj = {
    user_id,
    id: req.params.id
  };

  Potlucks.updateFoodRequest(argObj)
    .then(updated => {
      req.updated = updated;
      next();
    })
    .catch(next);
};

exports.deleteFoodRequest = (req, res, next) => {
  Potlucks.deleteFoodRequest(req.params.id)
    .then(deleted => {
      req.deleted = deleted;
      next();
    })
    .catch(next);
};
