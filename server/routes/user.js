import express from 'express';

import controller from '../controllers/user';
import validateRegistration from '../validators/validateUser';

const router = express.Router();

// User home
router.get('/', (req, res) => {
    if(!req.session.user) {
        return res.redirect('/users/login');
    }
    res.render('user', { user: req.session.user.firstname });  
});

// Registration
router.get('/register', (req, res) => {
    res.render('register', { warning: null, message: 'Already registered?', link: '/users/login' });
});

router.post('/register', validateRegistration, controller.register);

// Login
router.get('/login', (req, res) => {
    if(!req.session.user) {
        return res.render('login', { warning: null, message: 'Not registered?', link: '/users/register' });
    }
    res.redirect('/users');
});

router.post('/login', controller.login);

// O-auth login google
router.get('/login/google', controller.loginGoogle.getUser);

router.get('/login/google/callback', controller.loginGoogle.varify, controller.loginGoogle.success);

// O-auth login facebook
router.get('/login/facebook', controller.loginFacebook.getUser);

router.get('/login/facebook/callback', controller.loginFacebook.varify, controller.loginFacebook.success);

// Logout
router.post('/', controller.logout);

export default router;