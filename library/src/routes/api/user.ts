import express from 'express';
import passport from 'passport';
import isAuth from '../../middlewares/isAuth';
import container from '../../infrastructure/container';
import UserModule from '../../modules-ts/userModule';

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
    const userModule = container.get(UserModule);

    const newUser = await userModule.createUser(req.body);

    res.json(newUser);
});

export default userRouter;