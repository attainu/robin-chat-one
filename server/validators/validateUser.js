import { check, body, validationResult } from 'express-validator';

import User from '../schemas/user';

const register = [
    check('firstname')
        .notEmpty().bail()
        .withMessage('First name cannot be empty')
        .isAlpha().bail()
        .withMessage('First name should contains only alphabets(a-z, A-Z)')
        .isLength({ min: 3 }).bail()
        .withMessage('First name should contains at least 3 characters')
        .isLength({ max: 50 }).bail()
        .withMessage('First name should not contains more than 50 characters'),

    check('lastname')
        .if(body('last_name').exists({ checkFalsy: true }))
        .isAlpha().bail()
        .withMessage('Last name should contains only alphabets(a-z, A-Z)')
        .isLength({ min: 3 }).bail()
        .withMessage('Last name should contains at least 3 characters')
        .isLength({ max: 50 }).bail()
        .withMessage('Last name should not contains more than 50 characters'),

    check('email')
        .notEmpty().bail()
        .withMessage('Email cannot be empty')
        .isEmail().bail()
        .withMessage('Please enter a valid email'),
    body('email')
        .custom(value => {
            return User.findOne({ email: value }).then(user => {
                if(user) return Promise.reject('Email already exists!');
            });
        }),
    body('confirm_email')
        .custom((value, { req }) => {
            if(value !== req.body.email) 
            throw new Error('Email confirmation does not match email');
            return true;
        }),

    check('password')
        .not().isEmpty().bail()
        .withMessage('Password cannot be empty')
        .isAlphanumeric().bail()
        .withMessage('Password should contains only alpha-numeric characters (a-z, A-Z, 0-9)')
        .isLength({ min: 6 }).bail()
        .withMessage('Password should contains at least 6 characters')
        .isLength({ max: 25 }).bail()
        .withMessage('Password should not contains more than 25 characters'),
    body('confirm_password')
        .custom((value, { req }) => {
            if(value !== req.body.password) 
            throw new Error('Password confirmation does not match password');
            return true;
        }),
    
    (req, res, next) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) 
        return res.status(400).render('register', {
            warning: errors.errors[0].msg,
            message: 'Already register?', 
            link: 'login'
        });
        return next()
    }
]

export default register;