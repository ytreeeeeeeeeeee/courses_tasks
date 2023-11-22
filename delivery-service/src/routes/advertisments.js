import express from 'express';
import AdvertisementModule from '../modules/advertisment.js';
import fileMulter from '../middlewares/file.js';
import isAuth from '../middlewares/isAuth.js';
import { Types } from 'mongoose';

const advertismentRouter = express.Router();

advertismentRouter.get('/', async (req, res) => {
    try {
        const advertisments = await AdvertisementModule.find({});
        
        res.json({data: advertisments, status: 'ok'});
    } catch (e) {
        res.json({error: e.message, status: 'error'})
    }
});

advertismentRouter.get('/:id', async (req, res) => {
    try {
        const {id} = req.params;
        
        const advertisment = await AdvertisementModule.find({_id: new Types.ObjectId(id)});
        
        res.json({data: advertisment, status: 'ok'});
    } catch (e) {
        res.json({error: e.message, status: 'error'})
    }
});

advertismentRouter.post('/', isAuth, fileMulter.array('images'), async (req, res) => {
    const {shortTitle, description, tags} = req.body;

    try{
        const newAdvertisment = await AdvertisementModule.create({
            shortTitle,
            description,
            userId: req.user._id,
            images: req.files.map(file => file.path),
            tags: tags || [],
        });
        
        res.json({data: newAdvertisment, status: 'ok'})
    } catch (e) {
        res.json({error: e.message, status: 'error'})
    }
});

advertismentRouter.delete('/:id', isAuth, async (req, res) => {
    const {id} = req.params;

    try {
        const advertisment = await AdvertisementModule.find({_id: id});
        
        if (advertisment) {
            if (advertisment[0].user._id.equals(req.user._id)) {
                await AdvertisementModule.remove(id);
                res.json({status: 'ok'});
            } else {
                res.status(403).json({error: 'Пользователь не является владельцом объявления', status: 'error'});
            }
        } else {
            res.json({error: 'Такого объявления не существует', status: 'error'});
        }
    } catch (e) {
        res.json({error: e.message, status: 'error'})
    }
});

export default advertismentRouter;