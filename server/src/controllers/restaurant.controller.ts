import prisma from '../client';
import { Request, Response } from 'express';
import { comparePassword, hashPassword } from '../utils/password';
import generateToken from '../utils/generateToken';
import { BadRequestError } from '../errors/bad-request-error';
import { getIdFromToken } from '../utils/token';
import { DonationStatus } from '@prisma/client';

export const restaurantLogin = async (req: Request, res: Response) => {
    try {
        const { email, password: enteredPassword } = req.body;
        try {
            const restaurant = await prisma.restaurantUser.findUnique({
                where: {
                    email
                }
            })
            if (!restaurant) throw new BadRequestError('Invalid credentials');
            const passwordsMatch = await comparePassword(enteredPassword, restaurant.password);
            if (!passwordsMatch) throw new BadRequestError('Invalid credentials');
            else if (!restaurant.verified) throw new BadRequestError('You are not verified yet! Please wait for the admin to verify your account!');
            const { password, createdAt, updatedAt, ...rest } = restaurant;
            const token = generateToken(restaurant, 'restaurant');
            res.status(200).json({ success: true, data: { ...rest, token } });
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

export const restaurantRegister = async (req: Request, res: Response) => {
    try {
        const { email, password: enteredPassword, phone, photo, name, address } = req.body;
        try {
            const isExistAsRestaurant = await prisma.restaurantUser.findUnique({
                where: {
                    email
                }
            });
            if (isExistAsRestaurant) throw new BadRequestError('Email already exists as a restaurant!');

            const restaurant = await prisma.restaurantUser.findUnique({
                where: {
                    email
                }
            });
            if (restaurant) throw new BadRequestError('Restaurant already exists!');

            const hash = await hashPassword(enteredPassword);
            const newRestaurant = await prisma.restaurantUser.create({
                data: {
                    password: hash,
                    email,
                    phone,
                    photo,
                    name,
                    address
                }
            });

            const { password, createdAt, updatedAt, ...rest } = newRestaurant;
            const token = generateToken(newRestaurant, 'restaurant');
            res.status(200).json({ success: true, data: { ...rest, token } });
        } catch (error) {
            let message;
            if (error instanceof Error) message = error.message;
            else message = String(error);
            res.status(400).json({ success: false, message });
        }
    } catch (e) {
        let message;
        if (e instanceof Error) message = e.message;
        else message = String(e);
        res.status(400).json({ success: false, message });
    }
}

export const getRestaurants = async (req: Request, res: Response) => {
    try {
        try {
            const restaurants = await prisma.restaurantUser.findMany();
            res.status(200).json({ success: true, data: restaurants });
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

export const getRestaurant = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        try {
            const restaurant = await prisma.restaurantUser.findUnique({
                where: {
                    id: Number(id)
                }
            });
            res.status(200).json({ success: true, data: restaurant });
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

export const updateRestaurant = async (req: Request, res: Response) => {
    try {
        const id = getIdFromToken(req);
        const { phone, photo, name, address } = req.body;
        try {
            await prisma.restaurantUser.update({
                where: {
                    id: Number(id)
                },
                data: {
                    phone,
                    photo,
                    name,
                    address
                }
            });

            const updatedRestaurant = await prisma.restaurantUser.findUnique({
                where: {
                    id: Number(id)
                }
            });
            res.status(200).json({ success: true, data: updatedRestaurant });
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

export const deleteRestaurant = async (req: Request, res: Response) => {
    try {
        const id = getIdFromToken(req);
        try {
            const restaurant = await prisma.restaurantUser.delete({
                where: {
                    id: Number(id)
                }
            });
            res.status(200).json({ success: true, data: restaurant });
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

export const makeOpenFoodDonation = async (req: Request, res: Response) => {
    const id = getIdFromToken(req);
    const { name, description, photo, quantity, selfPickup } = req.body;
    try {
        try {
            const restaurant = await prisma.restaurantUser.findUnique({
                where: {
                    id: Number(id)
                }
            });
            if (!restaurant) throw new BadRequestError('Restaurant not found!');
            const openFood = await prisma.openFood.create({
                data: {
                    name,
                    description,
                    photo,
                    quantity: Number(quantity),
                    selfPickup,
                    restaurantUserId: Number(id),
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
        throw new BadRequestError(message);
    }
}

export const deleteDonation = async (req: Request, res: Response) => {
    const id = getIdFromToken(req);
    const { donationId } = req.body;
    try {
        try {
            const restaurant = await prisma.restaurantUser.findUnique({
                where: {
                    id: Number(id)
                }
            });
            if (!restaurant) throw new BadRequestError('Restaurant not found!');
            const donation = await prisma.openFood.findUnique({
                where: {
                    id: Number(donationId)
                }
            });
            if (!donation) throw new BadRequestError('Donation not found!');
            if (donation.restaurantUserId !== Number(id)) throw new BadRequestError('You are not the owner of this donation!');
            await prisma.openFood.delete({
                where: {
                    id: Number(donationId)
                }
            });
            res.status(200).json({ success: true, data: donation });
        } catch (e: any) {
            res.status(400).json({ success: false, message: e.message });
        }
    } catch (e) {
        let message;
        if (e instanceof Error) message = e.message;
        else message = String(e);
        throw new BadRequestError(message);
    }
}

export const getDonations = async (req: Request, res: Response) => {
    const id = getIdFromToken(req);
    try {
        try {
            const restaurant = await prisma.restaurantUser.findUnique({
                where: {
                    id: Number(id)
                }
            });
            if (!restaurant) throw new BadRequestError('Restaurant not found!');
            const donations = await prisma.openFood.findMany({
                where: {
                    restaurantUserId: Number(id),
                    quantity: {
                        gt: 0
                    }
                },
            });
            res.status(200).json({ success: true, data: donations });
        } catch (e: any) {
            res.status(400).json({ success: false, message: e.message });
        }
    } catch (e) {
        let message;
        if (e instanceof Error) message = e.message;
        else message = String(e);
        throw new BadRequestError(message);
    }
}

export const getOwnedDonations = async (req: Request, res: Response) => {
    try {
        const id = getIdFromToken(req);
        try {
            const restaurant = await prisma.restaurantUser.findUnique({
                where: {
                    id: Number(id)
                }
            });
            if (!restaurant) throw new BadRequestError('Restaurant not found!');

            const openFoods = await prisma.openFood.findMany({
                where: {
                    restaurantUserId: Number(id),
                },
            })

            const donationPromises = openFoods.map(async (openFood) => {
                const donations = await prisma.donation.findMany({
                    where: {
                        openFoodId: openFood.id
                    },
                    include: {
                        openFood: true,
                        neederUser: {
                            include: {
                                Address: true
                            }
                        },
                    }
                })
                return donations;
            });

            const donationResults = await Promise.all(donationPromises);
            const donations = donationResults.flat();

            res.status(200).json({ success: true, data: donations });
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


export const updateDonation = async (req: Request, res: Response) => {
    try {
        const id = getIdFromToken(req);
        const openFoodId = req.params.id;
        const { name, photo, quantity, description, selfPickup } = req.body;
        try {
            const restaurant = await prisma.restaurantUser.findUnique({
                where: {
                    id: Number(id)
                }
            });
            if (!restaurant) throw new BadRequestError('Restaurant not found!');
            const openFood = await prisma.openFood.findUnique({
                where: {
                    id: Number(openFoodId)
                }
            });
            if (!openFood) throw new BadRequestError('Donation not found!');
            if (openFood.restaurantUserId !== Number(id)) throw new BadRequestError('Donation not found in your foods!');

            await prisma.openFood.update({
                where: {
                    id: Number(openFoodId)
                },
                data: {
                    name: name || openFood.name,
                    photo: photo || openFood.photo,
                    quantity: Number(quantity) || openFood.quantity,
                    description: description || openFood.description,
                    selfPickup: selfPickup
                }
            })

            const updatedOpenFood = await prisma.openFood.findUnique({
                where: {
                    id: Number(openFoodId)
                }
            });

            res.status(200).json({ success: true, data: updatedOpenFood });
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

export const cancelOwnedDonation = async (req: Request, res: Response) => {
    try {
        const id = getIdFromToken(req);
        const { id: donationId } = req.params;
        try {
            const restaurant = await prisma.restaurantUser.findUnique({
                where: {
                    id: Number(id)
                }
            });
            if (!restaurant) throw new BadRequestError('Restaurant not found!');
            const donation = await prisma.donation.findUnique({
                where: {
                    id: Number(donationId)
                },
                include: {
                    openFood: true,
                }
            });
            if (!donation) throw new BadRequestError('Donation not found!');
            if (donation.openFood?.restaurantUserId !== Number(id)) throw new BadRequestError('Donation not found in your donations!');
            await prisma.donation.update({
                where: {
                    id: Number(donationId)
                },
                data: {
                    status: DonationStatus.rejected
                },
                include: {
                    openFood: true
                }
            })

            const updatedDonation = await prisma.donation.findUnique({
                where: {
                    id: Number(donationId)
                },
                include: {
                    openFood: true
                }
            })

            res.status(200).json({ success: true, data: updatedDonation });
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

export const updateDonationStatusToNextStep = async (req: Request, res: Response) => {
    try {
        const id = getIdFromToken(req);
        const { id: donationId } = req.params;
        try {
            const restaurant = await prisma.restaurantUser.findUnique({
                where: {
                    id: Number(id)
                }
            });
            if (!restaurant) throw new BadRequestError('Restaurant not found!');
            const donation = await prisma.donation.findUnique({
                where: {
                    id: Number(donationId)
                },
                include: {
                    openFood: true,
                }
            });
            if (!donation) throw new BadRequestError('Donation not found!');
            if (donation.openFood?.restaurantUserId !== Number(id)) throw new BadRequestError('Donation not found in your donations!');
            const currentStatus = donation.status;
            const selfPickup = donation.openFood?.selfPickup;
            let nextStatus;
            switch (currentStatus) {
                case 'pending':
                    nextStatus = DonationStatus.accepted;
                    break;
                case 'accepted':
                    nextStatus = selfPickup ? DonationStatus.inBox : DonationStatus.onTheWay;
                    break;
                case 'onTheWay':
                    nextStatus = DonationStatus.takenFromBox;
                    break;
                default:
                    throw new BadRequestError('Donation is already ready to be picked up from the restaurant!');
            }
            await prisma.donation.update({
                where: {
                    id: Number(donationId)
                },
                data: {
                    status: nextStatus
                },
                include: {
                    openFood: true,
                }
            })

            const updatedDonation = await prisma.donation.findUnique({
                where: {
                    id: Number(donationId)
                },
                include: {
                    openFood: true,
                }
            })

            res.status(200).json({ success: true, data: updatedDonation });
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