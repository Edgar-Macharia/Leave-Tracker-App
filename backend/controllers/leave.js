const Leave = require('../models/leave');
const User = require('../models/user');
const emailService = require('../services/emailService');


//  create leave request
exports.createLeave = (req, res, next) => {
    if (!req.user || !req.user._id) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const { leaveType, startDate, endDate, fileUpload, reason } = req.body;
    const userId = req.user._id;

    User.findById(userId)
        .populate('lineManagerId')
        .then(async (user) => {
            if (!user || !user.leaveBalance) {
                return res.status(400).json({ error: 'Invalid user or leave balance' });
            }

            const leaveDays = calculateLeaveDays(startDate, endDate);
            if (user.leaveBalance < leaveDays) {
                return res.status(400).json({ error: `Insufficient leave balance: ${user.leaveBalance} days` });
            }

            const leave = new Leave({
                leaveType,
                startDate,
                endDate,
                fileUpload,
                reason,
                user: userId,
                lastModifiedBy: userId,
            });
            await leave.save()

            const recipient = user.lineManagerId.email
            const subject = `New request from ${user.firstName}`
            const message = `Hello ${user.lineManagerId.firstName},<br><br> ${user.firstName} ${user.lastName} sent ${leave.leaveType} request from ${formatDate(leave.startDate)} to ${formatDate(leave.endDate)} for ${leaveDays} day(s).`

            emailService.sendMail(recipient, subject, message);

            res.status(201).json(leave);
        })
        .catch((error) => {
            res.status(500).json({
                error: error
            });
        });
};
/// Helper functions
const calculateLeaveDays = (startDate, endDate) => {
    const startTimestamp = new Date(startDate).getTime();
    const endTimestamp = new Date(endDate).getTime();

    return Math.ceil((endTimestamp - startTimestamp) / (1000 * 3600 * 24) + 1);
};

const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
};


// Get all Leaves
exports.getAllLeaves = async (req, res, next) => {
    try {
        const companyId = req.user.companyId;

        // Fetch all users in the same company
        const usersInCompany = await User.find({ companyId: companyId });

        // Fetch leaves for users in the same company
        const leaves = await Leave.find({ user: { $in: usersInCompany.map(user => user._id) } })
            .populate("user", '-password')
            .populate("lastModifiedBy", 'firstName lastName email');

        res.status(200).json(leaves);
    } catch (error) {
        console.error('Error fetching leaves:', error);
        res.status(500).json({ error: error.message });
    }
};


//  Get all Leaves for a specific user
exports.getAllLeavesForUser = (req, res, next) => {
    const userId = req.user._id;

    Leave.find({ user: userId })
        .populate("lastModifiedBy", 'firstName lastName email')
        .then((userLeaves) => {

            res.status(200).json(userLeaves);
        })
        .catch((error) => {
            res.status(500).json({
                error: error
            });
        });
}

// Get one leave
exports.getOneLeave = (req, res, next) => {
    const id = req.params.id;

    Leave.findOne({ _id: id })
        .then((leave) => {

            if (!leave) {
                return res.status(404).json({ error: 'Leave not found' });
            }

            res.status(200).json(leave);
        })
        .catch((error) => {
            res.status(500).json({ error: error });
        });

}

// get leaves for a specific line-manager
exports.getLeavesForLineManager = (req, res, next) => {
    const lineManagerId = req.user._id;


    User.find({ lineManagerId })
        .then((users) => {
            usersUnderLineManager = users;
            return Leave.find({ user: { $in: users.map(user => user._id) } })
                .populate("user", '_id firstName lastName');
        })
        .then((leaves) => {
            res.status(200).json(leaves);
        })
        .catch((error) => {
            res.status(500).json({ error: error });
        });
};


// update leave
exports.updateLeave = (req, res, next) => {
    const id = req.params.id;
    const userId = req.user._id;

    Leave.findOne({ _id: id, user: userId })
        .then((leave) => {
            if (!leave) {
                return res.status(404).json({ error: 'Leave not found or unauthorized' });
            }

            leave.leaveType = req.body.leaveType || leave.leaveType;
            leave.startDate = req.body.startDate || leave.startDate;
            leave.endDate = req.body.endDate || leave.endDate;
            leave.fileUpload = req.body.fileUpload || leave.fileUpload;
            leave.reason = req.body.reason || leave.reason;
            leave.lastModifiedBy = userId;

            return leave.save();
        })
        .then((updatedLeave) => {
            if (!res.headersSent) {
                res.status(200).json(updatedLeave);
            }
        })
        .catch((error) => {
            res.status(500).json({
                error: error.message
            })
        })
}

