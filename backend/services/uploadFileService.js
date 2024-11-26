const User = require('../models/user');
const Department = require('../models/department');
const excelToJson = require('convert-excel-to-json');
const fs = require('fs');
const generator = require('generate-password');
const emailService = require('./emailService');
const bcrypt = require('bcrypt');


// Upload excel file and import to mongodb
exports.uploadFile = async (req, res) => {
  try {
    const companyId = req.user.companyId;

    const filePath = __dirname + '/../uploads/' + req.file.filename

    await importExcelData2MongoDB(filePath, companyId);
    res.status(201).json({
      success: true,
      message: "uploaded successfully",
    });
  } catch (err) {
    console.error('Error handling file upload:', err);
    res.status(500).json({ error: err.message });
  }
}

// Import Excel File to MongoDB database
async function importExcelData2MongoDB(filePath, companyId) {
  try {
    //  Read Excel File to Json Data
    const excelData = excelToJson({
      sourceFile: filePath,
      sheets: [{
        name: 'Employees',
        header: { rows: 1 },
        columnToKey: {
          A: 'firstName',
          B: 'lastName',
          C: 'email',
          D: 'isAdmin',
          E: 'isLineManager',
          F: 'departmentName',
          G: 'lineManagerEmail',
          H: 'leaveBalance',
        }
      }]
    });

    const result = await mapExcelDataToUserModel(excelData.Employees, companyId);
    const newUsers = result.mappedData;
    const userDetails = result.userDetails;

    // Insert Json-Object to MongoDB
    await User.insertMany(newUsers);

    for (const user of userDetails) {
      const subject = 'Invitation to Leave Tracker App';
      const message = `Hello ${user.firstName}, Welcome to LTA<hr><br>To login to the system use the following details<br>
         Email: ${user.email}<br>Password (Temporary): ${user.password}`;

      emailService.sendMail(user.email, subject, message);
    }

    console.log('Data imported successfully');
  } catch (err) {
    console.error('Error importing Excel data:', err);
    throw err;
  } finally {
    // Delete the uploaded file after processing
    fs.unlinkSync(filePath);
  }
}

// Function to map Excel data to backend user model
async function mapExcelDataToUserModel(data, companyId) {
  const mappedData = [];
  const userDetails = [];

  for (const row of data) {

    const password = generatePassword();
    userDetails.push({ firstName: row.firstName, lastName: row.lastName, email: row.email, password: password });

    const hashedPassword = await bcrypt.hash(password, 10)

    mappedData.push({
      firstName: row.firstName,
      lastName: row.lastName,
      email: row.email,
      roles: generateUserRoles(row),
      companyId: companyId,
      departmentId: await mapDepartmentToId(row.departmentName),
      lineManagerId: await mapLineManagerToId(row.lineManagerEmail),
      initialLeaveBalance: row.leaveBalance,
      leaveBalance: row.leaveBalance,
      password: hashedPassword,
    });
  }
  return { mappedData, userDetails };
}


// Helper functions
async function mapDepartmentToId(value) {
  const department = await Department.findOne({ name: value });
  return department ? department._id : null;
}

async function mapLineManagerToId(value) {
  const lineManager = await User.findOne({ email: value });
  return lineManager ? lineManager._id : null;
}

const generateUserRoles = (row) => {
  let roles = ["EMPLOYEE"]
  if (row.isAdmin === 'Yes') {
    roles.push("ADMIN");
  }
  if (row.isLineManager === 'Yes') {
    roles.push("LINE_MANAGER");
  }
  return roles;
}

function generatePassword() {
  return generator.generate({
    length: 10,
    numbers: true
  });
}
