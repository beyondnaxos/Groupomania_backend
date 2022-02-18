module.exports = (sequelize, Sequelize) => {
    const Tutorial = sequelize.define("tutorial", {
      userId: {
        type: Sequelize.STRING
      },
      imageUrl: {
        type: Sequelize.STRING,
        allowNull: true
      },
      description: {
        type: Sequelize.STRING
      },
      // like : {
      //   type: Sequelize.INTEGER
      // },
      // dislike : {
      //   type: Sequelize.INTEGER
      // },
      // usersLiked : {
      //   type: Sequelize.ARRAY (Sequelize.STRING)

      // },
      // usersDisliked : {
      //   type: Sequelize.ARRAY (Sequelize.STRING)
      // },
      published: {
        type: Sequelize.BOOLEAN
      }
    })
  
    return Tutorial
  }