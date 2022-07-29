const db = require('./../models')
const Tutorial = db.tutorials
const Op = db.Sequelize.Op
const Comment = db.comments

exports.create = (req, res) => {
  console.log(req.body)

  const tutorial = {
    userId: req.auth.userId,
    name: req.body.name,
    imageUrl: req.file ? `${req.protocol}://${req.get('host')}/images/${req.file.filename}` : null,
    description: req.body.description,
    published: req.body.published ? req.body.published : false,
    isAdmin: req.body.isAdmin ? req.body.isAdmin : false
  };


  // Save Tutorial in the database
  Tutorial.create(tutorial)

    .then(response => {
      const post = response.get({ plain: true })
      post.comments = []
      console.log(post)
      res.send(post)
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Une erreur est survenue lors de la création du tutoriel."
      })
    })
}

// retrieve all Tutorials from the database.
exports.findAll = (req, res) => {
  const title = req.query.title;
  let condition = title ? { title: { [Op.like]: `%${title}%` } } : null

  Tutorial.findAll({ where: condition })
    .then(data => {
      res.send(data)
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Une erreur est survenue lors de la récupération du tutoriel."
      })
    })
}

// Find a single Tutorial with an id
exports.findOne = (req, res) => {
  const id = req.params.id

  Tutorial.findByPk(id)
    .then(data => {
      if (data) {
        res.send(data)
      } else {
        res.status(404).send({
          message: "Tutoriel non trouvé avec l'id " + id
        })
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Erreur lors de la récupération du tutoriel avec l'id " + id
      })
    })
}

// Update a Tutorial by the id in the request
exports.update = (req, res) => {
  const id = req.params.id

  Tutorial.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Tutoriel mis à jour avec succès"
        })
      } else {
        res.sen({
          message: `Aucun tutoriel trouvé avec l'id ${id}`
        })
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Erreur lors de la mise à jour du tutoriel avec l'id " + id
      })
    })
}

// Delete a Tutorial with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id
  Tutorial.findByPk(id).then(post => {
    console.log('clg de post ', post);
   
    if (post.userId === req.auth.userId || req.auth.isAdmin === true) {
     
      Tutorial.destroy({
        where: { id: id }
      }).then(num => {
        if (num == 1) {
          res.send({
            message: "Tutoriel supprimé avec succès"
          })
        } else {
          res.send({
            message: `Aucun tutoriel trouvé avec l'id ${id}`
          })
        }
      }).catch(err => {
        res.status(500).send({
          message: "Erreur lors de la suppression du tutoriel avec l'id " + id
        })
      })

    }
  })


}

// Delete all Tutorials from the database
exports.deleteAll = (req, res) => {
  Tutorial.destroy({
    where: {},
    truncate: false
  })
    .then(nums => {
      res.send({ message: `${nums} Tutoriels supprimés avec succès ` });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Une erreur est survenue lors de la suppression des tutoriels."
      })
    })
}

// Find all published Tutorials
exports.findAllPublished = (req, res) => {
  Tutorial.findAll({ raw: true, where: { published: true }, include: ['user'] })
    .then(tutos => {
      Comment.findAll().then(comments => {
        const tutosWithComments = tutos.map(tuto => {
          console.log(tuto)
          tuto.comments = [];
          comments.forEach(comment => {
            if (comment.tutorialId === tuto.id) {
              tuto.comments.push(comment);
            }
          })
          return tuto;
        })
        //console.log(tutosWithComments);
        res.send(tutosWithComments);
      })
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Une erreur est survenue lors de la récupération des tutoriels publiés"
      })
    })
}

exports.createComment = (req, res) => {

  const comment = {
    name: req.body.name,
    text: req.body.text,
    tutorialId: req.body.tutorialId,
    userId: req.auth.userId
  };
  console.log(comment);
  Comment.create(comment)
    .then((data) => {
      console.log(">> Created comment: " + JSON.stringify(data, null, 4))
      res.send(data)
    })
    .catch((err) => {
      console.log(">> Error while creating comment: ", err)
    })
};

exports.deleteComment = (req, res) => {
  const id = req.params.id;
  const commentId = req.params.commentId;
  Comment.findByPk(commentId).then(comment => {
    if (req.auth.userId === comment.userId || req.auth.isAdmin === true) {
      Comment.destroy({
        where: { id: commentId, tutorialId: id }
      })
        .then(num => {
          if (num == 1) {
            res.send({
              message: "Commentaire supprimé avec succès"
            })

          } else {
            res.send({
              message: `Aucun commentaire trouvé avec l'id ${commentId}`
            })
          }
        })
        .catch(err => {
          res.status(500).send({
            message: "Erreur lors de la suppression du commentaire avec l'id " + commentId
          })
        })
    }
  })


}

exports.findTutorialById = (tutorialId) => {
  return Tutorial.findByPk(tutorialId, { include: ["comments"] })
    .then((tutorial) => {
      return tutorial
    })
    .catch((err) => {
      console.log(">> Error while finding tutorial: ", err)
    })
};

exports.findCommentById = (id) => {
  return Comment.findByPk(id, { include: ["tutorial"] })
    .then((comment) => {
      return comment;
    })
    .catch((err) => {
      console.log(">> Error while finding comment: ", err);
    });
};

exports.findAll = () => {
  return Tutorial.findAll({
    include: ["comments"],
  }).then((tutorials) => {
    return tutorials;
  });
};
