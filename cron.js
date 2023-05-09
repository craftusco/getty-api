const cron = require('node-cron');
const axios = require('axios');

// Define your cron jobs
cron.schedule('*/1 * * * *', async () => {
  try {
    const response = await axios.get('http://localhost:3000/count');
    console.log(response.data);
  } catch (error) {
    console.error('Error calling count route:', error);
  }
});

cron.schedule('*/2 * * * *', async () => {
  try {
    const response = await axios.get('http://localhost:3000/sync');
    console.log(response.data);
  } catch (error) {
    console.error('Error calling sync route:', error);
  }
});

// Export a function to start the cron jobs
module.exports = function startCronJobs() {
  cron.start();
};
