import fs from 'fs';
import path from 'path';

import Filter from 'bad-words';
import SocketIOFileUpload from 'socketio-file-upload';

import { generateMessage, generateLocationMessage, generateFileShareMessage } from '../utils/messages';
import { addUser, removeUser, getUser, getUsersInRoom } from '../utils/users';
import Chat from '../schemas/chat';
import cloudUploader from '../services/cloudinary';
import io from '../index';

export default (socket) => {
    console.log('New WebSocket connection')

    const uploader = new SocketIOFileUpload()
    uploader.dir = path.join(__dirname, '../../public/uploads')
    uploader.listen(socket)

    socket.on('join', (options, callback) => {
        const { error, user } = addUser({ 
            id: socket.id, 
            username: socket.handshake.session.user.username,
            room: options.room
        })

        if (error) {
            return callback(error)
        }

        socket.join(user.room)

        Chat.find({ room: user.room }, (err, info) => {
            if(err) return console.log(err)
            socket.emit('old-message', info)
        })

        socket.emit('message', generateMessage('Admin', `Welcome ${user.username}!`))
        socket.broadcast.to(user.room).emit('message', generateMessage('Admin', `${user.username} has joined!`))
        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUsersInRoom(user.room)
        })

        callback()
    })

    socket.on('sendMessage', (message, callback) => {
        const user = getUser(socket.id)
        const filter = new Filter()

        if (filter.isProfane(message)) {
            return callback('Profanity is not allowed!')
        }

        if (user === undefined) {
            return callback({ error: 'Please login again!' });
        }

        const chat = generateMessage(user.username, message);        
        
        io.to(user.room).emit('message', chat)

        chat.room = user.room;
        Chat.create(chat).then(() => {
            console.log('success')
        }).catch(error => console.log('failure', error));

        callback()
    })

    socket.on('sendLocation', (coords, callback) => {
        const user = getUser(socket.id)

        if (user === undefined) {
            return callback({ error: 'Please login again!' });
        }

        const chat = generateLocationMessage(user.username, `https://google.com/maps?q=${coords.latitude},${coords.longitude}`);

        io.to(user.room).emit('locationMessage', chat)

        chat.room = user.room;
        Chat.create(chat).then(() => {
            console.log('success')
        }).catch(error => console.log('failure', error));

        callback()
    })

    uploader.on("saved", async event => {
        const user = getUser(socket.id)
        
        if (user === undefined) {
            socket.on('shareFile', (success, callback) => {
                return callback({ error: 'Please login again!' })
            });
            return;
        }

        const cloud = await cloudUploader(event.file.pathName);

        fs.unlinkSync(event.file.pathName);

        const chat = generateFileShareMessage(user.username, `${cloud.url}`);

        io.to(user.room).emit('fileShareMessage', chat)

        chat.room = user.room;
        Chat.create(chat).then(() => {
            console.log('success')
        }).catch(error => console.log('failure', error));
    });

    socket.on('disconnect', () => {
        const user = removeUser(socket.id)

        if (user) {
            io.to(user.room).emit('message', generateMessage('Admin', `${user.username} has left!`))
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUsersInRoom(user.room)
            })
        }
    })
}