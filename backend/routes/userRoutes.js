const express = require('express');
const router = express.Router();
const { registerUser,loginUser,updateUserProfile,getUserProfile } = require('../Controllers/userController')
const { protect } = require('../middleware/authmiddleware');




router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile',protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);



module.exports = router;
