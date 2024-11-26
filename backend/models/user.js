const mongoose = require('mongoose');
const Company = require('./company')
const Department = require('./department')
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    roles: { type: [String], enum: ['ADMIN', 'LINE_MANAGER', 'EMPLOYEE'], default: ['EMPLOYEE'] },
    departmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
    lineManagerId: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    initialLeaveBalance: { type: Number, default: 0 },
    leaveBalance: { type: Number, default: 0 },
    profilePicture: { type: String, default: "" }
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('user', userSchema);