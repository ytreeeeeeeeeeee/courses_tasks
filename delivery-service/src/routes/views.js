import express from 'express';

const viewsRouter = express.Router();

viewsRouter.get('/signin', (req, res) => {
    res.render('signin', {
        title: 'Авторизация',
    });
});

export default viewsRouter;