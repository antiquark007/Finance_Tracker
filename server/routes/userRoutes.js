const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');


router.get('/',userController.getCurrentUser );
router.get('/login',userController.loginUser );
router.post('/',userController.registerUser)

module.exports = router;