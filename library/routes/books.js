import express from "express";
import {v4 as uuid} from 'uuid';
import fs from "fs";
import fileMulter from "../middlewares/file.js"
import path from "path";
import { fileURLToPath } from "url";

let storage = {};
const bookRouter = express.Router();

class Book {
    constructor(title = '', description = '', authors = '', favorite = false, fileCover = '', fileName = '', fileBook = '') {
        this.id = uuid();
        this.title= title;
        this.description = description;
        this.authors = authors;
        this.favorite = favorite;
        this.fileCover = fileCover;
        this.fileName = fileName;
        this.fileBook = fileBook;
    }
};

fs.readFile('./storage.json', (err, data) => {
    if (err) throw err;
    storage = JSON.parse(data);
});

bookRouter.get('/', (req, res) => {
    const {books} = storage;
    res.json(books);
});

bookRouter.post('/', fileMulter.single('file'), (req, res) => {
    const {books} = storage;
    const {title, description, authors, favorite, fileCover, fileName} = req.body;
    const {path} = req.file;

    const newBook = new Book(title, description, authors, favorite, fileCover, fileName, path);
    books.push(newBook);


    fs.writeFile('./storage.json', JSON.stringify(storage), (err) => {
        if (err) throw err;
    });

    res.status(201);
    res.json(newBook);
});

bookRouter.get('/:id', (req, res) => {
    const {books} = storage;
    const {id} = req.params;
    const idx = books.findIndex(el => el.id === id);
    
    if (idx === -1) {
        res.sendStatus(404);
    }
    else {
        res.json(books[idx]);
    }
});

bookRouter.put('/:id', (req, res) => {
    const {books} = storage;
    const {title, description, authors, favorite, fileCover, fileName, fileBook} = req.body;
    const {id} = req.params;
    const idx = books.findIndex(el => el.id === id);

    if (idx === -1) {
        res.sendStatus(404);
    }
    else {
        books[idx] = {
            ...books[idx],
            title,
            description,
            authors,
            favorite,
            fileCover,
            fileName,
            fileBook,
        }

        fs.writeFile('./storage.json', JSON.stringify(storage), (err) => {
            if (err) throw err
        });

        res.json(books[idx]);
    } 
});

bookRouter.delete('/:id', (req, res) => {
    const {books} = storage;
    const {id} = req.params;
    let idx = books.findIndex(el => el.id === id);

    if (idx === -1) {
        res.sendStatus(404);
    }
    else {
        books.splice(idx, 1);

        fs.writeFile('./storage.json', JSON.stringify(storage), (err) => {
            if (err) throw err
        });

        res.send('ok');
    }
});

bookRouter.get('/:id/download', (req, res) => {
    const {books} = storage;
    const {id} = req.params;
    const idx = books.findIndex(el => el.id === id);

    if (idx === -1) {
        res.sendStatus(404);
    }
    else {
        const bookPath = path.join(path.dirname(fileURLToPath(import.meta.url)), '../', books[idx].fileBook);
        res.download(bookPath);
    }
})

export default bookRouter;