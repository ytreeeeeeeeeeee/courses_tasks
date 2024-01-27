const express = require('express');
const serverless = require('serverless-http');
const charactersModel = require('./models/characters');

const app = express();

app.use(express.urlencoded({extended: true}));
app.use(express.json());
    
app.get('/api/characters', (req, res) => {
    res.json(charactersModel);
});

app.get('/api/character', (req, res) => {
    const {id} = req.query;

    const character = charactersModel.find(el => el.id == id);
    console.log(character);
    
    if (character) {
        res.json(character);
    } else {
        res.json({status: 404, message: 'Not found'}).status(404);
    }
});

module.exports.handler = serverless(app);