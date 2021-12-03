const { Model } = require('objection');
const knex = require('../db/knex');
const Organization = require('./Organization');
const Role = require('./Role');
const RolePermission = require('./RolePermission');
const User = require('./User');

Model.knex(knex);

class OrganizationMember extends Model {
  static tableName = 'organization_members';

  static jsonSchema = {
    type: 'object',
    required: ['user_id', 'organization_id', 'role_id'],

    properties: {
      user_id: {
        type: 'integer',
      },
      organization_id: {
        type: 'integer',
      },
      role_id: {
        type: 'integer',
      },
    },
  };

  static relationMappings = {
    organization: {
      relation: Model.BelongsToOneRelation,
      modelClass: Organization,
      join: {
        from: 'organization_members.organization_id',
        to: 'organizations.id',
      },
    },
    user: {
      relation: Model.BelongsToOneRelation,
      modelClass: User,
      join: {
        from: 'organization_members.user_id',
        to: 'users.id',
      },
    },
  };
}

module.exports = OrganizationMember;
