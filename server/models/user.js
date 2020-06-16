import userSchema from '../schemas/user';
import hash from '../utils/hash';

class User {
    constructor() {}

    register = (user) => {
        return new Promise(async (res, rej) => {
            const newUser = {
                firstname: user.firstname,
                lastname: user.lastname,
                email: user.email,
                password: await hash.hashPassword(user.password)
            }

            userSchema.create(newUser, (err, info) => {
                if(err) rej(err);
                res(info);
            });
        });
    }

    login = (user) => {
        return new Promise(async (res, rej) => {
            userSchema.findOne({ email: user.email }, (err, info) => {
                if(err) rej(err);
                res(info);
            });
        });
    }
}

export default new User;