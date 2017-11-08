'use strict';
module.exports = (sequelize, DataTypes) => {
  var User_Post = sequelize.define('User_Post', {
    UserId: DataTypes.INTEGER,
    PostId: DataTypes.INTEGER,
    status: DataTypes.BOOLEAN
  });
  User_Post.associate=function(models){
      User_Post.belongsTo(models.Post);
      User_Post.belongsTo(models.User);
  }
  return User_Post;
};
