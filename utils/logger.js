/**
 * Logger function
 * @param {string} message The message to log
 */
module.exports = function logger(message) {
  console.log(`[${new Date()}] ${message}`);
};
