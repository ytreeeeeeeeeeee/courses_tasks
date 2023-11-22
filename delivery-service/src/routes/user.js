import express from 'express';
import bcrypt from 'bcrypt';
import passport from 'passport';
import UserModule from '../modules/user.js';

const userRouter = express.Router();

userRouter.post('/signup', async (req, res) => {
    const {email, password, name, contactPhone} = req.body;

    const newUser = await UserModule.create({
        email,
        passwordHash: await bcrypt.hash(password, 10),
        name,
        contactPhone,
    });

    if (newUser) res.json({data: newUser, status: 'ok'});
    else res.json({error: 'email занят', status: 'error'});
});

userRouter.post('/signin', 
    (req, res, next) => {
        passport.authenticate('local', (err, user, info) => {
            if (err) return next(err);
            if (!user) return res.json({error: 'Неверный логин или пароль', status: 'error'});
            req.logIn(user, (err) => {
                if (err) return next(err);
                return res.json({data: user, status: 'ok'});
            })
        })(req, res, next);
    });

export default userRouter;