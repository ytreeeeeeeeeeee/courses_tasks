import express from 'express';
import session from 'express-session';
import passport from 'passport';
import dotenv from 'dotenv';
import { Strategy as YandexStrategy } from 'passport-yandex';

dotenv.configDotenv();

const clientID = process.env.CLIENT_ID || '';
const clientSecret = process.env.CLIENT_SECRET || '';

const app = express();

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.set('view engine', 'ejs');
app.use(session({secret: 'qwerty', resave: true, saveUninitialized: true}));

const isAuth = (req, res, next) => {
    if (req.isAuthenticated) {
        return next();
    }
    res.redirect('/');
}

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((obj, done) => {
    done(null, obj);
});

passport.use(new YandexStrategy({
    clientID: clientID,
    clientSecret: clientSecret,
    callbackURL: 'http://localhost:3000/login/callback',
}, (accessToken, refreshToken, profile, done) => {
    done(null, profile);
}));

app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
    res.render('index', {user: req.user});
});

app.get('/login', passport.authenticate('yandex'));

app.get('/login/callback', passport.authenticate('yandex'), (req, res) => {
    res.redirect('/');
});

app.get('/logout', (req, res) => {
    req.logOut((err) => {
        if (err) { console.error(err) }
        res.redirect('/');
    });
});

app.get('/profile', isAuth, (req, res) => {
    res.json(req.user);
});

app.listen(3000, () => {
    console.log('server is running on 3000 port');
});