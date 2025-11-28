const express = require('express');
const router = express.Router();
const { adminAuth } = require('../middleware/adminMiddleware');

const { adminLogin, getAllUsers, addUser, editUser,getUser, deleteUser } = require('../Controllers/adminController')

// login
router.post('/login', adminLogin);

router.post('/users',adminAuth, addUser);
router.get('/users',adminAuth,getAllUsers);
router.delete('/users/:id',adminAuth, deleteUser);
router.put('/users/:id',adminAuth, editUser);
router.get('/users/:id',adminAuth,getUser)


module.exports = router;
