import { ObjectId } from "mongoose";

export interface IMessage {
    _id: ObjectId | string;
    text: string;
    username: string;
    bookId: ObjectId | string;
}