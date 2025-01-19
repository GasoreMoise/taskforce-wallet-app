const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { validateUpdateProfile } = require('../middlewares/validate');


router.get('/profile', userController.getProfile);
router.patch('/profile', validateUpdateProfile, userController.updateProfile);
router.patch('/password', userController.updatePassword);
router.delete('/account', userController.deleteAccount);



module.exports = router; 