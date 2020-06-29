import express from 'express';

import controller from '../controllers/profile';
import validateProfile from '../validators/validateProfile';
import validatePassword from '../validators/validatePassword';
import isLoggedIn from '../utils/authCheck';

const router = express.Router();

// User profile dashboard
router.get('/', isLoggedIn, (req, res) => {
    res.status(200).render('profile', { 
        user: req.session.user,
        message: req.flash()
    });
});

// Update profile
router.get('/edit', isLoggedIn, (req, res) => {
    res.status(200).render('editProfile', {
        user: req.session.user,
        message: req.flash()
    });
});

router.patch('/edit', isLoggedIn, validateProfile, controller.update);

// Password change
router.get('/password', isLoggedIn, (req, res) => {
    res.status(200).render('changePassword', {
        user: req.session.user,
        message: req.flash()
    });
});

router.patch('/password', isLoggedIn, validatePassword, controller.updatePassword);

// Delete profile
router.delete('/delete', isLoggedIn, controller.delete);

export default router;