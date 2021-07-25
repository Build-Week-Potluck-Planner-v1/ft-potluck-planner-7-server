exports.validateBody = ({body: {username, password}}, res, next) => {
  if (username && password) {
    next();
  } else {
    next({
      status: 400,
      message: 'Please provide a username and password'
    });
  }
};

exports.validateType = ({body: {username, password}}, res, next) => {
  if (typeof username === 'string' && typeof password === 'string') {
    next();
  } else {
    next({
      status: 400,
      message: 'Username and password must both be strings'
    });
  }
};
