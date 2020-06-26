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

            userSchema.create(newUser, async (err, info) => {
                if(err) rej(err);
                res(info);
            });
        });
    }

    verification = (id) => {
        return new Promise((res, rej) => {
            userSchema.updateOne({ _id: id }, { isVerified: true }, (err, info)=> {
                if(err) rej(err);
                const user = userSchema.findOne({ _id: id });
                res(user);
            });
        });
    }
}

export default new User;