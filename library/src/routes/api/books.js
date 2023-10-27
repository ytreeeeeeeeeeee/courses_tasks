import express from 'express';
import fs from "fs";
import fileMulter from '../../middlewares/file.js';
import isAuth from '../../middlewares/isAuth.js';
import path from "path";
import { fileURLToPath } from "url";
import Book from '../../models/book.js';

const bookRouter = express.Router();

bookRouter.get('/', isAuth, async (req, res) => {
    try {
        const books = await Book.find().select('-__v');
        res.json(books);
    } catch (e) {
        res.status(500).json({errmsg: e});
    }
});

bookRouter.post('/', fileMulter.single('file'), async (req, res) => {
    const {title, description, authors, favourite, fileCover, fileName} = req.body;
    const {path} = req.file;

    try {   
        const newBook = new Book({
            title,
            description,
            authors,
            favourite,
            fileCover,
            fileName,
            fileBook: path,
        });
        await newBook.save();
        
        res.status(201).json(newBook);
    } catch (e) {
        res.status(500).json({errmsg: e});
    }
});

bookRouter.get('/:id', isAuth, async (req, res) => {
    const {id} = req.params;
    
    try {
        const book = await Book.findById(id).select('-__v');
    
        if (!book) {
            res.sendStatus(404);
        }
        else {
            fetch(`${req.protocol}://${process.env.COUNTER_URL}/counter/${id}/incr`, {
                method: 'POST',
            }).then((response) => {
                response.json().then((r) => {
                    res.json({
                        ...book,
                        count: r.count,
                    });
                });
            });
        }
    } catch (e) {
        res.status(500).json({errmsg: e});
    }
});

bookRouter.put('/:id', fileMulter.single('file'), async (req, res) => {
    const {title, description, authors, favourite, fileCover, fileName} = req.body;
    const {id} = req.params;
    const fileBook = req.file && req.file.path;

    try {
        const book = await Book.findByIdAndUpdate(id, {
            title,
            description,
            authors,
            favourite,
            fileCover,
            fileName,
            fileBook,
        });
        
        book && res.json(book);
    } catch (e) {
        res.status(500).json({errmsg: e});
    }
});

bookRouter.delete('/:id', async (req, res) => {
    const {id} = req.params;

    try {
        const fileBook = await Book.findById(id).select('fileBook');
        const book = await Book.deleteOne({_id: id});

        if (!book) {
            res.sendStatus(404);
        }
        else {
            fs.unlink(path.join(path.dirname(fileURLToPath(import.meta.url)), '../../../', fileBook.fileBook), (err) => {
                if (err) throw err;
            });

            res.send('ok');
        }
    } catch (e) {
        res.status(500).json({errmsg: e});
    }
});

bookRouter.get('/:id/download', isAuth, async (req, res) => {
    const {id} = req.params;

    try {
        const book = await Book.findById(id).select('-__v');

        if (!book) {
            res.sendStatus(404);
        }
        else {
            const bookPath = path.join(path.dirname(fileURLToPath(import.meta.url)), '../../../', book.fileBook);
            res.download(bookPath);
        }
    } catch (e) {
        res.status(500).json({errmsg: e});
    }
})

export default bookRouter;