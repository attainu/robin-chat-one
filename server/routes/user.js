import express from 'express';

import controller from '../controllers/user';
import validateRegistration from '../validators/validateUser';

const router = express.Router();

// User home
router.get('/', (req, res) => {
    res.render('user', { user: null });
});

// Registration
router.get('/register', (req, res) => {
    res.render('register', { warning: null, message: 'Already registered?', link: 'login' });
});

router.post('/register', validateRegistration, controller.register);

// Login
router.get('/login', (req, res) => {
    res.render('login', { warning: null, message: 'Not registered?', link: 'register' });
});

router.post('/login', controller.login);

export default router;