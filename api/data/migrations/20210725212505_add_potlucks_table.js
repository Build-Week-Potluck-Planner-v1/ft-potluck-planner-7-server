
exports.up = function(knex) {
  return knex.schema
    .createTable('potlucks', tbl => {
      tbl.increments();
      tbl.string('name', 256)
        .notNullable();
      tbl.date('date')
        .notNullable();
      tbl.time('time')
        .notNullable();
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
