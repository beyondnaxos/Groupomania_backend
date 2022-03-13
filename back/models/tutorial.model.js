module.exports = (sequelize, Sequelize) => {
    const Tutorial = sequelize.define("tutorial", {
      name : {
        type: Sequelize.STRING,
        allowNull: false
      },
      imageUrl: {
        type: Sequelize.STRING,
        allowNull: true,
        
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
