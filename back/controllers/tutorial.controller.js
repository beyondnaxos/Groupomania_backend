const db = require('./../models')
const Tutorial = db.tutorials
const Op = db.Sequelize.Op
const Comment = db.comments

// Create and Save a new Tutorial
exports.create = (req, res ) => {
  // Validate request
  // if (!req.body.title) {
  //   res.status(400).send({
  //     message: "LE contenu ne peut être vide"
  //   })
  //   return
  // }

  // Create a Tutorial
  const tutorial = {
    userId : req.body.userId,
    token : req.body.token,
    description: req.body.description,
    published: req.body.published ? req.body.published : false
  };

  // Save Tutorial in the database
  Tutorial.create(tutorial)
    .then(data => {
      res.send(data)
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
        if ( data ) {
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
        where : { id : id }
    })
    .then (num => {
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

 Tutorial.destroy({
        where: { id: id }
 })
 .then(num => {
     if (num == 1 ) {
         res.send({
                message: "Tutoriel supprimé avec succès"
         })
     }else {
         res.send ({
                message: `Aucun tutoriel trouvé avec l'id ${id}`
         })
     }
 })
 .catch(err => {
     res.status(500).send({
            message: "Impossible de supprimer le tutoriel avec l'id " + id
     })
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
    Tutorial.findAll({ where: { published: true } })
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message ||  "Une erreur est survenue lors de la récupération des tutoriels publiés"
        });
      });
  };

  //-------------------------------------------------

  exports.createTutorial = (tutorial) => {
    return Tutorial.create({
      title: tutorial.title,
      description: tutorial.description,
    })
      .then((tutorial) => {
        console.log(">> Created tutorial: " + JSON.stringify(tutorial, null, 4));
        return tutorial;
      })
      .catch((err) => {
        console.log(">> Error while creating tutorial: ", err);
      });
  };


  exports.createComment = (tutorialId, comment) => {
    return Comment.create({
      name: comment.name,
      text: comment.text,
      tutorialId: tutorialId,
    })
      .then((comment) => {
        console.log(">> Created comment: " + JSON.stringify(comment, null, 4));
        return comment;
      })
      .catch((err) => {
        console.log(">> Error while creating comment: ", err);
      });
  };

  exports.findTutorialById = (tutorialId) => {
    return Tutorial.findByPk(tutorialId, { include: ["comments"] })
      .then((tutorial) => {
        return tutorial;
      })
      .catch((err) => {
        console.log(">> Error while finding tutorial: ", err);
      });
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