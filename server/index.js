import express from 'express';
import morgan from 'morgan';
import path from 'path';
import session from 'express-session';
import methodOverride from 'method-override';
import 'dotenv/config';

import './config/dbConnection';

import userRoute from './routes/user';
import profileRoute from './routes/profile';
import passport from 'passport';

const app = express();

app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is running on port ${process.env.PORT || 3000}`);
});

// Session
app.use(session({
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

// Routes
app.use('/users', userRoute);
app.use('/users/profile', profileRoute);

// Views
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Homepage
app.get('/', (req, res) => {
    res.status(200).render('homepage');
});

// Invalid path handler
app.use((req, res) => {
    return res.status(404).send('<h1>Not found!</h1>')
});