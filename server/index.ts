import express, { Request, Response } from "express"
import { Verification, VerificationRequestBody } from "@assets/types"
import { Person } from "@prisma/client"
import { prisma } from "./prisma"
import path from "path"
import { birthNumberMatches } from "./utils"
var cors = require("cors")
const app = express()
const port = 3000
app.use(cors())
app.use(express.json({ limit: "50Mb" }))

app.use(express.static(path.join(__dirname, "../dist")))

app.post(
    "/verification",
    async (req: Request<{}, {}, VerificationRequestBody>, res: Response) => {
        const { body } = req
        const { ocrResults } = body
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

            const genderMatchesBirthNumber =
                Number(data.birthNumber.slice(2, 4)) > 50
                    ? data.gender === "female"
                    : data.gender === "male"

            const isValid =
                data.faceMatched &&
                ocrResults.firstName &&
                ocrResults.lastName &&
                ocrResults.dateOfBirth &&
                ocrResults.birthNumber &&
                birthNumberMatches(data.birthNumber, data.dateOfBirth) &&
                genderMatchesBirthNumber

            const newVerificationRequest = await prisma.person.upsert({
                where: { birthNumber: body.birthNumber },
                update: {
                    ...data,
                    status: isValid ? "verified" : "processing"
                },
                create: { ...data, status: isValid ? "verified" : "processing" }
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

            res.status(200).json(user?.id ?? null)
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

            res.status(200).json(verification?.status ?? null)
        } catch (err) {
            res.status(500).json({ message: "Internal server error" })
            console.error(err)
        }
    }
)

app.get("/verification", async (_, res: Response) => {
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

app.put(
    "/verification/:id",
    async (
        req: Request<{ id: string }, {}, Partial<Verification>>,
        res: Response
    ) => {
        const id = req.params.id

        try {
            const result = await prisma.person.update({
                where: {
                    birthNumber: id
                },
                data: {
                    ...req.body
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
    }
)

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
