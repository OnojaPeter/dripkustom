const crypto = require('crypto');
const nodemailer = require('nodemailer');
const User = require('../models/user');

// Nodemailer transporter configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'onojapeter90@gmail.com',
        pass: process.env.TRANSPORTER_PASS,
    }
});

async function forgotPasswordPage (req, res) {
    try {
        res.render('forgotPassword');
    } catch (error) {
        console.error( error);
    }
};

async function resetPassPage (req, res) {
    const { token } = req.params;

    try {
        // Check if the token is valid and not expired
        const user = await User.findOne({ resetToken: token, resetTokenExpires: { $gt: Date.now() } });

        if (!user) {
            // Invalid or expired token
            console.log('Invalid or expired token');
            console.error('Invalid or expired token:', error);
            // return res.render('reset-password-error', { errorMessage: 'Invalid or expired token' });
        }

        // Render the reset password page with the token
        res.render('resetPassword', { token });
    } catch (error) {
        console.error('Error rendering reset password page:', error);
        // res.render('reset-password-error', { errorMessage: 'Internal server error' });
    }
};
// Step 1: Capture User Email
async function forgotPassword (req, res) {
    const { email } = req.body;

    try {
        // Step 2: Generate Token
        const token = crypto.randomBytes(20).toString('hex');
        console.log(token);
        // Step 3: Send Reset Link
        const user = await User.findOneAndUpdate({ email }, {
            resetToken: token,
            resetTokenExpires: Date.now() + 600000 // Token expires in 10 minutes
        }, { new: true });

        // Send reset password email
        await transporter.sendMail({
            to: email,
            subject: 'Password Reset Request',
            html: `
                <p>You are receiving this email because you (or someone else) have requested the reset of the password for your account.</p>
                <p>Please click on the following link or paste it into your browser to complete the process:</p>
                <p><a href="${req.protocol}://${req.get('host')}/reset-password/${token}">Reset Password</a></p>
                <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
            `,
        });

        res.status(200).json({ message: 'Reset password email sent' });
    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Step 4-6: Reset Password Page & Logic
async function resetPassword  (req, res) {
    const { token } = req.params;
    const { newPassword } = req.body;

    try {
        // Step 5: Validate Token
        const user = await User.findOne({ resetToken: token });

        if (!user || user.resetTokenExpires < Date.now()) {
            return res.status(400).json({ message: 'Invalid or expired token' });
        }

        // Step 6: Update Password
        user.password = newPassword;
        user.resetToken = undefined;
        user.resetTokenExpires = undefined;
        await user.save();

        res.status(200).json({ message: 'Password reset successful' });
    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    forgotPasswordPage,
    resetPassPage,
    forgotPassword,
    resetPassword,
}