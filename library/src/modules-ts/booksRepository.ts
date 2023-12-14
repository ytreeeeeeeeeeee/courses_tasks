import 'reflect-metadata';
import { injectable } from 'inversify';
import fs from 'fs';
import path from 'path';
import { IBook } from '../interfaces/book';
import Book from '../models/book';
import { errorHandler } from '../decorators/errorHandler';

interface CreateBookDto {
    title: IBook['title'];
    description?: IBook['description'];
    authors?: IBook['authors'];
    favourite?: IBook['favourite'];
    fileCover?: IBook['fileCover'];
    fileName?: IBook['fileName'];
    fileBook?: IBook['fileBook'];
}

@injectable()
class BooksRepository {
    @errorHandler
    async createBook(book: CreateBookDto): Promise<IBook> {  
        book.favourite = book.favourite ? true : false;

        const newBook = new Book(book);
        await newBook.save();
        
        return newBook;
    }

    @errorHandler
    async getBook(id: string): Promise<IBook | null> {
        const book = await Book.findById(id).select('-__v');
    
        return book;
    }

    @errorHandler
    async getBooks(): Promise<IBook[] | []> {
        const books = await Book.find().select('-__v');
        return books;
    }

    @errorHandler
    async updateBook(id: string, options: IBook): Promise<IBook | null> {
        options.favourite = options.favourite ? true : false;

        const book = await Book.findByIdAndUpdate(id, options);
        return book;
    }

    @errorHandler
    async deleteBook(id: string): Promise<string | null> {
        const curBook: IBook = await Book.findById(id).select('fileBook');
        const book = await Book.deleteOne({_id: id});

        if (!book) {
            return 'not ok';
        }
        else {
            fs.unlink(path.join(__dirname, '../../', curBook.fileBook), (err) => {
                if (err) throw err;
            });

            return 'ok';
        }
    }
}

export default BooksRepository;