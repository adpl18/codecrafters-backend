const { sequelize } = require('./models');

module.exports = async () => {
  await sequelize.sync({ force: true });
  // You can also create your test database here if needed
  // e.g., await sequelize.query('CREATE DATABASE database_test;');
};