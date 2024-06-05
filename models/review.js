'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Review.belongsTo(models.Reservation, {
        foreignKey: 'reservationId',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'
      });
    }
  }
  Review.init({
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    comment: {
      type: DataTypes.STRING,
      allowNull: true
    },
    reservationId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Reservations', // name of Target model
        key: 'id', // key in Target model that the foreign key refers to
      }
    }
  }, {
    sequelize,
    modelName: 'Review',
  });
  return Review;
};

