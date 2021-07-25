
exports.seed = function(knex) {
  return knex('users').truncate()
    .then(function () {
      return knex('users').insert([
        { username: 'test1', password: '1234'},
        { username: 'test2', password: '1234'},
        { username: 'test3', password: '1234'},
        { username: 'test4', password: '1234'}
      ]);
    });
};
