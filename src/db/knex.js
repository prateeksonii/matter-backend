const Knex = require('knex');
const { development } = require('../../knexfile');

const knex = Knex(development);

module.exports = knex;
