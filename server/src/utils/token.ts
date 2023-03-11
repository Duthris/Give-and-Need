import jwt from 'jsonwebtoken';
import { Request } from 'express';

export const getToken = (req: Request) => {
    const token = req.headers.authorization!.replace('Bearer ', '');
    return token;
}

export const verifyToken = (token: string) => {
    const payload = jwt.verify(token, process.env.JWT_SECRET!);
    return payload;
}

export const getIdFromToken = (req: Request) => {
    const token = getToken(req);
    const payload = verifyToken(token) as { id: number };
    const id = payload.id;
    return id;
}