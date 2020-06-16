import bcrypt from 'bcryptjs';

const hash = {
    hashPassword: (password) => {
        return new Promise((res, rej) => {
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(password, salt, (err, hash) => {
                    if(err) rej(err);
                    res(hash);
                });
            });
        })
    },

    comparePassword: (password, hashPassword) => {
        return new Promise((res, rej) => {
            bcrypt.compare(password, hashPassword, (err, status) => {
                if(err) rej(err);
                res(status);
            });
        });
    }
}


export default hash;