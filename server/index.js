import express from 'express';
import morgan from 'morgan';
import path from 'path';
import 'dotenv/config';

import './config/dbConnection';

import userRoute from './routes/user';

const app = express();

app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is running on port ${process.env.PORT || 3000}`);
});

// Middlewares
app.use(morgan('tiny'));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/users', userRoute);

// Views
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Homepage
app.get('/', (req, res) => {
    res.send('<h1>Welcome</h1>');
});

// Invalid path handler
app.use((req, res) => {
    return res.status(404).send('<h1>Not found!</h1>')
});