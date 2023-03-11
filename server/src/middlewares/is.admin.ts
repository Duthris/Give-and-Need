// middleware for checking if user is admin
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { NotAuthorizedError } from './../errors/not-authorized-error';

export const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let token = req.headers.authorization!.replace('Bearer ', '');

        const payload = jwt.verify(token, process.env.JWT_SECRET!) as { role: string };

        try {
            if (payload.role === 'admin') next();
            else throw new NotAuthorizedError();
        } catch (e) {
            throw new NotAuthorizedError();
        }

    } catch (e) {
        let message;
        if (e instanceof Error) message = e.message;
        else message = String(e);
        res.status(400).json({ success: false, message });        
    }
}