import express from 'express';
import mongoose from 'mongoose';
import session from 'express-session';
import passport from 'passport';
import path from 'path';
import passportSocketIo from 'passport.socketio';
import cookieParser from 'cookie-parser';

import { createServer } from 'http';
import { Strategy as LocalStrategy } from 'passport-local';
import { fileURLToPath } from 'url';
import { Server } from 'socket.io';

import User from './models/user.js';
import userRouter from './routes/user.js';
import advertismentRouter from './routes/advertisments.js';
import ChatModule from './modules/chat.js';
import chatRouter from './routes/chat.js';
import viewsRouter from './routes/views.js';

const PORT = process.env.PORT;
const DB_HOST = process.env.DB_HOST;
const DB_NAME = process.env.DB_NAME;
const DB_USER = process.env.DB_USER;
const DB_PASS = process.env.DB_PASS;
const SECRET_KEY = process.env.SECRET_KEY;

const app = express();
const server = createServer(app);
const io = new Server(server);
const sessionStore = new session.MemoryStore();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(session({
    secret: SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    key: 'express.sid',
    store: sessionStore,
}));
app.set('view engine', 'ejs');
app.set('views', path.join(path.dirname(fileURLToPath(import.meta.url)), '/views'));
app.use(express.static(path.join(path.dirname(fileURLToPath(import.meta.url)), '/public')));

async function start() {
    try {
        await mongoose.connect(DB_HOST, {
            user: DB_USER,
            pass: DB_PASS,
            dbName: DB_NAME,
        });
        
        const verify = async (email, password, done) => {
            try{
                const user = await User.findOne({email: email});
                if (!user) return done(null, false);
                
                const res = await user.verifyPassword(password);
                if (!res) return done(null, false);
                return done(null, user);
            } catch (e) {
                done(e);
            }
        }

        passport.use('local', new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
        }, verify));

        passport.serializeUser((user, cb) => {
            cb(null, user._id);
        });

        passport.deserializeUser(async (id, cb) => {
            try {
                cb(null, await User.findById(id));
            } catch (e) {
                cb(e);
            }
        });

        app.use(passport.initialize());
        app.use(passport.session());

        app.use('/', viewsRouter);
        app.use('/api', userRouter);
        app.use('/api/advertisments', advertismentRouter);
        app.use('/chat', chatRouter);

        io.use(passportSocketIo.authorize({
            store: sessionStore,
            key: 'express.sid',
            passport: passport,
            cookieParser: cookieParser,
            secret: SECRET_KEY,
        }));

        io.on('connection', (socket) => {
            const {id} = socket;
            console.log(`Socket connected: ${id}`);

            socket.on('getHistory', async (id) => {
                let allMessages = [];
                const chat = (await ChatModule.find([id, socket.request.user._id]))[0];

                if (chat) {
                    allMessages = await ChatModule.getHistory(chat._id);
                }

                socket.emit('chatHistory', allMessages);
            });

            socket.on('sendMessage', async (receiver, text) => {
                const msg = await ChatModule.sendMessage({
                    author: socket.request.user._id,
                    receiver,
                    text,
                });
            });

            ChatModule.subscribe((chatId, message) => {
                socket.emit('newMessage', chatId, message);
            });

            socket.on('disconnect', () => {
                console.log(`Socket disconnected: ${id}`);
            })
        });

        server.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (e) {
        console.error(e);
    }
}

start();