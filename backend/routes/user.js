const express = require('express');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// POST /signup
router.post('/signup', [
    check('username', 'Username is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password must be 6 or more characters').isLength({ min: 6 })
], async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ status: false, errors: errors.array() });
    }

    const { username, email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if(user){
            return res.status(400).json({ status: false, message: 'User already exists' });
        }

        user = new User({ username, email, password });
        
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();
        res.status(201).json({ status: true, message: 'User created successfully' });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// POST /login
router.post('/login', [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
], async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ status: false, errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if(!user){
            return res.status(400).json({ status: false, message: 'Invalid Credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({ status: false, message: 'Invalid Credentials' });
        }

        const payload = {
            user: {
                id: user.id,
                username: user.username
            }
        };

        jwt.sign(payload, process.env.JWT_SECRET || 'secret_key', { expiresIn: '1h' }, (err, token) => {
            if(err) throw err;
            res.status(200).json({ 
                status: true, 
                username: user.username, 
                message: 'User logged in successfully', 
                jwt_token: token 
            });
        });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

module.exports = router;