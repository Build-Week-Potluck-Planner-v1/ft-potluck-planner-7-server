const db = require('../data/db-config');

exports.getById = (id) => {
  return db('users_potlucks')
    .where({id})
    .first();
};

exports.getByGuest = (guest_id) => {
  return db('users_potlucks')
    .where({guest_id});
};

exports.getByPotluckAndGuest = ({potluck_id, guest_id}) => {
  return db('users_potlucks')
    .where({potluck_id, guest_id})
    .first();
};

exports.add = (invite) => {
  return db('users_potlucks')
    .insert(invite, ['id', 'potluck_id', 'guest_id', 'has_rsvped']);
};

exports.update = (id, has_rsvped) => {
  return db('users_potlucks')
    .where({id})
    .update({has_rsvped});
};
