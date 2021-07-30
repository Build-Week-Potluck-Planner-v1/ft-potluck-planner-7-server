const db = require('../data/db-config');

exports.getById = (id) => {
  return db('users_potlucks')
    .where({id})
    .first();
};

exports.getByGuest = (guest_id) => {
  return db('users_potlucks')
    .select('users_potlucks.*', 'potlucks.owner_id', 'potlucks.name', 'potlucks.date', 'potlucks.time', 'potlucks.location')
    .join('potlucks', 'users_potlucks.potluck_id', 'potlucks.id')
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
    .update({has_rsvped}, ['id', 'potluck_id', 'guest_id', 'has_rsvped'])
    .then(([updated]) => {
      return updated;
    });
};

exports.delete = (id) => {
  return db('users_potlucks')
    .where({id})
    .del(['id', 'potluck_id', 'guest_id', 'has_rsvped'])
    .then(([deleted]) => deleted);
};
