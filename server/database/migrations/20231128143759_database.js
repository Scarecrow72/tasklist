/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema
    .createTable('users', (table) => {
        table.increments('id');
        table.string('first_name').notNullable();
        table.string('middle_name');
        table.string('last_name').notNullable();
        table.string('login').notNullable().unique();
        table.string('password').notNullable();
        table.integer('manager').references('users.id');
    })
    .createTable('tasks', (table) => {
        table.increments('id');
        table.string('title').notNullable();
        table.string('description').notNullable();
        table.date('create_date').notNullable();
        table.date('finish_date').notNullable();
        table.date('renew_date');
        table.string('priority').notNullable();
        table.string('status').notNullable();
        table.integer('creator').notNullable().references('users.id');
        table.integer('responsible').notNullable().references('users.id');
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema
    .dropTable('tasks')
    .dropTable('users');
};
