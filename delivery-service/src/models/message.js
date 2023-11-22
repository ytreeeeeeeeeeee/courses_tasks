import { Schema, model } from 'mongoose';

const msgSchema = new Schema({
    author: {
        type: Schema.ObjectId,
        required: true,
        ref: 'User',
    },
    sentAt: {
        type: Date,
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
    readAt: {
        type: Date,
    }
}, {versionKey: false});

const msgModel = model('Message', msgSchema);

export default msgModel;