import path from 'path';
import http from 'http';

import express from 'express';
import morgan from 'morgan';
import expressSession from 'express-session';
import methodOverride from 'method-override';
import passport from 'passport';
import socketIO from 'socket.io';
import sharedSession from 'express-socket.io-session';
import 'dotenv/config';

import './config/dbConnection';
import socket from './socket/webChat';

import userRoute from './routes/user';
import profileRoute from './routes/profile';
import roomRoute from './routes/room';
import { cookie } from 'express-validator';
import flash from 'express-flash';

const app = express();
const port = process.env.PORT || 3000;
const server = http.createServer(app);

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// Session
const session = (expressSession({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));

// Middlewares
app.use(morgan('tiny'));
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method'));
app.use(session);

// Routes
app.use('/users', userRoute);
app.use('/users/profile', profileRoute);
app.use('/users/rooms', roomRoute);

// Views & statics
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, '../public')));

// Homepage
app.get('/', (req, res) => {
    res.status(200).render('homepage');
});

// Invalid path handler
app.use((req, res) => {
    return res.status(404).send('<h1>Not found!</h1>')
});

// SocketIO
const io = socketIO(server, {
    cookie: false
});

io.use(sharedSession(session, {
    autoSave: true
}));

io.on('connection', socket);

export default io;