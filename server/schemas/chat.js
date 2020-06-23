import mongoose from 'mongoose';

const chat = new mongoose.Schema({
    room: {
        type:String,
        required: true
    },

    username: {
        type: String,
        required: true,
    },

    text: {
        type: String,
        required: true
    }
},
    {
        timestamps: true
    },

    {
        versionKey: false
    }
);

export default mongoose.model('Chat', chat, 'chats');