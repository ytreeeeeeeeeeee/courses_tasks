import { Schema, model, Document } from "mongoose";
import { IMessage } from "../interfaces/message";

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

const msgModel = model<IMessage & Document>('Message', msgSchema);

export default msgModel;