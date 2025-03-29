const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const {protect}=require('../middleware/authMiddleware');


router.get('/current',protect,userController.getCurrentUser );
router.get('/login',userController.loginUser );
router.post('/register',userController.registerUser)

module.exports = router;