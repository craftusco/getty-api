const knex = require('../config/db');

const logMessage = async (message) => {
  try {
    await knex('getty_logs').insert({ message: message });
  } catch (error) {
    console.error('Error saving log:', error.message);
  }
};

module.exports = { logMessage };
