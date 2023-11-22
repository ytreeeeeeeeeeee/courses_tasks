import express from 'express';
import isAuth from '../middlewares/isAuth.js';
import Chat from '../models/chat.js';
import ChatModule from '../modules/chat.js';

const chatRouter = express.Router();

chatRouter.get('/', isAuth, async (req, res) => {
    try {
        const chats = await Chat.find({users: {
            $in: req.user._id,
        }}).populate('users', '_id name').lean();

        // if (chats.length === 0) {
        //     await ChatModule.sendMessage({
        //         author: req.user._id,
        //         receiver: '6557db216cf0dbf455e3419d', // любой id другого существующего пользователя
        //         text: 'Hello world',
        //     });
        // } // создано для теста
        
        chats.forEach(chat => {
            chat.interlocutor = chat.users.filter(item => !item._id.equals(req.user._id))[0];
            chat.notification = 0;
        });

        res.render('chat', {
            title: 'Чат',
            chats: chats,
            userId: req.user._id,
        });
    } catch (e) {
        throw e;
    }
});

export default chatRouter;