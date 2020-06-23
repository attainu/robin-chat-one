import Filter from 'bad-words';

import { generateMessage, generateLocationMessage } from '../utils/messages';
import { addUser, removeUser, getUser, getUsersInRoom } from '../utils/users';
import Chat from '../schemas/chat';
import io from '../index';

export default (socket) => {
    console.log('New WebSocket connection')

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
        io.to(user.room).emit('locationMessage', generateLocationMessage(user.username, `https://google.com/maps?q=${coords.latitude},${coords.longitude}`))
        callback()
    })

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