const mongoose = require('mongoose')


const companySchema = mongoose.Schema({
    name: { type: String, required: true },
});

module.exports = mongoose.model('Company', companySchema);