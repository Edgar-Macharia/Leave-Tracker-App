const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');
const auth = require('../middleware/auth')

router.post('/auth/signup', userCtrl.signup);
router.post('/add-user', auth.authenticateUser, auth.requireAdmin, userCtrl.addUser);
router.post('/auth/login', userCtrl.login);

router.get('/auth/current-user', userCtrl.getCurrentUser);
router.get('/users', userCtrl.getAllUsers);
router.get('/company/users', auth.authenticateUser, userCtrl.getUsersByCompanyId);
router.get('/department/:id', auth.authenticateUser, userCtrl.getUsersByDepartment);
router.put('/users', auth.authenticateUser, userCtrl.updateUser);
router.put('/users/profile-picture', auth.authenticateUser, userCtrl.updateProfilePicture);
router.put('/users/:id', auth.authenticateUser, auth.requireAdmin, userCtrl.updateUserDepartmentAndLineManager);

router.get('/line-managers', auth.authenticateUser, userCtrl.getLineManagers);
router.get('/line-managers/:departmentId', auth.authenticateUser, userCtrl.getLineManagersByDepartment);


module.exports = router