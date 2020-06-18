import express from 'express';
import flash from 'express-flash';

import controller from '../controllers/user';
import validateRegistration from '../validators/validateUser';
import isLoggedIn from '../utils/authCheck';

const router = express.Router();
router.use(flash());

// User home
router.get('/', isLoggedIn, (req, res) => {
    res.render('user', { 
        user: req.session.user,
        message: req.flash()
    }); 
});

// Registration
router.get('/register', (req, res) => {
    res.render('register', { message: req.flash() });
});

router.post('/register', validateRegistration, controller.register);

// Local login
router.get('/login', (req, res) => {
    if(!req.session.user) {
        res.render('login', { message: req.flash() });
    } else {
        res.redirect('/users');
    }
});

router.post('/login', controller.login);

// O-auth login google
router.get('/login/google', controller.loginGoogle.getUser);
router.get('/login/google/callback', controller.loginGoogle.varify);

// O-auth login facebook
router.get('/login/facebook', controller.loginFacebook.getUser);
router.get('/login/facebook/callback', controller.loginFacebook.varify);

// Logout
router.post('/', isLoggedIn, controller.logout);

export default router;