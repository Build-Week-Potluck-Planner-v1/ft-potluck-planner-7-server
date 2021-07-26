const db = require('../data/db-config');

exports.add = (invite) => {
  return db('users_potlucks')
    .insert(invite, ['id', 'potluck_id', 'guest_id', 'has_rsvped'])
    .catch(console.log);
};
