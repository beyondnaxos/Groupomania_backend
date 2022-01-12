// module.exports = (sequelize, Sequelize) => {
//     const User = sequelize.define('user', {
//       email: Sequelize.STRING,
//       username: Sequelize.STRING,
//       password: Sequelize.STRING
//     });
//     // User.associate = function(models) {
//     //   // les associations peuvent être définies ici
//     // };
    
//     return User;
//   };

  module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("user", {
      email: {
        type: Sequelize.STRING,
        allowNull: false ,
        unique: true
      },
      username: {
        type: Sequelize.STRING
      },
      password: {
        type: Sequelize.STRING
      }
    })
  
    return User
  }