'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add the new column 'category' to the 'Course' table
    await queryInterface.addColumn('Courses', 'category', {
      type: Sequelize.STRING,
      allowNull: true
    });
  },

  down: async (queryInterface) => {
    // Remove the 'category' column from the 'Course' table
    await queryInterface.removeColumn('Courses', 'category');
  }
};

