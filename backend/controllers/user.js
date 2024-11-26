const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const Company = require('../models/company');
const Department = require('../models/department');
const jwt = require('jsonwebtoken');
const emailService = require('../services/emailService');
require('dotenv').config();




exports.signup = async (req, res, next) => {

  const { companyName, firstName, lastName, email, password } = req.body;

  if (!password || password.trim() === '') {
    return res.status(400).json({ error: 'Password cannot be empty' });
  }

  const company = new Company({
    name: companyName,
  });

  await company.save().then((savedCompany) => {
    company._id = savedCompany._id;
  });

  const department = new Department({
    name: "HR",
    companyId: company._id
  });
  await department.save().then((savedDepartment) => {
    department._id = savedDepartment._id;
  });


  bcrypt.hash(password, 10).then(
    (hash) => {
      const user = new User({
        companyId: company._id,
        firstName,
        lastName,
        email,
        password: hash,
        roles: ['ADMIN', 'EMPLOYEE'],
        departmentId: department._id,
        lineManagerId: null,
      })

      user.save().then(
        () => {
          res.status(201).json({
            message: 'User created successfully!'
          });
        }).catch(
          (error) => {
            res.status(500).json({
              error: error
            })
          })
    });
}

exports.addUser = async (req, res, next) => {
  const { firstName, lastName, email, roles, departmentId, lineManagerId, leaveBalance, password } = req.body;

  if (!req.user.roles.includes('ADMIN')) {
    return res.status(403).json({
      error: 'Only admins can add users!',
    });
  }

  const adminCompany = req.user.companyId;
  const rolesWithDefault = [...roles, 'EMPLOYEE'];

  if (leaveBalance < 0) {
    return res.status(400).json({
      error: 'Leave balance cannot be negative!',
    });
  }

  try {
    const hash = await bcrypt.hash(password, 10);

    const user = new User({
      companyId: adminCompany,
      firstName,
      lastName,
      email,
      departmentId,
      roles: [...new Set(rolesWithDefault)],
      lineManagerId: lineManagerId || null,
      initialLeaveBalance: leaveBalance,
      leaveBalance,
      password: hash,
    });

    await user.save();

    const subject = 'Invitation to Leave Tracker App';
    const message = `Hello ${firstName}, Welcome to LTA<hr><br>To login to the system use the following details<br>
         Email: ${email}<br>Password (Temporary): ${password}`;

    emailService.sendMail(email, subject, message);

    res.status(201).json({
      message: 'User added successfully!',
    });
  } catch (error) {
    console.error('Error during addUser:', error);
    res.status(500).json({
      error: error,
    });
  }
};

exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email }).then(
    (user) => {
      if (!user) {
        return res.status(401).json({
          error: new Error('User not found!')
        });
      }
      bcrypt.compare(req.body.password, user.password).then(
        (valid) => {
          if (!valid) {
            return res.status(401).json({
              error: new Error('Incorrect password!')
            });
          }
          const token = jwt.sign(
            { userId: user._id, roles: user.roles, companyId: user.companyId },
            process.env.APP_SECRET,
            { expiresIn: '24h' });
          res.status(200).json({
            userId: user._id,
            token: token
          });
        }
      ).catch(
        (error) => {
          res.status(500).json({
            error: error
          });
        }
      );
    }
  ).catch(
    (error) => {
      res.status(500).json({
        error: error
      });
    }
  );
}

exports.getCurrentUser = (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1];

  jwt.verify(token, process.env.APP_SECRET, (err, decodedToken) => {
    if (err) {
      return res.status(401).json({
        error: 'Unauthorized'
      });
    }

    const userId = decodedToken.userId;

    User.findById(userId)
      .select('-password')
      .populate('companyId', '-__v')
      .then((user) => {
        if (!user) {
          return res.status(404).json({
            error: 'User not found'
          });
        }

        res.status(200).json(user);
      })
      .catch((error) => {
        res.status(500).json({
          error: error
        });
      });
  });
};

