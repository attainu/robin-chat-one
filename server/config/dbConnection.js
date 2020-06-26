import mongoose from 'mongoose';

mongoose.connect(process.env.MONGODB_CONNECT_LOCAL,
    {
        useCreateIndex: true,
        useFindAndModify: true,
        useUnifiedTopology: true,
        useNewUrlParser: true
    },
).then(console.log('Database connected!'))
.catch(err => console.log(err));