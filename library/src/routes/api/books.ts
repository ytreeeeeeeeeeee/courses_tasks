import express from 'express';
import path from "path";

import fileMulter from '../../middlewares/file';
import isAuth from '../../middlewares/isAuth';
import container from '../../infrastructure/container';
import BooksRepository from '../../modules-ts/booksRepository';

const bookRouter = express.Router();

bookRouter.get('/', isAuth, async (req, res) => {
    const repo = container.get(BooksRepository);
    const books = await repo.getBooks();
    res.json(books);
});

bookRouter.post('/', fileMulter.single('file'), async (req, res) => {
    const path = req.file?.path;

    const repo = container.get(BooksRepository);

    const newBook = await repo.createBook({
        ...req.body,
        fileBook: path,
    });
    res.status(201).json(newBook);
});

bookRouter.get('/:id', isAuth, async (req, res) => {
    const {id} = req.params;

    const repo = container.get(BooksRepository);

    const book = await repo.getBook(id);

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
});

bookRouter.put('/:id', fileMulter.single('file'), async (req, res) => {
    const {id} = req.params;
    const fileBook = req.file && req.file.path;

    const repo = container.get(BooksRepository);

    const book = await repo.updateBook(id, {
        ...req.body,
        fileBook,
    });
    book && res.json(book);
});

bookRouter.delete('/:id', async (req, res) => {
    const {id} = req.params;

    const repo = container.get(BooksRepository);

    const message = await repo.deleteBook(id);
    res.json(message);
});

bookRouter.get('/:id/download', isAuth, async (req, res) => {
    const {id} = req.params;

    const repo = container.get(BooksRepository);

    try {
        const book = await repo.getBook(id);

        if (!book) {
            res.sendStatus(404);
        }
        else {
            const bookPath = path.join(__dirname, '../../../', book.fileBook);
            res.download(bookPath);
        }
    } catch (e) {
        res.status(500).json({errmsg: e});
    }
})

export default bookRouter;