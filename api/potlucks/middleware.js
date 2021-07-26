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
  const dateChecked = Date.parse(date);
  if (typeof name === 'string' && typeof location === 'string' && !isNaN(dateChecked)){
    console.log(dateChecked.toISOString());
    // req.body.date = date
    next();
  } else {
    next({
      status: 400,
      message: 'Name and location should be strings, date should be an iso date string'
    });
  }
};
