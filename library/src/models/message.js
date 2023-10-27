import { Schema, model } from "mongoose";

const msgSchema = new Schema({
    text: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        ref: 'User',
        required: true,
    },
    bookId: {
        type: Schema.ObjectId,
        ref: 'Book',
        required: true,
    }
});

const msgModel = model('Message', msgSchema);

export default msgModel;