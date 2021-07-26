const Invites = require('./model');
const Users = require('../auth/model');

exports.validateInvite = (req, res, next) => {
  const {body: {guest_id, potluck_id}} = req;
  if (guest_id && potluck_id){
    req.body = {guest_id, potluck_id};
    next();
  } else {
    next({
      status: 400,
      message: 'Please provide a guest_id and potluck_id for the invite'
    });
  }
};


exports.validateType = ({body: {guest_id, potluck_id}}, res, next) => {
  const isValid = (input) => {
    return ((typeof input === 'number') && // number check
            (Math.floor(input) === input) && // integer check
            (input > 0)); // positive check
  };
  if (isValid(guest_id) && isValid(potluck_id)) {
    next();
  } else {
    next({
      status: 400,
      message: 'potluck_id and guest_id should be positive integers'
    });
  }
};

exports.checkGuestExists = ({body: {guest_id}}, res, next) => {
  Users.getById(guest_id)
    .then(guest => {
      if (guest) {
        next();
      } else {
        next({
          status: 400,
          message: 'Only existing users can be invited'
        });
      }
    })
    .catch(next);
};

exports.addInvite = (req, res, next) => {
  Invites.add(req.body)
    .then(([added]) => {
      req.added = added;
      next();
    })
    .catch(next);
};
