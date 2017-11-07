'use strict';
module.exports = (sequelize, DataTypes) => {
  var User_Post = sequelize.define('User_Post', {
    UserId: DataTypes.INTEGER,
    PostId: DataTypes.INTEGER,
    status: DataTypes.BOOLEAN,
    comment: DataTypes.TEXT
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return User_Post;
};