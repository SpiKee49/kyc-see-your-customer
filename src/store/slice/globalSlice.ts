import { createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"
import { FormSchemaType, OcrResults } from "../../Types"

interface GlobalState {
    birthNumber: string | null
    personalInformation: FormSchemaType | null
    documentInformation: {
        imageUrl?: string
        type?: "id-card" | "driver-license"
        imageData?: Blob
    }
    ocrResults: OcrResults | null
    faceRecognitionResult: boolean
}

const initialState: GlobalState = {
    birthNumber: null,
    personalInformation: null,
    documentInformation: {},
    ocrResults: null,
    faceRecognitionResult: false
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
        updateImageUrl: (
            state,
            action: PayloadAction<{ imageUrl: string; imageData: Blob }>
        ) => {
            state.documentInformation = {
                ...state.documentInformation,
                ...action.payload
            }
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
        },
        updateFaceRecognitionResult: (
            state,
            action: PayloadAction<boolean>
        ) => {
            state.faceRecognitionResult = action.payload
        }
    }
})

// Action creators are generated for each case reducer function
export const {
    setBirthNumber,
    setPersonalInformations,
    updateImageUrl,
    updateOcrResults,
    updateFaceRecognitionResult,
    updateDocumentType
} = globalSlice.actions

export default globalSlice.reducer
