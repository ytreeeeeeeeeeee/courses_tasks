import express from 'express';
import userRouter from './routes/api/user.js';
import bookRouter from './routes/api/books.js';
import bookViewRouter from './routes/view/books.js';
import error from './middlewares/error.js';

const app = express();

app.use(express.json());

app.use(express.urlencoded());
app.set("view engine", "ejs");

app.use('/api/user', userRouter);
app.use('/api/books', bookRouter);
app.use('/books', bookViewRouter);

app.use(error);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});