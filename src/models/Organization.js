const { Model } = require('objection');
const knex = require('../db/knex');
const User = require('./User');

Model.knex(knex);

class Organization extends Model {
  static tableName = 'organizations';

  static jsonSchema = {
    type: 'object',
    required: ['owner_id', 'name', 'secret', 'logo_url', 'primary_color'],

    properties: {
      owner_id: {
        type: 'integer',
      },
      name: {
        type: 'text',
      },
      secret: {
        type: 'text',
      },
      logo_url: {
        type: 'text',
      },
      primary_color: {
        type: 'text',
      },
    },
  };

  static relationMappings = {
    owner: {
      relation: Model.BelongsToOneRelation,
      modelClass: User,
      join: {
        from: 'organizations.owner_id',
        to: 'users.id',
      },
    },
  };
}

module.exports = Organization;
