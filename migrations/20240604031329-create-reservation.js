'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Reservations', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      isCancelled: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      isReviewed: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      courseId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Courses', // name of Target model
          key: 'id', // key in Target model that the foreign key refers to
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        allowNull: true
      },
      userId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users', // name of Target model
          key: 'id', // key in Target model that the foreign key refers to
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        allowNull: true
      },
      availabilityId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Availabilities', // name of Target model
          key: 'id', // key in Target model that the foreign key refers to
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('Reservations');
  }
};

