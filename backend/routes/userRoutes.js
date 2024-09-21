const express = require('express');
const { registerUser, authUser, allUsers, fetchAllUsers } = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

// protect function is for checking that user is authorized for this functionalities or not
router.route('/').post(registerUser).get(protect,allUsers);
router.post('/login', authUser);
router.post('/allUsers', fetchAllUsers);


module.exports = router;
