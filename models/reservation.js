'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Reservation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Reservation.belongsTo(models.Course, {
        foreignKey: 'courseId',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'
      });
      Reservation.belongsTo(models.User, {
        foreignKey: 'userId',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'
      });
      Reservation.belongsTo(models.Availability, {
        foreignKey: 'availabilityId',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'
      });
      Reservation.hasMany(models.Review, {
        foreignKey: 'reservationId',
        as: 'reviews'
      });
    }
  }
  Reservation.init({
    isCancelled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    isReviewed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    courseId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Courses', // name of Target model
        key: 'id', // key in Target model that the foreign key refers to
      }
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Users', // name of Target model
        key: 'id', // key in Target model that the foreign key refers to
      }
    },
    availabilityId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Availabilities', // name of Target model
        key: 'id', // key in Target model that the foreign key refers to
      }
    }
  }, {
    sequelize,
    modelName: 'Reservation',
  });
  return Reservation;
};

