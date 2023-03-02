const knex = require('knex')
const db = {
    client: 'mysql',
    connection: {
      host : 'play.craftus.co',
      port : 3306,
      user : 'umucjlqqb5t20',
      password : '@play_craftus',
      database : 'dbp5gdfaaom4cg',
      waitForConnections: true,
      connectionLimit: 100,
      queueLimit: 0,
    },
    pool: {
      min: 0,
      max: 100,
    }
  };
module.exports = knex(db)