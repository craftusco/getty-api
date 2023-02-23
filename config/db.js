const knex = require('knex')
const db = {
    client: 'mysql',
    connection: {
      host : 'play.craftus.co',
      port : 3306,
      user : 'umucjlqqb5t20',
      password : '@play_craftus',
      database : 'dbp5gdfaaom4cg'
    }
  };
  module.exports = knex(db)