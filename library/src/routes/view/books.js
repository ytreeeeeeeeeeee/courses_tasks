import express from "express";

import fileMulter from "../../middlewares/temporaryFile.js";
import isAuth from "../../middlewares/isAuth.js";

import Book from "../../models/book.js";
import Message from '../../models/message.js';

const bookViewRouter = express.Router();

function convertToFormData(body, file) {
    const formData = new FormData();

    formData.append('title', body.title); 
    formData.append('description', body.description);
    formData.append('authors', body.authors);
    formData.append('favourite', body.favourite ? true : false);
    formData.append('fileCover', body.fileCover);
    formData.append('fileName', body.fileName);

    if (file) {
        const fileInput = file;
        const fileBlob = new Blob([fileInput.buffer], {type: fileInput.mimetype});
        formData.append('file', fileBlob, fileInput.originalname);
    }

    return formData;
}

bookViewRouter.get('/', isAuth, async (req, res) => {
    try {
        const books = await Book.find().select('-__v');

        res.render('books/index', {
            title: 'Список книг',
            books: books
        });
    } catch (e) {
        console.log(e);
        res.redirect('/errors/404');
    }
});

bookViewRouter.get('/create', isAuth, (req, res) => {
    res.render('books/create', {
        title: 'Создать книгу',
    });
});

bookViewRouter.get('/update/:id', isAuth, async (req, res) => {
    const {id} = req.params;
    try {
        const book = await Book.findById(id).select('-__v');
        if (!book) {
            res.redirect('/errors/404');
        }
        else {
            res.render('books/update', {
                title: 'Редактировать книгу',
                book: book
            });
        }
    } catch (e) {
        console.log(e);
        res.redirect('/errors/404');
    }   
});

bookViewRouter.get('/:id', isAuth, async (req, res) => {
    const {id} = req.params;
    
    try {
        const book = await Book.findById(id).select('-__v');
        if (!book) {
            res.redirect('/errors/404');
        }
        else {
            const msgs = await Message.find({bookId: book.id}).select('-__v').sort({_id: -1});
            fetch(`${req.protocol}://${process.env.COUNTER_URL}/counter/${id}/incr`, {
                method: 'POST',
            }).then((response) => {
                response.json().then((r) => {
                    res.render('books/view', {
                        title: 'Информация о книге',
                        book: book,
                        count: r.count,
                        msgs: msgs,
                        username: req.user.username,
                    });
                });
            });
        }
    } catch (e) {
        console.log(e);
        res.redirect('/errors/404');
    }
});

bookViewRouter.post('/create', isAuth, fileMulter.single('file'), (req, res) => {
    const formData = convertToFormData(req.body, req.file);
    fetch(`${req.protocol}://library:3002/api/books/`, {
        method: 'POST',
        body: formData,
    })
    .then((response) => {
        res.redirect('/books');
    }).catch((e) => {
        console.log(e);
    });
});

bookViewRouter.post('/update/:id', isAuth, fileMulter.single('file'), (req, res) => {
    const {id} = req.params;
    const formData = convertToFormData(req.body, req.file);
    fetch(`${req.protocol}://library:3002/api/books/${id}`, {
        method: 'PUT',
        body: formData,
    })
    .then((response) => {
        res.redirect('/books');
    });
});

bookViewRouter.post('/delete/:id', isAuth, (req, res) => {
    const {id} = req.params;
    fetch(`${req.protocol}://library:3002/api/books/${id}`, {
        method: 'DELETE',
    })
    .then((response) => {
        res.redirect('/books');
    });
});

export default bookViewRouter;