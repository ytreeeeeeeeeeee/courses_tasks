import express from 'express';
import userRouter from './routes/user.js';
import bookRouter from './routes/books.js';

const app = express();

app.use(express.json());
app.use('/api/user', userRouter);
app.use('/api/books', bookRouter);

const storage = {
    books: [],
};

app.listen(3000);