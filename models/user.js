'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasMany(models.Course, {
        foreignKey: 'userId',
        as: 'courses'
      });
      User.hasMany(models.Availability, {
        foreignKey: 'userId',
        as: 'availabilities'
      });
      User.hasMany(models.Reservation, {
        foreignKey: 'userId',
        as: 'reservations'
    });
    }
  }
  User.init({
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING,
    birthdate: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};