const User = require('../models/user');
const bcrypt = require('bcryptjs');
// Create a new user
exports.createUser = async (req, res) => {
    try {
        const {fullName,username,password,type} = req.body

        const encryptedPassword = await bcrypt.hash(password,10);
        const user = await User.create({
            fullName,
            username,
            password: encryptedPassword,
            type,
            wallet: {
                balance: 0,  
                state: 'closed' 
            }
        });

        console.log("User " + user.username + " has succesfully registered");
        res.status(200).json(user)
    } catch (error) {
        if (error.code === 11000) {
            // Duplicate key error
            console.error('Duplicate username error:', error);
            res.status(400).json({ error: 'Username already exists' });
        } else {
            // General error
            console.error('Error details:', error);
            res.status(500).json({ error: error.message });
        }
    }
};

// Get all users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).sort({createdAt: 1})
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving users' });
    }
};

// Get a user by username
exports.getUserByUsername = async (req, res) => {
    const { username } = req.params;

    try {
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        console.log('GetUser was hit succesfully');
        res.status(200).json({ data: user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update a user by username
exports.updateUserByUsername = async (req, res) => {
    try {
        const { username } = req.params;
        const updateFields = req.body; 
        const user = await User.findOneAndUpdate(
            { username },
            { $set: updateFields }, 
            { new: true, runValidators: true } 
        );

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        console.log("User succesfully updated")
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: 'Error updating user' });
    }
};


// Delete a user by username
exports.deleteUserByUsername = async (req, res) => {
    try {
        const { username } = req.params;
        const user = await User.findOneAndDelete({ username });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting user' });
    }
};
