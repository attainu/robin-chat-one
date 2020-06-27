import { check, body, validationResult } from 'express-validator';

import User from '../schemas/user';

const profile = [
    check('firstname')
        .if(body('firstname').exists({ checkFalsy: true }))
        .isAlpha().bail()
        .withMessage('First name should contains only alphabets(a-z, A-Z)')
        .isLength({ min: 3 }).bail()
        .withMessage('First name should contains at least 3 characters')
        .isLength({ max: 50 }).bail()
        .withMessage('First name should not contains more than 50 characters'),

    check('lastname')
        .if(body('lastname').exists({ checkFalsy: true }))
        .isAlpha().bail()
        .withMessage('Last name should contains only alphabets(a-z, A-Z)')
        .isLength({ min: 3 }).bail()
        .withMessage('Last name should contains at least 3 characters')
        .isLength({ max: 50 }).bail()
        .withMessage('Last name should not contains more than 50 characters'),

    check('username')
        .if(body('username').exists({ checkFalsy: true }))
        .isAlphanumeric().bail()
        .withMessage('Username should contains only alpha-numeric characters (a-z, A-Z, 0-9)')
        .isLength({ min: 3 }).bail()
        .withMessage('Username should contains at least 3 characters')
        .isLength({ max: 25 }).bail()
        .withMessage('Username should not contains more than 25 characters'),
    body('username')
        .custom(value => {
            return User.findOne({ username: value }).then(user => {
                if(user) return Promise.reject('Username already taken!');
            });
        }),
        
    check('phone')
        .if(body('phone').exists({ checkFalsy: true }))
        .isNumeric().bail()
        .withMessage('Phone should contains only numeric characters (0-9)')
        .isLength({ min: 6 }).bail()
        .withMessage('Phone should contains at least 6 characters')
        .isLength({ max: 10 }).bail()
        .withMessage('Phone should not contains more than 10 characters'),

    check('country')
        .if(body('country').exists({ checkFalsy: true }))
        .isAlpha().bail()
        .withMessage('Country should contains only alphabets(a-z, A-Z)')
        .isLength({ min: 3 }).bail()
        .withMessage('Country should contains at least 3 characters')
        .isLength({ max: 50 }).bail()
        .withMessage('Country should not contains more than 50 characters'),
    
    (req, res, next) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            req.flash('info', errors.errors[0].msg);
            return res.redirect('/users/profile/edit');
        }
        return next();
    }
]

export default profile;