import { ObjectId } from "mongoose";

export interface IBook {
    _id: ObjectId | string;
    title: string;
    description: string;
    authors: string;
    favourite: boolean;
    fileCover: string;
    fileName: string;
    fileBook: string;
}