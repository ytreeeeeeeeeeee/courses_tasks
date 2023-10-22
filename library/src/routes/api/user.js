import express from 'express';
import passport from 'passport';
import isAuth from '../../middlewares/isAuth.js';
import User from '../../models/user.js';

const userRouter = express.Router();

userRouter.get('/me', isAuth, (req, res) => {
    res.json(req.user);
});

userRouter.post('/login',
    passport.authenticate('local', {failureRedirect: '/login'}),
    (req, res) => {
        res.json(req.user);
});

userRouter.post('/signup', async (req, res) => {
    const {username, password, displayName, email} = req.body;

    const newUser = new User({   
        username,
        password,
        displayName,
        emails: {
            value: email
        },
    });

    await newUser.save();

    res.json(newUser);
});

export default userRouter;