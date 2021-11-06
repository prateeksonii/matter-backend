const { Model } = require('objection');
const knex = require('../db/knex');

Model.knex(knex);

class User extends Model {
  static get tableName() {
    return 'users';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['first_name', 'email', 'password'],

      properties: {
        id: {
          type: 'integer',
        },
        first_name: {
          type: 'text',
        },
        last_name: {
          type: 'text',
        },
        email: {
          type: 'text',
        },
        password: {
          type: 'text',
        },
      },
    };
  }
}

module.exports = User;
