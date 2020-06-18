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
            const user = {
                firstname: editedUser.firstname || sessionUser.firstname,
                lastname: editedUser.lastname || sessionUser.lastname,
                email: sessionUser.email,
                nickname: editedUser.nickname || sessionUser.nickname,
                password: await hash.hashPassword(editedUser.password) || sessionUser.password,
                phone: editedUser.phone || sessionUser.phone,
                country: editedUser.country || sessionUser.country
            }
            userSchema.updateOne({ _id: user._id }, { user }, (err, info) => {
                if(err) rej(err);
                res(user);
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