// Delete Leave
exports.deleteLeave = (req, res, next) => {
    const id = req.params.id;
    const userId = req.user._id;

    Leave.findOneAndDelete({ _id: id, user: userId })
        .then((deletedLeave) => {
            if (!deletedLeave) {
                return res.status(404).json({ error: 'Leave not found or unauthorized' });
            }

            res.status(200).json({ message: 'Leave deleted successfully' });
        })
        .catch((error) => {
            res.status(500).json({
                error: error.message
            });
        });
}

// Approve Leave
exports.approveLeave = async (req, res, next) => {
    try {
        const leaveId = req.params.id;
        const managerId = req.user._id;

        // update leave request status
        const approvedLeave = await updateLeaveRequestStatus(leaveId, managerId, 'Approved');

        // update employee balance
        await updateEmployeeLeaveRequestBalance(approvedLeave);
        // send email notification
        await sendEmailApproval(approvedLeave)

        const result = await Leave.findById(leaveId);
        return res.status(200).json(result)
    }
    catch (error) {
        res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
}
async function updateLeaveRequestStatus(leaveId, managerId, newStatus) {
    return Leave.findById(leaveId)
        .then((leave) => {
            if (!leave) {
                throw new Error('Leave not found');
            }

            leave.status = newStatus;
            leave.lastModifiedBy = managerId;

            leave.save();
            return leave
        })
}

async function updateEmployeeLeaveRequestBalance(leave) {
    const user = await User.findById(leave.user);
    const leaveDays = calculateLeaveDays(leave.startDate, leave.endDate);
    user.leaveBalance -= leaveDays;
    return user.save();
}

async function sendEmailApproval(leave) {
    const user = await User.findById(leave.user);
    const lineManager = await User.findById(user.lineManagerId);

    const leaveDays = calculateLeaveDays(leave.startDate, leave.endDate);

    const recipient = user.email;
    const subject = 'Request Aprroved';
    const message = `Hello ${user.firstName},<br><br> Manager ${lineManager.firstName} ${lineManager.lastName} has approved your ${leave.leaveType} request
     from ${formatDate(leave.startDate)} to ${formatDate(leave.endDate)} for a duration of ${leaveDays} day(s).`

    emailService.sendMail(recipient, subject, message);
}

// Reject Leave
exports.rejectLeave = (req, res, next) => {
    const id = req.params.id;
    const managerId = req.user._id;

    Leave.findById(id)

        .then((leave) => {
            if (!leave) {
                return res.status(404).json({ error: 'Leave not found' });
            }

            leave.status = 'Rejected';
            leave.lastModifiedBy = managerId;

            return leave.save();
        })
        .then(async (leave) => {
            const user = await User.findById(leave.user);
            const lineManager = await User.findById(user.lineManagerId);

            const leaveDays = calculateLeaveDays(leave.startDate, leave.endDate);

            const recipient = user.email;
            const subject = 'Request Rejected';
            const message = `Hello ${user.firstName},<br><br> Manager ${lineManager.firstName} ${lineManager.lastName} has rejected your ${leave.leaveType} request
            from ${formatDate(leave.startDate)} to ${formatDate(leave.endDate)} for a duration of ${leaveDays} day(s).`

            emailService.sendMail(recipient, subject, message);

            res.status(200).json(leave);
        })
        .catch((error) => {
            res.status(500).json({ error: error.message || 'Internal Server Error' });
        })
}

// Cancel Leave
exports.cancelLeave = (req, res, next) => {
    const id = req.params.id;
    const managerId = req.user._id;

    Leave.findById(id)
        .then((leave) => {
            if (!leave) {
                return res.status(404).json({ error: 'Leave not found' });
            }

            leave.status = 'Cancelled';
            leave.lastModifiedBy = managerId;

            return leave.save();
        })
        .then((leave) => {
            res.status(200).json(leave);
        })
        .catch((error) => {
            res.status(500).json({ error: error.message || 'Internal Server Error' });
        })
}