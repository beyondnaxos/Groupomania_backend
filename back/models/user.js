module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define('User', {
      email: Sequelize.STRING,
      username: Sequelize.STRING,
      password: Sequelize.STRING
    }, {});
    User.associate = function(models) {
      // les associations peuvent être définies ici
    };
    
    return User;
  };