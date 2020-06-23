import { check, body, validationResult } from 'express-validator';

import User from '../schemas/user';

const username = [
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

    (req, res, next) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            req.flash('info', errors.errors[0].msg);
            return res.redirect('/users/rooms/addUsername');
        }
        return next();
    }
]

export default username;