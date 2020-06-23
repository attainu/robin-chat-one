import Profile from '../models/profile';

const profileController = {
    getUser: async(req, res) => {
        try{
            const user = await Profile.getUser(req.session.user);
            req.session.user = user;              
            return res.redirect('/users/profile');
        } catch(error) {
            return res.redirect('/users');
        }
    },

    update: async(req, res) => {
        try {
            const info = await Profile.update(req.session.user, req.body)
            if(info.n === info.ok) {
                const user = await Profile.getUser(req.session.user);
                req.session.user = user;
                req.flash('info', 'Profile updated!');
                return res.redirect('/users/profile');
            }
        } catch(errors) {
            req.flash('info', errors);
            return res.redirect('/users/profile/edit');
        }  
    },

    delete: async(req, res) => {
        try {
            const info = await Profile.delete(req.session.user);
            req.session.destroy();
            res.clearCookie('connect.sid');
            return res.redirect('/');
        } catch(errors) {
            return res.redirect('/');
        }  
    },
};

export default profileController;