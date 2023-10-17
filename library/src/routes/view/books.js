import express from "express";
import fs from "fs";
import fileMulter from "../../middlewares/temporaryFile.js";

let storage;

const bookViewRouter = express.Router();

bookViewRouter.use((req, res, next) => {
    fs.readFile('./src/storage.json', (err, data) => {
        if (err) throw err;
        storage = JSON.parse(data);
        next();
    });
});

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

bookViewRouter.get('/', (req, res) => {
    const {books} = storage;

    res.render('books/index', {
        title: 'Список книг',
        books: books
    });
});

bookViewRouter.get('/create', (req, res) => {
    res.render('books/create', {
        title: 'Создать книгу',
    });
});

bookViewRouter.get('/update/:id', (req, res) => {
    const {books} = storage;
    const {id} = req.params;
    const idx = books.findIndex(el => el.id === id);

    if (idx === -1) {
        res.redirect('/errors/404');
    }
    else {
        res.render('books/update', {
            title: 'Редактировать книгу',
            book: books[idx]
        });
    }
});

bookViewRouter.get('/:id', (req, res) => {
    const {books} = storage;
    const {id} = req.params;
    const idx = books.findIndex(el => el.id === id);

    if (idx === -1) {
        res.redirect('/errors/404');
    }
    else {
        fetch(`${req.protocol}://counter:3003/counter/${id}/incr`, {
            method: 'POST',
        }).then((response) => {
            response.json().then((r) => {
                res.render('books/view', {
                    title: 'Информация о книге',
                    book: books[idx],
                    count: r.count,
                });
            });
        });
    }
});

bookViewRouter.post('/create', fileMulter.single('file'), (req, res) => {
    const formData = convertToFormData(req.body, req.file);
    fetch(`${req.protocol}://library:3002/api/books/`, {
        method: 'POST',
        body: formData,
    })
    .then((response) => {
        res.redirect('/books');
    });
});

bookViewRouter.post('/update/:id', fileMulter.single('file'), (req, res) => {
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

bookViewRouter.post('/delete/:id', (req, res) => {
    const {id} = req.params;
    fetch(`${req.protocol}://library:3002/api/books/${id}`, {
        method: 'DELETE',
    })
    .then((response) => {
        res.redirect('/books');
    });
});

export default bookViewRouter;