'use strict';
module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define('User', {
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    email: DataTypes.STRING,
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    gender: DataTypes.STRING,
    address: DataTypes.STRING
  });
  User.associate=function(models){
      User.hasMany(models.Post);
      User.hasMany(models.User_Post);
      User.belongsToMany(models.Post,{through:models.User_Post});
  }
  return User;
};
