const crypto = require('crypto');
const nodemailer = require('nodemailer');
const User = require('../models/user');
const bcrypt = require('bcryptjs');

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
        res.render('forgotPassword', {messages: req.flash('error')});
    } catch (error) {
        console.error( error);
    }
};

async function resetPassPage (req, res) {
    const { token } = req.params;

    try {
        // console.log('Received token:', token);
        const user = await User.findOne({ resetToken: token, resetTokenExpires: { $gt: Date.now() } });
        // console.log('User found:', user);
        if (!user) {
            // Invalid or expired token
            console.log('Invalid or expired token');
            // console.error('Invalid or expired token:', error);
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
        const checkIfUserExist = await User.findOne({email})
        // console.log("user exist:",checkIfUserExist);

        if (checkIfUserExist) {
            // Generate Token
            const token = crypto.randomBytes(20).toString('hex');
            // console.log(token);
            const user = await User.findOneAndUpdate({ email }, {
                resetToken: token,
                resetTokenExpires: Date.now() + 600000 // Token expires in 10 minutes 
            }, { new: true });
            // console.log('user after User.findOneAndUpdate:', user);
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

            res.render('forgotPassword', {messages: 'Reset password link sent to your email'});
            // res.status(200).json({ message: 'Reset password email sent' });
        } else {
            res.render('forgotPassword', {messages: 'User does not exist, please signup'});
            // res.status(500).json({ message: 'user does not exist, please signup'});
        }
    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(400).json({ message: 'Internal server error' });
    }
};

// Step 4-6: Reset Password Page & Logic
async function resetPassword  (req, res) {
    const { token } = req.params;
    const { password } = req.body;
    console.log('new password:', password);

    try {
        // Step 5: Validate Token
        const user = await User.findOne({ resetToken: token });
        console.log('found user with the token id:', user);

        if (!user || user.resetTokenExpires < Date.now()) {
            return res.status(400).json({ message: 'Invalid or expired token' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        console.log('former pw:', user.password);
        // Step 6: Update Password
        user.password = hashedPassword;
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