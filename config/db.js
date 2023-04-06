const knex = require('knex')
const db = {
    client: 'mysql',
    connection: {
      host : 'localhost',
      port : 8889,
      user : 'root',
      password : 'root',
      database : 'getty',
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