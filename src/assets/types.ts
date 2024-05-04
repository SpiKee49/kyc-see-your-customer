import { z, literal } from "zod"

export const FormSchema = z.object({
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().email({ message: "Neplatná emailová adresa" }),
    gender: z.literal("male").or(literal("female")),
    dateOfBirth: z.string().date(),
    streetNumber: z.string(),
    city: z.string(),
    ZIP: z.string().refine(
        v => {
            let n = Number(v)
            return !isNaN(n) && v?.length === 5
        },
        { message: "PSČ musí obsahovať 5 cifier" }
    )
})
export type FormSchemaType = z.infer<typeof FormSchema>

export type OcrResults = Record<string, boolean>

export type GlobalState = {
    birthNumber: string | null
    personalInformation: FormSchemaType | null
    documentInformation: {
        imageData?: string
        type?: "id-card" | "driver-license"
    }
    ocrResults: OcrResults | null
    faceRecognitionResult: {
        faceMatched: boolean
        imageData?: string
    }
}

export type VerificationRequestBody = {
    birthNumber: string
    personalInformation: FormSchemaType
    documentInformation: {
        imageData: string
        type: "id-card" | "driver-license"
    }
    ocrResults: OcrResults | null
    faceRecognitionResult: {
        faceMatched: boolean
        imageData: string
    }
}
