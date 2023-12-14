import express, { response } from 'express';
import passport from 'passport';

const userViewRouter = express.Router();

userViewRouter.get('/login', (req, res) => {
    res.render('user/login', {
        title: 'Авторизация'
    });
});


userViewRouter.get('/signup', (req, res) => {
    res.render('user/signup', {
        title: 'Регистрация'
    });
});

userViewRouter.post('/login', passport.authenticate('local', {failureRedirect: '/login', successRedirect: '/books'}));

userViewRouter.post('/signup', (req, res) => {
    const {username, password, displayName, email} = req.body;

    fetch(`${req.protocol}://library:3002/api/user/signup`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username,
            password,
            displayName,
            email,
        }),
    }).then((response) => {
        res.redirect('/login');
    }).catch((e) => {
        console.error(e);
    });
});

export default userViewRouter;