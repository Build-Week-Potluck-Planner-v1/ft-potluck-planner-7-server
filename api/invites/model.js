const db = require('../data/db-config');

exports.getByPotluckAndGuest = ({potluck_id, guest_id}) => {
  return db('users_potlucks')
    .where({potluck_id, guest_id})
    .first();
};

exports.add = (invite) => {
  return db('users_potlucks')
    .insert(invite, ['id', 'potluck_id', 'guest_id', 'has_rsvped']);
};
