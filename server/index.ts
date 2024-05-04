import express, { Request, Response } from "express"
import { VerificationRequestBody } from "@assets/types"
import { Person } from "@prisma/client"
import { prisma } from "./prisma"
const app = express()
const port = 3000

app.use(express.json({ limit: "50Mb" }))

app.get("/", (req: Request, res: Response) => res.send("Hello World!"))

app.post(
    "/verification",
    async (req: Request<{}, {}, VerificationRequestBody>, res: Response) => {
        const { body } = req
        console.log(body)
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

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
