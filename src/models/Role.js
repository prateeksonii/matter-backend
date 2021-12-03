const { Model } = require('objection');
const knex = require('../db/knex');
const Organization = require('./Organization');
const OrganizationMember = require('./OrganizationMember');
const RolePermission = require('./RolePermission');

Model.knex(knex);

class Role extends Model {
  static tableName = 'roles';

  static jsonSchema = {
    type: 'object',
    required: ['name', 'organization_id'],

    properties: {
      name: {
        type: 'text',
      },
      organization_id: {
        type: 'integer',
      },
    },
  };

  static relationMappings = {
    organization: {
      relation: Model.BelongsToOneRelation,
      modelClass: Organization,
      join: {
        from: 'roles.organization_id',
        to: 'organizations.id',
      },
    },
    role_permission: {
      relation: Model.HasOneRelation,
      modelClass: RolePermission,
      join: {
        from: 'roles.id',
        to: 'role_permissions.role_id',
      },
    },
    organization_member: {
      relation: Model.HasOneRelation,
      modelClass: OrganizationMember,
      join: {
        from: 'roles.id',
        to: 'organization_members.role_id',
      },
    },
  };
}

module.exports = Role;
