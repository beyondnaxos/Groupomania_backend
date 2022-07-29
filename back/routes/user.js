const express = require('express') 
const router = express.Router() 
const userCtrl = require('../controllers/user') 
const cryptEmail = require('../middleware/cryptEmail')
const validPass = require('../middleware/validPass')
const auth = require('../middleware/auth')


// Create a new user
router.post('/signup',validPass, cryptEmail, userCtrl.signup) 

// Login a user
router.post('/login', cryptEmail, userCtrl.login) 

// Delete a user
router.delete('/users/:id', auth, userCtrl.deleteUser) 

// Get users list
router.get('/users',auth, userCtrl.getAllUsers)

module.exports = router
