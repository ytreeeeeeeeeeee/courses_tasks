import { Request, Response } from "express";

export default (req: Request, res: Response) => {
    res.render('errors/404', {title: 'Ошибка'});
}