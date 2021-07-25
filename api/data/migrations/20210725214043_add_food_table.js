
exports.up = function(knex) {
  return knex.schema
    .createTable('foods', tbl => {
      tbl.increments();
      tbl.string('name', 256)
        .notNullable()
        .unique();
    });
};

exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists('foods');
};
