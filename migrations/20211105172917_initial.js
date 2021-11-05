// eslint-disable-next-line no-unused-vars
const { Knex } = require('knex');

const addDefaultColumns = (table) => {
  table.increments('id');
  table.timestamps(false, true);
};

/**
 * @date 2021-11-05
 * @param {Knex} knex
 * @returns {Knex.SchemaBuilder}
 */
exports.up = (knex) =>
  knex.schema
    .createTable('users', (table) => {
      addDefaultColumns(table);
      table.text('first_name').notNullable();
      table.text('last_name');
      table.text('email').unique().notNullable();
      table.text('password').notNullable();
    })
    .createTable('organizations', (table) => {
      addDefaultColumns(table);
      table.integer('owner_id').unsigned().notNullable();
      table.text('name').notNullable().unique();
      table.text('logo_url');
      table.text('primary_color');
      table.text('secret').notNullable();

      table.foreign('owner_id').references('id').inTable('users');
    })
    .createTable('organization_members', (table) => {
      addDefaultColumns(table);
      table.integer('user_id').unsigned().notNullable().unique();
      table.integer('organization_id').unsigned().notNullable();

      table.foreign('user_id').references('id').inTable('users');
      table
        .foreign('organization_id')
        .references('id')
        .inTable('organizations');
    })
    .createTable('roles', (table) => {
      addDefaultColumns(table);
      table.text('name').notNullable();
      table.integer('organization_id').unsigned().notNullable();

      table
        .foreign('organization_id')
        .references('id')
        .inTable('organizations');
    })
    .createTable('role_permissions', (table) => {
      addDefaultColumns(table);
      table.integer('role_id').unsigned().notNullable();
      table.boolean('can_create_project');
      table.boolean('can_edit_project');
      table.boolean('can_delete_project');
      table.boolean('can_add_delete_members');
      table.boolean('can_edit_permissions');
      table.boolean('can_create_task');
      table.boolean('can_delete_task');
      table.boolean('can_edit_task');
      table.boolean('can_change_task_status');

      table.foreign('role_id').references('id').inTable('roles');
    });

/**
 * @date 2021-11-05
 * @param {Knex} knex
 * @returns {Knex.SchemaBuilder}
 */
exports.down = (knex) =>
  knex.schema
    .dropTable('role_permissions')
    .dropTable('roles')
    .dropTable('organization_members')
    .dropTable('organizations')
    .dropTable('users');
