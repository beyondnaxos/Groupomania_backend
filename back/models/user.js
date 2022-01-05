module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
      email: DataTypes.STRING,
      username: DataTypes.STRING,
      password: DataTypes.STRING
    }, {});
    User.associate = function(models) {
      // les associations peuvent être définies ici
    };
    
    return User;
  };