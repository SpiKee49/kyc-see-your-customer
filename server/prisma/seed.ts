import { prisma } from "../prisma"

async function seed() {
    const admin = await prisma.user.upsert({
        where: {
            userName: "admin"
        },
        update: {},
        create: {
            userName: "admin",
            password: "admin"
        }
    })

    console.log({ admin })
}

seed()
