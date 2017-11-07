'use strict';
module.exports = (sequelize, DataTypes) => {
  var Post = sequelize.define('Post', {
    title: DataTypes.STRING,
    content: DataTypes.TEXT,
    UserId: DataTypes.INTEGER
  });
  Post.associate=function(models){
      Post.belongsTo(models.User);
      Post.hasMany(models.User_Post);
      Post.belongsToMany(models.User,{through:models.User_Post});
  }
  return Post;
};
