import express, { Request, Response } from "express"
import { VerificationRequestBody } from "@assets/types"
import { Person } from "@prisma/client"
import { prisma } from "./prisma"
var cors = require("cors")
const app = express()
const port = 3000
app.use(cors())
app.use(express.json({ limit: "50Mb" }))

app.post(
    "/verification",
    async (req: Request<{}, {}, VerificationRequestBody>, res: Response) => {
        const { body } = req
        try {
            const data: Omit<Person, "status"> = {
                birthNumber: body.birthNumber,
                firstName: body.personalInformation.firstName,
                lastName: body.personalInformation.lastName,
                gender: body.personalInformation.gender,
                email: body.personalInformation.email,
                dateOfBirth: body.personalInformation.dateOfBirth,
                streetNumber: body.personalInformation.streetNumber,
                city: body.personalInformation.city,
                ZIP: body.personalInformation.ZIP,
                faceMatched: body.faceRecognitionResult.faceMatched,
                idPicture: body.documentInformation.imageData,
                facePicture: body.faceRecognitionResult.imageData
            }
            const newVerificationRequest = await prisma.person.upsert({
                where: { birthNumber: body.birthNumber },
                update: { ...data },
                create: { ...data }
            })

            res.status(200).json(newVerificationRequest)
        } catch (err) {
            res.status(500).json({ message: "Internal server error" })
            console.error(err)
        }
    }
)

app.post(
    "/login",
    async (
        req: Request<{}, {}, { userName: string; password: string }>,
        res: Response
    ) => {
        try {
            const credentials = req.body

            const user = await prisma.user.findUnique({
                where: { ...credentials }
            })

            if (user == null) {
                res.status(404).json({ message: "Wrong username or password." })
                return
            }

            res.status(200).json({ id: user.id })
        } catch (err) {
            res.status(500).json({ message: "Internal server error" })
            console.error(err)
        }
    }
)

app.get(
    "/verification/status/:birthNumber",
    async (req: Request, res: Response) => {
        try {
            const birthNumber = req.params.birthNumber
            const verification = await prisma.person.findUnique({
                where: { birthNumber },
                select: {
                    status: true
                }
            })

            if (verification == null) {
                res.status(404).json({
                    message: "Verification with such birth number doesnt exist."
                })
                return
            }

            res.status(200).json(verification)
        } catch (err) {
            res.status(500).json({ message: "Internal server error" })
            console.error(err)
        }
    }
)

app.get("/verification", async (req: Request, res: Response) => {
    try {
        const results = await prisma.person.findMany({
            select: {
                birthNumber: true,
                firstName: true,
                lastName: true,
                status: true
            }
        })

        res.status(200).json(results)
    } catch (err) {
        res.status(500).json({ message: "Internal server error" })
        console.error(err)
    }
})

app.get("/verification/:id", async (req: Request, res: Response) => {
    try {
        const result = await prisma.person.findUnique({
            where: {
                birthNumber: req.params.id
            }
        })

        if (result == null) {
            res.status(404).json({
                message: "Verification with such birth number doesnt exist."
            })
            return
        }

        res.status(200).json(result)
    } catch (err) {
        res.status(500).json({ message: "Internal server error" })
        console.error(err)
    }
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
