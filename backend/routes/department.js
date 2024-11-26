const express = require('express');
const router = express.Router();
const departmentCtrl = require('../controllers/department');
const auth = require('../middleware/auth');


router.get('/', auth.authenticateUser, departmentCtrl.getDepartments);
router.post('/', auth.authenticateUser, auth.requireAdmin, departmentCtrl.createDepartment);
router.put('/:id', auth.authenticateUser, auth.requireAdmin, departmentCtrl.updateDepartments);
router.delete('/:id', auth.authenticateUser, auth.requireAdmin, departmentCtrl.deleteDepartment);


module.exports = router;