// controllers/authController.js
const Admin = require('../models/Admin');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.loginAdmin = async (req, res) => {
    try {
        const { username, password } = req.body;
         console.log('Debug login request reived');
          console.log(' debug username ',username);
           console.log(' debug password ',password);
        // Check if admin exists
        const admin = await Admin.findOne({ username });
        console.log(' admin in db '+admin);
        if (!admin) {
             console.log('no admin found with this user name ');
            return res.status(400).json({ message: 'Invalid username or password' });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, admin.passwordHash);
         console.log('debug password match =',isMatch);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid username or password' });
        }

        // Create JWT Token
        const token = jwt.sign(
            { id: admin._id, username: admin.username },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.json({
            message: 'Login successful',
            token
        });

    } catch (error) {
        console.error('Login Error:', error);
       return res.status(500).json({ message: 'Server error' });
    }
};