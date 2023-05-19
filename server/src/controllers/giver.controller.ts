import prisma from '../client';
import { Request, Response } from 'express';
import { comparePassword, hashPassword } from '../utils/password';
import generateToken from '../utils/generateToken';
import { BadRequestError } from '../errors/bad-request-error';
import { getIdFromToken } from '../utils/token';
import { sendEmail } from '../utils/sendMail';
var voucher_codes = require('voucher-code-generator');
import { DonationStatus } from '@prisma/client';

export const giverLogin = async (req: Request, res: Response) => {
    try {
        const { email, password: enteredPassword } = req.body;
        try {
            const giver = await prisma.giverUser.findUnique({
                where: {
                    email
                }
            })
            if (!giver) throw new BadRequestError('Invalid credentials');
            else if (!giver.verified) throw new BadRequestError('Please verify your email');
            const passwordsMatch = await comparePassword(enteredPassword, giver.password);
            if (!passwordsMatch) throw new BadRequestError('Invalid credentials');
            const { password, createdAt, updatedAt, ...rest } = giver;
            const token = generateToken(giver, 'giver');
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

export const getGivers = async (req: Request, res: Response) => {
    try {
        try {
            const givers = await prisma.giverUser.findMany();
            res.status(200).json({ success: true, data: givers });
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

export const getGiver = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        try {
            const giver = await prisma.giverUser.findUnique({
                where: {
                    id: Number(id)
                }
            });
            if (!giver) throw new BadRequestError('Giver not found!');
            res.status(200).json({ success: true, data: giver });
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

export const giverRegister = async (req: Request, res: Response) => {
    try {
        const { email, password: enteredPassword, firstName, lastName, phone, birthday } = req.body;
        try {
            const giver = await prisma.giverUser.findUnique({
                where: {
                    email
                }
            });
            if (giver) throw new BadRequestError('Giver already exists!');

            const isExistAsNeeder = await prisma.neederUser.findUnique({
                where: {
                    email
                }
            });
            if (isExistAsNeeder) throw new BadRequestError('Email already exists as a needer!');

            const code = voucher_codes.generate({
                length: 6,
                charset: voucher_codes.charset("numbers")
            });

            const hash = await hashPassword(enteredPassword);
            const newGiver = await prisma.giverUser.create({
                data: {
                    password: hash,
                    email,
                    firstName,
                    lastName,
                    verificationCode: code[0],
                    birthday,
                    phone
                }
            })

            await sendEmail(email, 'Verify your email', `Verification code: ${code[0]}`);

            const { password, createdAt, updatedAt, ...rest } = newGiver;
            const token = generateToken(newGiver, 'giver');
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

export const verifyGiver = async (req: Request, res: Response) => {
    try {
        const { verificationCode, email } = req.body;
        try {
            const giver = await prisma.giverUser.findUnique({
                where: {
                    email
                }
            });
            if (!giver) throw new BadRequestError('Giver not found!');
            if (giver.verified === true) throw new BadRequestError('Giver already verified!');
            if (giver.verificationCode !== verificationCode) throw new BadRequestError('Invalid verification code!');
            await prisma.giverUser.update({
                where: {
                    id: giver.id
                },
                data: {
                    verified: true
                }
            })
            const { password, createdAt, updatedAt, ...rest } = giver;
            res.status(200).json({ success: true, data: { ...rest, giver } });
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

export const updateGiver = async (req: Request, res: Response) => {
    try {
        const id = getIdFromToken(req);
        const { firstName, lastName, photo } = req.body;
        try {
            const giver = await prisma.giverUser.findUnique({
                where: {
                    id: Number(id)
                }
            });
            if (!giver) throw new BadRequestError('Giver not found!');
            const updatedGiver = await prisma.giverUser.update({
                where: {
                    id: Number(id)
                },
                data: {
                    firstName: firstName || giver.firstName,
                    lastName: lastName || giver.lastName,
                    photo: photo || giver.photo
                }
            })
            const { password, createdAt, updatedAt, ...rest } = updatedGiver;
            res.status(200).json({ success: true, data: { ...rest } });
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

export const deleteGiver = async (req: Request, res: Response) => {
    try {
        const id = getIdFromToken(req);
        try {
            const giver = await prisma.giverUser.findUnique({
                where: {
                    id: Number(id)
                }
            });
            if (!giver) throw new BadRequestError('Giver not found!');
            await prisma.giverUser.delete({
                where: {
                    id: Number(id)
                }
            })
            res.status(200).json({ success: true, data: {} });
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

export const makeDonation = async (req: Request, res: Response) => {
    try {
        const id = getIdFromToken(req);
        const { name, photo, quantity, description, expirationDate } = req.body;

        try {
            const giver = await prisma.giverUser.findUnique({
                where: {
                    id: Number(id)
                }
            });

            if (!giver) throw new BadRequestError('Giver not found!');
            try {
                const packagedFood = await prisma.packagedFood.create({
                    data: {
                        name,
                        photo: photo,
                        quantity: Number(quantity) || 1,
                        description: description || '',
                        giverUserId: Number(id),
                        expirationDate: expirationDate || null,
                        ownable: true
                    }
                })

                const { createdAt, updatedAt, ...rest } = packagedFood;
                res.status(200).json({ success: true, data: { ...rest } });
            } catch (error) {
                let message;
                if (error instanceof Error) message = error.message;
                else message = String(error);
                res.status(400).json({ success: false, message });
            }
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

export const deleteDonation = async (req: Request, res: Response) => {
    try {
        const id = getIdFromToken(req);
        const { id: packagedFoodId } = req.params;

        try {
            const giver = await prisma.giverUser.findUnique({
                where: {
                    id: Number(id)
                }
            });
            if (!giver) throw new BadRequestError('Giver not found!');
            const packagedFood = await prisma.packagedFood.findUnique({
                where: {
                    id: Number(packagedFoodId)
                }
            });
            if (!packagedFood) throw new BadRequestError('Packaged food not found!');
            if (packagedFood.giverUserId !== Number(id)) throw new BadRequestError('Packaged food not found in your foods!');
            try {
                await prisma.packagedFood.delete({
                    where: {
                        id: Number(packagedFoodId)
                    }
                })
                res.status(200).json({ success: true, data: packagedFood });
            } catch (error) {
                let message;
                if (error instanceof Error) message = error.message;
                else message = String(error);
                res.status(400).json({ success: false, message });
            }
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

export const getDonations = async (req: Request, res: Response) => {
    try {
        const id = getIdFromToken(req);
        try {
            const giver = await prisma.giverUser.findUnique({
                where: {
                    id: Number(id)
                }
            });
            if (!giver) throw new BadRequestError('Giver not found!');
            const packagedFoods = await prisma.packagedFood.findMany({
                where: {
                    giverUserId: Number(id),
                    quantity: {
                        gt: 0
                    }
                },
            })
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

export const getDonation = async (req: Request, res: Response) => {
    try {
        const id = getIdFromToken(req);
        const { id: packagedFoodId } = req.params;
        try {
            const giver = await prisma.giverUser.findUnique({
                where: {
                    id: Number(id)
                }
            });
            if (!giver) throw new BadRequestError('Giver not found!');
            const packagedFood = await prisma.packagedFood.findUnique({
                where: {
                    id: Number(packagedFoodId)
                }
            })
            if (!packagedFood) throw new BadRequestError('Packaged food not found!');
            if (packagedFood.giverUserId !== Number(id)) throw new BadRequestError('Packaged food not found in your foods!');
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

export const updateDonation = async (req: Request, res: Response) => {
    try {
        const id = getIdFromToken(req);
        const packagedFoodId = req.params.id;
        const { name, photo, quantity, description, expirationDate } = req.body;
        try {
            const giver = await prisma.giverUser.findUnique({
                where: {
                    id: Number(id)
                }
            });
            if (!giver) throw new BadRequestError('Giver not found!');
            const packagedFood = await prisma.packagedFood.findUnique({
                where: {
                    id: Number(packagedFoodId)
                }
            });
            if (!packagedFood) throw new BadRequestError('Packaged food not found!');
            if (packagedFood.giverUserId !== Number(id)) throw new BadRequestError('Packaged food not found in your foods!');
            const updatedPackagedFood = await prisma.packagedFood.update({
                where: {
                    id: Number(packagedFoodId)
                },
                data: {
                    name: name || packagedFood.name,
                    photo: photo || packagedFood.photo,
                    quantity: Number(quantity) || packagedFood.quantity,
                    description: description || packagedFood.description,
                    expirationDate: expirationDate || packagedFood.expirationDate
                }
            })
            const { createdAt, updatedAt, ...rest } = updatedPackagedFood;
            res.status(200).json({ success: true, data: { ...rest } });
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

export const getOwnedDonations = async (req: Request, res: Response) => {
    try {
        const id = getIdFromToken(req);
        try {
            const giver = await prisma.giverUser.findUnique({
                where: {
                    id: Number(id)
                }
            });
            if (!giver) throw new BadRequestError('Giver not found!');

            const packagedFoods = await prisma.packagedFood.findMany({
                where: {
                    giverUserId: Number(id)
                },
            })

            const donations = await Promise.all(packagedFoods.map(async (packagedFood) => {
                const donation = await prisma.donation.findFirst({
                    where: {
                        packagedFoodId: packagedFood.id
                    },
                    include: {
                        packagedFood: true,
                        FoodBox: true
                    }
                })
                return donation
            }))

            const filteredDonations = donations.filter((donation) => donation !== null);

            res.status(200).json({ success: true, data: filteredDonations });
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

export const updateGiveStatusToNextStep = async (req: Request, res: Response) => {
    try {
        const id = getIdFromToken(req);
        const { id: donationId } = req.params;
        try {
            const giver = await prisma.giverUser.findUnique({
                where: {
                    id: Number(id)
                }
            });
            if (!giver) throw new BadRequestError('Giver not found!');
            const donation = await prisma.donation.findUnique({
                where: {
                    id: Number(donationId)
                },
                include: {
                    packagedFood: true,
                }
            });
            if (!donation) throw new BadRequestError('Donation not found!');
            if (donation.packagedFood?.giverUserId !== Number(id)) throw new BadRequestError('Donation not found in your donations!');
            const currentStatus = donation.status;
            let nextStatus;
            switch (currentStatus) {
                case 'pending':
                    nextStatus = DonationStatus.accepted;
                    break;
                case 'accepted':
                    nextStatus = DonationStatus.onTheWay;
                    break;
                case 'onTheWay':
                    nextStatus = DonationStatus.inBox;
                    break;
                default:
                    throw new BadRequestError('Donation has already in box!');
            }
            const updatedDonation = await prisma.donation.update({
                where: {
                    id: Number(donationId)
                },
                data: {
                    status: nextStatus
                },
                include: {
                    packagedFood: true,
                    FoodBox: true
                }
            })
            const { createdAt, updatedAt, ...rest } = updatedDonation;
            res.status(200).json({ success: true, data: { ...rest } });
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
            const giver = await prisma.giverUser.findUnique({
                where: {
                    id: Number(id)
                }
            });
            if (!giver) throw new BadRequestError('Giver not found!');
            const donation = await prisma.donation.findUnique({
                where: {
                    id: Number(donationId)
                },
                include: {
                    packagedFood: true,
                }
            });
            if (!donation) throw new BadRequestError('Donation not found!');
            if (donation.packagedFood?.giverUserId !== Number(id)) throw new BadRequestError('Donation not found in your donations!');
            const updatedDonation = await prisma.donation.update({
                where: {
                    id: Number(donationId)
                },
                data: {
                    status: DonationStatus.rejected
                },
                include: {
                    FoodBox: true,
                    packagedFood: true
                }
            })
            const { createdAt, updatedAt, ...rest } = updatedDonation;
            res.status(200).json({ success: true, data: { ...rest } });
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

export const forgotPassword = async (req: Request, res: Response) => {
    const { email } = req.body;
    try {
        const code = voucher_codes.generate({
            length: 6,
            charset: voucher_codes.charset("numbers")
        });

        const user = await prisma.giverUser.findUnique({
            where: {
                email
            }
        });
        if (!user) throw new BadRequestError('Giver not found!');
        const updatedUser = await prisma.giverUser.update({
            where: {
                email
            },
            data: {
                verificationCode: code[0]
            }
        })

        if (!updatedUser) throw new BadRequestError('Giver not found!');

        await sendEmail(email, 'Change Password', `Verification code: ${code[0]}`);

        res.status(200).json({ success: true, message: 'Verification code sent to your email!' });
    } catch (e) {
        let message;
        if (e instanceof Error) message = e.message;
        else message = String(e);
        res.status(400).json({ success: false, message });
    }
}

export const changePassword = async (req: Request, res: Response) => {
    const { email, password, verificationCode } = req.body;
    try {
        const user = await prisma.giverUser.findUnique({
            where: {
                email
            }
        });
        if (!user) throw new BadRequestError('Giver not found!');
        if (user.verificationCode !== verificationCode) throw new BadRequestError('Verification code is not correct!');


        const newVerificationCode = voucher_codes.generate({
            length: 6,
            charset: voucher_codes.charset("numbers")
        });

        const updatedUser = await prisma.giverUser.update({
            where: {
                email
            },
            data: {
                password: await hashPassword(password),
                verificationCode: newVerificationCode[0]
            }
        })

        if (!updatedUser) throw new BadRequestError('Giver not found!');

        res.status(200).json({ success: true, data: { message: 'Password changed successfully!' } });

    } catch (e) {
        let message;
        if (e instanceof Error) message = e.message;
        else message = String(e);
        res.status(400).json({ success: false, message });
    }
}

export const reSendVerificationCode = async (req: Request, res: Response) => {
    const { email } = req.body;
    try {
        const code = voucher_codes.generate({
            length: 6,
            charset: voucher_codes.charset("numbers")
        });

        const user = await prisma.giverUser.findUnique({
            where: {
                email
            }
        });
        if (!user) throw new BadRequestError('Giver not found!');
        const updatedUser = await prisma.giverUser.update({
            where: {
                email
            },
            data: {
                verificationCode: code[0]
            }
        })

        if (!updatedUser) throw new BadRequestError('Giver not found!');

        await sendEmail(email, 'Change Password', `Verification code: ${code[0]}`);

        res.status(200).json({ success: true, message: 'Verification code sent to your email!' });
    } catch (e) {
        let message;
        if (e instanceof Error) message = e.message;
        else message = String(e);
        res.status(400).json({ success: false, message });
    }
}