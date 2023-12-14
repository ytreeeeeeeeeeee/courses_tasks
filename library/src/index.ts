import express from 'express';
import mongoose from 'mongoose';
import passport from 'passport';
import session from 'express-session';
import path from 'path';
import {createServer} from 'http';
import {Server} from 'socket.io';
import {IStrategyOptions, IStrategyOptionsWithRequest, Strategy as LocalStartegy, VerifyFunction, VerifyFunctionWithRequest} from 'passport-local';

import User from './models/user';
import Message from './models/message';

import userRouter from './routes/api/user';
import bookRouter from './routes/api/books';
import bookViewRouter from './routes/view/books';
import userViewRouter from './routes/view/user';
import error from './middlewares/error';
import { IUser } from './interfaces/user';

declare global {
    namespace Express {
        interface User extends IUser {}
    }
}

const options: IStrategyOptions = {
    usernameField: 'username',
    passwordField: 'password'
};

const PORT = process.env.PORT || '';
const USERNAME = process.env.DB_USERNAME || '';
const PASSWORD = process.env.DB_PASSWORD || '';
const NAME = process.env.DB_NAME || '';
const HOST = process.env.DB_HOST || '';
const SECRET_KEY = process.env.SECRET_KEY || '';

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
    }
});

app.use(express.json());
app.use(express.urlencoded());
app.set("view engine", "ejs");
app.set('views', path.join(__dirname, '/views'));
app.use(session({secret: SECRET_KEY, resave: false, saveUninitialized: true}));

async function start() {
    try {
        await mongoose.connect(HOST, {
            user: USERNAME,
            pass: PASSWORD,
            dbName: NAME,
        });

        const verify: VerifyFunction = (username: string, password: string, done: (error: Error | null, user?: Express.User | false) => void) => {
            try {
                User.findOne({username: username}).then((user) => {
                    if (!user) return done(null, false);
                    if (!user.verifyPassword(password)) return done(null, false);
                    return done(null, user);
                });
            }
            catch (e: any) {
                return done(new Error(e.message));
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

        io.on('connection', (socket) => {
            const {id} = socket;
            console.log(`Socket connected: ${id}`);
        
            socket.on('comment', (msg) => {
                const newMsg = new Message(msg);
                newMsg.save().then(() => {
                    socket.broadcast.emit('comment', msg);
                    socket.emit('comment', msg);
                });
            });
        
            socket.on('disconnect', () => {
                console.log(`Socket disconected: ${id}`);
            });
        });
        
        app.use(passport.initialize());
        app.use(passport.session());

        app.use('/', userViewRouter);
        app.use('/books', bookViewRouter);
        app.use('/api/user', userRouter);
        app.use('/api/books', bookRouter);
        
        app.use(error);
        
        server.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (e) {
        console.log(e);
    }
}

start();