exports.getAllUsers = (req, res, next) => {
  User.find()
    .select('-password')
    .populate('companyId', '-__v')
    .populate('departmentId', '-__v')
    .populate('lineManagerId', 'firstName lastName email')
    .then((users) => {

      res.status(200).json(users);
    })
    .catch((error) => {
      res.status(500).json({
        error: error
      })
    })
};

exports.getUsersByDepartment = async (req, res, next) => {
  const companyId = req.user.companyId;
  const departmentId = req.params.id;

  try {
    // Check if the department exists within the company
    const department = await Department.findOne({ _id: departmentId, companyId: companyId });

    if (!department) {
      return res.status(404).json({ error: 'Department doesn\'t exist in the company' });
    }

    const users = await User.find({ companyId: companyId, departmentId: departmentId })
      .select('-password')
      .populate('departmentId', '-__v');

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getLineManagers = (req, res, next) => {

  const companyId = req.user.companyId;

  User.find({ roles: 'LINE_MANAGER', companyId }, 'firstName lastName email roles companyId departmentId')
    .then((lineManagers) => {
      res.status(200).json(lineManagers);
    })
    .catch((error) => {
      res.status(500).json({
        error: error
      })
    })
}

exports.getLineManagersByDepartment = (req, res, next) => {
  const companyId = req.user.companyId;

  const departmentId = req.params.departmentId;

  User.find({ companyId: companyId, departmentId: departmentId, roles: { $in: ['LINE_MANAGER'] } }, 'firstName lastName email roles companyId departmentId')
    .then((lineManagers) => {

      res.status(200).json(lineManagers);
    })
    .catch((error) => {
      res.status(500).json({
        error: error
      })
    })
}

exports.getUsersByCompanyId = async (req, res, next) => {
  const companyId = req.user.companyId;

  const page = req.query.page || 0;
  const usersPerPage = req.query.usersPerPage || 10;

  try {
    const totalRecords = await User.countDocuments({ companyId });

    const users = await User.find({ companyId })
      .skip(page * usersPerPage)
      .limit(usersPerPage)
      .select("-password")
      .populate('companyId', '-__v')
      .populate('departmentId', '-__v')
      .populate('lineManagerId', 'firstName lastName email')


    res.status(200).json({ users, totalRecords });
  }
  catch (error) {
    res.status(500).json({
      error: error
    })
  };

}

exports.updateUser = (req, res, next) => {
  const userId = req.user._id;

  User.findById(userId)
    .select("-password")
    .then((user) => {
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      user.firstName = req.body.firstName || user.firstName;
      user.lastName = req.body.lastName || user.lastName;

      return user.save();
    })
    .then((updatedUser) => {
      if (!res.headersSent) {
        res.status(200).json(updatedUser);
      }
    })
    .catch((error) => {
      res.status(500).json({
        error: error.message
      })
    })
}

exports.updateProfilePicture = async (req, res, next) => {
  const userId = req.user._id;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.profilePicture = req.body.profilePicture || user.profilePicture;

    await user.save();

    if (!res.headersSent) {
      res.status(200).json({
        message: 'Profile picture updated successfully!'
      });
    }
  } catch (error) {
    console.error('Error during updateProfilePicture:', error);
    res.status(500).json({ error: 'Failed to update profile picture' });
  }
}

exports.updateUserDepartmentAndLineManager = (req, res, next) => {
  const userId = req.params.id;
  const companyId = req.user.companyId;

  User.findOne({ _id: userId, companyId: companyId })
    .select('-password')
    .then((user) => {
      if (!user) {
        return res.status(404).json({ error: 'User not found in your company' });
      }

      user.departmentId = req.body.departmentId || user.departmentId;
      user.lineManagerId = req.body.lineManagerId || null;

      return user.save();
    })
    .then((updatedUser) => {
      if (!res.headersSent) {
        res.status(200).json(updatedUser);
      }
    })
    .catch((error) => {
      res.status(500).json({
        error: error.message
      })
    })

}