const axios = require('axios');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const DATA_SERVICE_URL = 'http://localhost:3001/api';
const JWT_SECRET = process.env.JWT_SECRET || 'vqPw49ELrOZtHWSjCnC4DH';

exports.createUser = async (req, res) => {
    try {
        const { fullName, username, password, type } = req.body;

        const response = await axios.post(`${DATA_SERVICE_URL}/users`, {
            fullName,
            username,
            password,
            type
        });

        res.status(200).json(response.data);
    } catch (error) {
        if (error.response && error.response.status === 400) {
            res.status(400).json({ error: 'Username already exists' });
        } else {
            console.error('Error details:', error);
            res.status(500).json({ error: 'Error creating user' });
        }
    }
};

exports.loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;

        const response = await axios.get(`${DATA_SERVICE_URL}/users/${username}`);
        const user = response.data.data;

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign(user, JWT_SECRET, {
            expiresIn: '1h' 
        });

        res.cookie("token", token);
        res.status(200).json(user);
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: error.message });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const response = await axios.get(`${DATA_SERVICE_URL}/users`);
        res.status(200).json(response.data);
    } catch (error) {
        console.error('Error retrieving users:', error);
        res.status(500).json({ error: 'Error retrieving users' });
    }
};

exports.getUserByUsername = async (req, res) => {
    const { username } = req.params;

    try {
        const response = await axios.get(`${DATA_SERVICE_URL}/users/${username}`);
        res.status(200).json(response.data);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ error: 'Error fetching user' });
    }
};

exports.updateUserByUsername = async (req, res) => {
    const { username } = req.params;
    const updateFields = req.body;

    console.log(username)
    console.log(updateFields)

    try {
        const response = await axios.patch(`${DATA_SERVICE_URL}/users/${username}`, updateFields);
        res.status(200).json(response.data);
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'Error updating user' });
    }
};

exports.deleteUserByUsername = async (req, res) => {
    const { username } = req.params;

    try {
        const response = await axios.delete(`${DATA_SERVICE_URL}/users/${username}`);
        res.status(200).json(response.data);
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Error deleting user' });
    }
};