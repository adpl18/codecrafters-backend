require('dotenv').config(); // Load environment variables from .env file

module.exports = {
  development: {
    username: process.env.USERNAME,
    password: process.env.PASSWORD,
    database: process.env.DB,
    host: process.env.HOST,
    dialect: process.env.DIALECT
  },
  test: {
    username: process.env.USERNAME,  // Adjust username if needed
    password: process.env.PSQL_PASSWORD,
    database: process.env.DB,  // Specify a different database name for testing
    host: process.env.HOST,  // Should match the service name in docker-compose.yml
    dialect: process.env.DIALECT,
  },
  production: {
    username: process.env.USERNAME,
    password: process.env.PASSWORD,
    database: process.env.DB,
    host: process.env.HOST,
    dialect: process.env.DIALECT,
    port: process.env.DB_PORT,
  },
};