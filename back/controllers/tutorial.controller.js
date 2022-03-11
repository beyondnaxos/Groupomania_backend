const db = require('./../models')
const Tutorial = db.tutorials
const Op = db.Sequelize.Op
const Comment = db.comments

exports.create = (req, res ) => {
console.log(req.body)

  const tutorial = {
    userId : req.auth.userId,
    name: req.body.name,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    description: req.body.description,
    published: req.body.published ? req.body.published : false,
    isAdmin: req.body.isAdmin ? req.body.isAdmin : false
  };
  

  // Save Tutorial in the database
  Tutorial.create(tutorial )

    .then(response => {
      const post = response.get({ plain: true })
      post.comments=[]
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


// exports.likeAndDislike = (req, res) => {
//   // récupère l'user id
//   let userId = req.body.userId
//   // récupère sauce id
//   let postId = req.params.id
//   // récupère 'like' dans le corps de requête
//   let like = req.body.like

//   // si l'utilisateur aime le post incrémente le nombre de likes
//   if (like === 1) {
//       Tutorial.update(
//           //push de l'user id et du like dans un tableau
//           { _id: postId }, { $push: { usersLiked: userId }, $inc: { likes: +1 } }
//       )
//           .then(() => res.status(200).json({ message: 'like added' }))
//           .catch((error) => res.status(400).json({ error }))
//   }

//   // si l'utilisateur n'aime pas le post incrémente le nombre de dislikes
//   if (like === -1) {
//       Tutorial.update(
//           // push de l'user id et du dilike dans un tableau
//           { _id: postId }, { $push: { usersDisliked: userId }, $inc: { dislikes: +1 } }
//       )
//           .then(() => res.status(200).json({ message: 'diskike added' }))
//           .catch((error) => res.status(400).json({ error }))
//   }

//   // Retrait du like dislike de l'utilisateur
//   if (like === 0) {
//       Tutorial.findOne({
//           _id: postId,
//       })
//           .then((tutorial) => {
//               // retire le like si l'utilisateur à déjà like le post
//               if (tutorial.usersLiked.includes(userId)) {
//                   Tutorial.update(
//                       //pull de l'user id et du like du tableau
//                       { _id: postId }, { $pull: { usersLiked: userId }, $inc: { likes: -1 } }
//                   )
//                       .then(() => res.status(200).json({ message: 'like removed' }))
//                       .catch((error) => res.status(400).json({ error }))
//               }
//               // retire le dislike si l'utilisateur à déjà dislike le post
//               if (tutorial.usersDisliked.includes(userId)) {
//                   Tutorial.update(
//               //pull de l'user id et du dislike du tableau
//                       { _id: postId }, { $pull: { usersDisliked: userId }, $inc: { dislikes: -1 } }
//                   )
//                       .then(() => res.status(200).json({ message: 'dislike removed' }))
//                       .catch((error) => res.status(400).json({ error }))
//               }
//           })
//           .catch((error) => res.status(400).json({ error }))
//   }
// }

// retrieve all Tutorials from the database.
exports.findAll = (req, res) => {
    const title = req.query.title;
    let condition = title ? { title: { [Op.like]: `%${title}%` } } : null

    Tutorial.findAll({  where: condition })
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
     Tutorial.findByPk(id).then(post => {
       console.log('clg de post ' , post);
       console.log('clg de post.user ' , post.userId);  
       console.log('clg de req.auth.userId ' , req.auth.userId);  
       if (post.userId === req.auth.userId || req.auth.isAdmin === true) {

             Tutorial.destroy({
                 where: {id: id}
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
          if(comment.tutorialId === tuto.id) {
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


  exports.createComment = (req, res) => {

    const comment = {
      name: req.body.name,
      text: req.body.text,
      tutorialId: req.body.tutorialId,
    };

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
   
    // if (req.auth.isAdmin === true) {
    Comment.destroy({
      where: { id: commentId , tutorialId: id }
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
    // }
  
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
