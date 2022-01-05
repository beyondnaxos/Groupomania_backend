const bcrypt = require("bcrypt") 
const jwt = require('jsonwebtoken') 
require('dotenv').config()
const User = require("../models/user") 

exports.signup = (req, res, next) => {
  console.log(req)
    bcrypt.hash(req.body.password, 10)
      .then(hash => {
        const user = {
          email: req.email,
          username: req.body.username,
          password: hash
        }
        User.create(user)
          .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
          .catch(error => res.status(400).json({ message : 'Email déjà utilisé !'})) 
      })
      .catch(error => res.status(500).json({ error })) 
  } 

  exports.login = (req, res, next) => {
    User.findOne({ email: req.email })
      .then(user => {
        if (!user) {
          return res.status(401).json({ error: 'Utilisateur non trouvé !' }) 
        }
        bcrypt.compare(req.body.password, user.password)
          .then(valid => {
            if (!valid) {
              return res.status(401).json({ error: new Error('Mot de passe incorrect !') })
            }
            res.status(200).json({
              userId: user._id,
              token: jwt.sign(
                  {userId : user._id},
                  process.env.JWT_KEY,
                  { expiresIn: '24h' }
              )
            }) 
          })
          .catch(error => res.status(500).json({ error })) 
      })
      .catch(error => res.status(500).json({ error })) 
  } 
