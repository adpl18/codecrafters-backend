'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Course extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Course.belongsTo(models.User, {
        foreignKey: 'userId',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'
      });
      Course.hasMany(models.Reservation, {
        foreignKey: 'courseId',
        as: 'reservations'
      });
    }
  }
  Course.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING
    },
    category: {
      type: DataTypes.STRING
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
    modelName: 'Course',
  });
  return Course;
};

