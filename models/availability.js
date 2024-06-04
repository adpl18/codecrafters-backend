'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Availability extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Availability.belongsTo(models.User, {
        foreignKey: 'userId',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'
      });
      Availability.hasMany(models.Reservation, {
        foreignKey: 'availabilityId',
        as: 'reservations'
      });
    }
  }
  Availability.init({
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    startTime: {
      type: DataTypes.TIME,
      allowNull: false
    },
    endTime: {
      type: DataTypes.TIME,
      allowNull: false
    },
    isAvailable: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Users', // name of Target model
        key: 'id', // key in Target model that the foreign key refers to
      }
    }
  }, {
    sequelize,
    modelName: 'Availability',
  });
  return Availability;
};

