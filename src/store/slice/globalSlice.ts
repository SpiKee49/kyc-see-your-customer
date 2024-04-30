import { createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"
import { FormSchemaType, OcrResults } from "../../Types"

interface GlobalState {
    birthNumber: string | null
    personalInformation: FormSchemaType | null
    documentInformation: {
        imageUrl?: string
        type?: "id-card" | "driver-license"
    }
    ocrResults: OcrResults | null
}

const initialState: GlobalState = {
    birthNumber: null,
    personalInformation: null,
    documentInformation: {},
    ocrResults: null
}

export const globalSlice = createSlice({
    name: "global",
    initialState,
    reducers: {
        setBirthNumber: (state, action: PayloadAction<string>) => {
            state.birthNumber = action.payload
        },
        setPersonalInformations: (
            state,
            action: PayloadAction<FormSchemaType>
        ) => {
            state.personalInformation = {
                ...action.payload,
                dateOfBirth: action.payload.dateOfBirth
                    .split("-")
                    .reverse()
                    .join(".")
            }
        },
        updateImageUrl: (state, action: PayloadAction<string>) => {
            state.documentInformation.imageUrl = action.payload
        },
        updateDocumentType: (
            state,
            action: PayloadAction<"id-card" | "driver-license">
        ) => {
            state.documentInformation.type = action.payload
        },
        updateOcrResults: (
            state,
            action: PayloadAction<Record<string, boolean>>
        ) => {
            state.ocrResults = action.payload
        }
    }
})

// Action creators are generated for each case reducer function
export const {
    setBirthNumber,
    setPersonalInformations,
    updateImageUrl,
    updateOcrResults,
    updateDocumentType
} = globalSlice.actions

export default globalSlice.reducer
