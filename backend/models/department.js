const mongoose = require('mongoose');
const Company = require('./company');


const departmentSchema = mongoose.Schema({
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
    name: { type: String, required: true }
});

module.exports = mongoose.model('Department', departmentSchema);