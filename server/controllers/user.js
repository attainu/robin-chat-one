import passport from 'passport';
import jwt from 'jsonwebtoken';

import User from '../models/user';
import '../services/passportAuth';
import { sendWelcomeEmail, sendVerificationEmail } from '../email/account'

const userController = {
    register: async (req, res) => {
        try {
            const user = await User.register(req.body);
            if(user) {
                // Send verification email
                jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' }, 
                (err, emailToken)=>{
                    if(err) return console.log(err);
                    const url = path.join(`http://localhost:3000/users/confirmation/${emailToken}`);
                    sendVerificationEmail(user.email, url);
                });
                req.flash('info', `Verification email sent to (${user.email}). Please verify your email account!`);
            } else {
                req.flash('info', `Registration failed!`);
            }
            
            return res.redirect('/users/login');
        } catch (error) {
            console.log(error);
            return res.redirect('/users/register');
        }
    },

    verify: async(req, res) => {
        try{
            // Verify email account
            const verified = jwt.verify(req.params.token, process.env.JWT_SECRET);            
            const user = await User.verification(verified._id);
            if(user) {
                sendWelcomeEmail(user.email, user.firstname);            
                req.flash('info', 'Account verification successful!');
            } else {
                req.flash('info', 'Account verification failed!');
            }

            return res.redirect('/users/login');
        }catch(error){
            return console.log(error);
        }
    },

    login: [passport.authenticate('local', { 
        failureRedirect: '/users/login',
        failureFlash: true,
        successFlash: true
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