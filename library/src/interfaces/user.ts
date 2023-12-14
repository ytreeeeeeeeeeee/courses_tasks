import { ObjectId } from "mongoose";

export interface IUser {
    _id: ObjectId | string;
    username: string;
    password: string;
    displayName?: string;
    emails?: {value: string}[];
    verifyPassword: (password: string) => boolean; 
}