import { prisma } from "../prisma"

async function seed() {
    await prisma.user.upsert({
        where: {
            userName: "admin"
        },
        update: {},
        create: {
            userName: "admin",
            password: "admin"
        }
    })
}

seed()
