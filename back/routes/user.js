const express = require('express') 
const router = express.Router() 
const userCtrl = require('../controllers/user') 
const cryptEmail = require('../middleware/cryptEmail')
const validPass = require('../middleware/validPass')
const auth = require('../middleware/auth')

router.post('/signup',validPass, cryptEmail, userCtrl.signup) 
router.post('/login', cryptEmail, userCtrl.login) 
router.delete('/users/:id', auth, userCtrl.deleteUser) 

module.exports = router
