const { Model } = require('objection');
const knex = require('../db/knex');
const Role = require('./Role');

Model.knex(knex);

class RolePermission extends Model {
  static tableName = 'role_permissions';

  static jsonSchema = {
    type: 'object',
    required: ['role_id'],

    properties: {
      role_id: {
        type: 'integer',
      },
      can_create_project: {
        type: 'boolean',
      },
      can_edit_project: {
        type: 'boolean',
      },
      can_delete_project: {
        type: 'boolean',
      },
      can_add_delete_members: {
        type: 'boolean',
      },
      can_edit_permissions: {
        type: 'boolean',
      },
      can_create_task: {
        type: 'boolean',
      },
      can_delete_task: {
        type: 'boolean',
      },
      can_edit_task: {
        type: 'boolean',
      },
      can_change_task_status: {
        type: 'boolean',
      },
    },
  };

  static relationMappings = {
    role: {
      relation: Model.BelongsToOneRelation,
      modelClass: Role,
      join: {
        from: 'role_permissions.role_id',
        to: 'roles.id',
      },
    },
  };
}

module.exports = RolePermission;
