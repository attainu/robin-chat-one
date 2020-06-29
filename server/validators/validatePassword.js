import { check, body, validationResult } from 'express-validator';

const password = [
    check('password')
        .if(body('password').exists({ checkFalsy: true }))
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
        if(!errors.isEmpty()) {
            req.flash('info', errors.errors[0].msg);
            return res.redirect('/users/profile/password');
        }
        return next();
    }
]

export default password;

