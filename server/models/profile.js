import userSchema from '../schemas/user';
import hash from '../utils/hash';

class Profile {
    constructor() {}

    getUser = (user) => {
        return new Promise((res, rej) => {
            userSchema.findOne({ _id: user._id }, (err, info) => {
                if(err) rej(err);
                res(info);
            });
        });
    }

    update = (sessionUser, editedUser) => {
        return new Promise(async (res, rej) => {
            userSchema.updateOne({ _id: sessionUser._id }, { 
                usfirstname: editedUser.firstname || sessionUser.firstname,
                lastname: editedUser.lastname || sessionUser.lastname,
                email: sessionUser.email,
                username: editedUser.username || sessionUser.username,
                phone: editedUser.phone || sessionUser.phone,
                country: editedUser.country || sessionUser.country
            }, (err, info) => {
                if(err) rej(err);
                res(info);
            });
        });
    }

    updatePassword = (sessionUser, editedUser) => {
        return new Promise(async (res, rej) => {
            userSchema.updateOne({ _id: sessionUser._id }, { 
                email: sessionUser.email,
                password: await hash.hashPassword(editedUser.password),
            }, (err, info) => {
                if(err) rej(err);
                res(info);
            });
        });
    }

    delete = (user) => {
        return new Promise((res, rej) => {
            userSchema.deleteOne({ _id: user._id }, (err, info) => {
                if(err) rej(err);
                res(info);
            });
        });
    }
}

export default new Profile;