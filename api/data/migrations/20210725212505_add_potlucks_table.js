
exports.up = function(knex) {
  return knex.schema
    .createTable('potlucks', tbl => {
      tbl.increments();
      tbl.string('name', 256)
        .notNullable();
      tbl.string('date')
        .notNullable();
      tbl.string('time');
      tbl.string('location', 256)
        .notNullable();
      tbl.integer('owner_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
        .onUpdate('CASCADE');
    });
};

exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists('potlucks');
};
