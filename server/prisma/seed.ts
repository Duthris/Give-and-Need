import { PrismaClient } from '@prisma/client'
import { hashPassword } from '../src/utils/password'

const prisma = new PrismaClient()

async function seed() {
    const admin = await prisma.adminUser.create({
        data: {
            email: 'admin@admin.com',
            password: await hashPassword('admin'),
        }
    })
    console.log({ admin });
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
