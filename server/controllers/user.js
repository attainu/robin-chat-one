import User from '../models/user';

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
                    message: 'Already register?', 
                    link: 'login'
                }
            );
        }
    }
};

export default userController;