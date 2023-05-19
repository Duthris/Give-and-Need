import { PrismaClient } from '@prisma/client'
import { hashPassword } from '../src/utils/password'

const prisma = new PrismaClient()

async function seed() {
    const admin = await prisma.adminUser.create({
        data: {
            email: 'admin',
            password: await hashPassword('admin'),
        }
    })

    const giver = await prisma.giverUser.create({
        data: {
            email: 'giver',
            password: await hashPassword('giver'),
        }
    })
    const needer = await prisma.neederUser.create({
        data: {
            email: 'needer',
            password: await hashPassword('needer'),
        }
    }) 
}

seed()
    .then(async () => {
        await prisma.$disconnect()
})
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
