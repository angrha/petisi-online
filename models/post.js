'use strict';
module.exports = (sequelize, DataTypes) => {
  var Post = sequelize.define('Post', {
    title: DataTypes.STRING,
    content: DataTypes.TEXT,
    UserId: DataTypes.INTEGER
  });
  Post.associate=function(models){
      Post.belongsTo(models.User);
  }
  return Post;
};
