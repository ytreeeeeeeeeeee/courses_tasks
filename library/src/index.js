import express from 'express';
import mongoose from 'mongoose';
import userRouter from './routes/api/user.js';
import bookRouter from './routes/api/books.js';
import bookViewRouter from './routes/view/books.js';
import error from './middlewares/error.js';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();

app.use(express.json());

app.use(express.urlencoded());
app.set("view engine", "ejs");
app.set('views', path.join(path.dirname(fileURLToPath(import.meta.url)), '/views'));

app.use('/api/user', userRouter);
app.use('/api/books', bookRouter);
app.use('/books', bookViewRouter);

app.use(error);

const PORT = process.env.PORT || 3000;
const USERNAME = process.env.DB_USERNAME;
const PASSWORD = process.env.DB_PASSWORD;
const NAME = process.env.DB_NAME;
const HOST = process.env.DB_HOST;

async function start() {
    try {
        await mongoose.connect(HOST, {
            user: USERNAME,
            pass: PASSWORD,
            dbName: NAME,
        });   
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (e) {
        console.log(e);
    }
}

start();