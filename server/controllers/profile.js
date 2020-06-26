import Profile from '../models/profile';
import { sendAccountClosingEmail, sendProfileUpdateEmail } from '../email/account'

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
                sendProfileUpdateEmail(user.email, user.firstname);
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
            await Profile.delete(req.session.user);
            sendAccountClosingEmail(req.session.user.email, req.session.user.firstname);
            req.session.destroy();
            res.clearCookie('connect.sid');
            return res.redirect('/');
        } catch(errors) {
            return res.redirect('/');
        }  
    },
};

export default profileController;