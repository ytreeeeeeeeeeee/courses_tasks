import Chat from '../models/chat.js';
import Message from '../models/message.js';
import EventEmmiter from 'events';

const emitter = new EventEmmiter();

const find = async (users) => {
    try {
        const chat = await Chat.find({
            users: {$all: users}
        });
    
        return chat || null;
    } catch (e) {
        console.error(e.message);
    }
};

const sendMessage = async ({author, receiver, text}) => {
    try {
        const newMessage = new Message({
            text,
            author,
            sentAt: Date.now(),
        });

        await newMessage.save();
        
        let chatId;

        const chat = (await find([author, receiver]))[0];

        if (!chat) {
            const newChat = new Chat({
                users: [author, receiver],
                createAt: Date.now(),
            });

            await newChat.save();

            chatId = newChat._id;
        } else {
            chatId = chat._id;
        }

        await Chat.findByIdAndUpdate(chatId, {$push: {messages: newMessage._id}});

        emitter.emit('newMessage', chatId, newMessage);

        return newMessage;
    } catch (e) {
        throw e;
    }
};

const subscribe = (callback) => {
    emitter.on('newMessage', (chatId, message) => {
        callback(chatId, message);
    });
};

const getHistory = async (id) => {
    try {
        const messages = (await Chat.findById(id).populate('messages').select('messages')).messages;
        
        return messages;
    } catch (e) {
        throw e;
    }
}

const ChatModule = {
    find,
    sendMessage,
    subscribe,
    getHistory,
}

export default ChatModule;