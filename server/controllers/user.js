import User from '../models/user';
import hash from '../utils/hash';

const userController = {
    register: async (req, res) => {
        try {
            let user = await User.register(req.body);
            return res.status(201).render('register', 
                {   
                    warning: null,
                    message: 'Registration successful',
                    link: 'login'
                }
            );
        } catch (errors) {
            return res.status(400).render('register', 
                {   
                    warning: errors,
                    message: 'Already registered?', 
                    link: 'login'
                }
            );
        }
    },

    login: async (req, res) => {
        try {
            let user = await User.login(req.body);
            if(user === null) {
                return res.status(404).render('login', 
                    {   
                        warning: 'Email does not exist!',
                        message: 'Not registered?',
                        link: 'register'
                    }
                )
            }
            if(await hash.comparePassword(req.body.password, user.password)) {
                return res.redirect('/users');
            } else {
                return res.status(403).render('login', 
                    {
                        warning: 'Password incorrect!',
                        message: 'Not registered?',
                        link: 'register'
                    }
                )
            }
        } catch (error) {
            console.log(error);
            return res.status(403).send('<h3>Login faild!<h3>');
        }
    }
};

export default userController;