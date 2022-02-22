module.exports = app => {
 
  const tutorials = require("./../controllers/tutorial.controller.js");

  var router = require("express").Router();
  const auth = require('../middleware/auth');
  const multer = require('../middleware/multer-config');



  // Create a new Tutorial
  router.post("/",auth, multer, tutorials.create);

  // Create Comment 
  router.post("/:tutorialId/comment", tutorials.createComment);
  
  // Retrieve all Tutorials
  router.get("/",auth, multer, tutorials.findAll);

  // Retrieve all published Tutorials
  router.get("/published" ,auth, multer,  tutorials.findAllPublished);

  // Retrieve a single Tutorial with id
  router.get("/:id", auth,  tutorials.findOne);

  // Update a Tutorial with id
  router.put("/:id",auth,tutorials.update);

  // Delete a Tutorial with id
  router.delete("/:id",auth, tutorials.delete);

  // Delete all Tutorials
  router.delete("/", auth, tutorials.deleteAll);

  app.use('/api/tutorials', router);
};