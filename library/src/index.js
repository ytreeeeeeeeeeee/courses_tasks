import express from 'express';
import mongoose from 'mongoose';
import passport from 'passport';
import {Strategy as LocalStartegy} from 'passport-local';
import User from './models/user.js';
import userRouter from './routes/api/user.js';
import bookRouter from './routes/api/books.js';
import bookViewRouter from './routes/view/books.js';
import userViewRouter from './routes/view/user.js';
import error from './middlewares/error.js';
import path from 'path';
import { fileURLToPath } from 'url';
import session from 'express-session';

const options = {
    usernameField: 'username',
    passwordField: 'password',
};

const PORT = process.env.PORT || 3000;
const USERNAME = process.env.DB_USERNAME;
const PASSWORD = process.env.DB_PASSWORD;
const NAME = process.env.DB_NAME;
const HOST = process.env.DB_HOST;
const SECRET_KEY = process.env.SECRET_KEY;

const app = express();

app.use(express.json());

app.use(express.urlencoded());
app.set("view engine", "ejs");
app.set('views', path.join(path.dirname(fileURLToPath(import.meta.url)), '/views'));
app.use(session({secret: SECRET_KEY, resave: false, saveUninitialized: true}));

async function start() {
    try {
        await mongoose.connect(HOST, {
            user: USERNAME,
            pass: PASSWORD,
            dbName: NAME,
        });

        const verify = async (username, password, done) => {
            try {
                const user = await User.findOne({username: username});
        
                if (!user) return done(null, false);
                if (!user.verifyPassword(password)) return done(null, false);
                return done(null, user);
            }
            catch (e) {
                return done(e);
            }
        }
        
        passport.use('local', new LocalStartegy(options, verify));
        
        passport.serializeUser((user, cb) => {
            cb(null, user._id);
        });
        
        passport.deserializeUser(async (id, cb) => {
            try {
                cb(null, await User.findById(id));
            }
            catch (e) {
                cb(e);
            }
        });
        
        app.use(passport.initialize());
        app.use(passport.session());

        app.use('/', userViewRouter);
        app.use('/books', bookViewRouter);
        app.use('/api/user', userRouter);
        app.use('/api/books', bookRouter);
        
        app.use(error);
        
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (e) {
        console.log(e);
    }
}

start();