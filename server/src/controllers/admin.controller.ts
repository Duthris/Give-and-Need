import { Request, Response } from 'express';
import prisma from '../client';
import { BadRequestError } from '../errors/bad-request-error';
import { comparePassword, hashPassword } from '../utils/password';
import generateToken from '../utils/generateToken';

export const adminLogin = async (req: Request, res: Response) => {
    try {
        const { email, enteredPassword } = req.body;
        try {
            const admin = await prisma.adminUser.findUnique({
                where: {
                    email
                }
            })
            if (!admin) throw new BadRequestError('Invalid credentials!');
            const passwordsMatch = await comparePassword(enteredPassword, admin.password);
            if (!passwordsMatch) throw new BadRequestError('Invalid credentials!');
            const { password, createdAt, updatedAt, ...rest } = admin;
            const token = generateToken(admin, 'admin');
            res.status(200).json({ success: true, data: { ...rest, token } });
        } catch (error: any) {
            res.status(400).json({ success: false, message: error.message });
        }
    } catch (e) {
        let message;
        if (e instanceof Error) message = e.message;
        else message = String(e);
        throw new BadRequestError(message);
    }
}

export const getAdmins = async (req: Request, res: Response) => {
    try {
        try {
            const admins = await prisma.adminUser.findMany();
            res.status(200).json({ success: true, data: admins });
        } catch (error: any) {
            res.status(400).json({ success: false, message: error.message });
        }
    } catch (e) {
        let message;
        if (e instanceof Error) message = e.message;
        else message = String(e);
        throw new BadRequestError(message);
    }
}

export const getAdmin = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        try {
            const admin = await prisma.adminUser.findUnique({
                where: {
                    id: Number(id)
                }
            });
            if (!admin) throw new BadRequestError('Admin not found!');
            res.status(200).json({ success: true, data: admin });
        } catch (error: any) {
            res.status(400).json({ success: false, message: error.message });
        }
    } catch (e) {
        let message;
        if (e instanceof Error) message = e.message;
        else message = String(e);
        throw new BadRequestError(message);
    }
}

export const createAdmin = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const hashedPassword = await hashPassword(password);
        try {
            const admin = await prisma.adminUser.create({
                data: {
                    email,
                    password: hashedPassword
                }
            });
            const { password: hashed, createdAt, updatedAt, ...rest } = admin;
            res.status(200).json({ success: true, data: rest });
        } catch (error: any) {
            res.status(400).json({ success: false, message: error.message });
        }
    } catch (e) {
        let message;
        if (e instanceof Error) message = e.message;
        else message = String(e);
        throw new BadRequestError(message);
    }
}

export const updateAdmin = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { email, password } = req.body;
        try {
            const admin = await prisma.adminUser.findUnique({
                where: {
                    id: Number(id)
                }
            });
            if (!admin) throw new BadRequestError('Admin not found!');
            await prisma.adminUser.update({
                where: {
                    id: Number(id)
                },
                data: {
                    email: email || admin.email,
                    password: password ? await hashPassword(password) : admin.password
                }
            });
            const updatedAdmin = await prisma.adminUser.findUnique({
                where: {
                    id: Number(id)
                }
            });
            const { password: hashedPassword, createdAt: created, updatedAt: updated, ...restAdmin } = updatedAdmin!;
            res.status(200).json({ success: true, data: restAdmin });
        } catch (error: any) {
            res.status(400).json({ success: false, message: error.message });
        }
    } catch (e) {
        let message;
        if (e instanceof Error) message = e.message;
        else message = String(e);
        throw new BadRequestError(message);
    }
}

export const deleteAdmin = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        try {
            const admin = await prisma.adminUser.findUnique({
                where: {
                    id: Number(id)
                }
            });
            if (!admin) throw new BadRequestError('Admin not found!');
            if (admin.id === req.currentUser!.id) throw new BadRequestError('You can\'t delete your own admin account!');
            await prisma.adminUser.delete({
                where: {
                    id: Number(id)
                }
            });
            const { password, createdAt, updatedAt, ...rest } = admin;
            res.status(200).json({ success: true, data: rest });
        } catch (error: any) {
            res.status(400).json({ success: false, message: error.message });
        }
    } catch (e) {
        let message;
        if (e instanceof Error) message = e.message;
        else message = String(e);
        throw new BadRequestError(message);
    }
}

export const addFoodBox = async (req: Request, res: Response) => {
    try {
        const { name } = req.body;
        try {
            const foodBox = await prisma.foodBox.create({
                data: {
                    name,
                    password: await hashPassword('supersecretpassword')
                }
            });
            res.status(200).json({ success: true, data: foodBox });
        } catch (error: any) {
            res.status(400).json({ success: false, message: error.message });
        }
    } catch (error) {
        let message;
        if (error instanceof Error) message = error.message;
        else message = String(error);
        throw new BadRequestError(message);
    }
}

export const verifyRestaurant = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        try {
            const restaurant = await prisma.restaurantUser.findUnique({
                where: {
                    id: Number(id)
                }
            });
            if (!restaurant) throw new BadRequestError('Restaurant not found!');
            await prisma.restaurantUser.update({
                where: {
                    id: Number(id)
                },
                data: {
                    verified: true
                }
            });
            res.status(200).json({ success: true, data: 'Restaurant verified!' });
        } catch (error: any) {
            res.status(400).json({ success: false, message: error.message });
        }
    } catch (error) {
        let message;
        if (error instanceof Error) message = error.message;
        else message = String(error);
        throw new BadRequestError(message);
    }
}

export const getUnverifiedRestaurants = async (req: Request, res: Response) => {
    try {
        try {
            const restaurants = await prisma.restaurantUser.findMany({
                where: {
                    verified: false
                }
            });
            res.status(200).json({ success: true, data: restaurants });
        } catch (error: any) {
            res.status(400).json({ success: false, message: error.message });
        }
    } catch (error) {
        let message;
        if (error instanceof Error) message = error.message;
        else message = String(error);
        throw new BadRequestError(message);
    }
}