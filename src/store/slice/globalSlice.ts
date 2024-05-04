import { createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"
import { FormSchemaType, GlobalState } from "../../assets/types"

const initialState: GlobalState = {
    birthNumber: null,
    personalInformation: null,
    documentInformation: {},
    ocrResults: null,
    faceRecognitionResult: {
        faceMatched: false
    }
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
            action: PayloadAction<{ imageData: string }>
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
            action: PayloadAction<{ faceMatched: boolean; imageData: string }>
        ) => {
            state.faceRecognitionResult = { ...action.payload }
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
