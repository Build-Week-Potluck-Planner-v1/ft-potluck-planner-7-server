const Potlucks = require('./model');

exports.validatePotluck = (req, res, next) => {
  const {body: {name, date, location}} = req;
  if (name && date && location) {
    req.body = {name, date, location};
    next();
  } else {
    next({
      status: 400,
      message: 'Please provide a name, date and location for the potluck'
    });
  }
};

exports.validateType = (req, res, next) => {
  const {body: {name, date, location}} = req;
  console.log('date:', date);
  const dateChecked = Date.parse(date);
  console.log('dateChecked:', dateChecked);
  if (typeof name === 'string' && typeof location === 'string' && !isNaN(dateChecked)){
    const newDate = new Date(dateChecked);
    req.body.date = newDate.toISOString();
    next();
  } else {
    next({
      status: 400,
      message: 'Name and location should be strings, date should be an iso date string'
    });
  }
};

exports.addPotluck = (req, res, next) => {
  potluck = {
    ...req.body,
    owner_id: req.user.id,
  };

  console.log(potluck.date);
  Potlucks.add(potluck)
    .then(potluck => {
      console.log(potluck);
      next();
    })
    .catch(next);
};
