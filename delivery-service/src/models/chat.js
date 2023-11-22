import { Schema, model } from 'mongoose';

const chatSchema = new Schema({
    users: {
        type: [
            {
                type: Schema.ObjectId,
                ref: 'User',
                required: true,
            }
        ],
        validate: {
            validator: function (array) {
                return array.length == 2;
            },
            message: 'В чате должно быть 2 участника',
        },
    },
    createAt: {
        type: Date,
        required: true,
    },
    messages: [
        {
            type: Schema.ObjectId,
            ref: 'Message',
        }
    ]
}, {versionKey: false});

const chatModel = model('Chat', chatSchema);

export default chatModel;