const Users = require('./model');

exports.validateBody = (req, res, next) => {
  const { username, password } = req.body;
  if ( username && password ) {
    req.body = { username, password };
    next();
  } else {
    next({
      status: 400,
      message: 'Please provide a username and password'
    });
  }
};

exports.validateType = ({ body: { username, password } }, res, next) => {
  if ( typeof username === 'string' && typeof password === 'string' ) {
    next();
  } else {
    next({
      status: 400,
      message: 'Username and password must both be strings'
    });
  }
};

exports.checkUsernameFree = ({ body: { username, password } }, res, next) => {
  Users.getByUsername(username)
    .then(user => {
      if (user) {
        next({
          status: 400,
          message: 'Username already exists'
        });
      } else {
        next();
      }
    })
    .catch(next);
};

exports.addUser = ({body: { username, password } }, res, next) => {
  Users.add({ username, password })
    .then(next);
};
