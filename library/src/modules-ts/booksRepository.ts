import fs from 'fs';
import path from 'path';
import { fileURLToPath } from "url";
// import Book from '../models/book.js';

interface IBook {
    title: string,
    description: string | undefined,
    authors: string | undefined,
    favourite: string | undefined,
    fileCover: string | undefined,
    fileName: string | undefined,
    fileBook: string | undefined
}

abstract class BooksRepository {
    async createBook(book: IBook) {
        // try {   
        //     const newBook = new Book(book);
        //     await newBook.save();
            
        //     return newBook;
        // } catch (e) {
        //     console.error(e);
        // }
    }

    async getBook(id: number) {
        // try {
        //     const book = await Book.findById(id).select('-__v');
        
        //     if (!book) {
        //         return null;
        //     }
        //     else {
        //         return book;
        //     }
        // } catch (e) {
        //     console.error(e);
        // }
    }

    async getBooks() {
        // try {
        //     const books = await Book.find().select('-__v');
        //     return books;
        // } catch (e) {
        //     console.error(e);
        // }
    }

    async updateBook(id: number) {

    }

    async deleteBook(id: number) {
        // try {
        //     const fileBook = await Book.findById(id).select('fileBook');
        //     const book = await Book.deleteOne({_id: id});
    
        //     if (!book) {
        //         return null;
        //     }
        //     else {
        //         fs.unlink(path.join(path.dirname(fileURLToPath(import.meta.url)), '../../', fileBook.fileBook), (err) => {
        //             if (err) throw err;
        //         });
    
        //        return 'ok';
        //     }
        // } catch (e) {
        //     console.error(e);
        // }
    }
}

export default BooksRepository;