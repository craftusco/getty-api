const cron = require('node-cron');
const axios = require('axios');

// Define your cron jobs
const job1 = cron.schedule('*/2 * * * *', async () => {
  try {
    const response = await axios.get('http://localhost:3009/');
    console.log(response.data);
  } catch (error) {
    console.error('Error calling count route:', error);
  }
});

const job2 = cron.schedule('*/1 * * * *', async () => {
  try {
    const response = await axios.post('http://localhost:3009/upload');
    console.log(response.data);
  } catch (error) {
    console.error('Error calling sync route:', error);
  }
});

// Export a function to start the cron jobs
module.exports = function startCronJobs() {
  job1.start();
  job2.start();
};
