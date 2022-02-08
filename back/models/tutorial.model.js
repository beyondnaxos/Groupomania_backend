module.exports = (sequelize, Sequelize) => {
    const Tutorial = sequelize.define("tutorial", {
      userId: {
        type: Sequelize.STRING
      },
      token: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.STRING
      },
      published: {
        type: Sequelize.BOOLEAN
      }
    })
  
    return Tutorial
  }