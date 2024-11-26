const mongoose = require('mongoose');

const leaveSchema = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    leaveType: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    fileUpload: { type: String },
    reason: { type: String },
    status: { type: String, enum: ['Waiting for Approval', 'Approved', 'Rejected', 'Cancelled'], default: 'Waiting for Approval' },
    lastModifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'user' }
});

module.exports = mongoose.model('Leave', leaveSchema);
