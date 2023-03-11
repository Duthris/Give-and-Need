import prisma from '../client';
import { Request, Response } from 'express';
import { BadRequestError } from '../errors/bad-request-error';
import { getIdFromToken } from '../utils/token';
import { NotAuthorizedError } from '../errors/not-authorized-error';

export const getPackagedFoods = async (req: Request, res: Response) => {
    try {
        try {
            const packagedFoods = await prisma.packagedFood.findMany({
                where: {
                    ownable: true
                }
            });
            res.status(200).json({ success: true, data: packagedFoods });
        } catch (e: any) {
            res.status(400).json({ success: false, message: e.message });
        }
    } catch (e) {
        let message;
        if (e instanceof Error) message = e.message;
        else message = String(e);
        res.status(400).json({ success: false, message });
    }
}

export const getPackagedFood = async (req: Request, res: Response) => {
    try {
        try {
            const packagedFood = await prisma.packagedFood.findUnique({
                where: {
                    id: Number(req.params.id)
                }
            });
            res.status(200).json({ success: true, data: packagedFood });
        } catch (e: any) {
            res.status(400).json({ success: false, message: e.message });
        }
    } catch (e) {
        let message;
        if (e instanceof Error) message = e.message;
        else message = String(e);
        res.status(400).json({ success: false, message });
    }
}

export const getOpenFoods = async (req: Request, res: Response) => {
    try {
        try {
            const openFoods = await prisma.openFood.findMany({
                where: {
                    ownable: true
                }
            });
            res.status(200).json({ success: true, data: openFoods });
        } catch (e: any) {
            res.status(400).json({ success: false, message: e.message });
        }
    } catch (e) {
        let message;
        if (e instanceof Error) message = e.message;
        else message = String(e);
        res.status(400).json({ success: false, message });
    }
}

export const getOpenFood = async (req: Request, res: Response) => {
    try {
        try {
            const openFood = await prisma.openFood.findUnique({
                where: {
                    id: Number(req.params.id)
                }
            });
            res.status(200).json({ success: true, data: openFood });
        } catch (e: any) {
            res.status(400).json({ success: false, message: e.message });
        }
    } catch (e) {
        let message;
        if (e instanceof Error) message = e.message;
        else message = String(e);
        res.status(400).json({ success: false, message });
    }
}

export const getAllFoods = async (req: Request, res: Response) => {
    try {
        try {
            const packagedFoods = await prisma.packagedFood.findMany({
                where: {
                    ownable: true
                }
            });
            const openFoods = await prisma.openFood.findMany({
                where: {
                    ownable: true
                }
            });
            const allFoods = [...packagedFoods, ...openFoods];
            res.status(200).json({ success: true, data: allFoods });
        } catch (e: any) {
            res.status(400).json({ success: false, message: e.message });
        }
    } catch (e) {
        let message;
        if (e instanceof Error) message = e.message;
        else message = String(e);
        res.status(400).json({ success: false, message });
    }
}