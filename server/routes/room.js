import path from 'path';

import express from 'express';

import isLoggedIn from '../utils/authCheck';
import validateUsername from '../validators/validateUsername';
import User from '../schemas/user';
import Profile from '../models/profile';

const router = express.Router();

// Join room
router.get('/', isLoggedIn, (req, res) => {
    res.status(200).render('joinRoom', { 
        username: req.session.user.username,
        message: req.flash()
    });
});

// Chat room
router.get('/chat', isLoggedIn, (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/chat.html'));
});

// Add username
router.get('/addUsername', isLoggedIn, (req, res) => {
    res.status(200).render('addUsername', { 
        user: req.session.user, 
        message: req.flash() 
    });
})

router.patch('/addUsername', isLoggedIn, validateUsername, async (req, res) => {
    await User.updateOne({ _id: req.session.user._id }, { 
        username: req.body.username 
    });
    req.session.user = await Profile.getUser(req.session.user);
    req.flash('info', 'Username added successfully!');
    res.redirect('/users/rooms');
})

export default router;