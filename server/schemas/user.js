import mongoose from 'mongoose';

const user = new mongoose.Schema({
    firstname: {
        type: String,
        required: true,
        min: 3,
        max: 50,
        trim: true
    },

    lastname: {
        type: String,
        min: 3,
        max: 50,
        trim: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },

    password: {
        type: String,
        required: true,
        trim: true
    },

    phone: {
        type: String,
        max: 10
    },

    country: {
        type: String
    }
},
    {
        timestamps: true
    },

    {
        versionKey: false
    }
);

export default mongoose.model('User', user, 'users');