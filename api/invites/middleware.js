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
