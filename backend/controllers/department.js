const User = require('../models/user');
const Department = require('../models/department');



exports.createDepartment = async (req, res, next) => {

  const { name } = req.body;

  try {
    const userId = req.user._id;
    const user = await User.findById(userId).populate('companyId');

    const companyId = user.companyId._id;

    // Check if the department with the name already exists
    const existingDepartment = await Department.findOne({ name, companyId });

    if (existingDepartment) {
      return res.status(400).json({ error: 'Department with this name already exists' });
    }


    const department = new Department({ name, companyId });
    const savedDepartment = await department.save();

    res.status(201).json({ department: savedDepartment });
  } catch (error) {
    console.error('Error creating department:', error);
    res.status(500).json({ error: error.message });
  }
}

exports.getDepartments = (req, res, next) => {
  const companyId = req.user.companyId;

  Department.find({ companyId: companyId })
  .select('-__v')
    .then((departments) => {
      res.status(200).json(departments);
    })
    .catch((error) => {
      res.status(500).json({
        error: error
      })
    })
}

exports.updateDepartments = (req, res, next) => {
  const id = req.params.id;

  Department.findOne({ _id: id })
    .then((department) => {
      if (!department) {
        return res.status(404).json({ error: 'Department not found' });
      }
      department.name = req.body.name || department.name;

      return department.save();
    })
    .then((updatedDepartment) => {
      if (updatedDepartment) {
        res.status(200).json(updatedDepartment);
      }
    })
    .catch((error) => {
      res.status(500).json({ error: error.message });
    })

}

exports.deleteDepartment = async (req, res, next) => {
  const departmentId = req.params.id;

  try {
    /// check if there are employees in the department
    const employeesInDepartment = await User.find({ departmentId })

    if (employeesInDepartment.length > 0) {
      return res.status(400).json({
        error: 'Department cannot be deleted as it contains linked employees.'
      });
    }

    const deletedDepartment = await Department.findByIdAndDelete(departmentId)

    if (!deletedDepartment) {
      return res.status(404).json({ error: 'Department not found' });
    }

    res.status(200).json({ message: 'Department deleted successfully' });
  }
  catch (error) {
    console.error('Error deleting department')
    res.status(500).json({ error: error.message });
  }
}