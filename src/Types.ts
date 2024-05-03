import { z, literal } from "zod"

export const FormSchema = z.object({
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().email(),
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
