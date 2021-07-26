exports.validateFood = (req, res, next) => {
  const {body: {name}} = req;
  if (name) {
    req.body = {name};
    next();
  } else {
    next({
      status: 400,
      message: 'Please provide a name for the food item'
    });
  }
};

exports.validateType = ({body: {name}}, res, next) => {
  if (typeof name === 'string') {
    next();
  } else {
    next({
      status: 400,
      message: 'name should be a string'
    });
  }
};
