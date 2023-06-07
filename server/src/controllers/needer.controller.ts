import prisma from '../client';
import { Request, Response } from 'express';
import { comparePassword, hashPassword } from '../utils/password';
import generateToken from '../utils/generateToken';
import { BadRequestError } from '../errors/bad-request-error';
import { getIdFromToken } from '../utils/token';
import { NotAuthorizedError } from '../errors/not-authorized-error';
import { sendEmail } from '../utils/sendMail';
var voucher_codes = require('voucher-code-generator');

export const neederLogin = async (req: Request, res: Response) => {
    try {
        const { email, password: enteredPassword } = req.body;
        try {
            const needer = await prisma.neederUser.findUnique({
                where: {
                    email
                }
            })
            if (!needer) throw new BadRequestError('Invalid credentials');
            else if (!needer.verified) throw new BadRequestError('Please verify your email');
            const passwordsMatch = await comparePassword(enteredPassword, needer.password);
            if (!passwordsMatch) throw new BadRequestError('Invalid credentials');
            const { password, createdAt, updatedAt, ...rest } = needer;
            const token = generateToken(needer, 'needer');
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

export const getNeeders = async (req: Request, res: Response) => {
    try {
        try {
            const needers = await prisma.neederUser.findMany();
            res.status(200).json({ success: true, data: needers });
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

export const getNeeder = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        try {
            const needer = await prisma.neederUser.findUnique({
                where: {
                    id: Number(id)
                }
            });
            if (!needer) throw new BadRequestError('Needer not found!');
            res.status(200).json({ success: true, data: needer });
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

export const neederRegister = async (req: Request, res: Response) => {
    try {
        const { email, password: enteredPassword, firstName, lastName, phone, birthday } = req.body;
        try {
            const isExistAsGiver = await prisma.giverUser.findUnique({
                where: {
                    email
                }
            });
            if (isExistAsGiver) throw new BadRequestError('Email already exists as a giver!');

            const needer = await prisma.neederUser.findUnique({
                where: {
                    email
                }
            });
            if (needer) throw new BadRequestError('Needer already exists!');
            const code = voucher_codes.generate({
                length: 6,
                charset: voucher_codes.charset("numbers")
            });

            const hash = await hashPassword(enteredPassword);
            const newNeeder = await prisma.neederUser.create({
                data: {
                    password: hash,
                    email,
                    firstName,
                    lastName,
                    verificationCode: code[0],
                    phone,
                    birthday
                }
            })
            await prisma.address.create({
                data: {
                    neederUserId: newNeeder.id,
                    name: '',
                    address: '',
                    city: '',
                    state: '',
                    zip: '',
                    country: ''
                }
            })

            await prisma.basket.create({
                data: {
                    neederUserId: newNeeder.id,
                }
            })

            await sendEmail(email, 'Verify your email', `Verification code: ${code[0]}`);
            const { password, createdAt, updatedAt, ...rest } = newNeeder;
            const token = generateToken(newNeeder, 'needer');
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

export const verifyNeeder = async (req: Request, res: Response) => {
    try {
        const { verificationCode, email } = req.body;
        try {
            const needer = await prisma.neederUser.findUnique({
                where: {
                    email
                }
            });
            if (!needer) throw new BadRequestError('Needer not found!');
            if (needer.verified) throw new BadRequestError('Needer already verified!');
            if (needer.verificationCode !== verificationCode) throw new BadRequestError('Invalid verification code!');
            await prisma.neederUser.update({
                where: {
                    id: needer.id
                },
                data: {
                    verified: true
                }
            })
            const { password, createdAt, updatedAt, ...rest } = needer;
            res.status(200).json({ success: true, data: { ...rest, needer } });
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

export const deleteNeeder = async (req: Request, res: Response) => {
    try {
        const id = getIdFromToken(req);
        try {
            const needer = await prisma.neederUser.findUnique({
                where: {
                    id: Number(id)
                }
            });
            if (!needer) throw new BadRequestError('Needer not found!');

            await prisma.neederUser.delete({
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

export const updateNeeder = async (req: Request, res: Response) => {
    try {
        const id = getIdFromToken(req);
        const { firstName, lastName, photo } = req.body;
        try {
            const needer = await prisma.neederUser.findUnique({
                where: {
                    id: Number(id)
                }
            });
            if (!needer) throw new BadRequestError('Needer not found!');

            await prisma.neederUser.update({
                where: {
                    id: Number(id)
                },
                data: {
                    firstName,
                    lastName,
                    photo
                }
            })

            const updatedNeeder = await prisma.neederUser.findUnique({
                where: {
                    id: Number(id)
                }
            });

            res.status(200).json({ success: true, data: updatedNeeder });
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

export const addFoodToBasket = async (req: Request, res: Response) => {
    try {
        const id = getIdFromToken(req);
        const { foodId } = req.body;
        try {
            const needer = await prisma.neederUser.findUnique({
                where: {
                    id: Number(id)
                }
            });
            if (!needer) throw new BadRequestError('Needer not found!');
            if (needer.dailyNeedQuota! <= 0) throw new BadRequestError('Daily need quota exceeded!');

            const isPackagedFood = await prisma.packagedFood.findUnique({
                where: {
                    id: Number(foodId)
                }
            });
            const isOpenFood = await prisma.openFood.findUnique({
                where: {
                    id: Number(foodId)
                }
            });
            if (!isPackagedFood && !isOpenFood) throw new BadRequestError('Food not found!');

            const neederBasket = await prisma.basket.findUnique({
                where: {
                    neederUserId: Number(id)
                }
            });
            if (!neederBasket) throw new BadRequestError('Needer basket not found!');

            const isBasketEmpty = !neederBasket.packagedFoodId && !neederBasket.openFoodId;

            if (isBasketEmpty) {
                await prisma.basket.update({
                    where: {
                        id: neederBasket.id
                    },
                    data: {
                        packagedFoodId: isPackagedFood ? Number(foodId) : null,
                        openFoodId: isOpenFood ? Number(foodId) : null,
                    }
                })

                const basket = await prisma.basket.findUnique({
                    where: {
                        neederUserId: Number(id)
                    }
                });

                res.status(200).json({ success: true, data: { basket } });
            } else {
                throw new BadRequestError('Your basket is not empty!');
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

export const getNeederBasket = async (req: Request, res: Response) => {
    try {
        const id = getIdFromToken(req);
        try {
            const needer = await prisma.neederUser.findUnique({
                where: {
                    id: Number(id)
                }
            });
            if (!needer) throw new BadRequestError('Needer not found!');

            const basket = await prisma.basket.findUnique({
                where: {
                    neederUserId: Number(id)
                }
            });

            res.status(200).json({ success: true, data: { basket } });
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

export const clearBasket = async (req: Request, res: Response) => {
    try {
        const id = getIdFromToken(req);
        try {
            const needer = await prisma.neederUser.findUnique({
                where: {
                    id: Number(id)
                }
            });
            if (!needer) throw new BadRequestError('Needer not found!');
            const basket = await prisma.basket.findUnique({
                where: {
                    neederUserId: Number(id)
                }
            });
            if (!basket) throw new BadRequestError('Needer basket not found!');
            await prisma.basket.update({
                where: {
                    id: basket.id
                },
                data: {
                    packagedFoodId: null,
                    openFoodId: null,
                }
            })
            res.status(200).json({ success: true, data: {} });
        } catch (e: any) {
            res.status(400).json({ success: false, message: e.message });
        }

    } catch (error) {

    }
}

export const needFood = async (req: Request, res: Response) => {
    try {
        const id = getIdFromToken(req);
        const { packagedFoodId, openFoodId, foodBoxId, addressId } = req.body;
        try {
            const needer = await prisma.neederUser.findUnique({
                where: {
                    id: Number(id)
                }
            });
            if (!needer) throw new BadRequestError('Needer not found!');
            if (needer.dailyNeedQuota! <= 0) throw new BadRequestError('Daily need quota exceeded!');

            const donation = await prisma.donation.create({
                data: {
                    neederUserId: Number(id),
                    packagedFoodId: Number(packagedFoodId) || null,
                    openFoodId: Number(openFoodId) || null,
                    status: 'pending',
                    addressId: Number(addressId) || null,
                }
            });

            let code = voucher_codes.generate({
                length: 6,
                count: 1,
                charset: voucher_codes.charset("numbers")
            });


            if (foodBoxId !== null) {
                const foodBox = await prisma.foodBox.findUnique({
                    where: {
                        id: Number(foodBoxId)
                    }
                });

                if (!foodBox) throw new BadRequestError('Food box not found!');
            }

            let food: any = null;
            let foodType;

            if (openFoodId) {
                food = await prisma.openFood.findUnique({
                    where: {
                        id: Number(openFoodId)
                    }
                });
                foodType = 'openFood';
            } else if (packagedFoodId) {
                food = await prisma.packagedFood.findUnique({
                    where: {
                        id: Number(packagedFoodId)
                    }
                });
                foodType = 'packagedFood';
            } else {
                throw new BadRequestError('No food in your basket!');
            }

            if (foodBoxId !== null) {
                await prisma.foodBox.update({
                    where: {
                        id: Number(foodBoxId)
                    },
                    data: {
                        password: code[0],
                        donationId: donation.id,
                        packagedFoodId: foodType === 'packagedFood' ? packagedFoodId : openFoodId,
                        neederUserId: Number(id),
                        giverUserId: foodType === 'packagedFood' ? food?.giverUserId : foodType === 'openFood' ? food?.restaurantUserId : null,
                    }
                })

                await sendEmail(needer.email, 'Your Food Box Password for Your Need', `Food Box Password: ${code[0]}`);
            }

            await prisma.neederUser.update({
                where: {
                    id: Number(id)
                },
                data: {
                    dailyNeedQuota: needer.dailyNeedQuota! - 1,
                }
            })

            if (food?.quantity > 1) {
                if (foodType === 'openFood') {
                    await prisma.openFood.update({
                        where: {
                            id: Number(openFoodId)
                        },
                        data: {
                            quantity: food.quantity - 1,
                        }
                    })
                } else if (foodType === 'packagedFood') {
                    await prisma.packagedFood.update({
                        where: {
                            id: Number(packagedFoodId)
                        },
                        data: {
                            quantity: food.quantity - 1,
                        }
                    })
                } else {
                    throw new BadRequestError('No food in your basket!');
                }
            } else if (food?.quantity === 1) {
                if (foodType === 'openFood') {
                    await prisma.openFood.update({
                        where: {
                            id: Number(openFoodId)
                        },
                        data: {
                            ownable: false,
                        }
                    })
                } else if (foodType === 'packagedFood') {
                    await prisma.packagedFood.update({
                        where: {
                            id: Number(packagedFoodId)
                        },
                        data: {
                            ownable: false,
                        }
                    })
                } else {
                    throw new BadRequestError('No food in your basket!');
                }
            } else {
                throw new BadRequestError('No food left!');
            }

            res.status(200).json({ success: true, data: { donation, code } });
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

export const getNeeds = async (req: Request, res: Response) => {
    try {
        const id = getIdFromToken(req);
        try {
            const needer = await prisma.neederUser.findUnique({
                where: {
                    id: Number(id)
                }
            });
            if (!needer) throw new BadRequestError('Needer not found!');
            const needs = await prisma.donation.findMany({
                where: {
                    neederUserId: Number(id)
                },
                include: {
                    openFood: {
                        include: {
                            restaurantUser: true,
                        }
                    },
                    packagedFood: true,
                    FoodBox: true,
                }
            });
            res.status(200).json({ success: true, data: needs });
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

export const getNeed = async (req: Request, res: Response) => {
    try {
        const id = getIdFromToken(req);
        const needId = req.params.id;
        try {
            const needer = await prisma.neederUser.findUnique({
                where: {
                    id: Number(id)
                }
            });
            if (!needer) throw new BadRequestError('Needer not found!');
            const isNeeder = await prisma.donation.findUnique({
                where: {
                    id: Number(needId)
                }
            });
            if (!isNeeder) throw new BadRequestError('Need not found!');
            if (isNeeder.neederUserId !== Number(id)) throw new BadRequestError('You are not the owner of this need!');

            const need = await prisma.donation.findUnique({
                where: {
                    id: Number(needId)
                }
            });
            res.status(200).json({ success: true, data: need });
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

export const resendFoodBoxPassword = async (req: Request, res: Response) => {
    try {
        const id = getIdFromToken(req);
        const needId = req.params.id;
        try {
            const needer = await prisma.neederUser.findUnique({
                where: {
                    id: Number(id)
                }
            });
            if (!needer) throw new BadRequestError('Needer not found!');
            const isNeeder = await prisma.donation.findUnique({
                where: {
                    id: Number(needId)
                }
            });

            if (!isNeeder) throw new BadRequestError('Need not found!');
            if (isNeeder.neederUserId !== Number(id)) throw new BadRequestError('You are not the owner of this need!');

            const foodBox = await prisma.foodBox.findMany({
                where: {
                    donationId: Number(needId)
                }
            })
            if (!foodBox[0].password) throw new BadRequestError('Food box not found!');
            await sendEmail(needer.email, 'Your Food Box Password for Your Need', `Food Box Password: ${foodBox[0].password}`);
            res.status(200).json({ success: true, data: foodBox });
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

export const markAsCompletedNeed = async (req: Request, res: Response) => {
    try {
        const id = getIdFromToken(req);
        const needId = req.params.id;
        try {
            const needer = await prisma.neederUser.findUnique({
                where: {
                    id: Number(id)
                }
            });
            if (!needer) throw new BadRequestError('Needer not found!');
            const isNeeder = await prisma.donation.findUnique({
                where: {
                    id: Number(needId)
                }
            });
            if (!isNeeder) throw new BadRequestError('Need not found!');
            if (isNeeder.neederUserId !== Number(id)) throw new BadRequestError('You are not the owner of this need!');

            const need = await prisma.donation.update({
                where: {
                    id: Number(needId)
                },
                data: {
                    status: 'completed'
                },
                include: {
                    openFood: true,
                    packagedFood: true,
                    FoodBox: true,
                }
            });
            res.status(200).json({ success: true, data: need });
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

        const user = await prisma.neederUser.findUnique({
            where: {
                email
            }
        });
        if (!user) throw new BadRequestError('Needer not found!');
        const updatedUser = await prisma.neederUser.update({
            where: {
                email
            },
            data: {
                verificationCode: code[0]
            }
        })

        if (!updatedUser) throw new BadRequestError('Needer not found!');

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
        const user = await prisma.neederUser.findUnique({
            where: {
                email
            }
        });
        if (!user) throw new BadRequestError('Needer not found!');
        if (user.verificationCode !== verificationCode) throw new BadRequestError('Verification code is not correct!');


        const newVerificationCode = voucher_codes.generate({
            length: 6,
            charset: voucher_codes.charset("numbers")
        });

        const updatedUser = await prisma.neederUser.update({
            where: {
                email
            },
            data: {
                password: await hashPassword(password),
                verificationCode: newVerificationCode[0]
            }
        })

        if (!updatedUser) throw new BadRequestError('Needer not found!');

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

        const user = await prisma.neederUser.findUnique({
            where: {
                email
            }
        });
        if (!user) throw new BadRequestError('Needer not found!');
        const updatedUser = await prisma.neederUser.update({
            where: {
                email
            },
            data: {
                verificationCode: code[0]
            }
        })

        if (!updatedUser) throw new BadRequestError('Needer not found!');

        await sendEmail(email, 'Verification Code', `Verification code: ${code[0]}`);

        res.status(200).json({ success: true, message: 'Verification code sent to your email!' });
    } catch (e) {
        let message;
        if (e instanceof Error) message = e.message;
        else message = String(e);
        res.status(400).json({ success: false, message });
    }
}

export const getAddresses = async (req: Request, res: Response) => {
    try {
        const id = getIdFromToken(req);
        const addresses = await prisma.address.findMany({
            where: {
                neederUserId: Number(id)
            }
        });
        res.status(200).json({ success: true, data: addresses });
    } catch (e) {
        let message;
        if (e instanceof Error) message = e.message;
        else message = String(e);
        res.status(400).json({ success: false, message });
    }
}

export const addAddress = async (req: Request, res: Response) => {
    try {
        const id = getIdFromToken(req);
        const { address, name } = req.body;
        const needer = await prisma.neederUser.findUnique({
            where: {
                id: Number(id)
            }
        });

        if (!needer) throw new BadRequestError('Needer not found!');

        const newAddress = await prisma.address.create({
            data: {
                address,
                neederUserId: Number(id),
                name,
                city: '',
                state: '',
                country: '',
                zip: '',
            }
        });
        res.status(200).json({ success: true, data: newAddress });
    } catch (e: any) {
        res.status(400).json({ success: false, message: e.message });
    }
}

export const deleteAddress = async (req: Request, res: Response) => {
    try {
        const id = getIdFromToken(req);
        const { id: addressId } = req.params;

        const needer = await prisma.neederUser.findUnique({
            where: {
                id: Number(id)
            }
        });

        if (!needer) throw new BadRequestError('Needer not found!');

        const address = await prisma.address.findUnique({
            where: {
                id: Number(addressId)
            }
        });

        if (!address) throw new BadRequestError('Address not found!');

        const deletedAddress = await prisma.address.delete({
            where: {
                id: Number(addressId)
            }
        });
        res.status(200).json({ success: true, data: deletedAddress });
    } catch (e: any) {
        res.status(400).json({ success: false, message: e.message });
    }
}

export const checkFoodBoxPassword = async (req: Request, res: Response) => {
    const { password } = req.headers;

    if (!password) res.status(200).write('false');

    const foodBox = await prisma.foodBox.findUnique({
        where: {
            id: 2
        }
    });


    if (!foodBox) throw new BadRequestError('Food box not found!');

    const isPasswordCorrect = foodBox.password === password;

    isPasswordCorrect ? res.status(200).write('true') : res.status(200).write('false');

    res.end();
}

export const updateAddress = async (req: Request, res: Response) => {
    try {
        const id = getIdFromToken(req);
        const { id: addressId } = req.params;
        const { address, name } = req.body;

        const needer = await prisma.neederUser.findUnique({
            where: {
                id: Number(id)
            }
        });

        if (!needer) throw new BadRequestError('Needer not found!');

        const addressToUpdate = await prisma.address.findUnique({
            where: {
                id: Number(addressId),
            }
        });

        if (!addressToUpdate) throw new BadRequestError('Address not found!');

        if (addressToUpdate.neederUserId !== Number(id)) throw new BadRequestError('You are not authorized to update this address!')

        await prisma.address.update({
            where: {
                id: Number(addressId)
            },
            data: {
                address,
                name
            }
        });

        const updatedAddress = await prisma.address.findUnique({
            where: {
                id: Number(addressId)
            }
        });

        res.status(200).json({ success: true, data: updatedAddress });
    } catch (e: any) {
        res.status(400).json({ success: false, message: e.message });
    }
}