import express from 'express';
import {v4 as uuid} from 'uuid';

const app = express();
const apiRouter = express.Router();
const bookRouter = express.Router();

app.use(express.json());
app.use('/api', apiRouter);
app.use('/api/books', bookRouter);

class Book {
    constructor(title = '', description = '', authors = '', favorite = '', fileCover = '', fileName = '') {
        this.id = uuid();
        this.title= title;
        this.description = description;
        this.authors = authors;
        this.favorite = favorite;
        this.fileCover = fileCover;
        this.fileName = fileName;
    }
};

const storage = {
    books: [],
};

apiRouter.post('/user/login', (req, res) => {
    res.status(201).json({
        id: 1,
        mail: "test@mail.ru",
    });
});

bookRouter.get('/', (req, res) => {
    const {books} = storage;
    res.json(books);
});

bookRouter.post('/', (req, res) => {
    const {books} = storage;
    const {title, description, authors, favorite, fileCover, fileName} = req.body;

    const newBook = new Book(title, description, authors, favorite, fileCover, fileName);
    books.push(newBook);

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
    const {title, description, authors, favorite, fileCover, fileName} = req.body;
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
        }

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
        res.send('ok');
    }
});

app.listen(3000);