const fs = require('fs');

module.exports = {
  host: 'db-mysql-ams3-69972-do-user-287139-0.b.db.ondigitalocean.com',
  user: 'sensor_user',
  password: 'AVNS_AiZkKq5mpst7dsiwjMf',
  database: 'sensor_db',
  port: 25060,
  ssl: {
    ca: fs.readFileSync('./certs/ca-certificate.crt'),
  },
};