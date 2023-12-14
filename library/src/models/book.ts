import { Schema, model, Document } from "mongoose";
import { IBook } from "../interfaces/book";

const bookSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
        default: "",
    },
    authors: {
        type: String,
        default: "",
    },
    favourite: {
        type: Boolean,
        default: false,
    },
    fileCover: {
        type: String,
        default: "",
    },
    fileName: {
        type: String,
        default: "",
    },
    fileBook: {
        type: String,
        default: "",
    },
});

const bookModel = model<IBook & Document>('Book', bookSchema)

export default bookModel;