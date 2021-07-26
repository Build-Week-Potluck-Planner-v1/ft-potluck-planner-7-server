const db = require('../data/db-config');

exports.add = (potluck) => {
  return db('potlucks')
    .insert(potluck, ['id', 'owner_id', 'name', 'date', 'time', 'location'])
    .then(([added]) => {
      return added;
    });
};
