import express, { Request, Response } from "express"
import { VerificationRequestBody } from "@assets/types"
import { Person } from "@prisma/client"
import { prisma } from "./PrismaClient"
const app = express()
const port = 3000

app.use(express.json({ limit: "50Mb" }))

app.get("/", (req: Request, res: Response) => res.send("Hello World!"))

app.post(
    "/verification",
    async (req: Request<{}, {}, VerificationRequestBody>, res: Response) => {
        const { body } = req

        try {
            const data: Omit<Person, "status"> = {
                birthNumber: body.birthNumber,
                ...body.personalInformation,
                faceMatched: body.faceRecognitionResult.faceMatched,
                idPicture: body.documentInformation.imageData,
                facePicture: body.faceRecognitionResult.imageData
            }

            const newVerificationRequest = prisma.person.upsert({
                where: { birthNumber: body.birthNumber },
                update: {},
                create: { ...data }
            })

            res.status(200).json(newVerificationRequest)
        } catch (err) {
            res.status(500).send(err)
        }
    }
)

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
