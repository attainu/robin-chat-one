import passport from 'passport';

import User from '../models/user';
import hash from '../utils/hash';
import '../services/passportAuth';

const userController = {
    register: async (req, res) => {
        try {
            let user = await User.register(req.body);
            req.flash('info', 'Registration successful!');
            return res.redirect('/users/login');
        } catch (errors) {
            req.flash('info', errors);
            return res.redirect('/users/register');
        }
    },

    login: [passport.authenticate('local', { 
        failureRedirect: '/users/login',
        failureFlash: 'Login failed!',
        successFlash: 'Login successful!'
    }),
    (req, res) => {
        req.session.user = req.user;
        res.redirect('/users')
    }],

    logout: (req, res) => {
        req.session.destroy();
        res.clearCookie('connect.sid');
        return res.redirect('/');
    },

    loginGoogle: {
        getUser: passport.authenticate('google', { scope: ['profile', 'email'] }),
        varify: [passport.authenticate('google', { 
            failureRedirect: '/users/login',
            failureFlash: 'Login failed!',
            successFlash: 'Login successful!'
        }),
        (req, res) => {
            req.session.user = req.user;
            res.redirect('/users');
        }]
    },

    loginFacebook: {
        getUser: passport.authenticate('facebook'),
        varify: [passport.authenticate('facebook', { 
            failureRedirect: '/users/login',
            failureFlash: 'Login failed!',
            successFlash: 'Login successful!'
        }),
        (req, res) => {
            req.session.user = req.user;
            res.redirect('/users');
        }]
    }
};

export default userController;