const express = require('express');
const { protect } = require('../middlewares/authMiddleware');
const { accessChat, fetchChats, createGroupChat, renameGroup, removeFromGroup, addToGroup, deleteGroup } = require('../controllers/chatControllers');

const router = express.Router();

router.route('/').post(protect, accessChat);
router.route('/').get(protect, fetchChats);
router.route('/group').post(protect, createGroupChat);
router.route('/rename').put(protect, renameGroup);
router.route('/groupremove').put(protect, removeFromGroup);
router.route('/groupadd').put(protect, addToGroup);
router.route('/deletegroup').put(protect, deleteGroup);

module.exports = router;

